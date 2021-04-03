// Challenge: Calculate age in days
function ageInDays() {
    var year = prompt("When were you born bro?");
    var age = (2021 - year) * 365;
    console.log(age);
    var h1 = document.createElement('h1');
    var textAnswer = document.createTextNode(age);
    h1.setAttribute('id', 'ageInDays');
    h1.appendChild(textAnswer);
    document.getElementById("flex-container-result").appendChild(h1);
}

function reset() {
    document.getElementById("ageInDays").remove();
}

function generateCat() {
    var image = document.createElement('img');
    var div = document.getElementById("flex-cat-gen");
    image.src = "https://media.tenor.com/images/ca17a1b44357d8c54a9af20124d983fb/tenor.gif";
    div.appendChild(image);
}

// Challenge 5: Blackjack
let blackjackGame = {
    'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardsMap': {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11]},
    'decision': {'winSpan': '#wins', 'drawSpan': '#draws', 'lossSpan': '#losses', 'winScore': 0,  'lossScore': 0,  'drawScore': 0},
    'isStand': false,
    'turnsOver': false,
};

const YOU = blackjackGame['you']
const DEALER = blackjackGame['dealer']

const hitSound = new Audio('static/sounds/swish.m4a')
const winSound = new Audio('static/sounds/cash.mp3')
const loseSound = new Audio('static/sounds/aww.mp3')

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);

document.querySelector('#blackjack-stand-button').addEventListener('click', dealerLogic);

document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);

function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
        let card = randomCard();
        console.log(card);
        showCard(card, YOU);
        updateScore(card, YOU);
        showScore(YOU);
    }
}

function randomCard() {
    let randomIndex = Math.floor(Math.random() * 13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = 'static/images/' + card + '.png';
        document.querySelector(activePlayer['div']).appendChild(cardImage);
        hitSound.play();
    } else {
        
    }
}

function blackjackDeal() {
    if (blackjackGame['turnsOver']) {
        blackjackGame['isStand'] = false;

        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
        for (i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }
        
        for (i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        showDecisionScore();

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector(YOU['scoreSpan']).style.color = 'white';
        document.querySelector(DEALER['scoreSpan']).style.color = 'white';
        document.querySelector('#your-blackjack-result').textContent = 0;
        document.querySelector('#dealer-blackjack-result').textContent = 0;

        document.querySelector('#blackjack-result').textContent = "Let's play";
        document.querySelector('#blackjack-result').style.color = 'black';

        blackjackGame['turnsOver'] = false;
    }
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
        // If adding 11 keeps me below 21, add 11. Otherwise, add 1.
        if (activePlayer['score'] <= 10) {
            activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        }

        else {
            activePlayer['score'] += blackjackGame['cardsMap'][card][0];
        }
    } else {
        activePlayer['score'] += blackjackGame['cardsMap'][card];
    }
}

function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST!';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    } else {
        document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
    }
}

async function dealerLogic() {
    blackjackGame['isStand'] = true;

    while (DEALER['score'] < 18 && blackjackGame['isStand']) {
        let card = randomCard();
        showCard(card, DEALER);
        updateScore(card, DEALER);
        showScore(DEALER);
        await sleep(750);
    }

    blackjackGame['turnsOver'] = true;
    computeWinner();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function computeWinner() {   
    let winner;
    
    if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackjackGame['decision']['drawScore'] += 1;
    }

    if (YOU['score'] <= 21 && DEALER['score'] > 21) {
        blackjackGame['decision']['winScore'] += 1;
        winner = YOU;
    }

    if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackjackGame['decision']['lossScore'] += 1;
        winner = DEALER;
    }

    if (YOU['score'] <= 21 && DEALER['score'] <= 21) {
        if (YOU['score'] > DEALER['score']) {
            blackjackGame['decision']['winScore']++;
            winner = YOU;
        } else if (YOU['score'] < DEALER['score']) {
            blackjackGame['decision']['lossScore']++;
            winner = DEALER;
        } else {
            blackjackGame['decision']['drawScore']++;
        }
    }
    
    let message, messageColor;

    if (blackjackGame['turnsOver']) {
        if (winner === YOU) {
            message = 'You won!';
            messageColor = 'green';
            winSound.play();
        } else if (winner === DEALER) {
            message = 'You lost!';
            messageColor = 'red';
            loseSound.play();
        } else {
            message = 'You drew!';
            messageColor = 'black';
        }

        document.querySelector('#blackjack-result').textContent = message;
        document.querySelector('#blackjack-result').style.color = messageColor;
    }
}

function showDecisionScore() {    
    document.querySelector(blackjackGame['decision']['winSpan']).style.color = 'white';
    document.querySelector(blackjackGame['decision']['drawSpan']).style.color = 'white';
    document.querySelector(blackjackGame['decision']['lossSpan']).style.color = 'white';
    document.querySelector(blackjackGame['decision']['winSpan']).textContent = blackjackGame['decision']['winScore'];
    document.querySelector(blackjackGame['decision']['drawSpan']).textContent = blackjackGame['decision']['drawScore'];
    document.querySelector(blackjackGame['decision']['lossSpan']).textContent = blackjackGame['decision']['lossScore'];
}