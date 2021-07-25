let fs = require("fs");
let path = require("path");

function fn(rPath,spaces)
{
    let currPath = rPath;
    let content = fs.readdirSync(currPath);
    for(let i = 0;i < content.length;i++)
    {
        let currFile = content[i];
        let currFilePath = path.join(currPath,currFile);
        let statsOfFile = fs.lstatSync(currFilePath);

        if(statsOfFile.isDirectory()){
            for(let i = 0;i < spaces;i++)
            {
                process.stdout.write("\t");
            }
            console.log(currFile);
            fn(currFilePath,spaces + 1);
        }
        else{
            for(let i = 0;i < spaces;i++)
            {
                process.stdout.write("\t");
            }
            console.log(currFile);
        }
    }
}

module.exports = {
    tree : fn
}