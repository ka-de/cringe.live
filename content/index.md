---
draft: false
showTitle: false
showMeta: false
---
{{< html >}}
<div id="homeContainer">
    <p id="textContainer">Welcome, <span id="greetingWord"></span>!<br><br></p>
</div>
<button id="continue" onclick="startTextAnimation()">⟶</button>

<div id="workings">
<pre>
├─── <a href='/blog'>Blog</a> [2023 - Undefined]
│   ├─── <a href='/latest'>/latest</a>
│   │ └─── The latest entry.
│   │
│   ├─── <a href='/categories/python/'>/python</a>
│   │  └── Posts about Python.
│   ├─── <a href='/categories/powershell/'>/PowerShell</a>
│   └─── <a href='/categories/windows/'>/Windows</a>
│
├─── <a href='/music'>Music</a>
├─── <a href='/literature'>Literature</a>
│   ├─── <a href='/sentence-me/'>/sentence-me</a>
│
├─── <a href='/games'>Games</a>
</pre>
</div>

<script>
// Array with greeting words
let greetingWords = [
    "Wanderer",
    "Explorer",
    "Adventurer",
    "Voyager",
    "Nomad",
    "Wayfarer",
    "Roamer",
    "Pioneer",
    "Discoverer",
    "Journeyer",
    "Pathfinder"
];

// Array with sentences to append
let sentences = [
    "This is the home of machine organized chaos.",
    "",
    "It was built with the help of machines, for the machines, but you are welcome to browse it too!",
];

// Function to select a random greeting word
function getRandomGreeting() {
    // Generate a random index
    let randomIndex = Math.floor(Math.random() * greetingWords.length);

    // Select a random greeting word
    let randomGreeting = greetingWords[randomIndex];

    return randomGreeting;
}

// Function to generate a random greeting message
function generateRandomGreeting() {
    let randomGreeting = getRandomGreeting();
    return randomGreeting;
}

// Function to start text animation
function startTextAnimation() {
    const textContainer = document.getElementById("textContainer");
    const greetingWordSpan = document.getElementById("greetingWord");
    const continueButton = document.getElementById("continue");
    const workingsElement = document.getElementById("workings");

    // Remove the button
    continueButton.style.display = "none";

    // Show the welcome message with typewriter-like animation
    const randomGreeting = generateRandomGreeting();
    greetingWordSpan.textContent = randomGreeting;

    // Append the rest of the sentences with typewriter-like animation
    appendSentencesWithAnimation(textContainer, 0);

    // After the animation is finished, toggle the visibility of the 'workings' element
    setTimeout(() => {
        workingsElement.style.display = "block";
    }, (sentences.length + 1) * 1000 /  0.8); // Adjust the timing as needed
}

// Function to append sentences with typewriter-like animation
function appendSentencesWithAnimation(textContainer, index) {
    if (index < sentences.length) {
        const sentence = sentences[index];
        const sentenceLength = sentence.length;
        const typingSpeed = 50; // Characters per second (adjust for desired speed)

        let charIndex = 0;
        const interval = setInterval(() => {
            if (charIndex < sentenceLength) {
                // Check if the current character is a link opening tag
                if (sentence.charAt(charIndex) === '<') {
                    // Find the closing tag
                    const closingTagIndex = sentence.indexOf('>', charIndex);
                    if (closingTagIndex !== -1) {
                        const linkText = sentence.substring(charIndex, closingTagIndex + 1);
                        // Create a new temporary element and set the innerHTML
                        const tempElement = document.createElement('div');
                        tempElement.innerHTML = linkText;
                        const linkElement = tempElement.querySelector('a');
                        if (linkElement) {
                            // Append the link to the text container
                            textContainer.appendChild(linkElement);
                        }
                        charIndex = closingTagIndex + 1;
                    }
                } else {
                    // Append regular characters
                    textContainer.innerHTML += sentence.charAt(charIndex);
                    charIndex++;
                }
            } else {
                clearInterval(interval); // Stop the typewriter effect
                textContainer.innerHTML += "<br>"; // Add a line break
                appendSentencesWithAnimation(textContainer, index + 1); // Move to the next sentence
            }
        }, 1000 / typingSpeed); // Delay for typewriter effect
    }
}

// Initialize by showing the welcome message
startTextAnimation();
</script>
{{< /html >}}
