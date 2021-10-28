
let active = "#d1d8e0";
let inactive = "#f1f2f6";

// store properties of every cell

// for (let i = 0; i < rows; i++) {
//     let rowArr = [];
//     for (let j = 0; j < cols; j++) {
//         let props = {
//             bold: false,
//             italic: false,
//             underline: false,
//             alignment: "left",
//             font_family: "monospace",
//             font_size: "16",
//             text_color: "#000000",
//             bg_color: "#f1f2f6",
//             value: "",
//             formula: "",
//             children: [],
//         };
//         rowArr.push(props);
//     }
//     dbMatrix.push(rowArr);
// }
// allSheetDb.push(dbMatrix);

{
    let addSheetBtn = document.querySelector(".add-sheet");
    addSheetBtn.click();
}

function getRidCid(address) {
    let rid = Number(address.slice(1)) - 1;
    let cid = Number(address.charCodeAt(0)) - 65;

    return [rid, cid];
}

function getActiveCell(address) {
    let [rid, cid] = getRidCid(address);
    let cell = document.querySelector(`.cell[rid="${rid}"][cid="${cid}"]`);
    let cellProp = dbMatrix[rid][cid];
    return [cell, cellProp];
}


let bold = document.querySelector(".bold");
let italic = document.querySelector(".italic");
let underline = document.querySelector(".underline");
let font_family = document.querySelector(".font-family-grp");
let font_size = document.querySelector(".font-size-grp");
let text_color = document.querySelector(".font-color-selector");
let bg_color = document.querySelector(".bg-selector");
let formula = document.querySelector(".formula-bar");

let alignment = document.querySelectorAll(".alignment")
let leftAlign = alignment[0];
let centerAlign = alignment[1];
let rightAlign = alignment[2];


bold.addEventListener("click", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cellProp.bold = !cellProp.bold;
    cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
    bold.style.backgroundColor = cellProp.bold ? active : inactive;
});

italic.addEventListener("click", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cellProp.italic = !cellProp.italic;
    cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
    italic.style.backgroundColor = cellProp.italic ? active : inactive;
});

underline.addEventListener("click", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cellProp.underline = !cellProp.underline;
    cell.style.textDecoration = cellProp.underline ? "underline" : "none";
    underline.style.backgroundColor = cellProp.underline ? active : inactive;
});

leftAlign.addEventListener("click", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cell.style.textAlign = "left";
    cellProp.alignment = "left";
    rightAlign.style.backgroundColor = inactive;
    centerAlign.style.backgroundColor = inactive;
    leftAlign.style.backgroundColor = active;
})

rightAlign.addEventListener("click", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cell.style.textAlign = "right";
    cellProp.alignment = "right";
    rightAlign.style.backgroundColor = active;
    centerAlign.style.backgroundColor = inactive;
    leftAlign.style.backgroundColor = inactive;
})

centerAlign.addEventListener("click", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cell.style.textAlign = "center";
    cellProp.alignment = "center";
    rightAlign.style.backgroundColor = inactive;
    centerAlign.style.backgroundColor = active;
    leftAlign.style.backgroundColor = inactive;
})

font_family.addEventListener("change", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cell.style.fontFamily = font_family.value;
    cellProp.font_family = font_family.value;
})

font_size.addEventListener("change", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cell.style.fontSize = font_size.value + "px";
    cellProp.font_size = font_size.value;
})
text_color.addEventListener("change", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cell.style.color = text_color.value;
    cellProp.text_color = text_color.value;
})
bg_color.addEventListener("change", (e) => {
    let [cell, cellProp] = getActiveCell(addressBar.value);
    cell.style.backgroundColor = bg_color.value;
    cellProp.bg_color = bg_color.value;
})



for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        setCellProps(cell, i, j);
    }
}

// setting UI
function setCellProps(cell, i, j) {
    cell.addEventListener("click", (e) => {
        // console.log(cell);
        // console.log(i + " " + j);
        let cellProp = dbMatrix[i][j];

        cell.style.fontWeight = cellProp.bold ? "bold" : "normal";
        bold.style.backgroundColor = cellProp.bold ? active : inactive;

        cell.style.fontStyle = cellProp.italic ? "italic" : "normal";
        italic.style.backgroundColor = cellProp.italic ? active : inactive;

        cell.style.textDecoration = cellProp.underline ? "underline" : "none";
        underline.style.backgroundColor = cellProp.underline ? active : inactive;

        // console.log(cellProp);
        if (cellProp.alignment === "left") {
            cell.style.textAlign = "left";
            rightAlign.style.backgroundColor = inactive;
            centerAlign.style.backgroundColor = inactive;
            leftAlign.style.backgroundColor = active;
        }
        else if (cellProp.alignment === "right") {
            cell.style.textAlign = "right";
            rightAlign.style.backgroundColor = active;
            centerAlign.style.backgroundColor = inactive;
            leftAlign.style.backgroundColor = inactive;
        }
        else if (cellProp.alignment === "center") {
            cell.style.textAlign = "center";
            rightAlign.style.backgroundColor = inactive;
            centerAlign.style.backgroundColor = active;
            leftAlign.style.backgroundColor = inactive;
        }

        font_family.value = cellProp.font_family;
        cell.style.fontFamily = cellProp.font_family

        font_size.value = cellProp.font_size;
        cell.style.fontSize = cellProp.font_size + "px";

        text_color.value = cellProp.text_color;
        cell.style.color = text_color.value;

        bg_color.value = cellProp.bg_color;
        cell.style.backgroundColor = bg_color.value;

        formula.value = cellProp.formula;
        // cell.setAttribute("value", cellProp.value);
        // console.log(dbMatrix);
    })
}