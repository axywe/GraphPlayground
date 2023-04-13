const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');
const clearCanvasBtn = document.getElementById('clearCanvas');
const graphDataTable = document.getElementById('graphData').getElementsByTagName('tbody')[0];

canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const existingNode = nodes.find(node => Math.hypot(node.x - x, node.y - y) < 20);

    if (existingNode) {
        if (canvas.selectedNode) {
            // check if the edge already exists and determine the direction
            const existingEdge = edges.find(edge =>
                (edge.node1 === canvas.selectedNode && edge.node2 === existingNode) ||
                (edge.node1 === existingNode && edge.node2 === canvas.selectedNode)
            );
            const direction = existingEdge && existingEdge.node1 === existingNode ? '0' : '1';

            // prompt for length and direction
            const length = parseFloat(prompt('Введите длину ребра:', existingEdge ? existingEdge.length : '0'));
            if (length > 0) {
                const newDirection = prompt('Введите направление ребра (1 - одностороннее, 0 - двустороннее):', direction);
                if (newDirection !== null) {
                    const isOneWay = newDirection === '1';
                    if (existingEdge) {
                        existingEdge.length = length;
                        existingEdge.direction = isOneWay;
                    } else {
                        const edge = new Edge(canvas.selectedNode, existingNode, length, isOneWay);
                        edges.push(edge);
                        canvas.selectedNode.edges.push(edge);
                        existingNode.edges.push(edge);
                    }
                }
                canvas.selectedNode = null;
            }
        } else {
            canvas.selectedNode = existingNode;
        }
    } else {
        const weight = prompt('Введите вес вершины', '1');
        if (weight !== null) {
            const newNode = new Node(x, y, weight);
            nodes.push(newNode);
        }
    }
    updateGraphData();
    drawGraph();
});

function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentEdges = step === 0 ? edges : history[step - 1];

    ctx.lineWidth = 3;

    currentEdges.forEach(edge => {
        ctx.beginPath();
        ctx.moveTo(edge.node1.x, edge.node1.y);
        ctx.lineTo(edge.node2.x, edge.node2.y);
        ctx.stroke();

        const midpointX = (edge.node1.x + edge.node2.x) / 2;
        const midpointY = (edge.node1.y + edge.node2.y) / 2;

        ctx.font = 'bold 16px Arial';
        ctx.fillText(edge.length.toFixed(2), midpointX, midpointY);

        if (edge.direction) {
            const angle = Math.atan2(edge.node2.y - edge.node1.y, edge.node2.x - edge.node1.x);
            const arrowSize = 10;
            const arrowAngle = Math.PI / 6;

            const arrowOffset = 20;
            const arrowX = edge.node2.x - arrowOffset * Math.cos(angle);
            const arrowY = edge.node2.y - arrowOffset * Math.sin(angle);

            ctx.beginPath();
            ctx.moveTo(arrowX - arrowSize * Math.cos(angle - arrowAngle), arrowY - arrowSize * Math.sin(angle - arrowAngle));
            ctx.lineTo(arrowX, arrowY);
            ctx.lineTo(arrowX - arrowSize * Math.cos(angle + arrowAngle), arrowY - arrowSize * Math.sin(angle + arrowAngle));
            ctx.stroke();
        }
    });

    const nodeSize = 15;

    nodes.forEach((node, index) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI);
        ctx.fillStyle = canvas.selectedNode === node ? 'rgba(255, 69, 0, 1)' : 'rgba(255, 140, 0, 1)';
        ctx.fill();
        ctx.stroke();

        ctx.font = 'bold 16px Arial';

        ctx.fillStyle = 'black';
        ctx.fillText((node.weight).toString(), node.x - 5, node.y - 20);
        ctx.fillStyle = 'black';
        ctx.fillText((index + 1).toString(), node.x - 5, node.y + 5);
    });
}

function updateGraphData() {
    graphDataTable.innerHTML = '';
    nodes.forEach((node, index) => {
        const row = graphDataTable.insertRow();
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        cell1.textContent = (index + 1).toString();

        const connectedNodes = node.edges.map(edge => {
            const connectedNode = edge.node1 === node ? edge.node2 : edge.node1;
            const connectedNodeIndex = nodes.indexOf(connectedNode) + 1;
            return { id: connectedNodeIndex, length: edge.length.toFixed(2), edge };
        });

        cell2.innerHTML = connectedNodes
            .map(
                connectedNode =>
                    `<span class="edge" data-node-id="${index + 1}" data-connected-node-id="${connectedNode.id}">(${connectedNode.id}, ${connectedNode.length})</span>`
            )
            .join(', ');

        cell1.classList.add('node');
        cell1.dataset.nodeId = (index + 1).toString();
    });

    // Добавляем обработчики событий для удаления узлов и ребер
    graphDataTable.querySelectorAll('.node').forEach(nodeElement => {
        nodeElement.addEventListener('click', event => {
            const nodeId = parseInt(event.target.dataset.nodeId, 10);
            removeNode(nodeId);
            updateGraphData();
            drawGraph();
        });
    });

    graphDataTable.querySelectorAll('.edge').forEach(edgeElement => {
        edgeElement.addEventListener('click', event => {
            const nodeId = parseInt(event.target.dataset.nodeId, 10);
            const connectedNodeId = parseInt(event.target.dataset.connectedNodeId, 10);
            removeEdge(nodeId, connectedNodeId);
            updateGraphData();
            drawGraph();
        });
    });
}

function removeNode(nodeId) {
    const nodeToRemove = nodes[nodeId - 1];
    nodes = nodes.filter((_, i) => i !== nodeId - 1);
    edges = edges.filter(
        edge => edge.node1 !== nodeToRemove && edge.node2 !== nodeToRemove
    );
}

function removeEdge(nodeId, connectedNodeId) {
    const node = nodes[nodeId - 1];
    const connectedNode = nodes[connectedNodeId - 1];
    const edgeToRemove = node.edges.find(
        edge => edge.node1 === connectedNode || edge.node2 === connectedNode
    );

    if (edgeToRemove) {
        node.edges = node.edges.filter(edge => edge !== edgeToRemove);
        connectedNode.edges = connectedNode.edges.filter(edge => edge !== edgeToRemove);
        edges = edges.filter(edge => edge !== edgeToRemove);
    }
}

clearCanvasBtn.addEventListener('click', () => {
    nodes = [];
    edges = [];
    drawGraph();
    updateGraphData();
    document.getElementById('result').innerHTML = '';
    document.getElementById('text-result').innerHTML = '';
});
