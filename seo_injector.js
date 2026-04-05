const fs = require('fs');
const path = require('path');

const dir = 'f:\\MyTools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const seoMap = {
  'index.html': {
    title: 'DocFixer | All-in-One Online PDF & Image Tools Free',
    desc: 'Free online tools for merging, splitting, compressing, and converting PDF documents and images. Unlimited use, securely in your browser.',
    keywords: 'free pdf tools, online pdf editor, pdf merger, compress pdf, image to pdf, docfixer, online image tools',
    type: 'WebSite'
  },
  'about.html': {
    title: 'About DocFixer | Free Document Tools',
    desc: 'Learn about DocFixer, your premier choice for fast, free, and secure online document processing tools.',
    keywords: 'about docfixer, document tools mission, free online tools',
    type: 'AboutPage'
  },
  'contact.html': {
    title: 'Contact Us | DocFixer Support',
    desc: 'Need help with our document tools? Contact DocFixer support for free assistance with our online PDF and image utilities.',
    keywords: 'contact docfixer, support, help document tools',
    type: 'ContactPage'
  },
  'disclaimer.html': {
    title: 'Disclaimer | DocFixer',
    desc: 'Read the disclaimer for DocFixer. Information regarding the use of our free online PDF and image tools.',
    keywords: 'docfixer disclaimer, terms of use, legal',
    type: 'WebPage'
  },
  'privacy.html': {
    title: 'Privacy Policy | DocFixer',
    desc: 'Understand how DocFixer protects your data. All files are processed securely in your browser and never uploaded to our servers.',
    keywords: 'privacy policy, docfixer privacy, secure pdf tools, local processing',
    type: 'WebPage'
  },
  'terms.html': {
    title: 'Terms & Conditions | DocFixer',
    desc: 'Terms and conditions for using DocFixers free online document and image processing tools.',
    keywords: 'terms and conditions, docfixer terms',
    type: 'WebPage'
  },
  'tools.html': {
    title: 'All Tools | PDF & Image Utilities by DocFixer',
    desc: 'Explore all free tools to merge, split, compress, convert, and manage your PDF and image files easily online.',
    keywords: 'pdf tools, image tools, free tools directory, compress, convert, merge',
    type: 'CollectionPage'
  },
  'tools_image.html': {
    title: 'Image Tools | Free Image Editor & Utilities | DocFixer',
    desc: 'Edit, compress, and convert images online for free. DocFixer provides fast, browser-based image utilities.',
    keywords: 'image editor, free image tools, convert image, edit image online',
    type: 'SoftwareApplication',
    appName: 'DocFixer Image Tools',
    appCategory: 'MultimediaApplication'
  },
  'tools_imagecompress.html': {
    title: 'Compress Image Online & Reduce File Size Free | DocFixer',
    desc: 'Compress JPG, PNG, WebP images instantly without losing quality. Free online image compressor by DocFixer.',
    keywords: 'compress image, reduce image size, image compressor, shrink photo size, free image compression',
    type: 'SoftwareApplication',
    appName: 'DocFixer Image Compressor',
    appCategory: 'MultimediaApplication'
  },
  'tools_imagtopdf.html': {
    title: 'Image to PDF Converter | Combine JPG/PNG to PDF Free | DocFixer',
    desc: 'Convert multiple images (JPG, PNG, WebP) into a single PDF document in seconds. Free browser-based image to PDF converter.',
    keywords: 'image to pdf, jpg to pdf, combine images into pdf, convert png to pdf, photo to pdf',
    type: 'SoftwareApplication',
    appName: 'DocFixer Image to PDF',
    appCategory: 'UtilitiesApplication'
  },
  'tools_margepdf.html': {
    title: 'Merge PDF Online | Combine PDF Files Free | DocFixer',
    desc: 'Merge multiple PDF files into one document instantly. Our free online PDF merger is fast, secure, and easy to use.',
    keywords: 'merge pdf, combine pdf online, free pdf merger, join pdf files, docfixer',
    type: 'SoftwareApplication',
    appName: 'DocFixer PDF Merger',
    appCategory: 'UtilitiesApplication'
  },
  'tools_pdfcompress.html': {
    title: 'Compress PDF Online | Reduce PDF Size Free | DocFixer',
    desc: 'Compress PDF files online securely. Reduce your PDF file size while maintaining excellent document quality using DocFixer.',
    keywords: 'compress pdf, reduce pdf size, shrink pdf free, fast pdf compressor',
    type: 'SoftwareApplication',
    appName: 'DocFixer PDF Compressor',
    appCategory: 'UtilitiesApplication'
  },
  'tools_pdftoword.html': {
    title: 'Extract Images from PDF | Free Online Tool | DocFixer',
    desc: 'Quickly extract all images from any PDF file. Fast, free, and secure browser-based tool by DocFixer.',
    keywords: 'extract images from pdf, pdf image extractor, get photos out of pdf, free pdf tool',
    type: 'SoftwareApplication',
    appName: 'DocFixer PDF Image Extractor',
    appCategory: 'UtilitiesApplication'
  },
  'tools_qrcode.html': {
    title: 'Free QR Code Generator Online | DocFixer',
    desc: 'Generate customized QR codes for URLs, text, and data online easily. A free, fast QR code creator by DocFixer.',
    keywords: 'qr code generator, make qr code free, qr creator online',
    type: 'SoftwareApplication',
    appName: 'DocFixer QR Code Generator',
    appCategory: 'UtilitiesApplication'
  },
  'tools_splitpdf.html': {
    title: 'Split PDF Online | Extract Pages Free | DocFixer',
    desc: 'Extract pages from your PDF or split a large PDF into smaller files. Completely free and runs securely in your browser.',
    keywords: 'split pdf, extract pdf pages, burst pdf, separate pdf online',
    type: 'SoftwareApplication',
    appName: 'DocFixer PDF Splitter',
    appCategory: 'UtilitiesApplication'
  },
  'tools_watermark.html': {
    title: 'Add Watermark to Images & PDFs Free | DocFixer',
    desc: 'Stamp your documents. Add text or image watermarks to your PDF files and images in seconds. Free browser-based watermarking tool.',
    keywords: 'add watermark to pdf, watermark image, stamp pdf online, secure watermarking',
    type: 'SoftwareApplication',
    appName: 'DocFixer Watermark Tool',
    appCategory: 'UtilitiesApplication'
  },
  'user_guid.html': {
    title: 'User Guide | How to Use DocFixer Tools',
    desc: 'Learn how to maximize your productivity using DocFixers PDF and image tools with our comprehensive free user guide.',
    keywords: 'docfixer user guide, how to use online pdf tools, edit pdf tutorial',
    type: 'WebPage'
  }
};

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  const meta = seoMap[file];
  if (!meta) {
    console.log(`Skipping ${file} - no metadata defined.`);
    return;
  }

  const canonicalUrl = `https://docfixer.online/${file === 'index.html' ? '' : file}`;
  
  let jsonLd = '';
  if (meta.type === 'SoftwareApplication') {
    jsonLd = `
  <!-- JSON-LD Structured Data for Application -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "${meta.appName}",
    "applicationCategory": "${meta.appCategory}",
    "operatingSystem": "All",
    "description": "${meta.desc}",
    "url": "${canonicalUrl}"
  }
  </script>`;
  } else {
    jsonLd = `
  <!-- JSON-LD Structured Data for Page -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "${meta.type}",
    "name": "${meta.title}",
    "description": "${meta.desc}",
    "url": "${canonicalUrl}"
  }
  </script>`;
  }

  const newSeoBlock = `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${meta.title}</title>
  
  <!-- SEO Meta Tags -->
  <meta name="description" content="${meta.desc}">
  <meta name="keywords" content="${meta.keywords}">
  <meta name="author" content="DocFixer">
  <link rel="canonical" href="${canonicalUrl}">
  
  <!-- Open Graph for Social Media -->
  <meta property="og:title" content="${meta.title}">
  <meta property="og:description" content="${meta.desc}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="DocFixer">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${meta.title}">
  <meta name="twitter:description" content="${meta.desc}">
${jsonLd}
  
  <!-- Bootstrap 5 + Icons & cool font -->`;

  // We need to replace everything between `<head>` and `<!-- Bootstrap 5 + Icons & cool font -->`
  // Wait, some files might have slightly different spaces, let's use a regex carefully.
  // E.g. /<head>[\s\S]*?<!-- Bootstrap 5 \+ Icons & cool font -->/
  
  // Look for the <head> tag and <!-- Bootstrap 5 part
  const headRegex = /<head>([\s\S]*?)<!-- \s*Bootstrap 5 \+ Icons/i;
  
  const match = content.match(headRegex);
  if (match) {
    content = content.replace(headRegex, `<head>${newSeoBlock}`);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Processed ${file}`);
  } else {
    console.log(`⚠️ Could not find injection points in ${file}`);
  }
});
