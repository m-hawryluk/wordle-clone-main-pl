const keyboard = document.querySelector("[data-keyboard]");
const guessGrid = document.querySelector("[data-guess-grid]");
const alertContainer = document.querySelector("[data-alert-container]");
const startScreen = document.querySelector("[data-start-screen]");
const startButton = document.querySelector("[data-start-button]");
const heroImage = document.querySelector("[data-hero-image]");
const heroFrame = document.querySelector("[data-hero-frame]");
const celebrationLayer = document.querySelector("[data-celebration-layer]");

const WORD_LENGTH = 5;
const FLIP_STEP_DURATION = 320;
const DANCE_ANIMATION_DURATION = 500;
const REFERENCE_DATE = new Date(2026, 2, 8);
const KEY_STATE_PRIORITY = {
  wrong: 0,
  "wrong-location": 1,
  correct: 2,
};
const LETTER_NORMALIZATION = {
  a: "a",
  c: "c",
  e: "e",
  l: "l",
  n: "n",
  o: "o",
  s: "s",
  z: "z",
  "ą": "a",
  "ć": "c",
  "ę": "e",
  "ł": "l",
  "ń": "n",
  "ó": "o",
  "ś": "s",
  "ź": "z",
  "ż": "z",
};
const FALLBACK_WORDS = ["kwiat"];
const rawWordBank =
  Array.isArray(window.WORD_BANK) && window.WORD_BANK.length > 0
    ? window.WORD_BANK
    : FALLBACK_WORDS;
const WORD_BANK = rawWordBank
  .map((word, index) => {
    const display = String(word).trim();
    const normalized = normalizeWord(display);
    return {
      id: index,
      display,
      normalized,
    };
  })
  .filter(
    (entry) =>
      entry.display.length === WORD_LENGTH &&
      entry.normalized.length === WORD_LENGTH &&
      /^[a-z]{5}$/.test(entry.normalized)
  );
const VALID_GUESSES = new Set(WORD_BANK.map((entry) => entry.normalized));
const targetEntry = pickTargetEntry();

let hasStarted = false;
let isLocked = false;
let isGameOver = false;

init();

function init() {
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
  hydrateHeroImageState();
  startButton.focus();
}

function hydrateHeroImageState() {
  const markLoaded = () => heroFrame.classList.remove("image-missing");
  const markMissing = () => heroFrame.classList.add("image-missing");

  heroImage.addEventListener("load", markLoaded);
  heroImage.addEventListener("error", markMissing);

  if (heroImage.complete) {
    if (heroImage.naturalWidth > 0) {
      markLoaded();
    } else {
      markMissing();
    }
  }
}

function startGame() {
  if (hasStarted) return;

  hasStarted = true;
  startScreen.classList.add("is-hidden");
  startScreen.setAttribute("aria-hidden", "true");
  startButton.disabled = true;
  showAlert(`Powodzenia! Pula startowa: ${rawWordBank.length} słów.`, 2000);
}

function handleMouseClick(event) {
  if (event.target.closest("[data-start-button]")) {
    startGame();
    return;
  }

  if (!canInteract()) {
    return;
  }

  const key = event.target.closest("[data-key]");
  if (key != null) {
    pressKey(key.dataset.key);
    return;
  }

  if (event.target.closest("[data-enter]")) {
    submitGuess();
    return;
  }

  if (event.target.closest("[data-delete]")) {
    deleteKey();
  }
}

function handleKeyPress(event) {
  if (!hasStarted && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    startGame();
    return;
  }

  if (!canInteract()) {
    return;
  }

  if (event.key === "Enter") {
    submitGuess();
    return;
  }

  if (event.key === "Backspace" || event.key === "Delete") {
    deleteKey();
    return;
  }

  const normalizedLetter = normalizeLetter(event.key);
  if (normalizedLetter != null) {
    pressKey(normalizedLetter);
  }
}

function canInteract() {
  return hasStarted && !isLocked && !isGameOver;
}

function normalizeLetter(value) {
  if (value.length !== 1) return null;

  const lowercased = value.toLowerCase();
  const normalized = LETTER_NORMALIZATION[lowercased] ?? lowercased;

  return /^[a-z]$/.test(normalized) ? normalized : null;
}

function normalizeWord(value) {
  return [...String(value).trim().toLowerCase()]
    .map((character) => LETTER_NORMALIZATION[character] ?? character)
    .join("");
}

