
let treeObj = require("./command/tree");
let organizeObj = require("./command/organize");
let helpObj = require("./command/help");
const tree = require("./command/tree");


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

organizeObj.Organize(arr[1]);


