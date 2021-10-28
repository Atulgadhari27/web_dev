async function colorPromise() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve();
        }, 1000)
    })
}



async function isGraphCyclicTracePath(graphComponentMatrix, cycleResponse) {
    let visited = [];
    let dfsVisited = [];

    for (let i = 0; i < rows; i++) {
        let visRow = [];
        let dfsRow = [];
        for (let j = 0; j < cols; j++) {
            visRow.push(false);
            dfsRow.push(false);
        }
        visited.push(visRow);
        dfsVisited.push(dfsRow);
    }

    let [srci, srcj] = cycleResponse;
    let response = await dfsCycleDetectTracePath(graphComponentMatrix, srci, srcj, visited, dfsVisited);

    if (response === true) {
        return Promise.resolve(true);
    }

    return Promise.resolve(false);

}

async function dfsCycleDetectTracePath(graphComponentMatrix, srci, srcj, visited, dfsVisited) {
    visited[srci][srcj] = true;
    dfsVisited[srci][srcj] = true;

    let cell = document.querySelector(`.cell[rid="${srci}"][cid="${srcj}"]`);
    cell.style.backgroundColor = "pink";
    await colorPromise();

    for (let children = 0; children < graphComponentMatrix[srci][srcj].length; children++) {
        let [ci, cj] = graphComponentMatrix[srci][srcj][children];
        console.log(graphComponentMatrix);
        if (visited[ci][cj] == false) {
            let response = await dfsCycleDetectTracePath(graphComponentMatrix, ci, cj, visited, dfsVisited)
            if (response === true) {
                await colorPromise();
                cell.style.removeProperty("background-color");
                
                return Promise.resolve(true);
            }
        }
        else if (visited[ci][cj] === true && dfsVisited[ci][cj] === true) {
            let childCell = document.querySelector(`.cell[rid="${ci}"][cid="${cj}"]`);
            console.log(childCell);
            childCell.style.backgroundColor = "orange";
            await colorPromise();

            childCell.style.removeProperty("background-color");
            await colorPromise();

            cell.style.removeProperty("background-color");
            await colorPromise();

            return Promise.resolve(true);
        }
    }

    dfsVisited[srci][srcj] = false;
    cell.style.removeProperty("background-color");
    // await colorPromise();

    return Promise.resolve(false);
}

