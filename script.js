let countdown;
let timeRemaining = 60; // Tiempo en segundos
const numeroRondasObjetivo = 3;
let rondasJugadas = 0;
let objetivoAlcanzado = false;
let rondasGanadas = 0;

function startCountdown() {
  countdown = setInterval(function () {
    timeRemaining--;
    updateUI();
    
    if (timeRemaining <= 0) {
      endGame('¡Se acabó el tiempo! Has perdido.');
    }
  }, 1000); // Actualiza cada segundo
}

function stopCountdown() {
  clearInterval(countdown);
}

function resetCountdown() {
  timeRemaining = 60; // Reinicia el tiempo
}

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
  // Restablece el tiempo cuando el jugador comienza un nuevo juego
  resetCountdown();
  
  // Restablece variables relacionadas con el objetivo de rondas
  rondasJugadas = 0;
  objetivoAlcanzado = false;
  
  createDeck();
  shuffleDeck();
  playerHand = [drawCard(), drawCard()];
  dealerHand = [drawCard(), drawCard()];
  playerScore = calculateScore(playerHand);
  dealerScore = calculateScore(dealerHand);

  updateUI();
  
  // Inicia la cuenta atrás al comenzar el juego
  startCountdown();
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
  const timeRemainingElement = document.getElementById('time-remaining');
  if (timeRemainingElement) {
    timeRemainingElement.textContent = `Tiempo restante: ${timeRemaining} segundos`;
  }
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
  // Detiene la cuenta atrás al finalizar el juego
  stopCountdown();
  
  const resultElement = document.getElementById('game-result');
  if (resultElement) {
    resultElement.textContent = message;
  }

  rondasJugadas++;

  // Incrementa las rondas ganadas cuando el jugador gana la ronda
  if (message.includes('¡Has ganado!')) {
    rondasGanadas++;
  }

  // Muestra las rondas ganadas en la interfaz
  const rondasGanadasElement = document.getElementById('rondas-ganadas');
  if (rondasGanadasElement) {
    rondasGanadasElement.textContent = `Rondas Ganadas: ${rondasGanadas}`;
  }

  if (rondasJugadas >= numeroRondasObjetivo) {
    // El jugador completó el número objetivo de rondas
    console.log('¡Has completado el número objetivo de rondas!');

    if (rondasGanadas >= rondasJugadas / 2) {
      console.log('¡Has ganado más de la mitad de las rondas! ¡Ganaste el juego!');
    } else {
      console.log('No has ganado más de la mitad de las rondas. ¡Perdiste el juego!');
    }
  } else {
    // Reinicia el tiempo cuando el jugador vuelva a jugar
    resetCountdown();
  }
}
