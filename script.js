const inputBox = document.getElementById('input-box');
const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button")
const resetPlusButton = document.getElementById('reset-plus-button');
const resetMinusButton = document.getElementById('reset-minus-button');
const messageBox = document.getElementById("message-box");
const guessContainers = document.querySelectorAll(".guess-container");
const keys = document.querySelectorAll(".key");
const RANDOM_WORD_API_URL = "https://violetgoat-word-backend.herokuapp.com/random/"
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
let guessedLetterFrequencyMap = {};
let secretWord = "train";
let guessCount = 0;
let gameOver = false;
let currentWordLength = WORD_LENGTH;
const resultArray = [];

document.addEventListener('DOMContentLoaded', () => {
    submitButton.addEventListener("click", submitGuess);
    resetButton.addEventListener("click", resetSame);
    resetPlusButton.addEventListener('click', resetPlus);
    resetMinusButton.addEventListener('click', resetMinus)
    keys.forEach(key=>key.addEventListener('click', (e)=>keyPress(e)))
})

fetchSecretWord();

async function fetchSecretWord(wordLength = WORD_LENGTH) {

    let isValid = false;

    do {
        let response = await fetch(RANDOM_WORD_API_URL + wordLength);
        secretWord = await getTextFromStream(response.body);
        isValid = await isValidWord(secretWord);
    } while(!isValid)

    currentWordLength = wordLength;

}

async function getTextFromStream(readableStream) {
    let reader = readableStream.getReader();
    let utf8Decoder = new TextDecoder();
    let nextChunk;

    let resultStr = '';

    while (!(nextChunk = await reader.read()).done) {
        let partialData = nextChunk.value;
        resultStr += utf8Decoder.decode(partialData);
    }

    return resultStr;
}

async function submitGuess(){

    if(gameOver) {return;}

    const guess = inputBox.value.toLowerCase();
    guessedLetterFrequencyMap = {}
    const valid = await isValidWord(guess);

    if(guess.length !== secretWord.length){

        printMessage("Enter a "  + secretWord.length + "-letter word.");

    } else if (!valid){

        printMessage("I'm pretty sure that's not a word.");

    } else {

        printMessage("");

        updateResultArray(guess);
        updateDomWithResult(guess);

        guessCount += 1;
        inputBox.value = "";

        if(resultArray.every(num=>num ===2 )){
            printMessage("You got it!")
            gameOver = true;
        } else if(guessCount === MAX_GUESSES){
            printMessage(`No. The word was: ${secretWord.toUpperCase()}`)
            gameOver = true;
        }

    }
}

function reset(wordLength){

    guessCount = 0;

    printMessage("");
    updateDomForWordLength(wordLength);

    const letterBlocksInner = document.querySelectorAll(".letter-block-inner")

    letterBlocksInner.forEach(element=>{
        element.classList.remove('correct-letter');
        element.classList.remove('misplaced-letter');
        element.classList.remove('incorrect-letter');
        element.classList.add("no-guess");
    })

    keys.forEach(key=>clearKeyClass(key));

    fetchSecretWord(wordLength);

}

function resetSame(){
    reset(currentWordLength);
}

function resetMinus(){
    if(currentWordLength > 4){
        reset(currentWordLength-1)
    }
}

function resetPlus(){
    if(currentWordLength < 7){
        reset(currentWordLength+1)
    }
}

function updateResultArray(guess){

    for(let i = 0; i < secretWord.length; i++){
        resultArray[i] = 0;
    }

    checkForCorrectLettersInCorrectPosition(guess);
    checkForCorrectLettersInWrongPosition(guess);

}

function checkForCorrectLettersInCorrectPosition(guess){
    for(let i = 0; i < resultArray.length; i++){
        const guessChar = guess.charAt(i);
        const correctChar = secretWord.charAt(i);
        if(guessChar === correctChar) {
            resultArray[i] = 2;
            addOrIncrementLetterFrequencyInGuessedLettersMap(guessChar)
        }
    }
}

