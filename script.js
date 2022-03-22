const inputBox = document.getElementById('input-box');
const submitButton = document.getElementById("submit-button");
const resetButton = document.getElementById("reset-button")
const messageBox = document.getElementById("message-box");
const guessContainers = document.getElementsByClassName("guess-container");
const letterBlocksInner = document.getElementsByClassName("letter-block-inner")
const RANDOM_WORD_API_URL = "/"
const MAX_GUESSES = 6;
let guessedLetterFrequencyMap = {};
let secretWord = "train";
let guessCount = 0;

submitButton.addEventListener("click", submitGuess);
resetButton.addEventListener("click", reset);

// async function generateRandomWord() {
//
//     const config = {
//         headers: {
//             Accept: 'application/json'
//         }
//     }
//
//     // fetch word from server
//
//     const response = await fetch(RANDOM_WORD_API_URL + wordLength, config)
//     const wordData = await response.json()
//
//     // add word to word element
//
//     secretWord = wordData.word;
// }

async function submitGuess(){
    const guess = inputBox.value;

    if(guess.length !== secretWord.length || !isValidWord(guess)){
        printMessage("Enter a "  + secretWord.length + "-letter word.");
    } else if(guessCount < MAX_GUESSES) {

        printMessage("");

        const resultArray = getResultArray(guess, secretWord);

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
            currentBox.innerHTML = guess.charAt(i).toUpperCase();

        }

        guessCount += 1;

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
}

/**
 *
 * @param {String} guess
 * @param {String} secretWord
 * @returns {*[]}
 */
function getResultArray(guess, secretWord){

    const resultArray = [];

    for(let i = 0; i < secretWord.length; i++){
        resultArray.push(0);
    }

    checkForCorrectLettersInCorrectPosition(guess, secretWord, resultArray);

    checkForCorrectLettersInWrongPosition(guess, secretWord, resultArray);

    return resultArray;
}

function checkForCorrectLettersInCorrectPosition(guess, secretWord, resultArray){
    for(let i = 0; i < resultArray.length; i++){
        const guessChar = guess.charAt(i);
        const correctChar = secretWord.charAt(i);
        if(guessChar === correctChar) {
            resultArray[i] = 2;
            addOrIncrementLetterFrequencyInGuessedLettersMap(guessChar)
        }
    }
}

function checkForCorrectLettersInWrongPosition(guess, secretWord, resultArray) {
    for(let i = 0; i < resultArray.length; i++){

        if(resultArray[i] === 2){
            continue;
        }

        const guessChar = guess.charAt(i);

        if(secretWord.indexOf(guessChar) !== -1) {

            addOrIncrementLetterFrequencyInGuessedLettersMap(guessChar);

            if(!(guessedLetterFrequencyMap[guessChar] >
                frequencyOfCharacterInCorrectWord(guessChar))) {
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
    messageBox.innerHTML = message;
}

function isValidWord(){
    return true;
}
