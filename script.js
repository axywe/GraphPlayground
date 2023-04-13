const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const inputBtn = document.getElementById('inputBtn');
const inputModal = document.getElementById('inputModal');
const closeBtn = document.getElementById('inputClose');
const submitBtn = document.getElementById('submitBtn');
const inputData = document.getElementById('inputData');
const openModalBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('myModal');
const closeModalBtn = document.getElementById('exit-btn');
const modalCanvas = document.getElementById('modalCanvas');
const modalCtx = modalCanvas.getContext('2d');
const clearBtn = document.getElementById('clear-btn');
const nodeWeight = document.getElementById('node-weight');
const edgeWeight = document.getElementById('edge-weight');
const exportBtn = document.getElementById('export-btn');
const textResult = document.getElementById('text-result');
const NNAButton = document.getElementById('NNA');
const nextStepBtn = document.getElementById('NNAStep');
const toTheEndBtn = document.getElementById('NNAEnd');
const primsButton = document.getElementById('Prims');
const buttonsContainer = document.getElementById('buttons-container');
const resultTable = document.getElementById('result');
const pruferButton = document.getElementById('Prufer');
// const revPruferButton = document.getElementById('revPrufer');


class Node {
    constructor(id, x, y, weight, highlight= false, color = 'rgba(30, 144, 255, 0.6)') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.weight = weight;
        this.highlight = highlight;
        this.color = color;
    }
}
class Edge {
    constructor(node1, node2, length, highlight= false) {
        this.node1 = node1;
        this.node2 = node2;
        this.length = length;
        this.highlight = highlight;
    }
}
class Graph {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addEdge(edge) {
        this.edges.push(edge);
    }

    deleteNode(nodeId) {
        this.nodes = this.nodes.filter(node => node.id !== nodeId);
        this.edges = this.edges.filter(edge => edge.node1 !== nodeId && edge.node2 !== nodeId);
    }

    deleteEdge(node1, node2) {
        this.edges = this.edges.filter(edge => !(edge.node1 === node1 && edge.node2 === node2) && !(edge.node1 === node2 && edge.node2 === node1));
    }
}

let selectedNode = null;
let draggedNode = false;
let graph = parseInput(`{"nodes":[{"id":1,"x":238,"y":299,"weight":"1","highlight":false},{"id":2,"x":342,"y":298,"weight":"1","highlight":false},{"id":3,"x":500,"y":294,"weight":"7","highlight":false},{"id":4,"x":602,"y":252,"weight":"5","highlight":false},{"id":5,"x":635,"y":313,"weight":"2","highlight":false},{"id":6,"x":677,"y":194,"weight":"8","highlight":false},{"id":7,"x":454,"y":155,"weight":"1","highlight":false},{"id":8,"x":570,"y":339,"weight":"1","highlight":false}],"edges":[{"node1":1,"node2":2,"length":"1"},{"node1":2,"node2":3,"length":"1"},{"node1":3,"node2":7,"length":"1"},{"node1":4,"node2":7,"length":"1"},{"node1":5,"node2":4,"length":"1"},{"node1":8,"node2":4,"length":"1"},{"node1":4,"node2":6,"length":"1"}]}`);
drawGraph(graph, ctx, canvas);
let NodeCount = graph.nodes.length + 1;

function drawGraph(graph, ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    graph.edges.forEach(edge => {
        const node1 = graph.nodes.find(n => n.id === edge.node1);
        const node2 = graph.nodes.find(n => n.id === edge.node2);
        ctx.beginPath();
        ctx.moveTo(node2.x, node2.y); // <-- Switched node2 and node1
        ctx.lineTo(node1.x, node1.y); // <-- Switched node1 and node2
        ctx.lineWidth = 3;
        if(!edge.highlight) ctx.strokeStyle = 'rgba(70, 130, 180, 0.8)';
        else ctx.strokeStyle = 'rgba(127, 0, 0, 0.9)';
        ctx.stroke();

        // Calculate arrow end point at the intersection of edge and node circle
        const dx = node1.x - node2.x; // <-- Switched node1 and node2
        const dy = node1.y - node2.y; // <-- Switched node1 and node2
        const distance = Math.sqrt(dx * dx + dy * dy);
        const radius = 20;
        const node1X = node1.x - dx * (radius / distance); // <-- Switched node1 and node2
        const node1Y = node1.y - dy * (radius / distance); // <-- Switched node1 and node2
        const arrowSize = 10;
        const angle = Math.atan2(node1Y - node2.y, node1X - node2.x); // <-- Switched node1 and node2
        const arrowX = node1X - (radius + arrowSize) * Math.cos(angle);
        const arrowY = node1Y - (radius + arrowSize) * Math.sin(angle);

        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX + arrowSize * Math.cos(angle - Math.PI / 6), arrowY + arrowSize * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(arrowX + arrowSize * Math.cos(angle + Math.PI / 6), arrowY + arrowSize * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fillStyle = 'rgba(70, 130, 180, 0.8)';
        ctx.fill();

        const midX = (node1.x + node2.x) / 2;
        const midY = (node1.y + node2.y) / 2;
        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.length, midX, midY - 15);
    });


    graph.nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
        if (node === selectedNode) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
        } else {
            ctx.fillStyle = node.color;
        }
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 139, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.id, node.x, node.y);

        ctx.fillStyle = 'black';
        ctx.font = '14px Arial';
        ctx.fillText(node.weight, node.x, node.y - 30);
    });
}

function createTable(graph) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';

    graph.nodes.forEach(node => {
        const row = document.createElement('tr');

        const nodeIdCell = document.createElement('td');
        nodeIdCell.textContent = node.id;
        nodeIdCell.style.cursor = 'pointer';
        nodeIdCell.onclick = () => {
            graph.deleteNode(node.id);
            createTable(graph);
            drawGraph(graph, modalCtx, modalCanvas);
        };
        row.appendChild(nodeIdCell);

        const edgesCell = document.createElement('td');
        const edges = graph.edges
            .filter(edge => edge.node1 === node.id || edge.node2 === node.id)
            .map(edge => {
                const edgeSpan = document.createElement('span');
                edgeSpan.textContent = `${edge.node1}-${edge.node2}`;
                edgeSpan.style.cursor = 'pointer';
                edgeSpan.onclick = (e) => {
                    e.stopPropagation();
                    graph.deleteEdge(edge.node1, edge.node2);
                    createTable(graph);
                    drawGraph(graph, modalCtx, modalCanvas);
                };
                return edgeSpan;
            });

        edges.forEach((edgeSpan, index) => {
            edgesCell.appendChild(edgeSpan);
            if (index < edges.length - 1) {
                edgesCell.appendChild(document.createTextNode(', '));
            }
        });

        row.appendChild(edgesCell);
        tableBody.appendChild(row);
    });
}

