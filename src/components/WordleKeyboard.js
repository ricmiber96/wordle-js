import KEYBOARD_STATE from '../assets/keyboardState.json'

class WordleKeyboard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.letters = KEYBOARD_STATE
    }

static get styles(){
    return /* css */`
    :host {

    }
    .container {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        width: 450px;
        flex-wrap: wrap;
        margin: 1em;
    }
    .letter {
        background: #999;
        color: #fff;
        font-family: Arial, sans-serif;
        font-weight: bold;
        padding: 20px 14px;
        margin: 6px 2px;
        text-transform: uppercase;
        cursor: pointer;
        display: flex;
        border-radius:4px;
        align-items: center;
        justify-content: center;
        user-select:none;
    }

    .letter.special{
        width:32px;
    }
 
`;
}

listeners(){
    const keys = Array.from(this.shadowRoot.querySelectorAll(".letter"))
    keys.forEach(key => {
        key.addEventListener("click", () => {
            const detail =  key.textContent.replace("NEXT", "enter").replace("BACK", "backspace")
            const options = {detail, bubbles: true, composed: true}
            const event = new CustomEvent("keyboard",options);
            this.dispatchEvent(event)
        })
    })
}

connectedCallback(){
    this.render();
    this.listeners()
}

render() {
    this.shadowRoot.innerHTML = /* html */`
    <style> ${WordleKeyboard.styles} </style>
    <div class="container">
        ${this.letters.map(letter => `<div class="letter ${letter.state}">${letter.key}</div>`).join("")}
    </div>`;
    }
}

customElements.define("wordle-keyboard", WordleKeyboard);