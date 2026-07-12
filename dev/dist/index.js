"use strict";
// Reference Lesson: Introduction To TypScript - this .ts file compiles to browser-ready JavaScript.
// Reference Lesson: Using Enumerations - enums describe fixed game and card states.
var CardState;
(function (CardState) {
    CardState["FaceDown"] = "face-down";
    CardState["Flipped"] = "flipped";
    CardState["Matched"] = "matched";
})(CardState || (CardState = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["Playing"] = "playing";
    GameStatus["Won"] = "won";
    GameStatus["Lost"] = "lost";
})(GameStatus || (GameStatus = {}));
// Reference Lesson: Introduction To Interfaces - the GameCard contract is used by card arrays and functions.
// Reference Lesson: Using Data Types - constants use explicit number and string array types.
// Requirement: The player has a maximum of 3 tries/attempts.
const MAX_ATTEMPTS = 3;
// Requirement: The set includes 3 pairs of matching cards, which makes 6 cards total.
const MATCH_PAIR_COUNT = 3;
// Requirement: Special cards like Aces, Kings, Queens, and Jacks are included and work.
const CARD_VALUE_POOL = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
// Requirement: Non-matching cards flip back to their face-down state after a short delay.
const FLIP_BACK_DELAY = 850;
// Reference Lesson: Using Type Assertions - querySelector results are asserted as specific element types.
// Requirement: Type assertions are used to work with browser DOM elements in TypeScript.
const boardElement = document.querySelector(".game-board");
const attemptsElement = document.querySelector(".attempts-count");
const messageElement = document.querySelector(".game-message");
const resetButton = document.querySelector(".reset-button");
let cards = [];
let selectedCardIds = [];
let attemptsRemaining = MAX_ATTEMPTS;
let gameStatus = GameStatus.Playing;
let isComparing = false;
let statusMessage = "Pick two cards to find a match.";
let pendingFlipTimeout;
let previousValueSignature = "";
let previousDeckSignature = "";
// Reference Lesson: Typed Functions & Arguments - functions include typed parameters and return types.
const assertRequiredElement = (element, selector) => {
    if (!element) {
        throw new Error(`Missing required element: ${selector}`);
    }
};
const shuffleCards = (deck) => {
    const shuffledCards = deck.slice();
    for (let index = shuffledCards.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const currentCard = shuffledCards[index];
        shuffledCards[index] = shuffledCards[randomIndex];
        shuffledCards[randomIndex] = currentCard;
    }
    return shuffledCards;
};
// Requirement: At the start of each new game, the card values are reshuffled.
const shuffleValues = (values) => {
    const shuffledValues = values.slice();
    for (let index = shuffledValues.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        const currentValue = shuffledValues[index];
        shuffledValues[index] = shuffledValues[randomIndex];
        shuffledValues[randomIndex] = currentValue;
    }
    return shuffledValues;
};
const getValueSignature = (values) => {
    return values.slice().sort().join("|");
};
const getDeckSignature = (deck) => {
    return deck.map((card) => card.value).join("|");
};
// Reference Lesson: Using Data Types - string arrays are used to choose the card values for each game.
// Requirement: Each new game uses a different set of card values when possible.
const chooseCardValues = () => {
    let selectedValues = shuffleValues(CARD_VALUE_POOL).slice(0, MATCH_PAIR_COUNT);
    let selectedSignature = getValueSignature(selectedValues);
    if (selectedSignature === previousValueSignature) {
        const replacementValue = CARD_VALUE_POOL.find((value) => {
            return selectedValues.indexOf(value) === -1;
        });
        if (replacementValue) {
            selectedValues[0] = replacementValue;
        }
        selectedSignature = getValueSignature(selectedValues);
    }
    return selectedValues;
};
// Requirement: A new game creates 6 cards, made from 3 matching pairs, all starting face down.
const createDeck = () => {
    const deck = [];
    const selectedValues = chooseCardValues();
    selectedValues.forEach((value) => {
        for (let copy = 0; copy < 2; copy += 1) {
            deck.push({
                id: deck.length + 1,
                value,
                state: CardState.FaceDown
            });
        }
    });
    // Requirement: At the start of each new game, the card positions are reshuffled.
    let shuffledDeck = shuffleCards(deck);
    let shuffledDeckSignature = getDeckSignature(shuffledDeck);
    if (shuffledDeckSignature === previousDeckSignature && shuffledDeck.length > 1) {
        const firstCard = shuffledDeck.shift();
        if (firstCard) {
            shuffledDeck.push(firstCard);
        }
        shuffledDeckSignature = getDeckSignature(shuffledDeck);
    }
    shuffledDeck.forEach((card, index) => {
        card.id = index + 1;
    });
    previousValueSignature = getValueSignature(selectedValues);
    previousDeckSignature = shuffledDeckSignature;
    return shuffledDeck;
};
const findCardById = (cardId) => {
    return cards.find((card) => card.id === cardId);
};
// Reference Lesson: Typed Functions & Arguments - this function accepts a GameCard and returns a string.
// Requirement: Each card exposes an accessible label so screen reader users know its position and state.
const getCardLabel = (card, position, total) => {
    const location = `card ${position} of ${total}`;
    if (card.state === CardState.Matched) {
        return `Matched ${location}, value ${card.value}`;
    }
    if (card.state === CardState.Flipped) {
        return `Flipped ${location}, value ${card.value}`;
    }
    return `Face-down ${location}`;
};
// Reference Lesson: Typed Functions & Arguments - this function returns the message string shown to the player.
const getVisibleMessage = () => {
    if (gameStatus === GameStatus.Won) {
        return "You Won!";
    }
    if (gameStatus === GameStatus.Lost) {
        return "Game Over";
    }
    return statusMessage;
};
const updateGameStatus = () => {
    // Requirement: The player wins by matching all three pairs.
    const allCardsMatched = cards.every((card) => {
        return card.state === CardState.Matched;
    });
    if (allCardsMatched) {
        gameStatus = GameStatus.Won;
        return;
    }
    // Requirement: The player loses when there are no attempts left before all pairs are matched.
    if (attemptsRemaining <= 0) {
        gameStatus = GameStatus.Lost;
        return;
    }
    gameStatus = GameStatus.Playing;
};
// Reference Lesson: Typed Functions & Arguments - void functions update the page without returning a value.
const renderGameInfo = () => {
    attemptsElement.textContent = attemptsRemaining.toString();
    messageElement.textContent = getVisibleMessage();
    document.body.dataset.gameStatus = gameStatus;
};
const renderBoard = () => {
    boardElement.innerHTML = "";
    // Requirement: There are six cards displayed on the board after the deck is created.
    cards.forEach((card, index) => {
        const cardButton = document.createElement("button");
        const cardValue = document.createElement("span");
        cardButton.type = "button";
        cardButton.className = `card card--${card.state}`;
        cardButton.dataset.cardId = card.id.toString();
        cardButton.setAttribute("aria-label", getCardLabel(card, index + 1, cards.length));
        // Accessibility: announce matched/face-down status changes without stealing focus.
        cardButton.setAttribute("aria-pressed", (card.state === CardState.Flipped).toString());
        cardButton.disabled =
            gameStatus !== GameStatus.Playing ||
                isComparing ||
                card.state !== CardState.FaceDown;
        cardValue.className = "card__value";
        cardValue.textContent = card.value;
        cardButton.appendChild(cardValue);
        boardElement.appendChild(cardButton);
    });
};
const renderGame = () => {
    renderGameInfo();
    renderBoard();
};
const clearPendingFlip = () => {
    if (pendingFlipTimeout !== undefined) {
        window.clearTimeout(pendingFlipTimeout);
        pendingFlipTimeout = undefined;
    }
};
const finishComparison = () => {
    selectedCardIds = [];
    isComparing = false;
    updateGameStatus();
    renderGame();
};
const compareSelectedCards = () => {
    // Requirement: One attempt means comparing exactly 2 selected cards.
    const firstCard = findCardById(selectedCardIds[0]);
    const secondCard = findCardById(selectedCardIds[1]);
    if (!firstCard || !secondCard) {
        finishComparison();
        return;
    }
    isComparing = true;
    if (firstCard.value === secondCard.value) {
        // Requirement: Matching cards stay face up and locked.
        firstCard.state = CardState.Matched;
        secondCard.state = CardState.Matched;
        statusMessage = "Match found. Keep going.";
        finishComparison();
        return;
    }
    // Requirement: If the cards do not match, reduce the player's remaining attempts by one.
    attemptsRemaining -= 1;
    statusMessage = attemptsRemaining > 0 ? "No match. Try another pair." : "No match.";
    renderGame();
    pendingFlipTimeout = window.setTimeout(() => {
        // Requirement: Non-matching cards are flipped back to their face-down state.
        firstCard.state = CardState.FaceDown;
        secondCard.state = CardState.FaceDown;
        pendingFlipTimeout = undefined;
        finishComparison();
    }, FLIP_BACK_DELAY);
};
const handleCardSelection = (cardId) => {
    if (gameStatus !== GameStatus.Playing || isComparing) {
        return;
    }
    const selectedCard = findCardById(cardId);
    if (!selectedCard || selectedCard.state !== CardState.FaceDown) {
        return;
    }
    selectedCard.state = CardState.Flipped;
    selectedCardIds.push(selectedCard.id);
    renderGame();
    // Requirement: A card flip alone is not an attempt; the attempt happens after 2 cards are selected.
    if (selectedCardIds.length === 2) {
        compareSelectedCards();
    }
};
const startGame = () => {
    // Requirement: Each new game resets attempts, creates a fresh deck, and reshuffles values and positions.
    clearPendingFlip();
    cards = createDeck();
    selectedCardIds = [];
    attemptsRemaining = MAX_ATTEMPTS;
    gameStatus = GameStatus.Playing;
    isComparing = false;
    statusMessage = "Pick two cards to find a match.";
    renderGame();
};
assertRequiredElement(boardElement, ".game-board");
assertRequiredElement(attemptsElement, ".attempts-count");
assertRequiredElement(messageElement, ".game-message");
assertRequiredElement(resetButton, ".reset-button");
boardElement.addEventListener("click", (event) => {
    // Reference Lesson: Using Type Assertions - event targets are asserted before using DOM methods.
    const target = event.target;
    const cardButton = target.closest(".card");
    if (!cardButton) {
        return;
    }
    const cardId = Number(cardButton.dataset.cardId);
    if (Number.isNaN(cardId)) {
        return;
    }
    handleCardSelection(cardId);
});
resetButton.addEventListener("click", () => {
    startGame();
});
startGame();