function checkEdges(graph) {
    const copiedGraph = JSON.parse(JSON.stringify(graph)); // Создание копии графа с помощью JSON
    let hasEdges = true; // Изначально считаем, что у всех вершин есть ребра

    for (const node of copiedGraph.nodes) {
        const connectedEdges = copiedGraph.edges.filter(
            edge => edge.node1 === node.id || edge.node2 === node.id
        );
        if (connectedEdges.length === 0) {
            hasEdges = false; // Если у вершины нет связанных ребер, изменяем флаг
            break; // Прерываем цикл, т.к. условие уже не выполнено
        }
    }

    return hasEdges;
}

function checkNode(graph, nodeId) {
    return JSON.parse(JSON.stringify(graph)).nodes.some(node => node.id === nodeId);
}

openModalBtn.onclick = () => {
    modal.style.display = 'block';
    resultTable.style.display = 'none';
    textResult.style.display = 'none';
    drawGraph(graph, modalCtx, modalCanvas);
    createTable(graph);
};

closeModalBtn.onclick = () => {
    modal.style.display = 'none';
    drawGraph(graph, ctx, canvas);
};

modalCanvas.addEventListener('mousedown', (event) => {
    const rect = modalCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const foundNode = findNode(mouseX, mouseY);

    if (foundNode) {
        if (selectedNode && selectedNode !== foundNode) {
            if (edgeWeight.value <= 0) edgeWeight.value = 1;
            const edgeExists = graph.edges.some(edge =>
                (edge.node1 === selectedNode.id && edge.node2 === foundNode.id) ||
                (edge.node1 === foundNode.id && edge.node2 === selectedNode.id)
            );
            if (!edgeExists) {
                const newEdge = new Edge(selectedNode.id, foundNode.id, edgeWeight.value);
                graph.addEdge(newEdge);
                createTable(graph);
                drawGraph(graph, modalCtx, modalCanvas);
            }
            selectedNode = null;
        } else {
            selectedNode = foundNode;
        }
    } else {
        if (nodeWeight.value <= 0) nodeWeight.value = 1;
        const newNode = new Node(NodeCount++, mouseX, mouseY, nodeWeight.value);
        graph.addNode(newNode);
        createTable(graph);
        drawGraph(graph, modalCtx, modalCanvas);
    }
});

function setGraph(image){
    switch(image){
        case 1:
            graph = parseInput(`{
    "nodes": [
        {
            "id": 1,
            "x": 304,
            "y": 372.5625,
            "weight": 1
        },
        {
            "id": 2,
            "x": 453,
            "y": 364.5625,
            "weight": 4
        },
        {
            "id": 3,
            "x": 402,
            "y": 259.5625,
            "weight": 10
        },
        {
            "id": 4,
            "x": 521,
            "y": 231.5625,
            "weight": 23
        },
        {
            "id": 5,
            "x": 414,
            "y": 145.5625,
            "weight": 12
        },
        {
            "id": 6,
            "x": 276,
            "y": 216.5625,
            "weight": 9
        }
    ],
    "edges": [
        {
            "node1": 1,
            "node2": 3,
            "length": "9.00"
        },
        {
            "node1": 1,
            "node2": 2,
            "length": "7.00"
        },
        {
            "node1": 3,
            "node2": 6,
            "length": "2.00"
        },
        {
            "node1": 1,
            "node2": 6,
            "length": "14.00"
        },
        {
            "node1": 2,
            "node2": 4,
            "length": "15.00"
        },
        {
            "node1": 3,
            "node2": 4,
            "length": "11.00"
        },
        {
            "node1": 4,
            "node2": 5,
            "length": "6.00"
        },
        {
            "node1": 6,
            "node2": 5,
            "length": "9.00"
        },
        {
            "node1": 2,
            "node2": 3,
            "length": "10.00"
        }
    ]
}`);
            drawGraph(graph, modalCtx, modalCanvas);
            createTable(graph);
            inputModal.style.display = 'none';
            break;
        case 2:
            graph = parseInput(`{"nodes":[{"id":1,"x":238,"y":299,"weight":"1","highlight":false},{"id":2,"x":342,"y":298,"weight":"1","highlight":false},{"id":3,"x":500,"y":294,"weight":"7","highlight":false},{"id":4,"x":602,"y":252,"weight":"5","highlight":false},{"id":5,"x":635,"y":313,"weight":"2","highlight":false},{"id":6,"x":677,"y":194,"weight":"8","highlight":false},{"id":7,"x":454,"y":155,"weight":"1","highlight":false},{"id":8,"x":570,"y":339,"weight":"1","highlight":false}],"edges":[{"node1":1,"node2":2,"length":"1"},{"node1":2,"node2":3,"length":"1"},{"node1":3,"node2":7,"length":"1"},{"node1":4,"node2":7,"length":"1"},{"node1":5,"node2":4,"length":"1"},{"node1":8,"node2":4,"length":"1"},{"node1":4,"node2":6,"length":"1"}]}`);
            drawGraph(graph, modalCtx, modalCanvas);
            createTable(graph);
            inputModal.style.display = 'none';
            break;
        case 3:
            graph = parseInput(`{"nodes":[{"id":1,"x":427.5,"y":230,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":2,"x":508,"y":116,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":3,"x":346,"y":98,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":4,"x":214,"y":168,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":5,"x":214,"y":262,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":6,"x":234,"y":340,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":7,"x":322,"y":417,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":8,"x":456,"y":445,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":9,"x":576,"y":419,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":10,"x":628,"y":340,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":11,"x":662,"y":290,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":12,"x":667,"y":220,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":13,"x":636,"y":156,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"},{"id":14,"x":576.5,"y":133,"weight":"1","highlight":false,"color":"rgba(30, 144, 255, 0.6)"}],"edges":[{"node1":2,"node2":1,"length":"1"},{"node1":14,"node2":1,"length":"1"},{"node1":1,"node2":13,"length":"1"},{"node1":1,"node2":12,"length":"1"},{"node1":1,"node2":11,"length":"1"},{"node1":1,"node2":10,"length":"1"},{"node1":1,"node2":9,"length":"1"},{"node1":1,"node2":8,"length":"1"},{"node1":1,"node2":7,"length":"1"},{"node1":1,"node2":6,"length":"1"},{"node1":1,"node2":5,"length":"1"},{"node1":1,"node2":4,"length":"1"},{"node1":1,"node2":3,"length":"1"},{"node1":3,"node2":2,"length":"1"},{"node1":2,"node2":14,"length":"1"},{"node1":14,"node2":13,"length":"1"},{"node1":13,"node2":12,"length":"1"},{"node1":12,"node2":11,"length":"1"},{"node1":11,"node2":10,"length":"1"},{"node1":10,"node2":9,"length":"1"},{"node1":9,"node2":8,"length":"1"},{"node1":8,"node2":7,"length":"1"},{"node1":7,"node2":6,"length":"1"},{"node1":6,"node2":5,"length":"1"},{"node1":5,"node2":4,"length":"1"},{"node1":4,"node2":3,"length":"1"}]}`);
            drawGraph(graph, modalCtx, modalCanvas);
            createTable(graph);
            inputModal.style.display = 'none';
            break;
    }

}

