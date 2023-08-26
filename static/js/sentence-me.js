const sentenceContainer = document.getElementById("sentenceContainer");
const randomizeButton = document.getElementById("randomizeButton");
const { gsap } = window;
let sentences;

fetch('/json/sentence-me.json')
    .then(response => response.json())
    .then(data => {
        sentences = data;
        initializeSentences();
    })
    .catch(error => {
        console.error('Error:', error);
    });

function initializeSentences() {
    for (let i = 1; sentences[i]; i++) {
        const sentenceDiv = createSentenceDiv(i);
        sentenceContainer.appendChild(sentenceDiv);
    }
}

function createSentenceDiv(i) {
    const sentenceDiv = document.createElement("div");
    sentenceDiv.className = "sentence-container";
    const leftArrow = createArrow("\u2190", () => changeSentence(i, "left"));
    const sentenceText = createSentenceText(i);
    const rightArrow = createArrow("\u2192", () => changeSentence(i, "right"));
    sentenceDiv.appendChild(leftArrow);
    sentenceDiv.appendChild(sentenceText);
    sentenceDiv.appendChild(rightArrow);
    return sentenceDiv;
}

function createArrow(html, clickHandler) {
    const arrow = document.createElement("div");
    arrow.className = "changeSentence";
    arrow.innerHTML = html;
    arrow.onclick = clickHandler;
    return arrow;
}

function createSentenceText(i) {
    const sentenceText = document.createElement("div");
    sentenceText.className = "sentence-text";
    sentenceText.id = `sentence${i}`;
    sentenceText.textContent = sentences[i][0];
    return sentenceText;
}

function changeSentence(sentenceNumber, direction) {
    const sentenceElement = document.getElementById(`sentence${sentenceNumber}`);
    let currentIndex = sentences[sentenceNumber].indexOf(sentenceElement.textContent);

    function animateSentence() {
        if (direction === 'left') {
            currentIndex = (currentIndex - 1 + sentences[sentenceNumber].length) % sentences[sentenceNumber].length;
        } else {
            currentIndex = (currentIndex + 1) % sentences[sentenceNumber].length;
        }

        const newSentence = sentences[sentenceNumber][currentIndex];

        gsap.to(sentenceElement, {
            duration: 2.0,
            opacity: 0.6,
            text: newSentence,

            onComplete: function () {
                gsap.to(sentenceElement, {
                    duration: 1.0,
                    opacity: 1,
                });
                sentenceElement.textContent = newSentence;
            }
        });
    }

    animateSentence();
}

randomizeButton.addEventListener('click', randomizeSentences);

function randomizeSentences() {
    for (let i = 1; sentences[i]; i++) {
        const sentenceElement = document.getElementById(`sentence${i}`);
        const randomIndex = Math.floor(Math.random() * sentences[i].length);
        const newSentence = sentences[i][randomIndex];

        gsap.to(sentenceElement, {
            duration: 2.0,
            opacity: 0.6,
            text: newSentence,

            onComplete: function () {
                gsap.to(sentenceElement, {
                    duration: 1.0,
                    opacity: 1,
                });
                sentenceElement.textContent = newSentence;
            }
        });
    }
}