const MAX_LETTERS = 5;
class WordleWord extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.word = " ".repeat(MAX_LETTERS)
    }

static get styles(){
    return /* css */`
    :host {
        --size-letter: 50px;
    }
    .container {
        display:flex;
    }
    .letter {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: var(--size-letter);
        height:var(--size-letter);
        border: 2px solid #404040;
        padding: 5px;
        margin: 5px;
        font-size: 2rem;
        text-transform: uppercase;
    }

    :host(.sended) .letter{
        background-color: var(--used-color);
        border-color: var(--used-color);
    }

   .container .letter.exact{
        background-color: var(--exact-color);
        border-color: var(--exact-color);
    }

    .container .letter.exist{
        background-color: var(--exist-color);
        border-color: var(--exist-color);
    }

    
    `;
}
connectedCallback(){
    this.render();
}

getTemplateLetters() {
    return this.word
        .split("")
        .map(letter => `<div class="letter">${letter}</div>`)
        .join("")
}

toString() {
    return this.word.replace(/ /g, "");
  }

isEmpty(){
    return this.word.includes(" ")
}

isSolved(){
    const letters = Array.from(this.shadowRoot.querySelectorAll(".letter"));
    return letters.every(letter => letter.classList.contains("exact"))
}

setExactLetter(index){
    const letters = this.shadowRoot.querySelectorAll(".letter");
    letters[index].classList.add("exact") 
}

setExistLetter(index){
    const letters = this.shadowRoot.querySelectorAll(".letter");
    letters[index].classList.add("exist");
}


addLetter(letter){
    const word = this.word.replace(/\s/g, '') + letter
    this.word = word.padEnd(MAX_LETTERS, " ")
    this.render()
}

removeLetter(){
    const word = this.word.replace(/\s/g, '').slice(0, -1)
    this.word = word.padEnd(MAX_LETTERS, " ")
    this.render()
}


render() {
    this.shadowRoot.innerHTML = /* html */`
    <style> ${WordleWord.styles} </style>
    <div class="container">
        ${this.getTemplateLetters()}
    </div>`;
    }
}

customElements.define("wordle-word", WordleWord);