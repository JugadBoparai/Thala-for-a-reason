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

// DOM elements
let resultDiv = document.getElementById('resultDiv');
let thalaGif = document.getElementById('thalaGif');
let notThalaGif = document.getElementById('notThalaGif');
let thalaAudio = document.getElementById('thalaAudio');
let notThalaAudio = document.getElementById('notThalaAudio');

// Array of hints
let hints = [
    "What is Cristiano Ronaldo's number?",
    "What is MS. Dhoni's number?",
    "What is the Square of 4?",
    "Shine bright like a _______?",
    "How many prisoners did Guru Hargobind Sahib ji free from Gwalior Fort",
    "In darkest night, I bring my light, hanging high, a guiding sight. What am I?",
    "From the earth I grow, green and lean, a source of protein, a staple cuisine. What am I?",
    "Rows of books in silent rows, knowledge and stories, they bestow. What am I?",
    "What is the next number in the sequence: 2019, 2020, 2021, 2022, ____?",
    "What is James Bond's code number?",
    "What is the atomic number of Nitrogen on the periodic table?",
    "Where do airplanes land and take off?",
    "On icy cliffs, I perch with pride, with wings spread wide, I glide and glide. What am I?",
    "What do you call a sibling who's not your sister?",
    "I'm colorful and form a spectrum in the sky, what am I?",
    "I have good style and great vision, what am I?",
    "I'm a source of power, stored energy in a cell, I provide electricity, so your devices can dwell. What am i?",
    "I'm a person in charge, steering a ship or a team, With authority and responsibility, I reign supreme. What am I?",
    "Where does the magic happen?"
];
// Variable to track the last chosen hint
let lastChosenHint = "";


function checkInput() {
    let userInput = document.getElementById('box-txt').value.trim();
    let isValid = false;
    
    // Check if the input is empty
    if (userInput === '') {
        if (alertSoundFail) {
            alertSoundFail.play();
        }
        alert('You forgot to enter a value, stupid!');
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
      thalaAudio.play();
      // Display attempts message
      displayAttempts();
      resultDiv.innerHTML = `${userInput} is a correct answer. Thala for a reason!`;
      resultDiv.innerHTML += `<br>You did it in ${attempts} attempts.`;
      resultDiv.classList.add('result-correct');
    } else {
      // Choose a random audio element and play it
      notThalaGif.style.display = 'block';
      chooseRandomNotAudio().play();
      resultDiv.innerHTML = `${userInput} is not a correct answer. Try again!`;
      resultDiv.classList.add('result-incorrect');
      // Increment attempts regardless of the result
      attempts++;
    }
}

function displayAttempts() {
        // If attempts is 0, set it to 1 to ensure it's never displayed as 0
        if (attempts === 0) {
            attempts = 1;
        }
        // Reset attempts for the next round
        attempts = 1;
        // Reset hints count in localStorage
        localStorage.setItem('hintsRemaining', '3');
}

function clearResult() {
    console.log('Clearing result...');
    // Check if resultDiv and other elements exist before accessing their properties
    if (resultDiv && thalaGif && thalaAudio && notThalaGif && notThalaAudios) {
        // Hide thalaGif and notThalaGif
        thalaGif.style.display = 'none';
        notThalaGif.style.display = 'none';
        // Pause audio playback
        thalaAudio.pause();
        notThalaAudios.forEach(audio => audio.pause());
        // Clear text content and reset class name
        resultDiv.textContent = '';
        resultDiv.className = '';
        console.log('Result cleared.');
    } else {
        console.log('One or more elements not found.');
    }
}


function chooseRandomNotAudio(){
    // Get a random index from the array
    let randomIndex = Math.floor(Math.random() * notThalaAudios.length);
    // Get the randomly selected audio element
    let randomAudio = notThalaAudios[randomIndex];
    // Return the randomly selected audio element
    return randomAudio;
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
        alert('No more hints available 😈');
    }
}
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
    let hiddenBox = document.getElementById('hidden-box');
    hiddenBox.style.display = 'block';
    thalaAudio.pause();
    thalaGif.style.display = 'block';


    // Add a close button to the hidden box
    let closeButton = document.createElement('span');
    closeButton.id = 'close-button';
    closeButton.innerHTML = '&times;'; // Close symbol (X)

    // Append the close button to the hidden box
    hiddenBox.appendChild(closeButton);

    // Add a click event listener to the close button
    closeButton.addEventListener('click', function() {
        // Hide the hidden box when the close button is clicked
        hiddenBox.style.display = 'none';
        clearResult();
    });
}

function displayNotThalaGif() {
    chooseRandomNotAudio().play();

    // Get the notThalaGif modal element
    let notThalaGifModal = document.getElementById('notThalaGif');

    // Show the notThalaGif modal
    notThalaGifModal.style.display = 'block';
    closeNotThalaGif();    
}

function closeNotThalaGif(){
    let notThalaGif = document.getElementById('notThalaGif')
        notThalaGif.style.display = 'none';
        clearResult();
}


async function shareOnWhatsApp() {
    const queryInput = document.getElementById("box-txt");
    if (!queryInput) {
        console.error("Element with ID 'box-txt' not found.");
        return;
    }

    const queryValue = queryInput.value;
    let urlWithQuery = `${window.location.origin}/`;

    const encodedQuery = btoa(queryValue);
    if (queryValue !== "") {
        urlWithQuery = `${window.location.origin}/?query=${encodedQuery}`;
    }

    try {
        const whatsAppText = encodeURIComponent(
            `${urlWithQuery}`
        );
        const whatsappLink = `https://wa.me/?text=${whatsAppText}`;

        // Open WhatsApp sharing window
        window.open(whatsappLink, "_blank");
    } catch (error) {
        console.error("Error:", error);
        alert("Error sharing on WhatsApp");
    }
}


