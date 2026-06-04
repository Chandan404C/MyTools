using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RemoteTransferAPI.Data;
using RemoteTransferAPI.Models;

namespace RemoteTransferAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransferController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public TransferController(
            AppDbContext context,
            IWebHostEnvironment env)   // ← inject IWebHostEnvironment
        {
            _context = context;
            _env = env;
        }

        // ===================================
        // SEND / UPLOAD
        // ===================================

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(
            IFormFile? file,
            [FromForm] string? text)
        {
            try
            {
                if ((file == null || file.Length == 0)
                    && string.IsNullOrWhiteSpace(text))
                {
                    return BadRequest("Upload file or text.");
                }

                // Generate unique 6-digit token
                var rnd = new Random();
                string token;
                do
                {
                    token = rnd.Next(100000, 999999).ToString();
                }
                while (await _context.FileTransfers
                    .AnyAsync(x => x.Token == token));

                string filePath = "";
                string fileName = "";

                if (file != null && file.Length > 0)
                {
                    fileName = file.FileName;

                    // Determine writable upload folder:
                    // 1) wwwroot/Uploads  (ideal, but WebRootPath is null on some hosts)
                    // 2) ContentRoot/Uploads  (fallback)
                    // 3) System temp dir  (always writable — last resort)
                    string uploadFolder = "";

                    var candidates = new[]
                    {
                        _env.WebRootPath  != null ? Path.Combine(_env.WebRootPath,      "Uploads") : null,
                        _env.ContentRootPath != null ? Path.Combine(_env.ContentRootPath, "Uploads") : null,
                        Path.Combine(Path.GetTempPath(), "DocFixerUploads")
                    };

                    foreach (var candidate in candidates)
                    {
                        if (candidate == null) continue;
                        try
                        {
                            if (!Directory.Exists(candidate))
                                Directory.CreateDirectory(candidate);
                            // Quick write-permission check
                            var testFile = Path.Combine(candidate, ".write_test");
                            await System.IO.File.WriteAllTextAsync(testFile, "ok");
                            System.IO.File.Delete(testFile);
                            uploadFolder = candidate;
                            break;
                        }
                        catch { /* try next candidate */ }
                    }

                    if (string.IsNullOrEmpty(uploadFolder))
                        return StatusCode(500, "No writable directory found for uploads.");

                    string newFileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    filePath = Path.Combine(uploadFolder, newFileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                }

                var now = DateTime.UtcNow;
                var transfer = new FileTransfer
                {
                    Token        = token,
                    FileName     = fileName  ?? "",   // never NULL in DB
                    FilePath     = filePath  ?? "",   // never NULL in DB
                    TextData     = text      ?? "",   // never NULL — was causing SqlNullValueException on file uploads
                    IsDownloaded = false,
                    CreatedDate  = now,
                    ExpiryTime   = now.AddMinutes(15)
                };

                _context.FileTransfers.Add(transfer);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Success   = true,
                    Token     = token,
                    ExpiresAt = transfer.ExpiryTime
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Upload failed: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // ===================================
        // RECEIVE TOKEN (metadata only)
        // ===================================

        [HttpGet("receive/{token}")]
        public async Task<IActionResult> Receive(string token)
        {
            try
            {
                var data = await _context.FileTransfers
                    .FirstOrDefaultAsync(x => x.Token == token);

                if (data == null)
                    return NotFound(new { Message = "Invalid Token" });

                if (DateTime.UtcNow > data.ExpiryTime)
                {
                    await DeleteTransfer(data);
                    return BadRequest(new { Message = "Token Expired" });
                }

                return Ok(new
                {
                    FileName   = data.FileName  ?? "",
                    TextData   = data.TextData  ?? "",
                    HasFile    = !string.IsNullOrEmpty(data.FilePath),
                    ExpiryTime = data.ExpiryTime
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Receive failed: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // ===================================
        // DOWNLOAD
        // ===================================

        [HttpGet("download/{token}")]
        public async Task<IActionResult> Download(string token)
        {
            try
            {
                var data = await _context.FileTransfers
                    .FirstOrDefaultAsync(x => x.Token == token);

                if (data == null)
                    return NotFound("Invalid Token");

                if (DateTime.UtcNow > data.ExpiryTime)
                {
                    await DeleteTransfer(data);
                    return BadRequest("Token Expired");
                }

                // TEXT: return as plain text
                if (string.IsNullOrWhiteSpace(data.FilePath))
                {
                    string textContent = data.TextData ?? "";
                    await DeleteTransfer(data);
                    return File(
                        System.Text.Encoding.UTF8.GetBytes(textContent),
                        "text/plain",
                        "message.txt");
                }

                // File missing on disk (server restart wiped temp/uploads)
                if (!System.IO.File.Exists(data.FilePath))
                {
                    _context.FileTransfers.Remove(data);
                    await _context.SaveChangesAsync();
                    return NotFound("File no longer exists on server. It may have been cleaned up after a server restart.");
                }

                byte[] fileBytes = await System.IO.File.ReadAllBytesAsync(data.FilePath);
                string safeFileName = data.FileName ?? "";
                string downloadName = string.IsNullOrEmpty(safeFileName)
                    ? "download" + Path.GetExtension(data.FilePath)
                    : safeFileName;

                string contentType = GetContentType(safeFileName);

                await DeleteTransfer(data);

                return File(fileBytes, contentType, downloadName);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Download failed: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // ===================================
        // MANUAL DELETE
        // ===================================

        [HttpDelete("delete/{token}")]
        public async Task<IActionResult> Delete(string token)
        {
            try
            {
                var data = await _context.FileTransfers
                    .FirstOrDefaultAsync(x => x.Token == token);

                if (data == null)
                    return NotFound(new { Message = "Token not found" });

                await DeleteTransfer(data);
                return Ok(new { Message = "Deleted Successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Delete failed: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // ===================================
        // CLEANUP EXPIRED TOKENS
        // ===================================

        [HttpPost("cleanup")]
        public async Task<IActionResult> Cleanup()
        {
            try
            {
                var expired = await _context.FileTransfers
                    .Where(x => x.ExpiryTime < DateTime.UtcNow)
                    .ToListAsync();

                foreach (var item in expired)
                    await DeleteTransfer(item);

                return Ok(new { Deleted = expired.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Cleanup failed: {ex.GetType().Name}: {ex.Message}");
            }
        }

        // ===================================
        // PRIVATE HELPERS
        // ===================================

        private async Task DeleteTransfer(FileTransfer data)
        {
            // Delete file from disk if it exists
            if (!string.IsNullOrEmpty(data.FilePath)
                && System.IO.File.Exists(data.FilePath))
            {
                System.IO.File.Delete(data.FilePath);
            }

            _context.FileTransfers.Remove(data);
            await _context.SaveChangesAsync();
        }

        // Returns correct MIME type for common extensions
        private static string GetContentType(string? fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return "application/octet-stream";

            var ext = Path.GetExtension(fileName).ToLowerInvariant();
            return ext switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png"  => "image/png",
                ".gif"  => "image/gif",
                ".webp" => "image/webp",
                ".bmp"  => "image/bmp",
                ".svg"  => "image/svg+xml",
                ".pdf"  => "application/pdf",
                ".txt"  => "text/plain",
                ".csv"  => "text/csv",
                ".json" => "application/json",
                ".xml"  => "application/xml",
                ".zip"  => "application/zip",
                ".rar"  => "application/x-rar-compressed",
                ".mp4"  => "video/mp4",
                ".mp3"  => "audio/mpeg",
                ".docx" => "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ".xlsx" => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                ".pptx" => "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                _       => "application/octet-stream"
            };
        }
    }
}
