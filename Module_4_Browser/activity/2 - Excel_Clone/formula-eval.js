
let formulaBar = document.querySelector(".formula-bar");

for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e) => {
            let cellProp = dbMatrix[i][j];

            if (cell.innerText == cellProp.value) {
                return;
            }
            else {
                cellProp.value = cell.innerText;
                removeChildOfParent(addressBar.value);
                cellProp.formula = "";
                updateChildren(addressBar.value);
            }


            // console.log(cellProp);
            // console.log(dbMatrix);
        });
    }
}

formulaBar.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && formulaBar.value) {
        let [cell, cellProp] = getActiveCell(addressBar.value);
        if (formulaBar.value != cellProp.formula) {
            removeChildOfParent(addressBar.value);
        }
        // console.log(graphComponentMatrix);
        addChildToGraphComponent(formulaBar.value, addressBar.value);

        let cycleResponse = isGraphCyclic(graphComponentMatrix)
        if (cycleResponse) {
            let response = confirm("Your Formula is Cyclic, Do you want to trace path");
            while(response === true){
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
                response = confirm("Your Formula is Cyclic, Do you want to trace path");
            }
            // removeChildFromGraphComponent(formulaBar.value, addressBar.value);
            formulaBar.value = "";
        }
        else {
            let evalValue = evaluateFormula(formulaBar.value);
            setUIandCellPorp(evalValue, formulaBar.value, addressBar.value);
            setChildOfParent(formulaBar.value);
            updateChildren(addressBar.value);
        }
        console.log(graphComponentMatrix)
    }
})

function addChildToGraphComponent(formula, childAddress) {
    formula = formula.split(" ");
    let [crid, ccid] = getRidCid(childAddress);
    for (let i = 0; i < formula.length; i++) {
        let ascii = formula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 91) {
            let [prid, pcid] = getRidCid(formula[i]);
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

function removeChildFromGraphComponent(formula, childAddress) {
    formula = formula.split(" ");
    let [crid, ccid] = getRidCid(childAddress);
    for (let i = 0; i < formula.length; i++) {
        let ascii = formula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 91) {
            let [prid, pcid] = getRidCid(formula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}
function evaluateFormula(formula) {
    formula = formula.split(" ");
    for (let i = 0; i < formula.length; i++) {
        let ascii = formula[i].charCodeAt(0);
        // console.log(formula[i]);
        if (ascii >= 65 && ascii <= 91) {
            // console.log(formula[i]);
            let [cell, cellProp] = getActiveCell(formula[i]);
            formula[i] = cellProp.value;
            // console.log(cellProp);
        }
    }

    let decoded = formula.join(" ");
    // console.log(decoded);
    return eval(decoded);
}


function setChildOfParent(formula) {
    let child = addressBar.value;
    formula = formula.split(" ");
    for (let i = 0; i < formula.length; i++) {
        let ascii = formula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 91) {
            let [ParentCell, ParentCellProp] = getActiveCell(formula[i]);
            ParentCellProp.children.push(child);
        }
    }
}

function removeChildOfParent(address) {
    let child = address;
    let [childCell, childCellProp] = getActiveCell(child);
    let oldFormula = childCellProp.formula;
    oldFormula = oldFormula.split(" ");
    for (let i = 0; i < oldFormula.length; i++) {
        let ascii = oldFormula[i].charCodeAt(0);
        if (ascii >= 65 && ascii <= 91) {
            let [ParentCell, ParentCellProp] = getActiveCell(oldFormula[i]);
            let idx = ParentCellProp.children.indexOf(child);
            ParentCellProp.children.splice(idx, 1);
        }
    }
}

function updateChildren(parentAddress) {
    let [parentCell, parentCellProp] = getActiveCell(parentAddress);
    let children = parentCellProp.children;
    for (let i = 0; i < children.length; i++) {
        let [childCell, childCellProp] = getActiveCell(children[i]);
        let childFormula = childCellProp.formula;
        let eval = evaluateFormula(childFormula)
        setUIandCellPorp(eval, childFormula, children[i]);
        updateChildren(children[i]);
    }
}

function setUIandCellPorp(val, formula, address) {
    let [cell, cellProp] = getActiveCell(address);
    cell.innerHTML = val;
    cellProp.value = val;
    cellProp.formula = formula;
    // console.log(cellProp);
}