modalCanvas.addEventListener('mousemove', (event) => {
    if (!selectedNode|| event.buttons !== 1) return;

    const rect = modalCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const distance = Math.sqrt(Math.pow(selectedNode.y - selectedNode.x, 2) + Math.pow(mouseY - mouseX, 2));
    if (distance > 5) {
        draggedNode = true;
    }

    if (draggedNode) {
        selectedNode.x = mouseX;
        selectedNode.y = mouseY;
        drawGraph(graph, modalCtx, modalCanvas);
    }
});

modalCanvas.addEventListener('mouseup', (event) => {
    const rect = modalCanvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const foundNode = findNode(mouseX, mouseY);

    if(draggedNode) selectedNode = null;
    if (foundNode && selectedNode && foundNode !== selectedNode) {
        if(edgeWeight.value<=0) edgeWeight.value = 1;
        const newEdge = new Edge(selectedNode.id, foundNode.id, edgeWeight.value);
        selectedNode = null;
        graph.addEdge(newEdge);
        drawGraph(graph, modalCtx, modalCanvas);
    }
    drawGraph(graph, modalCtx, modalCanvas);
    draggedNode = false;
});

clearBtn.addEventListener("click",() =>{
    graph = parseInput(`{
    "nodes": [],
    "edges": []
}`)
    drawGraph(graph, modalCtx, modalCanvas);
    createTable(graph);
    NodeCount = graph.nodes.length + 1;
})

window.onclick = event => {
    if (event.target === inputModal) {
        inputModal.style.display = 'none';
    }
    if (event.target === modal) {
        modal.style.display = 'none';
        drawGraph(graph, ctx, canvas);
    }
};

function findNode(x, y) {
    return graph.nodes.find(node => Math.sqrt(Math.pow(x - node.x, 2) + Math.pow(y - node.y, 2)) <= 20);
}

//Ввод и вывод
function parseInput(input) {
    const data = JSON.parse(input);
    const nodes = data.nodes.map(
        n => new Node(n.id, n.x, n.y, n.weight)
    );
    const edges = data.edges.map(
        e => new Edge(e.node1, e.node2, e.length)
    );
    return new Graph(nodes, edges);
}

submitBtn.onclick = () => {
    if(inputData.value){
        graph = parseInput(inputData.value);
        NodeCount = graph.nodes.length + 1;
    }
    drawGraph(graph, modalCtx, modalCanvas);
    createTable(graph);
    inputModal.style.display = 'none';
};

inputBtn.onclick = () => {
    inputModal.style.display = 'block';
};

exportBtn.onclick = () => {
    console.log(JSON.stringify({
        nodes: graph.nodes,
        edges: graph.edges.map(edge => ({
            node1: edge.node1,
            node2: edge.node2,
            length: edge.length.toString()
        }))
    }));
};

closeBtn.onclick = () => {
    inputModal.style.display = 'none';
};

//Дейкстра
function dijkstra(graph, startNode, endNode) {
    // Инициализация массивов
    const visited = new Set();
    const distances = Array(graph.nodes.length).fill(Infinity);
    const previous = Array(graph.nodes.length).fill(null);
    distances[startNode.id - 1] = 0;

    let currentNode = startNode;
    let iterationsData = [];
    while (currentNode) {
        const currentNodeId = currentNode.id - 1;

        // Обновление расстояний
        for (const edge of graph.edges) {
            if ((edge.node1 === currentNode.id || (edge.node2 === currentNode.id && !edge.direction)) && !visited.has(edge.node2)) {
                const neighborNodeId = edge.node2 - 1;
                const newDistance = distances[currentNodeId] + parseFloat(edge.length);
                if (newDistance < distances[neighborNodeId]) {
                    distances[neighborNodeId] = newDistance;
                    previous[neighborNodeId] = currentNode.id;
                }
            }
        }

        // Добавление текущей вершины в посещенные
        if(Number(Array.from(visited).pop()) == currentNode.id) break;
        visited.add(currentNode.id);
        // Сохранение текущих данных для таблицы
        iterationsData.push({
            visited: new Set(visited),
            currentNode: currentNode.id,
            distances: Array.from(distances)
        });



        // Выбор следующей вершины
        let minDistance = Infinity;
        let nextNode = null;
        for (let i = 0; i < distances.length; i++) {
            if (!visited.has(i + 1) && distances[i] < minDistance) {
                minDistance = distances[i];
                nextNode = graph.nodes[i];
            }
        }
        currentNode = nextNode;
    }

    // Восстановление кратчайшего пути
    let path = [];
    let pathNode = endNode.id;
    while (pathNode) {
        path.unshift(pathNode);
        pathNode = previous[pathNode - 1];
    }

    return {
        path,
        iterationsData
    };
}

