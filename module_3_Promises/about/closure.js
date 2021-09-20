
// problem 
// if we run the below code then this will give is 3 3 3 as output;
console.log("question");
function q1(){
    let qarr = [];
    for(var i = 0; i < 3; i++){
        qarr.push(function fn(){
            console.log(i);
        })
    }
    return qarr;
}

let qarr = q1();

qarr[0]();
qarr[1]();
qarr[2]();


// solution 1;
// call function insteadly --> see line 30;
console.log("Solution 1");
function outer(){
    let arr = [];
    for(var i = 0; i < 3; i++){
        arr.push(function fn(){
            console.log(i);
        }())
    }
    arr;
}

outer();


//solution 2
// use another variable to store in the closure;
console.log("Solution 2");
function outer1(){
    let arr = [];
    for(var i = 0; i < 3; i++){
        function outerfn(){
            var j = i;
            return function fn(){
                console.log(j);
            }
            
        }
        arr.push(outerfn())
    }
    return arr;
}

let arr1 = outer1();

arr1[0]();
arr1[1]();
arr1[2]();



// solution 3;
// use let instead of var;
console.log("solution 3");

function s3(){
    let arr = [];
    for(let i = 0; i < 3; i++){
        arr.push(function fn(){
            console.log(i);
        })
    }
    return arr;
}

let arr = s3();

arr[0]();
arr[1]();
arr[2]();
