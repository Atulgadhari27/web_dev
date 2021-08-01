let fs = require("fs");
let path = require("path");

let inputArr = process.argv.slice(2);

let optionArr = [];

let content = "";

for(let i = 0; i < inputArr.length; i++)
{
    let firstChar = inputArr[i].charAt(0);

    if(firstChar == "-")
    {
        optionArr.push(inputArr[i]);
    }
    else{
        if(fs.existsSync(inputArr[i]))
        {
            content += fs.readFileSync(inputArr[i]) + "\r\n";
        }
        else{
            console.log(inputArr[i] ," File does not exist :( ");
            return;
        }
    }
}

let nRunned = false;
let bRunned = false;

for(let i = 0; i < optionArr.length; i++)
{
    let option = optionArr[i];
    let splitArr = content.split("\r\n");

    switch(option)
    {
        case "-s":
            let tempArr = [];
            for(let j = 0; j < splitArr.length; j++)
            {
                if(splitArr[j] == '' && (splitArr[j - 1] == '' || splitArr[j - 1] == null))
                {
                    splitArr[j] = null;
                }
                else{
                    tempArr.push(splitArr[j]);
                }
            }

            splitArr = tempArr;
            content = splitArr.join("\r\n");
            break;

        case "-n":
            if(bRunned == true)
            {
                break;
            }
            nRunned = true;
            let resStr = "";
            for(let j = 0; j < splitArr.length; j++)
            {
                resStr += j + 1 + ". " + splitArr[j] + "\r\n";
            }

            content = resStr;
            break;

        case "-b":
            if(nRunned == true)
            {
                break;
            }
            bRunned = true;
            let resString = "";
            let count = 1;
            for(let j = 0; j < splitArr.length; j++)
            {
                if(splitArr[j] != '')
                {
                    resString += count + ". " + splitArr[j] + "\r\n";
                    count++;
                }
                else{
                    resString += splitArr[j] + "\r\n";
                }
            }
            content = resString;
            break;
    }
}

console.log(content);
