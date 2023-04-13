class Node {
    constructor(x, y, weight=1) {
        this.x = x;
        this.y = y;
        this.weight = weight;
        this.edges = [];
    }
}

class Edge {
    constructor(node1, node2, length, direction) {
        this.node1 = node1;
        this.node2 = node2;
        this.length = length;
        this.direction = direction;
    }
}

let nodes = [];
let edges = [];
