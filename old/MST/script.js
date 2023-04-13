const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const mstButton = document.getElementById('mst');
const resetButton = document.getElementById('reset');
const nodeTable = document.getElementById('nodeTable').querySelector('tbody');


let nodes = [];
let edges = [];

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    nodes.push({ x, y });
    updateNodeTable();
    drawNodes();
});

function updateNodeTable() {
    nodeTable.innerHTML = '';
    nodes.forEach((node, index) => {
        const tr = document.createElement('tr');

        const nodeIndex = document.createElement('td');
        nodeIndex.textContent = index;
        tr.appendChild(nodeIndex);

        const nodeX = document.createElement('td');
        nodeX.textContent = node.x.toFixed(0);
        tr.appendChild(nodeX);

        const nodeY = document.createElement('td');
        nodeY.textContent = node.y.toFixed(0);
        tr.appendChild(nodeY);

        nodeTable.appendChild(tr);
    });
}


function drawNodes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
}

function drawEdge(edge) {
    ctx.beginPath();
    ctx.moveTo(nodes[edge.node1].x, nodes[edge.node1].y);
    ctx.lineTo(nodes[edge.node2].x, nodes[edge.node2].y);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.stroke();
}

function euclideanDistance(node1, node2) {
    const dx = node1.x - node2.x;
    const dy = node1.y - node2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function kruskalMST(nodes) {
    edges = [];
    for (let i = 0; i < nodes.length; ++i) {
        for (let j = i + 1; j < nodes.length; ++j) {
            edges.push({ node1: i, node2: j, weight: euclideanDistance(nodes[i], nodes[j]) });
        }
    }

    edges.sort((a, b) => a.weight - b.weight);

    const sets = [];
    for (let i = 0; i < nodes.length; ++i) {
        sets.push(new Set([i]));
    }

    const mstEdges = [];

    for (const edge of edges) {
        const set1 = sets.find(set => set.has(edge.node1));
        const set2 = sets.find(set => set.has(edge.node2));

        if (set1 !== set2) {            mstEdges.push(edge);

            const unionSet = new Set([...set1, ...set2]);
            sets.splice(sets.indexOf(set1), 1);
            sets.splice(sets.indexOf(set2), 1);
            sets.push(unionSet);

            if (mstEdges.length === nodes.length - 1) {
                break;
            }
        }
    }

    return mstEdges;
}

mstButton.addEventListener('click', () => {
    if (nodes.length < 2) return;

    const mstEdges = kruskalMST(nodes);
    drawNodes();
    for (const edge of mstEdges) {
        drawEdge(edge);
    }
});

resetButton.addEventListener('click', () => {
    nodes = [];
    edges = [];
    updateNodeTable();
    drawNodes();
});