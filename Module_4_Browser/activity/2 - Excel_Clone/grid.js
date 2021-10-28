let rows = 100;
let cols = 26;

let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let grid = document.querySelector(".grid");
let addressBar = document.querySelector(".address-bar");

// onfocus="this.value = this.value"

for(let i = 0; i < cols; i++){
    let div = document.createElement("div");
    div.setAttribute("class", "cell");
    div.innerHTML = String.fromCharCode(65 + i);
    topRow.appendChild(div);
}

for(let i = 1; i <= rows; i++){
    let div = document.createElement("div");
    div.setAttribute("class", "left-cell");
    div.innerHTML = i;
    leftCol.appendChild(div);
}

for(let i = 0; i < rows; i++){
    let row = document.createElement("div");
    row.setAttribute("class", "row");
    for(let j = 0; j < cols; j++){
        let cell = document.createElement("div");
        cell.setAttribute("class", "cell");
        cell.setAttribute("contenteditable", "true");
        cell.setAttribute("spellcheck", "false");
        cell.setAttribute("rid", i);
        cell.setAttribute("cid", j);
        cell.setAttribute("onfocus", "this.value = this.value");
        row.appendChild(cell);
        displayCellName(cell, i, j);
    }
    grid.appendChild(row);
}

function displayCellName(cell, i, j) {
    cell.addEventListener("click", (e) =>{
        let rowId = i + 1;
        let colId = String.fromCharCode(65 + j);
        addressBar.value = `${colId}${rowId}`;
    })
}
