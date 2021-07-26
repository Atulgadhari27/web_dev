let fs = require("fs");
let path = require("path");

function fn(filePath)
{
    let stat = fs.statSync(filePath);
    let baseName = path.basename(filePath);
    if(stat.isFile())
    {
        console.log("\t|-- > " + baseName);
    }
    else
    {
        let content = fs.readdirSync(filePath);
        console.log("|-- > " + baseName);
        for(let i = 0;i < content.length;i++)
        {
            let currPath = path.join(filePath,content[i])
            fn(currPath);
        }
    }
}

module.exports = {
    tree : fn
}