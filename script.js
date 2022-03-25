const inputBox = document.getElementById('input-box');
const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button")
const messageBox = document.getElementById("message-box");
const guessContainers = document.getElementsByClassName("guess-container");
const letterBlocksInner = document.getElementsByClassName("letter-block-inner")
const RANDOM_WORD_API_URL = "https://violetgoat-word-backend.herokuapp.com/random/"
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
let guessedLetterFrequencyMap = {};
let secretWord = "train";
let guessCount = 0;
const resultArray = [];

submitButton.addEventListener("click", submitGuess);
resetButton.addEventListener("click", reset);

fetchSecretWord();

async function fetchSecretWord() {

    // fetch word from server

    let response = await fetch(RANDOM_WORD_API_URL + WORD_LENGTH);

    secretWord = await getTextFromStream(response.body);

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
    const guess = inputBox.value;

    if(guess.length !== secretWord.length || !isValidWord(guess)){
        printMessage("Enter a "  + secretWord.length + "-letter word.");
    } else if(guessCount < MAX_GUESSES) {

        printMessage("");

        updateResultArray(guess)

        updateDomWithResult(guess);

        guessCount += 1;
        inputBox.value = "";

        if(resultArray.every(num=>num ===2 )){
            printMessage("You got it!")
        } else if(guessCount === MAX_GUESSES){
            printMessage(`No. The word was: ${secretWord.toUpperCase()}`)
        }
            guessedLetterFrequencyMap = {}
    }
}

function reset(){
    guessCount = 0;
    Array.from(letterBlocksInner).forEach(element=>{
        element.classList.remove('correct-letter');
        element.classList.remove('misplaced-letter');
        element.classList.remove('incorrect-letter');
        element.classList.add("no-guess");
    })
    printMessage("");
    fetchSecretWord();
}

/**
 *
 * @param {String} guess
 * @param {String} secretWord
 * @returns {*[]}
 */
function updateResultArray(guess){

    for(let i = 0; i < secretWord.length; i++){
        resultArray[i] = 0;
    }

    checkForCorrectLettersInCorrectPosition(guess, secretWord);
    checkForCorrectLettersInWrongPosition(guess, secretWord);

}

function checkForCorrectLettersInCorrectPosition(guess, secretWord){
    for(let i = 0; i < resultArray.length; i++){
        const guessChar = guess.charAt(i);
        const correctChar = secretWord.charAt(i);
        if(guessChar === correctChar) {
            resultArray[i] = 2;
            addOrIncrementLetterFrequencyInGuessedLettersMap(guessChar)
        }
    }
}

function checkForCorrectLettersInWrongPosition(guess, secretWord) {
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

function isValidWord(){
    return true;
}

function updateDomWithResult(guess){

    const currentRowGuessBoxes = guessContainers[guessCount].children;

    for(let i = 0; i < secretWord.length; i++){

        const currentBox = currentRowGuessBoxes[i].firstElementChild;

        if(resultArray[i] === 2){
            currentBox.classList.add("correct-letter")
        } else if(resultArray[i] === 1) {
            currentBox.classList.add("misplaced-letter")
        } else {
            currentBox.classList.add("incorrect-letter")
        }

        currentBox.classList.remove("no-guess");
        currentBox.innerText = guess.charAt(i).toUpperCase();

    }
}