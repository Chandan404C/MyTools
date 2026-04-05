const fs = require('fs');
const path = require('path');

const dir = 'f:\\MyTools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let newContent = content
        .replace(/ToolHub/g, 'DocFixer')
        .replace(/Tool Hub/g, 'DocFixer')
        .replace(/toolhub\.com/g, 'docfixer.online')
        .replace(/toolhub/g, 'docfixer');
        
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        modifiedCount++;
    }
});

console.log('Successfully updated ' + modifiedCount + ' files.');
