
let treeObj = require("./command/tree");
let organizeObj = require("./command/organize");
let helpObj = require("./command/help");
let copyObj = require("./command/copy_paste");


let arr = process.argv.slice(2);

let command = arr[0];

let currPath = process.cwd();
if(command == "help")
{
    helpObj.help();
    return;
}
if(command == "tree")
{
    treeObj.tree(arr[1]);
    return;
}
if(command == "organize")
{
    organizeObj.Organize(arr[1]);
}

if(command == "copy")
{
    copyObj.copy(arr[1], arr[2]);
}
    


