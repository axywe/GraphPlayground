window.alert = function(message) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.zIndex = '9999';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    const content = document.createElement('div');
    content.style.position = 'absolute';
    content.style.top = '50%';
    content.style.left = '50%';
    content.style.transform = 'translate(-50%, -50%)';
    content.style.backgroundColor = 'white';
    content.style.padding = '1em';
    content.style.borderRadius = '5px';
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    content.appendChild(messageElement);
    content.appendChild(okButton);
    modal.appendChild(content);
    document.body.appendChild(modal);
};

let mode = 1;

function switchMode(newMode) {
    mode = newMode;
    document.querySelector('.button-container').className = `button-container mode-${mode}`;

    const loadJSON = document.getElementById('loadJSON');
    const dijkstra = document.getElementById('dijkstra');
    const startPrims = document.getElementById('startPrims');
    const getJSON = document.getElementById('getJSON');
    const stepForward = document.getElementById('stepForward');
    const stepBack = document.getElementById('stepBack');
    const cancel = document.getElementById('cancel');
    const toEnd = document.getElementById('toEnd');
    const forwardBtn = document.getElementById('forwardBtn');
    const backwardBtn = document.getElementById('backwardBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const endBtn = document.getElementById('endBtn');
    const pruferCodeOutput = document.getElementById('textCode');
    const result = document.getElementById('result');
    const textresult = document.getElementById('text-result');
    const pruferBtn = document.getElementById('Prufer');

    loadJSON.style.display = 'none';
    dijkstra.style.display = 'none';
    startPrims.style.display = 'none';
    getJSON.style.display = 'none';
    stepForward.style.display = 'none';
    stepBack.style.display = 'none';
    cancel.style.display = 'none';
    toEnd.style.display = 'none';
    forwardBtn.style.display = 'none';
    backwardBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    endBtn.style.display = 'none';
    pruferCodeOutput.style.display = 'none';
    textresult.style.display = 'none';
    result.style.display = 'none';

    switch (mode) {
        case 1:
            loadJSON.style.display = 'inline-block';
            getJSON.style.display = 'inline-block';
            break;
        case 2:
            dijkstra.style.display = 'inline-block';
            textresult.style.display = 'inline-block';
            result.style.display = 'inline-block';
            break;
        case 3:
            startPrims.style.display = 'inline-block';
            stepForward.style.display = 'inline-block';
            stepBack.style.display = 'inline-block';
            cancel.style.display = '';
            toEnd.style.display = '';
            break;
        case 4:
            pruferBtn.style.display = 'inline-block';
            forwardBtn.style.display = 'inline-block';
            backwardBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
            endBtn.style.display = 'inline-block';
            pruferCodeOutput.style.display = 'inline-block';
            break;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    switchMode(1);
});
