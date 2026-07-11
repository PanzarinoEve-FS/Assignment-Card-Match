// Reference Lesson: Introduction To TypScript - this .ts file compiles to browser-ready JavaScript.
// Reference Lesson: Using Enumerations - enums describe fixed game and card states.
enum CardState {
  FaceDown = "face-down",
  Flipped = "flipped",
  Matched = "matched"
}

enum GameStatus {
  Playing = "playing",
  Won = "won",
  Lost = "lost"
}

// Reference Lesson: Introduction To Interfaces - this interface defines the shape of each card object.
interface GameCard {
  id: number;
  value: string;
  state: CardState;
}

// Reference Lesson: Introduction To Interfaces - the GameCard contract is used by card arrays and functions.
// Reference Lesson: Using Data Types - constants use explicit number and string array types.
// Requirement: The player has a maximum of 3 tries/attempts.
const MAX_ATTEMPTS: number = 3;
// Requirement: The set includes 3 pairs of matching cards, which makes 6 cards total.
const MATCH_PAIR_COUNT: number = 3;
// Requirement: Special cards like Aces, Kings, Queens, and Jacks are included and work.
const CARD_VALUE_POOL: string[] = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];
// Requirement: Non-matching cards flip back to their face-down state after a short delay.
const FLIP_BACK_DELAY: number = 850;

// Reference Lesson: Using Type Assertions - querySelector results are asserted as specific element types.
// Requirement: Type assertions are used to work with browser DOM elements in TypeScript.
const boardElement = document.querySelector(".game-board") as HTMLElement;
const attemptsElement = document.querySelector(".attempts-count") as HTMLElement;
const messageElement = document.querySelector(".game-message") as HTMLElement;
const resetButton = document.querySelector(".reset-button") as HTMLButtonElement;

let cards: GameCard[] = [];
let selectedCardIds: number[] = [];
let attemptsRemaining: number = MAX_ATTEMPTS;
let gameStatus: GameStatus = GameStatus.Playing;
let isComparing: boolean = false;
let statusMessage: string = "Pick two cards to find a match.";
let pendingFlipTimeout: number | undefined;
let previousValueSignature: string = "";
let previousDeckSignature: string = "";

// Reference Lesson: Typed Functions & Arguments - functions include typed parameters and return types.
const assertRequiredElement = (element: HTMLElement | null, selector: string): void => {
  if (!element) {
    throw new Error(`Missing required element: ${selector}`);
  }
};

const shuffleCards = (deck: GameCard[]): GameCard[] => {
  const shuffledCards: GameCard[] = deck.slice();

  for (let index: number = shuffledCards.length - 1; index > 0; index -= 1) {
    const randomIndex: number = Math.floor(Math.random() * (index + 1));
    const currentCard: GameCard = shuffledCards[index];

    shuffledCards[index] = shuffledCards[randomIndex];
    shuffledCards[randomIndex] = currentCard;
  }

  return shuffledCards;
};

// Requirement: At the start of each new game, the card values are reshuffled.
const shuffleValues = (values: string[]): string[] => {
  const shuffledValues: string[] = values.slice();

  for (let index: number = shuffledValues.length - 1; index > 0; index -= 1) {
    const randomIndex: number = Math.floor(Math.random() * (index + 1));
    const currentValue: string = shuffledValues[index];

    shuffledValues[index] = shuffledValues[randomIndex];
    shuffledValues[randomIndex] = currentValue;
  }

  return shuffledValues;
};

const getValueSignature = (values: string[]): string => {
  return values.slice().sort().join("|");
};

const getDeckSignature = (deck: GameCard[]): string => {
  return deck.map((card: GameCard): string => card.value).join("|");
};

