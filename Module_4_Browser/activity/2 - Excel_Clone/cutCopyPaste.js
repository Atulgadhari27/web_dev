let ctrlKey;

document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})

document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

let rangeStorage = [];
let dataStorage = [];

let cut = document.querySelector(".cut");
let copy = document.querySelector(".copy");
let paste = document.querySelector(".paste");

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

        cell.addEventListener("click", (e) => {
            if (!ctrlKey) return;
            if (rangeStorage.length >= 2) {
                handleUIandOverFlow();
                rangeStorage = [];
            }
            let rid = i;
            let cid = j;
            rangeStorage.push([rid, cid]);

            // console.log(rangeStorage)
            cell.style.border = "2px solid black";

        })
    }
}

function handleUIandOverFlow() {
    for (let i = 0; i < rangeStorage.length; i++) {
        let rid = rangeStorage[i][0];
        let cid = rangeStorage[i][1];

        let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
        cell.style.removeProperty("border");
    }
}

function copyCutData() {

    let i1 = rangeStorage[0][0];
    let j1 = rangeStorage[0][1];
    let i2 = rangeStorage[1][0];
    let j2 = rangeStorage[1][1];

    for (let i = i1; i <= i2; i++) {
        let row = [];
        for (let j = j1; j <= j2; j++) {
            let cellProp = dbMatrix[i][j];
            row.push(cellProp);
        }
        dataStorage.push(row);
    }

    // console.log(dataStorage);
}

cut.addEventListener("click", () => {
    if (rangeStorage.length < 2) return;

    dataStorage = [];
    copyCutData();
    handleCut();
    handleUIandOverFlow();
    rangeStorage = [];
})

function handleCut() {
    let newProp = {
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

    let i1 = rangeStorage[0][0];
    let j1 = rangeStorage[0][1];
    let i2 = rangeStorage[1][0];
    let j2 = rangeStorage[1][1];

    for (let i = i1; i <= i2; i++) {
        for (let j = j1; j <= j2; j++) {
            dbMatrix[i][j] = newProp;
            console.log(i + " " + j);
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            cell.innerHTML = "";
            cell.click();
        }
    }

}

copy.addEventListener("click", () => {
    if (rangeStorage.length < 2) return;

    dataStorage = [];
    copyCutData();
    handleUIandOverFlow();
    rangeStorage = [];
})

paste.addEventListener("click", () => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    let rid = cell.getAttribute("rid");
    let cid = cell.getAttribute("cid");

    handlePaste(rid, cid);
})

function handlePaste(rowid, colid) {
    if (dataStorage.length == 0) return;

    let rid = rowid;
    let cid = colid;

    for (let i = 0; i < dataStorage.length && rid < 100; i++, rid++) {
        cid = colid;
        for (let j = 0; j < dataStorage[i].length && cid < 26; j++, cid++) {
            let cellProp = dataStorage[i][j];
            console.log(rid + " " + cid)
            let pasteCell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
            dbMatrix[rid][cid] = cellProp;
            pasteCell.innerHTML = cellProp.value;
            pasteCell.click();
        }
    }

}

