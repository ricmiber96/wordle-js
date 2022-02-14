
import WORDS from '../assets/words.json'
import './WordleWord.js'
import './WordleKeyboard.js'

const LETTERS = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
"a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ",
"z", "x", "c", "v", "b", "n", "m"]

class WordleGame extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.startGame();
    }

static get styles(){
    return /* css */`
    :host {
        font-family: Montserrat, sans-serif;
        --exact-color: #6aaa64;
        --exist-color: #c9b458;
        --used-color: #3a3b3c;
    }
    .container{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        height: 100vh;
  
    }

    h1 {
        text-transform: uppercase;
        padding-bottom: .5rem;
        border-bottom: 1px solid #555;
    }

    .words {
        display: flex;
        flex-direction: column;
        font-weight: bold;
    }
    `;
}

startGame() {
    const randomIndex = Math.floor(Math.random()*WORDS.length);
    this.secretWord = WORDS[randomIndex]
    this.ending = false;
    console.log('====================================');
    console.log(this.secretWord );
    console.log('====================================');
}


connectedCallback(){
    this.render();
    this.currentWord = this.shadowRoot.querySelector("wordle-word[current]")
    this.keyboard = this.shadowRoot.querySelector("wordle-keyboard")
    document.addEventListener("keyup", (event) => this.pushLetter(event.key))
    document.addEventListener("keyboard", (event) => this.pushLetter(event.detail))
}

pushLetter(letter) {
    //GAME OVER 
    if(this.ending){return}
    const key = letter.toLowerCase()
    const isEnter = key === "enter"
    const isBackspace = key === "backspace"
    const isLetter = LETTERS.includes(key)
    const isEmptyWord = this.currentWord.isEmpty()

    if(isEnter){
        this.checkRestriction()
    }
    if(isBackspace){
        //REMOVE LAST LETTER
        this.currentWord.removeLetter()
    }
    if(isLetter && isEmptyWord){
        //ADD LETTER 
        this.currentWord.addLetter(key)
    }

}

//ADD LOGIC RESTRICTION
checkRestriction(){

    const isEmptyWord = this.currentWord.isEmpty()
    if(isEmptyWord){
        alert("La palabra debe contener 5 letras")
        return
    }

    const word = this.currentWord.toString()
    const isCorrectWord = WORDS.includes(word)

    if (!isCorrectWord){
        alert("La palabra no existe en el diccionario")
        return
    }

    const solved = this.resolve()
    if(!solved){
        this.nextWord()
        return
    }

    this.win()

}

resolve() {
    const word = this.currentWord.toString()
    const possibleLetters = word.split("")
    const secretLetters =  this.secretWord.split("")
    
    possibleLetters.forEach((letter,i)=> {
        const isExactLetter = letter == this.secretWord[i]
        if(isExactLetter){
            this.currentWord.setExactLetter(i)
            //CHECK LETTER ON KEYBOARD
            secretLetters[i] = " "
        }
    })
    possibleLetters.forEach((letter,i) => {
        const isExistLetter = secretLetters.includes(letter)
        if(isExistLetter){
            this.currentWord.setExistLetter(i)
            const pos = secretLetters.findIndex(l => l == letter)
            secretLetters[pos] = " "
            //CHECK LETTER ON KEYBOARD
        }
    })

    this.currentWord.classList.add("sended")
    return this.currentWord.isSolved()
}


nextWord() {
    this.currentWord = this.shadowRoot.querySelector("wordle-word[current]")
    const nextWord = this.currentWord.nextElementSibling

    if(nextWord){
        nextWord.setAttribute('current',"")
        this.currentWord.removeAttribute('current')
        this.currentWord = nextWord
        return
    }

    this.lose()
}

win() {
    this.ending = true
    alert("Has ganado 🚀!!!")
}

lose() {
    alert('Has perdido')
    this.ending = true
}

render() {
    this.shadowRoot.innerHTML = /* html */`
    <style> ${WordleGame.styles} </style>
    <div class="container">
        <h1>Wordle_Game</h1>
        <div class="words">
            <wordle-word current></wordle-word>
            <wordle-word></wordle-word>
            <wordle-word></wordle-word>
            <wordle-word></wordle-word>
            <wordle-word></wordle-word>
            <wordle-word></wordle-word>
        </div>
        <wordle-keyboard></wordle-keyboard>
    </div>`;
    }
}

customElements.define("wordle-game", WordleGame);