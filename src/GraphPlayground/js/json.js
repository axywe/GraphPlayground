const loadJSONBtn = document.getElementById('loadJSON');

function getJSONGraphData() {
    const nodesData = nodes.map((node, index) => {
        return { id: index + 1, x: node.x, y: node.y, weight: node.weight };
    });

    const edgesData = edges.map(edge => {
        return {
            node1: nodes.indexOf(edge.node1) + 1,
            node2: nodes.indexOf(edge.node2) + 1,
            length: edge.length.toFixed(2),
            direction: edge.direction
        };
    });

    const graphData = {
        nodes: nodesData,
        edges: edgesData
    };

    return JSON.stringify(graphData, null, 2);
}

loadJSONBtn.addEventListener('click', () => {
    const jsonString = prompt('Введите JSON строку графа:', '{\n' +
        '  "nodes": [\n' +
        '    {\n' +
        '      "id": 1,\n' +
        '      "x": 304,\n' +
        '      "y": 372.5625\n' +
        '    },\n' +
        '    {\n' +
        '      "id": 2,\n' +
        '      "x": 453,\n' +
        '      "y": 364.5625\n' +
        '    },\n' +
        '    {\n' +
        '      "id": 3,\n' +
        '      "x": 402,\n' +
        '      "y": 259.5625\n' +
        '    },\n' +
        '    {\n' +
        '      "id": 4,\n' +
        '      "x": 521,\n' +
        '      "y": 231.5625\n' +
        '    },\n' +
        '    {\n' +
        '      "id": 5,\n' +
        '      "x": 414,\n' +
        '      "y": 145.5625\n' +
        '    },\n' +
        '    {\n' +
        '      "id": 6,\n' +
        '      "x": 276,\n' +
        '      "y": 216.5625\n' +
        '    }\n' +
        '  ],\n' +
        '  "edges": [\n' +
        '    {\n' +
        '      "node1": 1,\n' +
        '      "node2": 3,\n' +
        '      "length": "9.00",\n' +
        '      "direction": true\n' +
        '    },\n' +
        '    {\n' +
        '      "node1": 1,\n' +
        '      "node2": 2,\n' +
        '      "length": "7.00",\n' +
        '      "direction": true\n' +
        '    },\n' +
        '    {\n' +
        '      "node1": 3,\n' +
        '      "node2": 6,\n' +
        '      "length": "2.00",\n' +
        '      "direction": true\n' +
        '    },\n' +
        '    {\n' +
        '      "node1": 1,\n' +
        '      "node2": 6,\n' +
        '      "length": "14.00",\n' +
        '      "direction": true\n' +
        '    },\n' +
        '    {\n' +
        '      "node1": 2,\n' +
        '      "node2": 4,\n' +
        '      "length": "15.00",\n' +
        '      "direction": true\n' +
        '    },\n' +
        '    {\n' +
        '      "node1": 3,\n' +
        '      "node2": 4,\n' +
        '      "length": "11.00",\n' +
        '      "direction": true\n' +
        '    },\n' +
        '    {\n' +
        '      "node1": 4,\n' +
        '      "node2": 5,\n' +
        '      "length": "6.00",\n' +
        '      "direction": true\n' +
        '    },\n' +
        '    {\n' +
        '      "node1": 6,\n' +
        '      "node2": 5,\n' +
        '      "length": "9.00",\n' +
        '      "direction": true\n' +
        '    },\n' +
        '    {\n' +
        '      "node1": 2,\n' +
        '      "node2": 3,\n' +
        '      "length": "10.00",\n' +
        '      "direction": true\n' +
        '    }\n' +
        '  ]\n' +
        '}');
    if (jsonString) {
        try {
            const graphData = JSON.parse(jsonString);
            loadGraphFromJSONData(graphData);
            drawGraph();
        } catch (error) {
            alert('Ошибка при разборе JSON: ' + error.message);
        }
    }
    updateGraphData();
});

function loadGraphFromJSONData(graphData) {
    nodes = graphData.nodes.map(data => new Node(data.x, data.y, data.weight));
    edges = graphData.edges.map(data => {
        const node1 = nodes[data.node1 - 1];
        const node2 = nodes[data.node2 - 1];
        const length = parseFloat(data.length);
        const direction = data.direction;
        const edge = new Edge(node1, node2, length, direction);
        node1.edges.push(edge);
        node2.edges.push(edge);
        return edge;
    });
}
