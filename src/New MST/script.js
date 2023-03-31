class Node {
    constructor(name, x, y) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.edges = [];
    }
}

class Edge {
    constructor(node1, node2, weight) {
        this.node1 = node1;
        this.node2 = node2;
        this.weight = weight;
    }
}

class Graph {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.nodes = {};
        this.edges = [];
        this.selectedNode = null;
        this.nodeCounter = 0;
    }

    addNode(x, y) {
        const newNode = new Node(`Node${this.nodeCounter}`, x, y);
        this.nodes[newNode.name] = newNode;
        this.nodeCounter++;

        this.updateNodeSelect();
        this.drawGraph();
    }

    findNodeByCoordinates(x, y, threshold) {
        for (const nodeName in this.nodes) {
            const node = this.nodes[nodeName];
            const dx = node.x - x;
            const dy = node.y - y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < threshold) {
                return node;
            }
        }

        return null;
    }

    addEdge(node1, node2, weight) {
        const edge = new Edge(node1, node2, weight);
        node1.edges.push(edge);
        node2.edges.push(edge);
        this.edges.push(edge);
    }

    deleteEdge(edge) {
        this.edges = this.edges.filter((e) => e !== edge);
        edge.node1.edges = edge.node1.edges.filter((e) => e !== edge);
        edge.node2.edges = edge.node2.edges.filter((e) => e !== edge);
    }

    deleteNode(node) {
        delete this.nodes[node.name];
        node.edges.forEach((edge) => {
            this.deleteEdge(edge);
        });

        this.updateNodeSelect();
        this.drawGraph();
    }

    dijkstra(startNode, endNode) {
        const unvisitedNodes = new Set(Object.values(this.nodes));
        const distances = {};
        const previousNodes = {};

        for (const node of unvisitedNodes) {
            distances[node.name] = Infinity;
            previousNodes[node.name] = null;
        }

        distances[startNode.name] = 0;

        while (unvisitedNodes.size > 0) {
            const currentNode = Array.from(unvisitedNodes).reduce((closestNode, node) => {
                return distances[node.name] < distances[closestNode.name] ? node : closestNode;
            });

            if (currentNode === endNode) break;

            unvisitedNodes.delete(currentNode);

            for (const edge of currentNode.edges) {
                const neighbor = edge.node1 === currentNode ? edge.node2 : edge.node1;
                if (!unvisitedNodes.has(neighbor)) continue;

                const tentativeDistance = distances[currentNode.name] + edge.weight;
                if (tentativeDistance < distances[neighbor.name]) {
                    distances[neighbor.name] = tentativeDistance;
                    previousNodes[neighbor.name] = currentNode;
                }
            }
        }

        const path = [];
        let currentNode = endNode;

        while (currentNode) {
            path.unshift(currentNode.name);
            currentNode = previousNodes[currentNode.name];
        }

        return {
            path: path,
            distance: distances[endNode.name],
        };
    }

    drawGraph() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const edge of this.edges) {
            this.ctx.beginPath();
            this.ctx.moveTo(edge.node1.x, edge.node1.y);
            this.ctx.lineTo(edge.node2.x, edge.node2.y);
            this.ctx.stroke();

            const middleX = (edge.node1.x + edge.node2.x) / 2;
            const middleY = (edge.node1.y + edge.node2.y) / 2;
            this.ctx.fillText(edge.weight, middleX, middleY);
        }

        for (const nodeName in this.nodes) {
            const node = this.nodes[nodeName];

            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
            this.ctx.fillStyle = "white";
            this.ctx.fill();
            this.ctx.stroke();

            this.ctx.fillStyle = "black";
            this.ctx.fillText(node.name, node.x - 10, node.y + 5);
        }
    }

    updateNodeSelect() {
        startNodeSelect.innerHTML = '';
        endNodeSelect.innerHTML = '';

        for (const nodeName in this.nodes) {
            const option = document.createElement("option");
            option.value = nodeName;
            option.text = nodeName;

            startNodeSelect.add(option.cloneNode(true));
            endNodeSelect.add(option);
        }
    }
}

const showError = (message) => {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    setTimeout(() => {
        errorMessage.textContent = "";
    }, 3000);
};

const canvas = document.getElementById("graph-canvas");
const addNodeButton = document.getElementById("add-node");
const resetGraphButton = document.getElementById("reset-graph");
const startNodeSelect = document.getElementById("start-node");
const endNodeSelect = document.getElementById("end-node");
const calculateButton = document.getElementById("calculate");
const nodesTable = document.getElementById("nodes-table");
const edgesTable = document.getElementById("edges-table");
const resultTable = document.getElementById("result-table");

const graph = new Graph(canvas);

addNodeButton.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(Math.random() * rect.width);
    const y = Math.floor(Math.random() * rect.height);
    const threshold = 30;

    if (!graph.findNodeByCoordinates(x, y, threshold)) {
        graph.addNode(x, y);
    } else {
        showError("Узел слишком близко к другому узлу");
    }
});

resetGraphButton.addEventListener("click", () => {
    graph.resetGraph();
});

calculateButton.addEventListener("click", () => {
    const startNode = graph.nodes[startNodeSelect.value];
    const endNode = graph.nodes[endNodeSelect.value];

    if (!startNode || !endNode) {
        showError("Выберите начальный и конечный узел");
        return;
    }

    const result = graph.dijkstra(startNode, endNode);
    // Ваш код для отображения результата алгоритма Дейкстры в таблице resultTable
});

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const threshold = 30;

    const clickedNode = graph.findNodeByCoordinates(x, y, threshold);

    if (clickedNode) {
        if (graph.selectedNode) {
            const weight = Math.floor(Math.random() * 10) + 1;
            graph.addEdge(graph.selectedNode, clickedNode, weight);
            graph.selectedNode = null;
        } else {
            graph.selectedNode = clickedNode;
        }
    } else {
        graph.selectedNode = null;
    }

    graph.drawGraph();
});
