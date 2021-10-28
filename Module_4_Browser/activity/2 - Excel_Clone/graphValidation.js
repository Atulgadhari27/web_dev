let collectedGraphComponent = [];
let graphComponentMatrix = [];

// for(let i = 0; i < rows; i++){
//     let row = [];
//     for(let j = 0; j < cols; j++){
//         row.push([]);
//     }
//     graphComponentMatrix.push(row);
// }
// collectedGraphComponent.push(graphComponentMatrix);

function isGraphCyclic(graphComponentMatrix){
    let visited = [];
    let dfsVisited = [];

    for(let i = 0; i < rows; i++){
        let visRow = [];
        let dfsRow = [];
        for(let j = 0; j < cols; j++){
            visRow.push(false);
            dfsRow.push(false);
        }
        visited.push(visRow);
        dfsVisited.push(dfsRow);
    }

    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let response = dfsCycleDetect(graphComponentMatrix, i, j, visited, dfsVisited);
            if(response === true){
                return [i, j];
            }
        }
    }
}

function dfsCycleDetect(graphComponentMatrix, srci, srcj, visited, dfsVisited){
    visited[srci][srcj] = true;
    dfsVisited[srci][srcj] = true;

    for(let children = 0; children < graphComponentMatrix[srci][srcj].length; children++){
        let [ci, cj] = graphComponentMatrix[srci][srcj][children];
        if(visited[ci][cj] == false){
            let response = dfsCycleDetect(graphComponentMatrix, ci, cj, visited, dfsVisited)
            if(response == true){
                return true;
            }
        }
        else if(visited[ci][cj] == true && dfsVisited[ci][cj] == true){
            return true;
        }
    }

    dfsVisited[srci][srcj] = false;
}