function findShortestPath() {
    const startNodeId = parseInt(prompt('Введите начальную вершину:'));
    const endNodeId = parseInt(prompt('Введите конечную вершину:'));
    const startNode = {
        id: startNodeId,
        ...graph.nodes.find(node => node.id === startNodeId)
    };
    const endNode = {
        id: endNodeId,
        ...graph.nodes.find(node => node.id === endNodeId)
    };

    if (!startNode || !endNode) {
        alert('Неправильные значения начальной или конечной вершины.');
        return;
    }
    const {
        path,
        iterationsData
    } = dijkstra(graph, startNode, endNode);

    if (path.length > 1) {
        // Заполнение таблицы результатов

        resultTable.style.display = '';
        resultTable.innerHTML = '';
        const headerRow = resultTable.insertRow();
        headerRow.innerHTML = `<th>Итерация</th><th>S</th><th>w</th>${graph.nodes
            .map((node) => `<th>D[${node.id}]</th>`)
            .join('')}`;

        for (const iterationData of iterationsData) {
            const row = resultTable.insertRow();
            row.innerHTML = `
        <td>${iterationData.visited.size}</td>
        <td>{${Array.from(iterationData.visited).join(', ')}}</td>
        <td>${iterationData.currentNode}</td>
        ${iterationData.distances.map(distance => `<td>${distance === Infinity ? '∞' : distance.toFixed(2).toString().replace('.', ',')}</td>`).join('')
            }
      `;
        }
    } else {
        resultTable.innerHTML = '';
    }

    // Вывод кратчайшего пути
    if (path.length > 1) {
        textResult.style.display = '';
        textResult.innerHTML = `Кратчайший путь из ${startNodeId} в ${endNodeId}: {${path.join(', ')}}`;
    } else {
        textResult.style.display = '';
        textResult.innerHTML = `Нет пути из ${startNodeId} в ${endNodeId}.`;
    }
    const sColumn = document.querySelectorAll('#result td:nth-of-type(2)');
    const sColumnWidth = Array.from(sColumn).reduce((maxWidth, cell) => {
        const cellWidth = cell.offsetWidth;
        return cellWidth > maxWidth ? cellWidth : maxWidth;
    }, 0);

    const sHeaderCell = document.querySelector('#result th:nth-of-type(2)');
    if(sHeaderCell) sHeaderCell.style.width = `${sColumnWidth}px`;

}

//Алгоритм ближайшего соседа
let graphCopy;
let remainingNodes;
let currentNode;
let steps;
let finish = false;

function nearestNeighborAlgorithm(startNodeId) {
    finish = false;
    graphCopy = JSON.parse(JSON.stringify(graph));
    remainingNodes = graphCopy.nodes.slice();
    currentNode = remainingNodes.find(node => node.id === startNodeId);
    remainingNodes = remainingNodes.filter(node => node.id !== startNodeId);
    steps = [];
    let totalLength = 0;
    let indexes = `${currentNode.id}, `;

    while (remainingNodes.length) {
        let minDistance = Infinity;
        let nearestNode;
        let nearestEdge;

        remainingNodes.forEach(node => {
            const edge = graphCopy.edges.find(edge => (edge.node1 === currentNode.id && edge.node2 === node.id) || (edge.node1 === node.id && edge.node2 === currentNode.id));

            if (edge && parseFloat(edge.length) < minDistance) {
                minDistance = parseFloat(edge.length);
                nearestNode = node;
                nearestEdge = edge;
            }
        });

        steps.push(nearestEdge);
        currentNode = nearestNode;
        remainingNodes = remainingNodes.filter(node => node.id !== nearestNode.id);
        indexes += nearestNode.id + ", ";
        totalLength += parseFloat(minDistance);
    }
    indexes = indexes.slice(0, -2);
    textResult.innerHTML = `Путь: {${indexes}} <br> Общая длина: ${totalLength}`;

    nextStepBtn.style.display = '';
    toTheEndBtn.style.display = '';
    textResult.style.display = '';
    buttonsContainer.style.display = 'none';

    performNextStep();
}

function performNextStep() {
    if (steps.length && !finish) {
        const nextEdge = steps.shift();
        nextEdge.highlight = true;
        drawGraph(graphCopy, ctx, canvas);
    } else {
        nextStepBtn.style.display = 'none';
        toTheEndBtn.style.display = 'none';
        buttonsContainer.style.display = '';
        drawGraph(graph,ctx,canvas);
        textResult.style.display = 'none';
    }
}

function performToEnd() {
    steps.forEach(edge => edge.highlight = true);
    drawGraph(graphCopy, ctx, canvas);
    toTheEndBtn.style.display = 'none';
    finish = true;
}

NNAButton.onclick = () => {

    //TODO FIX 1-2-3-4
    if (isTree(graph)) {
        textResult.style.display = '';
        textResult.innerHTML = 'Ошибка: невозможно обойти все вершины графа.';
        setTimeout(() => {
            textResult.style.display = 'none';
        }, 5000);
        return;
    }
    if(!checkEdges(graph)){
        textResult.style.display = '';
        textResult.innerHTML = `Ошибка: граф не связный. У одной или нескольких вершин нет связанных ребер.`;
        setTimeout(() =>{
            textResult.style.display = 'none';
        }, 5000)
        return;
    }
    const firstNodeId = prompt('Введите значение начального узла', '1')

    resultTable.style.display = 'none';

    if(checkEdges(graph) && graph.nodes.some(node => node.id === parseInt(firstNodeId))){
        nearestNeighborAlgorithm(parseInt(firstNodeId));
    }else if(!checkEdges(graph)){
        textResult.innerHTML = `Не у всех узлов есть ребра`;
        textResult.style.display = '';
        setTimeout(()=>{
            textResult.style.display = 'none';
        }, 10000);
    }
    else{
        textResult.innerHTML = `Узел с указанным ID не существует`;
        textResult.style.display = '';
            setTimeout(()=>{
            textResult.style.display = 'none';
        }, 10000);
    }
};

//Алгоритм Прима

function primAlgorithm(graphCopy, startNode) {
    let visitedNodes = new Set();
    let highlightedEdges = [];

    visitedNodes.add(startNode);

    while (visitedNodes.size < graphCopy.nodes.length) {
        let minEdge = null;

        for (const edge of graphCopy.edges) {
            if ((visitedNodes.has(edge.node1) && !visitedNodes.has(edge.node2)) || (visitedNodes.has(edge.node2) && !visitedNodes.has(edge.node1))) {
                if (!minEdge || parseFloat(edge.length) < parseFloat(minEdge.length)) {
                    minEdge = edge;
                }
            }
        }

        if (minEdge) {
            visitedNodes.add(minEdge.node1);
            visitedNodes.add(minEdge.node2);
            highlightedEdges.push(minEdge);
        }
    }

    return highlightedEdges;
}