function pickTargetEntry() {
  if (WORD_BANK.length === 0) {
    return { display: "kwiat", normalized: "kwiat" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reference = new Date(REFERENCE_DATE);
  reference.setHours(0, 0, 0, 0);

  const dayOffset = Math.floor(
    (today.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = ((dayOffset % WORD_BANK.length) + WORD_BANK.length) % WORD_BANK.length;

  return WORD_BANK[index];
}

function pressKey(letter) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) {
    return;
  }

  const nextTile = guessGrid.querySelector(".tile:not([data-letter])");
  if (nextTile == null) {
    return;
  }

  nextTile.dataset.letter = letter.toLowerCase();
  nextTile.dataset.state = "active";
  nextTile.textContent = letter.toUpperCase();
}

function deleteKey() {
  const activeTiles = [...getActiveTiles()];
  const lastTile = activeTiles[activeTiles.length - 1];

  if (lastTile == null) {
    return;
  }

  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

async function submitGuess() {
  if (!canInteract()) {
    return;
  }

  const activeTiles = [...getActiveTiles()];
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Za mało liter");
    shakeTiles(activeTiles);
    return;
  }

  const guess = activeTiles.map((tile) => tile.dataset.letter).join("");
  if (!VALID_GUESSES.has(guess)) {
    showAlert("Tego słowa nie ma na liście startowej");
    shakeTiles(activeTiles);
    return;
  }

  isLocked = true;
  const evaluation = evaluateGuess(guess, targetEntry.normalized);
  await flipTiles(activeTiles, guess, evaluation);
  checkWinLose(guess, activeTiles);

  if (!isGameOver) {
    isLocked = false;
  }
}

function evaluateGuess(guess, solution) {
  const evaluation = Array(WORD_LENGTH).fill("wrong");
  const remainingLetters = {};

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (guess[index] === solution[index]) {
      evaluation[index] = "correct";
    } else {
      remainingLetters[solution[index]] =
        (remainingLetters[solution[index]] ?? 0) + 1;
    }
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (evaluation[index] !== "wrong") {
      continue;
    }

    const letter = guess[index];
    if ((remainingLetters[letter] ?? 0) > 0) {
      evaluation[index] = "wrong-location";
      remainingLetters[letter] -= 1;
    }
  }

  return evaluation;
}

async function flipTiles(tiles, guess, evaluation) {
  for (let index = 0; index < tiles.length; index += 1) {
    const tile = tiles[index];
    tile.classList.add("flip");
    await wait(FLIP_STEP_DURATION / 2);

    tile.classList.remove("flip");
    tile.dataset.state = evaluation[index];
    tile.classList.add("reveal");
    updateKeyState(guess[index], evaluation[index]);

    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("reveal");
      },
      { once: true }
    );

    await wait(FLIP_STEP_DURATION / 2);
  }
}

function updateKeyState(letter, nextState) {
  const key = keyboard.querySelector(`[data-key="${letter.toUpperCase()}"]`);
  if (key == null) {
    return;
  }

  const currentState = key.dataset.state;
  if (
    currentState != null &&
    KEY_STATE_PRIORITY[currentState] >= KEY_STATE_PRIORITY[nextState]
  ) {
    return;
  }

  if (currentState != null) {
    key.classList.remove(currentState);
  }

  key.dataset.state = nextState;
  key.classList.add(nextState);
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('.tile[data-state="active"]');
}

function showAlert(message, duration = 1400) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);

  if (duration == null) {
    return;
  }

  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener(
      "transitionend",
      () => {
        alert.remove();
      },
      { once: true }
    );
  }, duration);
}

function shakeTiles(tiles) {
  tiles.forEach((tile) => {
    tile.classList.add("shake");
    tile.addEventListener(
      "animationend",
      () => {
        tile.classList.remove("shake");
      },
      { once: true }
    );
  });
}

function checkWinLose(guess, tiles) {
  if (guess === targetEntry.normalized) {
    isGameOver = true;
    showAlert(`Brawo! Hasło to ${targetEntry.display.toUpperCase()}!`, 2600);
    danceTiles(tiles);
    launchCelebration();
    return;
  }

  const remainingTiles = guessGrid.querySelectorAll(".tile:not([data-letter])");
  if (remainingTiles.length === 0) {
    isGameOver = true;
    showAlert(`Szukane słowo: ${targetEntry.display.toUpperCase()}`, null);
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance");
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("dance");
        },
        { once: true }
      );
    }, (index * DANCE_ANIMATION_DURATION) / 5);
  });
}

function launchCelebration() {
  for (let index = 0; index < 22; index += 1) {
    const petal = document.createElement("span");
    petal.className = "celebration-petal";
    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--delay", `${Math.random() * 0.45}s`);
    petal.style.setProperty("--duration", `${2.7 + Math.random() * 1.2}s`);
    petal.style.setProperty("--rotation", `${-35 + Math.random() * 70}deg`);
    petal.style.setProperty("--scale", `${0.8 + Math.random() * 0.55}`);
    petal.style.setProperty("--drift", `${Math.random().toFixed(2)}`);

    celebrationLayer.append(petal);
    petal.addEventListener(
      "animationend",
      () => {
        petal.remove();
      },
      { once: true }
    );
  }
}

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
