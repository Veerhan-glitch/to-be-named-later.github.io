document.addEventListener("DOMContentLoaded", function() {
    const toggleBtn = document.getElementById('toggle-btn');
    const elements = Array.from(document.querySelectorAll('.container *:not(#toggle-btn)'));
    
    const userNameInput = document.getElementById("user-name");
    const wakAname = document.getElementById("user-name-game");

    const popupMessage = document.getElementById("popup-message");

    const delay = (delayInms) => {return new Promise(resolve => setTimeout(resolve, delayInms));};
    const currentTheme = localStorage.getItem("theme") || "light";

    let isClickEnabled = true;
    let notdoing = true;

    // initial theme
    document.body.classList.add(currentTheme);


    // user name

    // receive name from the wakAname
    window.addEventListener("message", function(event) {
        if (event.data.type === 'selectedName') {
            userNameInput.value = event.data.letters;
            wakAname.classList.remove('show');
        }
    });

    // close wakAname when clicking out
    wakAname.onclick = function(event) {
        if (event.target === wakAname) {
            wakAname.classList.remove('show');
        }
    }


    // phone number

    function convertWordsToNumbers(input) {
        const wordToNumberMap = {
            "zero": 0, "one": 1, "two": 2, "three": 3,
            "four": 4, "five": 5, "six": 6, "seven": 7,
            "eight": 8, "nine": 9, "ten": 10,
            "double": 2, "triple": 3
        };

        const words = input.toLowerCase().trim().split(/\s+/);
        let number = '';
        let repeatCount = 0;

        for (let i = 0; i < words.length; i++) {
            const word = words[i];

            if (word === "double") {
                repeatCount = 2;
            } else if (word === "triple") {
                repeatCount = 3;
            } else if (wordToNumberMap[word] !== undefined) {
                if (repeatCount > 0) {
                    number += wordToNumberMap[word].toString().repeat(repeatCount);
                    repeatCount = 0; 
                } else {
                    number += wordToNumberMap[word];
                }
            } else {
                alert(`Error: Unknown word ("${word}") was present in the input.`);
                return '';
            }
        }

        if (repeatCount > 0) {
            alert('Error: "double" or "triple" must be followed by a number.');
            return '';
        }
        if (number.length > 13 || number.length < 7) {
            alert(`Error: the entered number ("${number}") was of invalid size ("${number.length}")`);
            return '';
        }
        return number;
    }


    // theme things

    async function handleElementNormalClick(event) {
        const clickedElement = event.target;
        // console.log(`Element clicked (normal mode): ${clickedElement.id || clickedElement.className}`);

        if (clickedElement.id == 'user-name') {
            wakAname.classList.add('show');
        }

        if (clickedElement.id == 'submit-button' && notdoing) {
            notdoing = false;
            const fullNameValue = userNameInput.value.trim();
            const phoneInput = document.getElementById("phone-number").value;


            if (!fullNameValue) {
                alert("Please enter your user name.");
                return;
            }
            if (!phoneInput) {
                alert("Please enter your phone number.");
                return;
            }
            const phoneNumber = convertWordsToNumbers(phoneInput);
            if (phoneNumber) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                popupMessage.textContent = `${fullNameValue} - ${phoneInput} ( ${phoneNumber} )`;
                alert(`Submission successful!\nName: ${fullNameValue}\nPhone: ${phoneInput} (${phoneNumber})`);
            }
        }
        let _ = await delay(300);
        notdoing = true;
    }

    function handleElementThemeToggleClick(event) {
        const clickedElement = event.target;
        console.log(`Element clicked (toggle mode): ${clickedElement.id || clickedElement.className}`);
        
        if (clickedElement.classList.contains('light')) {
            console.log('Changing from light to dark');
            clickedElement.classList.remove('light');
            clickedElement.classList.add('dark');
        } else {
            console.log('Changing from dark to light');
            clickedElement.classList.remove('dark');
            clickedElement.classList.add('light');
        }
    }

    function toggleClickFunctionality() {
        isClickEnabled = !isClickEnabled;
        console.log(`Click functionality ${isClickEnabled ? 'enabled' : 'disabled'}`);
        
        elements.forEach(el => {
            el.classList.toggle('disabled', !isClickEnabled);
            el.onclick = isClickEnabled ? handleElementNormalClick : handleElementThemeToggleClick;
            // console.log(`Element ${el.id || el.className} click functionality ${isClickEnabled ? 'enabled' : 'disabled'}`);
        });
    }

    function handleElementThemeToggleClick(event) {
        const clickedElement = event.target;
        console.log(`Element clicked (toggle mode): ${clickedElement.id || clickedElement.className}`);
        
        if (clickedElement.classList.contains('light')) {
            console.log('Changing from light to dark');
            clickedElement.classList.remove('light');
            clickedElement.classList.add('dark');
        } else {
            console.log('Changing from dark to light');
            clickedElement.classList.remove('dark');
            clickedElement.classList.add('light');
        }
    }

    toggleBtn.addEventListener('click', () => {
        console.log('Toggle button clicked');
        toggleClickFunctionality();
    });

    elements.forEach(el => {el.onclick = handleElementNormalClick;});
});