primsButton.addEventListener('click', () => {
    // Создаем копию графа
    finish = false;
    const graphCopy = JSON.parse(JSON.stringify(graph));
    if(!checkEdges(graphCopy)){
        textResult.style.display = '';
        textResult.innerHTML = `Ошибка: граф не связный. У одной или нескольких вершин нет связанных ребер.`;
        setTimeout(() =>{
            textResult.style.display = 'none';
        }, 5000)
        return;
    }
    const startNode = prompt("Введите стартовый узел", "1");
    if(!checkNode(graph, parseInt(startNode))){
        textResult.style.display = '';
        textResult.innerHTML = `Ошибка: указанной вершины не существует.`;
        setTimeout(() =>{
            textResult.style.display = 'none';
        }, 5000)
        return;
    }
    //TODO Добавить проверку на наличие вершины и на сбалансированность графа
    //TODO Пофиксить визуальное редактирование графа

    // Выполняем алгоритм Прима и получаем подсвеченные ребра
    const highlightedEdges = primAlgorithm(graphCopy, parseInt(startNode));

    buttonsContainer.style.display = 'none';
    resultTable.style.display = 'none';

    // Создаем кнопки "Далее" и "В конец"
    const nextButton = document.createElement('button');
nextButton.classList.add('centered-button');
    nextButton.id = 'nextStep';
    nextButton.innerText = 'Далее';
    document.body.appendChild(nextButton);

    const toEndButton = document.createElement('button');
    toEndButton.classList.add('centered-button');

    toEndButton.id = 'toEnd';
    toEndButton.innerText = 'В конец';
    document.body.appendChild(toEndButton);

    // Переменная для отслеживания текущего шага
    let currentStep = 0;
    // Подсветка первого ребра и перерисовка графа
    highlightedEdges[currentStep].highlight = true;
    drawGraph(graphCopy, ctx, canvas);
    textResult.style.display = '';
    textResult.innerHTML = `Итоговый вес остовного дерева: ${highlightedEdges.reduce((total, highlightedEdges) => total + parseFloat(highlightedEdges.length), 0)}`;
    // Обработчик событий для кнопки "Далее"
    nextButton.addEventListener('click', () => {
        if (currentStep < highlightedEdges.length - 1 && !finish) {
            currentStep++;
            highlightedEdges[currentStep].highlight = true;
            drawGraph(graphCopy, ctx, canvas);
        } else {
            // Восстанавливаем первоначальный граф и выводим результат
            drawGraph(graph, ctx, canvas);
            // Возвращаем скрытые кнопки
            buttonsContainer.style.display = '';


            // Удаляем кнопки "Далее" и "В конец"
            document.body.removeChild(nextButton);
            if(!finish) document.body.removeChild(toEndButton);
            textResult.innerHTML = ``;
            finish = false;

        }
    });

    // Обработчик событий для кнопки "В конец"
    toEndButton.addEventListener('click', () => {
        for (let i = currentStep; i < highlightedEdges.length; i++) {
            highlightedEdges[i].highlight = true;
        }
        drawGraph(graphCopy, ctx, canvas);

        // Восстанавливаем первоначальный граф и выводим результат
            finish = true;
            // Удаляем кнопки "Далее" и "В конец"
            document.body.removeChild(toEndButton);
    });
});

//Код Прюфера

function pruferStep(graph, degrees) {
    if (!degrees) {
        return { pruferCode: null, updatedDegrees: null };
    }

    let minNode = degrees.filter(node => node.degree === 1).sort((a, b) => a.weight - b.weight || a.id - b.id)[0];

    if (!minNode) {
        return { pruferCode: null, updatedDegrees: null };
    }

    let adjacentNode = graph.edges.find(edge => edge.node1 === minNode.id || edge.node2 === minNode.id);

    if (!adjacentNode) {
        return { pruferCode: null, updatedDegrees: null };
    }

    let neighbor = adjacentNode.node1 === minNode.id ? adjacentNode.node2 : adjacentNode.node1;

    graph.deleteNode(minNode.id);
    degrees = degrees.filter(node => node.id !== minNode.id);
    degrees.find(node => node.id === neighbor).degree--;

    return { pruferCode: neighbor, updatedDegrees: degrees };
}

function pruferAlgorithm(graph) {
    let pruferCode = [];
    let degrees = graph.nodes.map(node => {
        return { id: node.id, degree: graph.edges.filter(edge => edge.node1 === node.id || edge.node2 === node.id).length, weight: node.weight };
    });

    while (graph.nodes.length > 2) {
        let stepResult = pruferStep(graph, degrees);

        if (stepResult.pruferCode === null) {
            return []; // Возвращает пустой массив, если adjacentNode не найден (граф не связный)
        }

        pruferCode.push(stepResult.pruferCode);
        degrees = stepResult.updatedDegrees;
    }

    return pruferCode;
}

function isTree(graph) {
    const visited = new Set();
    const stack = [graph.nodes[0].id];

    while (stack.length > 0) {
        const currentNode = stack.pop();
        visited.add(currentNode);

        const neighbors = graph.edges
            .filter(edge => edge.node1 === currentNode || edge.node2 === currentNode)
            .map(edge => (edge.node1 === currentNode ? edge.node2 : edge.node1));

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
            } else {
                const connectedEdges = graph.edges.filter(edge => (edge.node1 === currentNode && edge.node2 === neighbor) || (edge.node1 === neighbor && edge.node2 === currentNode));
                if (connectedEdges.length > 1) {
                    return false;
                }
            }
        }
    }

    return visited.size === graph.nodes.length && graph.edges.length === graph.nodes.length - 1;
}

