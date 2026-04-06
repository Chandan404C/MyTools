const fs = require('fs');
const path = require('path');
const dir = 'f:/MyTools';

fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.html')) {
        let filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.split('href="https://www.facebook.com"').join('href="https://www.facebook.com/profile.php?id=61579636438080"');
        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated ' + file);
        }
    }
});
