const ANSWER_LENGHT = 5;
const ROUNDS = 6;
const letters = document.querySelectorAll(".box");
const loadingDiv = document.querySelector(".info-bar");

let init = async () => {
   let currentRow = 0;
   let currentGuess = "";
   let done = false;
   let isLoading = true;

   const res = await fetch("https://words.dev-apis.com/word-of-the-day")
    const resObj = await res.json();
    const word = resObj.word.toUpperCase();
    const wordParts = word.split("");
    setLoading(false);
    isLoading = false;

   const addLetter = (letter) => {
    if (currentGuess.length < ANSWER_LENGHT) {
        currentGuess += letter;
    } else {
        currentGuess = currentGuess.substring(0, currentGuess.length - 1) + letter;
    } 

    letters[ANSWER_LENGHT * currentRow + currentGuess.length - 1].innerText = letter;
}
   let commit = async () => {
    if (currentGuess.length !== ANSWER_LENGHT) {
        return;
    }
    isLoading = true;
    setLoading(true);
    const res = await fetch("https://words.dev-apis.com/validate-word", {
    method: "POST",
    body: JSON.stringify({word: currentGuess})
    });

    const resObj = await res.json();
    const validWord = resObj.validWord;

    isLoading= false;
    setLoading(false);

    if (!validWord) {
        markInvalidWord();
        return;
    }

    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);

    for (let i = 0; i< ANSWER_LENGHT; i++) {
        if (guessParts[i] === wordParts[i]) {
            letters[currentRow * ANSWER_LENGHT + i].classList.add("correct");
            map[guessParts[i]]--;
        }
    }

    for (let i = 0; i < ANSWER_LENGHT; i++) {
        if (guessParts[i] === wordParts[i]) {

        }else if (wordParts.includes(guessParts[i]) && map[guessParts[i]]> 0) {        
            letters[currentRow * ANSWER_LENGHT + i].classList.add("close");
            map[guessParts[i]] --;
        } else {
            letters[currentRow * ANSWER_LENGHT + i].classList.add("wrong");
        }
    }
    currentRow++;
    if (currentGuess === word) {
        done = true;
        document.querySelector(".Title").classList.add("winner");
        return;
    } else if (currentRow === ROUNDS) {
        alert(`you lose, the word was ${word}`);
        done = true;
    }
    currentGuess = "";

   }

   const backspace = () => {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[ANSWER_LENGHT * currentRow + currentGuess.length].innerText = "";
   }

   const markInvalidWord = () => {
    for (let i = 0; i < ANSWER_LENGHT; i++) {
        letters[currentRow * ANSWER_LENGHT + i].classList.remove("invalid");
        setTimeout(function () {
            letters[currentRow * ANSWER_LENGHT + i].classList.add("invalid");   
        }, 10);
    }
   }

   document.addEventListener("keydown",handleKeyPress = (event) => {
    if (done || isLoading) {
        //do nothing
        return;
    }
    const action = event.key;

    if(action === "Enter") {
        commit ();
      } else if (action === "Backspace") {
        backspace();
      } else if (isLetter(action)) {
        addLetter(action.toUpperCase());
      } else {
        // do nothing //
    }
   });
}

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
  };

function setLoading(isLoading) {
  loadingDiv.classList.toggle("show", isLoading);

}

const makeMap = (array) => {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        const letter = array[i]
        if  (obj[letter]) {
            obj[letter]++;
        } else {
            obj[letter] =1;
        }
    }

    return obj;
}

init();