pruferButton.addEventListener('click', () => {
    resultTable.style.display = 'none';
    const graphCopy = new Graph(
        JSON.parse(JSON.stringify(graph.nodes)),
        JSON.parse(JSON.stringify(graph.edges))
    );

    if (!isTree(graphCopy)) {
        textResult.style.display = '';
        textResult.innerHTML = `Ошибка: граф должен быть деревом (связным и ациклическим).`;
        setTimeout(() => {
            textResult.style.display = 'none';
        }, 5000);
        return;
    }

    if (!checkEdges(graphCopy)) {
        textResult.style.display = '';
        textResult.innerHTML = `Ошибка: граф не связный. У одной или нескольких вершин нет связанных ребер.`;
        setTimeout(() => {
            textResult.style.display = 'none';
        }, 5000)
        return;
    }

    const pruferCode = pruferAlgorithm(graphCopy);
    buttonsContainer.style.display = 'none';

    const nextButton = document.createElement('button');
    nextButton.id = 'nextStep';
    nextButton.innerText = 'Далее';
    document.body.appendChild(nextButton);

    const toEndButton = document.createElement('button');
    toEndButton.id = 'toEnd';
    toEndButton.innerText = 'В конец';
    document.body.appendChild(toEndButton);
    nextButton.classList.add('centered-button');
    toEndButton.classList.add('centered-button');
    let currentStep = 0;
    let currentPruferCode = [];
    let degrees;

    textResult.style.display = '';
    textResult.innerHTML = `Текущий код Прюфера: ${currentPruferCode}`;

    nextButton.addEventListener('click', () => {
        const graphCopy = new Graph(
            JSON.parse(JSON.stringify(graph.nodes)),
            JSON.parse(JSON.stringify(graph.edges))
        );
        if (currentStep < pruferCode.length) { // Изменено условие, чтобы оставалось две вершины в графе
            currentPruferCode.push(pruferCode[currentStep]);
            currentStep++;

            let degrees = graphCopy.nodes.map(node => {
                return { id: node.id, degree: graphCopy.edges.filter(edge => edge.node1 === node.id || edge.node2 === node.id).length, weight: node.weight };
            });

            for (let i = 0; i < currentStep; i++) {
                const stepResult = pruferStep(graphCopy, degrees);
                degrees = stepResult.updatedDegrees;
            }

            drawGraph(graphCopy, ctx, canvas);
            textResult.innerHTML = `Текущий код Прюфера: ${currentPruferCode}`;
        } else {
            buttonsContainer.style.display = '';
            document.body.removeChild(nextButton);
            document.body.removeChild(toEndButton);
            textResult.style.display = 'none';
            drawGraph(graph, ctx, canvas);
        }
    });

    toEndButton.addEventListener('click', () => {
        const graphCopy = new Graph(
            JSON.parse(JSON.stringify(graph.nodes)),
            JSON.parse(JSON.stringify(graph.edges))
        );
        currentStep = pruferCode.length;

        degrees = graphCopy.nodes.map(node => {
            return { id: node.id, degree: graphCopy.edges.filter(edge => edge.node1 === node.id || edge.node2 === node.id).length, weight: node.weight };
        });

        for (let i = 0; i < pruferCode.length; i++) {
            const stepResult = pruferStep(graphCopy, degrees);
            currentPruferCode.push(stepResult.pruferCode);
            degrees = stepResult.updatedDegrees;
        }

        // Удаляем последний шаг, чтобы оставить две вершины в графе
        currentPruferCode.pop();

        drawGraph(graphCopy, ctx, canvas);
        textResult.style.display = '';
        textResult.innerHTML = `Текущий код Прюфера: ${currentPruferCode}`;

        toEndButton.style.display = 'none';
    });



});

// //Обратный код
//
// function reversePruferStep(pruferCode, availableNodes) {
//     const nodeIndex = pruferCode.shift();
//     const node = availableNodes.find(n => n.id === nodeIndex);
//     const minNode = availableNodes.filter(n => !pruferCode.includes(n.id)).sort((a, b) => a.weight - b.weight || a.id - b.id)[0];
//
//     availableNodes.splice(availableNodes.indexOf(minNode), 1);
//
//     return {
//         edge: { node1: node.id, node2: minNode.id },
//         updatedAvailableNodes: availableNodes,
//     };
// }
//
// function reversePruferAlgorithm(pruferCode, nodes) {
//     let availableNodes = nodes.slice();
//     const edges = [];
//
//     while (pruferCode.length > 0) {
//         const stepResult = reversePruferStep(pruferCode, availableNodes);
//         edges.push(stepResult.edge);
//         availableNodes = stepResult.updatedAvailableNodes;
//     }
//
//     if (availableNodes.length === 2) {
//         edges.push({ node1: availableNodes[0].id, node2: availableNodes[1].id });
//     }
//
//     return edges;
// }
//
// revPruferButton.addEventListener('click', () => {
//     const pruferCode = JSON.parse('[' + prompt('Введите код Прюфера (числа через запятую):') + ']');
//     const nodes = graph.nodes;
//
//     if (pruferCode.length !== nodes.length - 2) {
//         alert('Код Прюфера некорректной длины. Длина должна быть равна числу вершин минус 2.');
//         return;
//     }
//
//     buttonsContainer.style.display = 'none';
//     const nextButton = document.createElement('button');
//     nextButton.id = 'nextStep';
//     nextButton.innerText = 'Далее';
//     document.body.appendChild(nextButton);
//
//     const toEndButton = document.createElement('button');
//     toEndButton.id = 'toEnd';
//     toEndButton.innerText = 'В конец';
//     document.body.appendChild(toEndButton);
//
//     const newEdges = reversePruferAlgorithm(pruferCode.slice(), nodes);
//     const graphCopy = new Graph(JSON.parse(JSON.stringify(nodes)), []);
//
//     let currentStep = 0;
//
//     nextButton.addEventListener('click', () => {
//         if (currentStep < newEdges.length) {
//             graphCopy.edges.push(newEdges[currentStep]);
//             currentStep++;
//             drawGraph(graphCopy, ctx, canvas);
//         } else {
//             buttonsContainer.style.display = '';
//             document.body.removeChild(nextButton);
//             document.body.removeChild(toEndButton);
//             drawGraph(graph, ctx, canvas);
//         }
//     });
//
//     toEndButton.addEventListener('click', () => {
//         graphCopy.edges = newEdges;
//         drawGraph(graphCopy, ctx, canvas);
//
//         buttonsContainer.style.display = '';
//         document.body.removeChild(nextButton);
//         document.body.removeChild(toEndButton);
//     });
// });

