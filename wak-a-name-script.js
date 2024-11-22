const title = document.getElementById("title");
const grid = document.getElementById("grid");
const cells = document.querySelectorAll(".cell");
const utility = document.getElementsByClassName("utility");

let username;
let gameActive = false;
let letterInterval;
let unpickedLetters;
let pickedLetters;
let alphabetIndex;
let letter;
let randomIndex;

function startGame() {
    gameActive = true;
    console.log("Game Started");

    username = "";

    updateUsername();
    resetUnpickedLetters();
    resetInOrder();
    initializeCellClickHandlers();
    hideLetters();

    letterInterval = setInterval(showLetters, 1050); // cells change every 1.05 sec
    // console.log("Intreval: ", 1050);

    document.getElementById("start-button").classList.add("hidden");

    title.style.margin = "5%";
    grid.style.width = "auto";
    grid.style.height = "auto";

    for (let i = 0; i < utility.length; i++) utility[i].style.display = "flex";
}

function updateUsername() {
    title.innerHTML = "Name: " + username + "<--";
    // console.log("Name updated: ", (username));
}

function resetUnpickedLetters() {
    unpickedLetters = Array.from({ length: 26 }, (_, i) =>
        String.fromCharCode(65 + i)
    );
    // console.log("Reset unpicked letters list: ", unpickedLetters);

    pickedLetters = [];
    // console.log("Reset picked letters list: ", pickedLetters);
}

function resetInOrder() {
    alphabetIndex = 0;
    // console.log("Reset alphabet index");
}

function initializeCellClickHandlers() {
    cells.forEach((cell) => {
        cell.addEventListener("mousedown", (event) => {
            if (!cell.querySelector(".firstChild")) handleEmptyCellClick();
        });
    });
}

function hideLetters() {
    cells.forEach((cell) => {
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild); // remove the letter
        }
        cell.style.backgroundColor = "#f0f0f0";
    });
}

function showLetters() {
    hideLetters();

    // 1 letter is in order
    const orderedLetter = getNextAlphabetLetter();

    // 2 are from already picked (in order not counted and at start they are random)
    const firstOldLetter = pickRandomLetterFromPicked([orderedLetter]);
    const secondOldLetter = pickRandomLetterFromPicked([
        orderedLetter,
        firstOldLetter,
    ]);

    // 2 are from un-picked (in order not counted)
    const firstNewLetter = pickRandomLetterFromUnpicked([orderedLetter]);
    const secondNewLetter = pickRandomLetterFromUnpicked([orderedLetter]);

    const selectedLetters = [
        firstNewLetter,
        secondNewLetter,
        firstOldLetter,
        secondOldLetter,
        orderedLetter,
    ];

    const selectedCells = new Set();

    selectedLetters.forEach((letter) => {
        do randomCell = Math.floor(Math.random() * cells.length);
        while (selectedCells.has(randomCell));

        selectedCells.add(randomCell);

        cells[randomCell].style.backgroundColor = "#8bc34a";
        const letterElement = document.createElement("div");
        letterElement.classList.add("letter");
        letterElement.innerText = letter;
        letterElement.addEventListener("mouseup", (event) =>
            whackLetter(event, letter)
        );
        cells[randomCell].appendChild(letterElement);
    });
}

function handleEmptyCellClick() {
    const action = Math.floor(Math.random() * 3);
    if (action === 0) {
        backspace();
    } else if (action === 1) {
        space();
    } else {
        const randomLetter = getRandomLetter();
        username += randomLetter;
        updateUsername();
    }
}

function getRandomLetter(alreadySelected = []) {
    do {
        const randomIndex = Math.floor(Math.random() * 26);
        letter = String.fromCharCode(65 + randomIndex);
        // console.log('Random letter:', letter);
    } while (alreadySelected.includes(letter));

    return letter;
}

function whackLetter(event, letter) {
    const cell = event.target.parentNode;
    cell.removeChild(event.target);
    username += letter;
    updateUsername();
    cell.style.backgroundColor = "#f0f0f0";
}

function backspace() {
    if (username.length > 0) {
        username = username.slice(0, -1);
        // console.log('backspace')
        updateUsername();
    }
}

function space() {
    username += " ";
    // console.log('space')
    updateUsername();
}

function getNextAlphabetLetter() {
    if (alphabetIndex >= 26) resetInOrder();

    const letter = String.fromCharCode(65 + alphabetIndex);
    alphabetIndex++;
    // console.log('In order:', letter)
    return letter;
}

function pickRandomLetterFromUnpicked(alreadySelected) {
    if (unpickedLetters.length === 0) resetUnpickedLetters();

    do {
        randomIndex = Math.floor(Math.random() * unpickedLetters.length);
        letter = unpickedLetters[randomIndex];
        // console.log("new letter: " + letter);
    } while (alreadySelected.includes(letter));

    unpickedLetters.splice(randomIndex, 1);
    pickedLetters.push(letter);
    return letter;
}

function pickRandomLetterFromPicked(alreadySelected) {
    if (pickedLetters.length === 0) return getRandomLetter(alreadySelected);

    do {
        randomIndex = Math.floor(Math.random() * pickedLetters.length);
        letter = pickedLetters[randomIndex];
        // console.log("old letter: " + letter);
    } while (alreadySelected.includes(letter));

    return letter;
}

function enter() {
    const userConfirmation = confirm('Is your name "' + username + '"?');
    if (userConfirmation) {
        clearInterval(letterInterval);
        gameActive = false;
        const selectedName = username;
        resetGame(selectedName);
    } else {
        // console.log("Still selecting!");
    }
}

function resetGame(selectedName) {
    // console.log("Selected Name: " + selectedName);

    window.parent.postMessage({ type: 'selectedName', letters: selectedName }, '*');

    // reset everything
    username = "";
    resetUnpickedLetters();
    resetInOrder();
    hideLetters();
    for (let i = 0; i < utility.length; i++) utility[i].style.display = "none";
    title.innerHTML =
        "Play Whac-A-Mole with the letters in your name!<br><br>Click on ⌫ to remove the last added letter, <br>⎵ to add a space, <br>when you're ready to submit, click on ⏎.";
    grid.style.width = "0";
    grid.style.height = "0";
    document.getElementById("start-button").classList.remove("hidden");
};