// Reference Lesson: Using Data Types - string arrays are used to choose the card values for each game.
// Requirement: Each new game uses a different set of card values when possible.
const chooseCardValues = (): string[] => {
  let selectedValues: string[] = shuffleValues(CARD_VALUE_POOL).slice(0, MATCH_PAIR_COUNT);
  let selectedSignature: string = getValueSignature(selectedValues);

  if (selectedSignature === previousValueSignature) {
    const replacementValue: string | undefined = CARD_VALUE_POOL.find((value: string): boolean => {
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
const createDeck = (): GameCard[] => {
  const deck: GameCard[] = [];
  const selectedValues: string[] = chooseCardValues();

  selectedValues.forEach((value: string): void => {
    for (let copy: number = 0; copy < 2; copy += 1) {
      deck.push({
        id: deck.length + 1,
        value,
        state: CardState.FaceDown
      });
    }
  });

  // Requirement: At the start of each new game, the card positions are reshuffled.
  let shuffledDeck: GameCard[] = shuffleCards(deck);
  let shuffledDeckSignature: string = getDeckSignature(shuffledDeck);

  if (shuffledDeckSignature === previousDeckSignature && shuffledDeck.length > 1) {
    const firstCard: GameCard | undefined = shuffledDeck.shift();

    if (firstCard) {
      shuffledDeck.push(firstCard);
    }

    shuffledDeckSignature = getDeckSignature(shuffledDeck);
  }

  shuffledDeck.forEach((card: GameCard, index: number): void => {
    card.id = index + 1;
  });

  previousValueSignature = getValueSignature(selectedValues);
  previousDeckSignature = shuffledDeckSignature;

  return shuffledDeck;
};

const findCardById = (cardId: number): GameCard | undefined => {
  return cards.find((card: GameCard): boolean => card.id === cardId);
};

// Reference Lesson: Typed Functions & Arguments - this function accepts a GameCard and returns a string.
const getCardLabel = (card: GameCard): string => {
  if (card.state === CardState.Matched) {
    return `Matched card ${card.value}`;
  }

  if (card.state === CardState.Flipped) {
    return `Flipped card ${card.value}`;
  }

  return "Face-down card";
};

// Reference Lesson: Typed Functions & Arguments - this function returns the message string shown to the player.
const getVisibleMessage = (): string => {
  if (gameStatus === GameStatus.Won) {
    return "You Won!";
  }

  if (gameStatus === GameStatus.Lost) {
    return "Game Over";
  }

  return statusMessage;
};

const updateGameStatus = (): void => {
  // Requirement: The player wins by matching all three pairs.
  const allCardsMatched: boolean = cards.every((card: GameCard): boolean => {
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
const renderGameInfo = (): void => {
  attemptsElement.textContent = attemptsRemaining.toString();
  messageElement.textContent = getVisibleMessage();
  document.body.dataset.gameStatus = gameStatus;
};

const renderBoard = (): void => {
  boardElement.innerHTML = "";

  // Requirement: There are six cards displayed on the board after the deck is created.
  cards.forEach((card: GameCard): void => {
    const cardButton: HTMLButtonElement = document.createElement("button");
    const cardValue: HTMLSpanElement = document.createElement("span");

    cardButton.type = "button";
    cardButton.className = `card card--${card.state}`;
    cardButton.dataset.cardId = card.id.toString();
    cardButton.setAttribute("aria-label", getCardLabel(card));
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

const renderGame = (): void => {
  renderGameInfo();
  renderBoard();
};

const clearPendingFlip = (): void => {
  if (pendingFlipTimeout !== undefined) {
    window.clearTimeout(pendingFlipTimeout);
    pendingFlipTimeout = undefined;
  }
};

const finishComparison = (): void => {
  selectedCardIds = [];
  isComparing = false;
  updateGameStatus();
  renderGame();
};

const compareSelectedCards = (): void => {
  // Requirement: One attempt means comparing exactly 2 selected cards.
  const firstCard: GameCard | undefined = findCardById(selectedCardIds[0]);
  const secondCard: GameCard | undefined = findCardById(selectedCardIds[1]);

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

  pendingFlipTimeout = window.setTimeout((): void => {
    // Requirement: Non-matching cards are flipped back to their face-down state.
    firstCard.state = CardState.FaceDown;
    secondCard.state = CardState.FaceDown;
    pendingFlipTimeout = undefined;
    finishComparison();
  }, FLIP_BACK_DELAY);
};

const handleCardSelection = (cardId: number): void => {
  if (gameStatus !== GameStatus.Playing || isComparing) {
    return;
  }

  const selectedCard: GameCard | undefined = findCardById(cardId);

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

const startGame = (): void => {
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

boardElement.addEventListener("click", (event: MouseEvent): void => {
  // Reference Lesson: Using Type Assertions - event targets are asserted before using DOM methods.
  const target = event.target as HTMLElement;
  const cardButton = target.closest(".card") as HTMLButtonElement | null;

  if (!cardButton) {
    return;
  }

  const cardId: number = Number(cardButton.dataset.cardId);

  if (Number.isNaN(cardId)) {
    return;
  }

  handleCardSelection(cardId);
});

resetButton.addEventListener("click", (): void => {
  startGame();
});

startGame();