//Жадный Алгоритм Раскраски

function greedyColoring(graph) {
    const nodes = JSON.parse(JSON.stringify(graph.nodes)).sort((a, b) => a.id - b.id);
    const edges = JSON.parse(JSON.stringify(graph.edges));
    const colorMap = new Map();

    nodes.forEach(node => {
        const adjacentNodes = edges
            .filter(edge => edge.node1 === node.id || edge.node2 === node.id)
            .map(edge => (edge.node1 === node.id ? edge.node2 : edge.node1));

        const usedColors = new Set();
        adjacentNodes.forEach(adjacentNode => {
            const color = colorMap.get(adjacentNode);
            if (color) {
                usedColors.add(color);
            }
        });

        let color = 1;
        while (usedColors.has(color)) {
            color++;
        }

        colorMap.set(node.id, color);
    });

    return colorMap;
}
const GreedyBtn = document.getElementById('Greedy');
GreedyBtn.addEventListener('click', () => {
    const graphCopy = new Graph(
        JSON.parse(JSON.stringify(graph.nodes)),
        JSON.parse(JSON.stringify(graph.edges))
    );

    const colorMap = greedyColoring(graphCopy);

    graphCopy.nodes.forEach(node => {
        node.color = `rgba(${(colorMap.get(node.id) * 60) % 255}, ${(colorMap.get(node.id) * 100) % 255}, ${(colorMap.get(node.id) * 130) % 255}, 0.6)`;
    });
    document.getElementById('result').style.display = 'none';

    buttonsContainer.style.display = 'none';

    const nextButton = document.createElement('button');
    nextButton.id = 'nextStep';
    nextButton.innerText = 'Далее';
    document.body.appendChild(nextButton);

    const toEndButton = document.createElement('button');
    toEndButton.id = 'toEnd';
    toEndButton.innerText = 'В конец';
    document.body.appendChild(toEndButton);
    nextButton.classList.add('centered-button');
    toEndButton.classList.add('centered-button');

    let currentStep = 0;
    let colorQueue = Array.from(colorMap);
    let finished = false;

    nextButton.addEventListener('click', () => {
        if (currentStep < colorQueue.length) {
            graph.nodes.find(node => node.id === colorQueue[currentStep][0]).color = graphCopy.nodes.find(node => node.id === colorQueue[currentStep][0]).color;
            drawGraph(graph, ctx, canvas);
            currentStep++;
        }

        if (currentStep === colorQueue.length && !finished) {
            finished = true;
            toEndButton.style.display = 'none';
        } else if (currentStep === colorQueue.length && finished) {
            graph.nodes.forEach(node => {
                node.color = 'rgba(30, 144, 255, 0.6)';
            });
            drawGraph(graph, ctx, canvas);
            currentStep = 0;
            finished = false;
            toEndButton.style.display = 'none';
            buttonsContainer.style.display = '';
            document.body.removeChild(nextButton);
            document.body.removeChild(toEndButton);
        } else if (finished) {
            buttonsContainer.style.display = '';
            document.body.removeChild(nextButton);
            document.body.removeChild(toEndButton);
        }
    });

    toEndButton.addEventListener('click', () => {
        graph.nodes.forEach(node => {
            node.color = graphCopy.nodes.find(nodeCopy => nodeCopy.id === node.id).color;
        });
        drawGraph(graph, ctx, canvas);

        finished = true;
        currentStep = colorQueue.length;
        toEndButton.style.display = 'none';
    });
});

//Точный Алгоритм Раскраски
function exhaustiveColoring(graph, currentColoring, currentNode, bestColoring) {
    if (currentNode >= graph.nodes.length) {
        if (!bestColoring || maxColor(currentColoring) < maxColor(bestColoring)) {
            return currentColoring;
        }
        return bestColoring;
    }

    const adjacentNodes = graph.edges
        .filter(edge => edge.node1 === graph.nodes[currentNode].id || edge.node2 === graph.nodes[currentNode].id)
        .map(edge => (edge.node1 === graph.nodes[currentNode].id ? edge.node2 : edge.node1));

    for (let color = 1; color <= maxColor(currentColoring) + 1; color++) {
        let validColor = true;
        for (const adjacentNode of adjacentNodes) {
            if (currentColoring[adjacentNode - 1] === color) {
                validColor = false;
                break;
            }
        }

        if (validColor) {
            const newColoring = currentColoring.slice();
            newColoring[currentNode] = color;
            bestColoring = exhaustiveColoring(graph, newColoring, currentNode + 1, bestColoring);
        }
    }

    return bestColoring;
}

function maxColor(coloring) {
    return Math.max.apply(null, coloring);
}

const exhaustiveBtn = document.getElementById('Exhaustive');
exhaustiveBtn.addEventListener('click', () => {
    const graphCopy = new Graph(
        JSON.parse(JSON.stringify(graph.nodes)),
        JSON.parse(JSON.stringify(graph.edges))
    );

    const bestColoring = exhaustiveColoring(graphCopy, Array(graphCopy.nodes.length).fill(0), 0, null);

    graphCopy.nodes.forEach((node, index) => {
        node.color = `rgba(${(bestColoring[index] * 60) % 255}, ${(bestColoring[index] * 100) % 255}, ${(bestColoring[index] * 130) % 255}, 0.6)`;
    });
    document.getElementById('result').style.display = 'none';
    buttonsContainer.style.display = 'none';

    const nextButton = document.createElement('button');
    nextButton.classList.add('centered-button');
    nextButton.id = 'nextStep';
    nextButton.innerText = 'Далее';
    document.body.appendChild(nextButton);

    let currentStep = 0;
    let colorQueue = bestColoring;
    let finished = false;
    graph.nodes.forEach(node => {
        node.color = graphCopy.nodes.find(nodeCopy => nodeCopy.id === node.id).color;
    });
    drawGraph(graph, ctx, canvas);

    const colorsUsed = new Set(Array.from(bestColoring.values())).size;
    textResult.innerHTML = `Количество использованных цветов: ${colorsUsed}`;
    textResult.style.display = '';
    finished = true;
    currentStep = colorQueue.length;
    nextButton.addEventListener('click', () => {
        if (currentStep < colorQueue.length) {
            graph.nodes.find(node => node.id === graphCopy.nodes[currentStep].id).color = graphCopy.nodes[currentStep].color;
            drawGraph(graph, ctx, canvas);
            currentStep++;
        }

    if (currentStep === colorQueue.length && finished) {
            graph.nodes.forEach(node => {
                node.color = 'rgba(30, 144, 255, 0.6)';
            });
            drawGraph(graph, ctx, canvas);
            currentStep = 0;
            finished = false;
            buttonsContainer.style.display = '';
            document.body.removeChild(nextButton);
            textResult.style.display = 'none';

    } else if (finished) {
            buttonsContainer.style.display = '';
        textResult.style.display = 'none';
        document.body.removeChild(nextButton);
        }
    });
});





