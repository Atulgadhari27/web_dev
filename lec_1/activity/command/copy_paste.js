let fs = require("fs");
let path = require("path");

function copyPaste(srcPath, destPath)
{
    let baseName = path.basename(srcPath);
    destPath = path.join(destPath, baseName);

    fs.copyFileSync(srcPath, destPath);
}

module.exports = {
    copy : copyPaste
}