const suits = ['Corazones', 'Diamantes', 'Tréboles', 'Picas'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let deck = [];
let playerHand = [];
let dealerHand = [];
let playerScore = 0;
let dealerScore = 0;
function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      deck.push({ suit, rank });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function deal() {
  createDeck();
  shuffleDeck();
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  playerScore = calculateScore(playerHand);
  dealerScore = calculateScore(dealerHand);

  updateUI();
}

function drawCard() {
  return deck.pop();
}

function calculateScore(hand) {
  let score = 0;
  let hasAce = false;

  for (let card of hand) {
    if (card.rank === 'A') {
      hasAce = true;
    }
    score += getCardValue(card.rank);
  }

  if (hasAce && score + 10 <= 21) {
    score += 10; // Contar el As como 11 si no pasa de 21
  }

  return score;
}

function getCardValue(rank) {
  if (rank === 'J' || rank === 'Q' || rank === 'K') {
    return 10;
  } else if (rank === 'A') {
    return 1; // El As se cuenta como 1 por defecto
  } else {
    return parseInt(rank);
  }
}

function hit() {
  playerHand.push(drawCard());
  playerScore = calculateScore(playerHand);
  updateUI();

  if (playerScore > 21) {
    endGame('¡Has perdido! Superaste 21.');
  }
}

function stand() {
  while (dealerScore < 17) {
    dealerHand.push(drawCard());
    dealerScore = calculateScore(dealerHand);
  }

  updateUI();

  if (dealerScore > 21 || playerScore > dealerScore) {
    endGame('¡Has ganado!');
  } else if (playerScore < dealerScore) {
    endGame('¡Has perdido!');
  } else {
    endGame('¡Es un empate!');
  }
}

function updateUI() {
  displayHand(playerHand, 'player-cards', 'player-score');
  displayHand(dealerHand, 'dealer-cards', 'dealer-score');
}

function displayHand(hand, cardsElementId, scoreElementId) {
  const cardsElement = document.getElementById(cardsElementId);
  const scoreElement = document.getElementById(scoreElementId);
  cardsElement.innerHTML = '';
  scoreElement.textContent = `Puntuación: ${calculateScore(hand)}`;

  for (let card of hand) {
    const cardElement = document.createElement('div');
    cardElement.textContent = `${card.rank} de ${card.suit}`;
    cardsElement.appendChild(cardElement);
  }
}

function endGame(message) {
  const resultElement = document.getElementById('game-result');
  resultElement.textContent = message;
}