// Алгоритм Форда-Фалкерсона для поиска максимального потока
const MaxFlowBtn = document.getElementById('MaxFlow');
MaxFlowBtn.addEventListener('click', () => {
    const source = parseInt(prompt('Введите ID начального узла:', '1'));
    const target = parseInt(prompt('Введите ID конечного узла:', '4'));

    if (!graph.nodes.some(node => node.id === source) || !graph.nodes.some(node => node.id === target)) {
        alert('Один или оба введенных ID не существуют в графе.');
        return;
    }

    if (source === target) {
        alert('ID начального и конечного узла совпадают.');
        return;
    }

    const graphCopy = JSON.parse(JSON.stringify(graph));
    const originalGraphState = JSON.parse(JSON.stringify(graph));
    const allSteps = [];
    let maxFlow = 0;
    let path = findAugmentingPath(graphCopy.edges, source, target);

    while (path !== null) {
        allSteps.push(path);

        let pathFlow = Infinity;
        for (let i = 0; i < path.length - 1; i++) {
            const edge = graphCopy.edges.find(edge => edge.node1 === path[i] && edge.node2 === path[i + 1]);
            pathFlow = Math.min(pathFlow, edge.length);
        }

        const updatedEdges = [];
        for (let i = 0; i < path.length - 1; i++) {
            const edge = graphCopy.edges.find(edge => edge.node1 === path[i] && edge.node2 === path[i + 1]);
            edge.length -= pathFlow;

            const originalEdge = graph.edges.find(edge => edge.node1 === path[i] && edge.node2 === path[i + 1]);
            updatedEdges.push({ edge: originalEdge, updatedLength: parseFloat(originalEdge.length) - pathFlow });

            let reverseEdge = graphCopy.edges.find(edge => edge.node1 === path[i + 1] && edge.node2 === path[i]);
            if (reverseEdge) {
                reverseEdge.length += pathFlow;
            } else {
                reverseEdge = { node1: path[i + 1], node2: path[i], length: pathFlow };
                graphCopy.edges.push(reverseEdge);
            }
        }

        allSteps[allSteps.length - 1].updatedEdges = updatedEdges;
        maxFlow += pathFlow;
        path = findAugmentingPath(graphCopy.edges, source, target);
    }

    buttonsContainer.style.display = 'none';

    const nextButton = document.createElement('button');
    nextButton.id = 'nextStep';
    nextButton.innerText = 'Далее';
    document.body.appendChild(nextButton);

    const toEndButton = document.createElement('button');
    toEndButton.id = 'toEnd';
    toEndButton.innerText = 'В конец';
    document.body.appendChild(toEndButton);
    nextButton.classList.add('centered-button');
    toEndButton.classList.add('centered-button');

    document.getElementById('text-result').innerHTML = `Максимальный поток: ${maxFlow}`;
    document.getElementById('text-result').style.display = '';

    let currentStep = 0;
    let finished = false;

    nextButton.addEventListener('click', () => {
        if (currentStep < allSteps.length) {
            graph.edges.forEach(edge => edge.highlight = false);
            const currentPath = allSteps[currentStep];
            currentPath.forEach((nodeId, index) => {
                if (index < currentPath.length - 1) {
                    const edge = graph.edges.find(edge => edge.node1 === nodeId && edge.node2 === currentPath[index + 1]);
                    if (edge) {
                        edge.highlight = true;
                    }
                }
            });
            currentPath.updatedEdges.forEach(({ edge, updatedLength }) => {
                edge.length = updatedLength;
            });
            drawGraph(graph, ctx, canvas);
            currentStep++;
        }    if (currentStep === allSteps.length && !finished) {
            finished = true;
            toEndButton.style.display = 'none';
        } else if (currentStep === allSteps.length && finished) {
            graph.edges.forEach(edge => edge.highlight = false);
            drawGraph(graph, ctx, canvas);
            currentStep = 0;
            finished = false;
            toEndButton.style.display = 'none';
            buttonsContainer.style.display = '';
            graph.edges = originalGraphState.edges;
            drawGraph(graph, ctx, canvas);
            document.body.removeChild(nextButton);
            document.body.removeChild(toEndButton);
            textResult.style.display = 'none';
        } else if (finished) {
            buttonsContainer.style.display = '';
            document.body.removeChild(nextButton);
            document.body.removeChild(toEndButton);
            textResult.style.display = 'none';
        }
    });

    toEndButton.addEventListener('click', () => {
        graph.edges.forEach(edge => edge.highlight = false);
        allSteps.forEach(path => {
            path.forEach((nodeId, index) => {
                if (index < path.length - 1) {
                    const edge = graph.edges.find(edge => edge.node1 === nodeId && edge.node2 === path[index + 1]);
                    if (edge) {
                        edge.highlight = true;
                    }
                }
            });
        });
        drawGraph(graph, ctx, canvas);

        finished = true;
        currentStep = allSteps.length;
        toEndButton.style.display = 'none';
    });
});

function findAugmentingPath(edges, source, target) {
    const queue = [source];
    const visited = new Set();
    const parent = {};

    while (queue.length) {
        const currentNode = queue.shift();

        if (currentNode === target) {
            const path = [target];

            while (path[0] !== source) {
                path.unshift(parent[path[0]]);
            }

            return path;
        }

        visited.add(currentNode);

        const adjacentEdges = edges.filter(edge => edge.node1 === currentNode && edge.length > 0);
        for (const edge of adjacentEdges) {
            const nextNode = edge.node2;

            if (!visited.has(nextNode)) {
                parent[nextNode] = currentNode;
                visited.add(nextNode);
                queue.push(nextNode);
            }
        }
    }

    return null;
}