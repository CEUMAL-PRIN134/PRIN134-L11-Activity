const gameArea = document.getElementById('gameArea');
const originalTarget = document.getElementById('target');
const scoreBoard = document.getElementById('scoreBoard');
const setupInput = document.querySelector('#ins input');
const setupButton = document.querySelector('#ins button');

let score = 0;
let targets = [];
let nextExpected = 1;
let totalTargets = 0;


originalTarget.style.display = 'none';

setupButton.addEventListener('click', setupGame);

function setupGame() {
    // Clear previous game
    targets.forEach(target => {
        if (target.element.parentNode) {
            gameArea.removeChild(target.element);
        }
    });
    targets = [];
    nextExpected = 1;

    scoreBoard.textContent = `Score: ${score}`;

    const numberOfTargets = parseInt(setupInput.value);

    
    if (isNaN(numberOfTargets) || numberOfTargets < 1 || numberOfTargets > 5) {
        return; 
    }

    totalTargets = numberOfTargets;

    // Create targets
    for (let i = 1; i <= numberOfTargets; i++) {
        createTarget(i);
    }
}

function createTarget(number) {
    const newTarget = document.createElement('div');
    newTarget.className = 'target';
    newTarget.textContent = number;

    Object.assign(newTarget.style, {
        position: 'absolute',
        width: '50px',
        height: '50px',
        backgroundColor: 'red',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold'
    });

    gameArea.appendChild(newTarget);
    moveTarget(newTarget);

    const targetObj = {
        element: newTarget,
        number: number
    };
    targets.push(targetObj);

    newTarget.addEventListener('contextmenu', function (e) {
        e.preventDefault(); // Right-click only
        handleTargetRightClick(targetObj);
    });
}

function moveTarget(targetElement) {
    const gameAreaRect = gameArea.getBoundingClientRect();
    const maxX = gameAreaRect.width - targetElement.offsetWidth;
    const maxY = gameAreaRect.height - targetElement.offsetHeight;

    targetElement.style.left = `${Math.floor(Math.random() * maxX)}px`;
    targetElement.style.top = `${Math.floor(Math.random() * maxY)}px`;
}

function handleTargetRightClick(targetObj) {
    if (targetObj.number === nextExpected) {
        targetObj.element.remove();

        const index = targets.findIndex(t => t.number === targetObj.number);
        if (index !== -1) {
            targets.splice(index, 1);
        }

        nextExpected++;

        if (nextExpected > totalTargets) {
            score += totalTargets;
            scoreBoard.textContent = `Score: ${score}`;

            setTimeout(() => {
                setupGame();
            }, 800);
        }
    }
}

// Ctrl + S 
document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    score = 0;
    scoreBoard.textContent = `Score: ${score}`;
  }
});
