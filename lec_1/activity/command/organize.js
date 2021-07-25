
let fs = require("fs");
let path = require("path");

let types = {
    Media : [".mp4", '.mkv',".png",".jpeg",".jpg",""],
    Archives : [".zip",".7z",".rar",".tar",".gz",".ar",".iso"],
    Documents : [".doc",".docx",".pdf",".xlsx",".xls",".odt",".pptx",".ppt"],
    App : [".exe",".dmg",".pkg",".deb"]
};

function fn(rPath)
{

    let currPath = rPath;
    let content = fs.readdirSync(currPath);
    for(let i = 0;i < content.length;i++)
    {
        let currFile = content[i];
        let extName = path.extname(currFile);
        let eleType = "Other";
        for(const key in types)
        {
            for(let j = 0;j < types[key].length;j++)
            {
                if(extName == types[key][j])
                {
                    eleType = key;
                    break;
                }
            }
            if(eleType != "Other")
            {
                break;
            }
        }
        let folderPath = path.join(currPath,eleType);
        let srcFilePath = path.join(currPath,currFile);

        let isFileExistes = fs.existsSync(folderPath);
        if(!isFileExistes)
        {
            fs.mkdirSync(folderPath);
        }
        let destFilePath = path.join(folderPath,currFile);

        fs.copyFileSync(srcFilePath,destFilePath);
        console.log(currFile, " belongs to --> ", eleType);
        fs.unlinkSync(srcFilePath);
    }

    console.log("Files Organized Successfully")
}

module.exports = {
    Organize : fn
}