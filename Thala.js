// Global variables
let hintsRemaining = parseInt(localStorage.getItem('hintsRemaining')) || 3;
let attempts = 0;
let hintIndex = 0;
let consecutiveCorrectAttempts = 0;
let previousAnswer = '';
let hiddenCorrectAttempts = 0;


let notThalaAudios = [
    document.getElementById('notThalaAudio0'),
    document.getElementById('notThalaAudio1'),
    document.getElementById('notThalaAudio2'),
    document.getElementById('notThalaAudio3'),
    document.getElementById('notThalaAudio4'),
];

// Audio elements
let alertSoundSuccess = document.getElementById('alertSoundSuccess');
let alertSoundFail = document.getElementById('alertSoundFail');
let alertSoundFinal = document.getElementById('alertSoundFinal');
let bole_jo_koyal= document.getElementById('bole_jokoyal');

// DOM elements
let resultDiv = document.getElementById('result');
let thalaGif = document.getElementById('thalaGif');
let thalaAudio = document.getElementById('thalaAudio');
let notThalaGif = document.getElementById('notThalaGif');
let notThalaAudio = document.getElementById('notThalaAudio');


function displayAttempts() {
    // If attempts is 0, set it to 1 to ensure it's never displayed as 0
    if (attempts === 0) {
        attempts = 1;
    }
    resultDiv.innerHTML += `${previousAnswer} is correct!<br>Thala for a reason. You did it in ${attempts} attempts.`;
    // Reset attempts for the next round
    attempts = 0;
    // Reset hints count in localStorage
    localStorage.setItem('hintsRemaining', '3');
}


function checkInput() {
    let userInput = document.getElementById('box-txt').value.trim();
    let isValid = false;
    
    // Check if the input is empty
    if (userInput === '') {
        if (alertSoundFail) {
            alertSoundFail.play();
        }
        alert('You forgot to enter a value, silly!');
        return;
    }
    
    // Check if the input is the same as the previous answer
    if (userInput === previousAnswer) {
        alert('You entered the same answer as before. It is correct but try a different one!');
        return;
    }
    
    // Check if the input is valid
    if (/^[a-zA-Z]{7}$/.test(userInput) || (/^\d+$/.test(userInput) && userInput.split('').reduce((a, b) => +a + +b, 0) === 7)) {
        isValid = true;
        previousAnswer = userInput;     // Store the current answer as the previous answer
        consecutiveCorrectAttempts++;   // Increment consecutive correct attempts
        if (consecutiveCorrectAttempts === 5) { 
            if (thalaGif) {
                thalaGif.style.display = 'none';
            }
            if (thalaAudio) {
                thalaAudio.pause();
            }
            if (notThalaGif) {
                notThalaGif.style.display = 'none';
            }
            if (notThalaAudios) {
                notThalaAudios.forEach(audio => {
                    if (audio) {
                        audio.pause();
                    }
                });
            }
            if (resultDiv) {
                resultDiv.textContent = '';
                resultDiv.className = '';
                document.getElementById('hintsContainer').innerHTML = '';
            }
            displayHiddenBox();
            alert('Congratulations! You made 5 consecutive correct attempts.');
            consecutiveCorrectAttempts = 0;     
        }
    } else {
        // Reset consecutive correct attempts if the current attempt is incorrect
        consecutiveCorrectAttempts = 0;
    }
    
    // Display the result based on validity
    displayResult(isValid, userInput);
    
    // Increment attempts regardless of the result
    attempts++;
}




function displayResult(isValid, userInput) {
    if (isValid) {
        // Show the GIF and play the audio
        thalaGif.style.display = 'block';
        thalaAudio.play();
        // Display attempts message
        displayAttempts();
        resultDiv.className = isValid ? 'correct' : 'incorrect';
    } else {
        notThalaGif.style.display = 'block';
        // Choose a random audio element and play it
        chooseRandomNotAudio().play();
        resultDiv.innerHTML = `${userInput} is not the correct answer. Try again!`;
        resultDiv.className = 'incorrect';
        // Increment attempts regardless of the result
        attempts++;
    }
}



