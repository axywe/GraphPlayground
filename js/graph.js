class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(node) {
        this.nodes.push(node);
    }

    addEdge(edge) {
        this.edges.push(edge);
    }
}

class Node {
    constructor(id, x, y, weight) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.weight = weight;
        this.edges = [];
    }
    addEdge(edge) {
        this.edges.push(edge);
    }
}

class Edge {
    constructor(id, node1, node2, length) {
        this.id = id;
        this.node1 = node1;
        this.node2 = node2;
        this.length = length;
    }
}