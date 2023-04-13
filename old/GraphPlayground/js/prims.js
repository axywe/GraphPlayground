let history = [];
let step = 0;
let primsEdges = [];

function primsAlgorithm() {
    let visitedNodes = new Set([nodes[0]]);

    while (visitedNodes.size < nodes.length) {
        let minEdge = null;

        for (const edge of edges) {
            const node1Visited = visitedNodes.has(edge.node1);
            const node2Visited = visitedNodes.has(edge.node2);

            if (node1Visited !== node2Visited) {
                if (!minEdge || edge.length < minEdge.length) {
                    minEdge = edge;
                }
            }
        }

        if (minEdge) {
            if (!visitedNodes.has(minEdge.node1)) {
                visitedNodes.add(minEdge.node1);
            } else {
                visitedNodes.add(minEdge.node2);
            }

            primsEdges.push(minEdge);
            history.push([...primsEdges]);
        }
    }
}

function stepForward() {
    if (step < history.length) {
        step++;
    }
}

function stepBack() {
    if (step > 0) {
        step--;
    }
}

function cancel() {
    step = 0;
    primsEdges = [];
    history = [];
}

function toEnd() {
    step = history.length;
    primsEdges = history[step];
}

function hasDisconnectedNodes() {
    return nodes.some(node => node.edges.length === 0);
}

document.getElementById('stepForward').addEventListener('click', () => {
    stepForward();
    drawGraph();
});

document.getElementById('stepBack').addEventListener('click', () => {
    stepBack();
    drawGraph();
});

document.getElementById('cancel').addEventListener('click', () => {
    cancel();
    drawGraph();
});

document.getElementById('toEnd').addEventListener('click', () => {
    toEnd();
    drawGraph();
});

document.getElementById('startPrims').addEventListener('click', () => {
    if (hasDisconnectedNodes()) {
        alert("Не удаётся выполнить алгоритм Прима: есть узлы без рёбер. Пожалуйста, соедините все узлы ребрами.");
        return;
    }
    cancel();
    primsAlgorithm();
    toEnd();
    drawGraph();
});