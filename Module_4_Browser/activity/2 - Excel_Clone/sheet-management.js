
let addSheetBtn = document.querySelector(".add-sheet");
let sheetCont = document.querySelector(".sheets");

let allSheetDb = [];
let dbMatrix = [];

addSheetBtn.addEventListener("click", (e) => {
    let sheet = document.createElement("div");
    sheet.setAttribute("class", "sheet-no");
    let allSheets = document.querySelectorAll(".sheet-no");
    let id = allSheets.length;
    sheet.setAttribute("id", id);
    id += 1;
    sheet.innerHTML = `Sheet ${id}`;
    sheetCont.appendChild(sheet);
    createDb();
    createGraphComponentMatrix();
    handleSheetClick(sheet);
    handleSheetRemoval(sheet);
    console.log(allSheetDb);
    console.log(collectedGraphComponent);
    sheet.scrollIntoView();
    sheet.click();
})

function createDb() {
    let dbMatrix = [];

    for (let i = 0; i < rows; i++) {
        let rowArr = [];
        for (let j = 0; j < cols; j++) {
            let props = {
                bold: false,
                italic: false,
                underline: false,
                alignment: "left",
                font_family: "monospace",
                font_size: "16",
                text_color: "#000000",
                bg_color: "#f1f2f6",
                value: "",
                formula: "",
                children: [],
            };
            rowArr.push(props);
        }
        dbMatrix.push(rowArr);
    }
    allSheetDb.push(dbMatrix);
}

function createGraphComponentMatrix() {
    let graphComponentMatrix = [];
    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let j = 0; j < cols; j++) {
            // Why array -> More than 1 child relation(dependency)
            row.push([]);
        }
        graphComponentMatrix.push(row);
    }
    collectedGraphComponent.push(graphComponentMatrix);
}


function handleSheetClick(sheet) {
    sheet.addEventListener("click", () => {
        let sheetidx = Number(sheet.getAttribute("id"));
        updateUI(sheetidx);
        let allSheets = document.querySelectorAll(".sheet-no");
        for (let i = 0; i < allSheets.length; i++) {
            allSheets[i].style.backgroundColor = "#f1f2f6";
        }
        sheet.style.backgroundColor = "#d1ccc0";
    })
}

function updateUI(idx) {
    let sheet = allSheetDb[idx];
    dbMatrix = sheet;
    graphComponentMatrix = collectedGraphComponent[idx];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            let cellProp = dbMatrix[i][j];
            cell.click();
            cell.innerText = cellProp.value;
        }
    }
    let firstcell = document.querySelector(".row .cell");
    firstcell.click();
}

function handleSheetRemoval(sheet) {
    sheet.addEventListener("mousedown", (e) => {
        if (e.button == 2) {
            let allSheets = document.querySelectorAll(".sheet-no");
            // console.log(allSheets.length);
            if (allSheets.length <= 1) {
                alert(`You need to have atleast one sheet!!`);
                return;
            }
            let idx = Number(sheet.getAttribute("id"));
            let response = confirm(`Do you want to delete Sheet ${idx + 1}`);
            if (response == true) {
                allSheetDb.splice(idx, 1);
                collectedGraphComponent.splice(idx, 1);

                handleSheetUIAndDelete(sheet);
                dbMatrix = allSheetDb[0];
                graphComponentMatrix = collectedGraphComponent[0];
            }
        }
    });
}

function handleSheetUIAndDelete(sheet) {

    sheet.remove();
    console.log(allSheetDb)
    console.log(collectedGraphComponent);
    let allSheets = document.querySelectorAll(".sheet-no");
    for (let i = 0; i < allSheets.length; i++) {
        let sh = allSheets[i];
        // console.log(sh);
        sh.setAttribute("id", i);
        sh.innerHTML = `Sheet ${i + 1}`;
    }
    allSheets[0].click();
    // let idx = Number(sheet.getAttribute("id"));


}