function clearResult() {
    console.log('Clearing result...');    
    thalaGif.style.display = 'none';
    thalaAudio.pause();
    notThalaGif.style.display = 'none';
    // Pause each audio element in the notThalaAudios array
    notThalaAudios.forEach(audio => audio.pause());
    resultDiv.textContent = '';
    resultDiv.className = '';
    console.log('Result cleared.');
}

// Array of hints
let hints = [
    "What is Cristiano Ronaldo's number?",
    "What MS. Dhoni's number?",
    "How many days are in a week?",
    "You silly boy, the hint is 7.",
    "How many continents does the earth have?",
    "How many books are in the Harry Potter series",
    "How many wonders of the worlds are there?",
    "How many colors are there in a rainbow?",
    "What is the next number in the sequence: 2019, 2020, 2021, 2022, ____?",
    "What is James Bond's code number?",
    "What is the atomic number of Nitrogen on the periodic table?",
    "Where do airplanes land and take off?",
    "What do you call a solution to all of life's problems in a bottle?",
    "What do you call a sibling who's not your sister?",
    "I'm colorful and form a spectrum in the sky, what am I?",
    "I'm a common fruit, yellow and curved. What am I?",
    "What is the Milkyway?",
    "I have good style and great vision, what am I?"
];

// Variable to track the last chosen hint
let lastChosenHint = "";

function chooseRandomHint() {
    let availableHints = hints.filter(hint => hint !== lastChosenHint);
    if (availableHints.length === 0) {
        // All hints have been used, reset and shuffle the array
        availableHints = hints.sort(() => Math.random() - 0.5);
    }
    // Select a random hint from the available hints
    const randomIndex = Math.floor(Math.random() * availableHints.length);
    const randomHint = availableHints[randomIndex];
    // Update the last chosen hint
    lastChosenHint = randomHint;
    return randomHint;
}


function provideHint() {
    // Check if there are hints remaining
    if (hintIndex < hints.length && hintsRemaining > 0) {
        // Provide the next hint
        alertSoundSuccess.play();
        // Choose a random hint
        let randomHint = chooseRandomHint();
        // Display the hint on the page
        displayHintOnPage(randomHint);
        // Increment the hint index
        hintIndex++;
        // Decrease the hint count
        hintsRemaining--;
        // Update the displayed hint count on the page
        document.getElementById('hintCount').textContent = hintsRemaining;
    } else if (hintsRemaining === 0) {
        // No more hints remaining, inform the user
        alertSoundFail.play();
        alert('No more hints available.');
    }
}


function displayHintOnPage(hintText) {
    // Create a new paragraph element for each hint
    let hintParagraph = document.createElement('p');
    hintParagraph.textContent = hintText;

    // Append the hint paragraph to the hints container
    document.getElementById('hintsContainer').appendChild(hintParagraph);
}


function displayHiddenBox() {
    alertSoundFinal.play();
    // Show the hidden box
    let hiddenBox = document.getElementById('hiddenBox');
    hiddenBox.style.display = 'block';

    // Add a close button to the hidden box
    let closeButton = document.createElement('span');
    closeButton.id = 'closeButton';
    closeButton.innerHTML = '&times;'; // Close symbol (X)

    // Append the close button to the hidden box
    hiddenBox.appendChild(closeButton);

    // Add a click event listener to the close button
    closeButton.addEventListener('click', function () {
        // Hide the hidden box when the close button is clicked
        hiddenBox.style.display = 'none';
    });
}


function chooseRandomNotAudio(){
    // Get a random index from the array
    let randomIndex = Math.floor(Math.random() * notThalaAudios.length);
    // Get the randomly selected audio element
    let randomAudio = notThalaAudios[randomIndex];
    // Return the randomly selected audio element
    return randomAudio;
}


