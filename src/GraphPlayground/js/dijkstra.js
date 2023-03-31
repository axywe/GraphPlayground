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

    return { path, iterationsData };
}

function findShortestPath() {
    const startNodeId = parseInt(prompt('Введите начальную вершину:'));
    const endNodeId = parseInt(prompt('Введите конечную вершину:'));
    const startNode = { id: startNodeId, ...nodes[startNodeId - 1] };
    const endNode = { id: endNodeId, ...nodes[endNodeId - 1] };

    if (!startNode || !endNode) {
        alert('Неправильные значения начальной или конечной вершины.');
        return;
    }

    const graph = JSON.parse(getJSONGraphData());
    const { path, iterationsData } = dijkstra(graph, startNode, endNode);
    if (path.length > 1) {
        // Заполнение таблицы результатов
        const resultTable = document.getElementById('result');
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
        const resultTable = document.getElementById('result');
        resultTable.innerHTML = '';
    }

// Вывод кратчайшего пути
    const textResult = document.getElementById('text-result');
    if (path.length > 1) {
        textResult.innerHTML = `Кратчайший путь из ${startNodeId} в ${endNodeId}: {${path.join(', ')}}`;
    } else {
        textResult.innerHTML = `Нет пути из ${startNodeId} в ${endNodeId}.`;
    }

}
