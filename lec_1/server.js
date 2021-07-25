let a = 10;
function fn(){
    console.log("Hii I am Server");
}

function hidden(){
    console.log("Hii i am hidden");
}

module.exports = {
    varName : a,
    fun : fn
}