function checkForCorrectLettersInWrongPosition(guess) {
    for(let i = 0; i < resultArray.length; i++){

        if(resultArray[i] === 2){
            continue;
        }

        const guessChar = guess.charAt(i);

        if(secretWord.indexOf(guessChar) !== -1) {

            addOrIncrementLetterFrequencyInGuessedLettersMap(guessChar);
            const correctFrequency = frequencyOfCharacterInCorrectWord(guessChar)

            if(!(guessedLetterFrequencyMap[guessChar] >
                correctFrequency)) {
                resultArray[i] = 1;
            }
        }
    }
}

function addOrIncrementLetterFrequencyInGuessedLettersMap(guessChar){
    if(guessedLetterFrequencyMap.hasOwnProperty(guessChar)){
        guessedLetterFrequencyMap[guessChar] = guessedLetterFrequencyMap[guessChar] + 1;
    } else {
        guessedLetterFrequencyMap[guessChar] = 1;
    }
}

function frequencyOfCharacterInCorrectWord(guessChar) {
    let count = 0;

    for(let i = 0; i < secretWord.length; i++){
        if(secretWord.charAt(i) === guessChar){
            count += 1;
        }
    }

    return count;
}


function printMessage(message){
    messageBox.innerText = message;
}

async function isValidWord(guess){
    return fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + guess)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data[0].hasOwnProperty('word');
        }).catch(()=> {return false})

}

function updateDomWithResult(guess){

    const currentRowGuessBoxes = guessContainers[guessCount].children;

    // update color of letters in results container (top)
    for(let i = 0; i < secretWord.length; i++){

        const guessedLetter = guess.charAt(i).toUpperCase();
        const currentBox = currentRowGuessBoxes[i].firstElementChild;
        const correspondingKey = document.getElementById(guessedLetter);

        if(resultArray[i] === 2){
            currentBox.classList.add("correct-letter")
        } else if(resultArray[i] === 1) {
            currentBox.classList.add("misplaced-letter")

            if(correspondingKey!== null){
                clearKeyClass(correspondingKey)
                correspondingKey.classList.add("misplaced-letter")
            }
        } else {
            currentBox.classList.add("incorrect-letter")

            if(correspondingKey!== null){
                clearKeyClass(correspondingKey)
                correspondingKey.classList.add("incorrect-letter")
            }

        }

        currentBox.classList.remove("no-guess");
        currentBox.innerText = guessedLetter;

    }
}

function clearKeyClass(key){
    key.classList.remove('correct-letter');
    key.classList.remove('misplaced-letter');
    key.classList.remove('incorrect-letter');
}

function updateDomForWordLength(wordLength) {

    if(wordLength === currentWordLength){
        return;
    }

    if(wordLength < 8 && wordLength > currentWordLength){


        guessContainers.forEach(guessContainer => {
            let count = 1;

            while (guessContainer.childElementCount < wordLength) {
                const blockNumber = currentWordLength + count;
                const child = document.createElement("div");
                child.classList.add('letter-block');

                const grandchild = document.createElement('div');
                grandchild.classList.add('letter-block-inner');
                grandchild.classList.add('block-' + blockNumber);
                grandchild.classList.add('no-guess')

                child.appendChild(grandchild);
                guessContainer.appendChild(child);

                count++;
            }

        })

    } else if(wordLength > 3 && wordLength < currentWordLength) {
        guessContainers.forEach(guessContainer=>{
            while(guessContainer.childElementCount > wordLength){
                guessContainer.lastChild.remove();
            }
        })
    }
}

function keyPress(e) {

    const currentInput = inputBox.value;
    const currentInputLength = currentInput.length;
    let newInput = "";

    if (e.target.id === 'backspace-key') {

        if(currentInputLength > 1) {
            newInput = currentInput.substring(0, currentInputLength - 1);
        }

    } else {

        const pressed = e.target.innerText;
        newInput = currentInput + pressed.toUpperCase();

    }

    inputBox.value = newInput;
}