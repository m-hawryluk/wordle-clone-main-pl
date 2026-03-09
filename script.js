const keyboard = document.querySelector("[data-keyboard]");
const guessGrid = document.querySelector("[data-guess-grid]");
const alertContainer = document.querySelector("[data-alert-container]");
const startScreen = document.querySelector("[data-start-screen]");
const startButton = document.querySelector("[data-start-button]");
const heroImage = document.querySelector("[data-hero-image]");
const heroFrame = document.querySelector("[data-hero-frame]");
const celebrationLayer = document.querySelector("[data-celebration-layer]");
const wordCountBadge = document.querySelector("[data-word-count]");
const pagerSentence = document.querySelector("[data-pager-sentence]");
const pagerViewport = document.querySelector("[data-pager-viewport]");

const WORD_LENGTH = 5;
const FLIP_STEP_DURATION = 320;
const DANCE_ANIMATION_DURATION = 500;
const PROVERB_SCROLL_SPEED_PX_PER_SEC = 43;
const PROVERB_SCROLL_PADDING_PX = 24;
const PROVERB_MIN_DURATION_MS = 4000;
const PAGER_RESIZE_RESTART_THRESHOLD_PX = 8;
const ROTATION_REFERENCE_DATE = new Date(2022, 0, 1);
const KEY_STATE_PRIORITY = {
  wrong: 0,
  "wrong-location": 1,
  correct: 2,
};
const POLISH_LETTER_REGEX = /^[a-ząćęłńóśźż]$/u;
const POLISH_WORD_REGEX = /^[a-ząćęłńóśźż]{5}$/u;
const FALLBACK_WORDS = ["kwiat"];
const PROVERBS = [
  ...new Set([
    "Apetyt rośnie w miarę jedzenia",
    "Bez pracy nie ma kołaczy",
    "Co za dużo to niezdrowo",
    "Co nagle to po diable",
    "Cicha woda brzegi rwie",
    "Darowanemu koniowi w zęby się nie zagląda",
    "Gdzie kucharek sześć tam nie ma co jeść",
    "Gdzie dwóch się bije tam trzeci korzysta",
    "Jak sobie pościelesz tak się wyśpisz",
    "Kto pod kim dołki kopie sam w nie wpada",
    "Lepszy wróbel w garści niż gołąb na dachu",
    "Mądry Polak po szkodzie",
    "Nie chwal dnia przed zachodem słońca",
    "Nie ma tego złego co by na dobre nie wyszło",
    "Niedaleko pada jabłko od jabłoni",
    "Nie wszystko złoto co się świeci",
    "Pierwsze koty za płoty",
    "Potrzeba matką wynalazków",
    "Stara miłość nie rdzewieje",
    "Strach ma wielkie oczy",
    "Trawa zawsze bardziej zielona u sąsiada",
    "W zdrowym ciele zdrowy duch",
    "Ziarnko do ziarnka a zbierze się miarka",
    "Kto rano wstaje temu Pan Bóg daje",
    "Kto pyta nie błądzi",
    "Co kraj to obyczaj",
    "Do trzech razy sztuka",
    "Fortuna kołem się toczy",
    "Gdzie diabeł nie może tam babę pośle",
    "Jak Kuba Bogu tak Bóg Kubie",
    "Kto mieczem wojuje od miecza ginie",
    "Kto późno przychodzi sam sobie szkodzi",
    "Kto szuka ten znajduje",
    "Lepsze późno niż wcale",
    "Małe dzieci mały kłopot duże dzieci duży kłopot",
    "Mowa jest srebrem a milczenie złotem",
    "Na bezrybiu i rak ryba",
    "Na złodzieju czapka gore",
    "Nadzieja matką głupich",
    "Nie taki diabeł straszny jak go malują",
    "Nie od razu Kraków zbudowano",
    "Nie samym chlebem człowiek żyje",
    "Nie święci garnki lepią",
    "Nowa miotła dobrze zamiata",
    "O wilku mowa a wilk tu",
    "Oko za oko ząb za ząb",
    "Pieniądze szczęścia nie dają",
    "Po burzy zawsze wychodzi słońce",
    "Po nitce do kłębka",
    "Pokorne cielę dwie matki ssie",
    "Prawda w oczy kole",
    "Przez żołądek do serca",
    "Ręka rękę myje",
    "Słowo się rzekło kobyłka u płotu",
    "Starych drzew się nie przesadza",
    "Szewc bez butów chodzi",
    "Trafiła kosa na kamień",
    "Umiesz liczyć licz na siebie",
    "Uderz w stół a nożyce się odezwą",
    "W kupie siła",
    "Wszędzie dobrze ale w domu najlepiej",
    "Wyszło szydło z worka",
    "Z dużej chmury mały deszcz",
    "Z pustego i Salomon nie naleje",
    "Zgoda buduje niezgoda rujnuje",
    "Żeby kózka nie skakała to by nóżki nie złamała",
    "Jak trwoga to do Boga",
    "Kto daje i odbiera ten się w piekle poniewiera",
    "Kto ma pszczoły ten ma miód",
    "Kto wiatr sieje ten burzę zbiera",
    "Kto z kim przestaje takim się staje",
    "Lepiej zapobiegać niż leczyć",
    "Mądry ustąpi głupiemu",
    "Na pochyłe drzewo wszystkie kozy skaczą",
    "Nosił wilk razy kilka ponieśli i wilka",
    "Od przybytku głowa nie boli",
    "Ogień i woda dobrzy słudzy ale źli panowie",
    "Prawdziwych przyjaciół poznaje się w biedzie",
    "Przyganiał kocioł garnkowi",
    "Rób swoje a będzie dobrze",
    "Ryba psuje się od głowy",
    "Skąpy dwa razy traci",
    "Starość nie radość młodość nie wieczność",
    "Swojego nie znacie cudze chwalicie",
    "Śmiech to zdrowie",
    "Tam gdzie drwa rąbią tam wióry lecą",
    "Ten się śmieje kto się śmieje ostatni",
    "Tylko winny się tłumaczy",
    "W marcu jak w garncu",
    "W kwietniu plecień bo przeplata",
    "W maju jak w raju",
    "Gdy kota nie ma myszy harcują",
    "I wilk syty i owca cała",
    "Kto smaruje ten jedzie",
    "Kropla drąży skałę",
    "Lepszy rydz niż nic",
    "Co ma wisieć nie utonie",
    "Gdzie drwa rąbią tam wióry lecą",
    "Gdzie wielu rządzi tam bieda",
    "Gdzie serce tam dom",
    "Grosz do grosza a będzie kokosza",
    "Jak sobie ktoś pościele tak się wyśpi",
    "Jaka praca taka płaca",
    "Jaki pan taki kram",
    "Jaki ojciec taki syn",
    "Jedna jaskółka wiosny nie czyni",
    "Jedna ręka drugą myje",
    "Każdy jest kowalem swojego losu",
    "Każdy kij ma dwa końce",
    "Kłamstwo ma krótkie nogi",
    "Kto chce psa uderzyć kij znajdzie",
    "Kto nie pracuje ten nie je",
    "Kto nie ryzykuje ten nie pije szampana",
    "Kto pierwszy ten lepszy",
    "Kto pod kim dołki kopie sam w nie wpada",
    "Kto przy mieczu wojuje od miecza ginie",
    "Kto sieje wiatr zbiera burzę",
    "Kto ma wiedzę ma władzę",
    "Kto nie ma w głowie ma w nogach",
    "Kto nie słucha ojca matki będzie słuchał psiej skóry",
    "Kto nie próbuje ten nie wygrywa",
    "Kto śpi nie grzeszy",
    "Kto wiele zaczyna mało kończy",
    "Kto za młodu nie oszczędza na starość biedę spędza",
    "Kuj żelazo póki gorące",
    "Lepsza zgoda niż niezgoda",
    "Lepszy grosz dziś niż złoty jutro",
    "Lepszy jeden przyjaciel niż stu znajomych",
    "Lepszy mądry wróg niż głupi przyjaciel",
    "Licho nie śpi",
    "Mała rzecz a cieszy",
    "Mądrego dobrze posłuchać",
    "Milczenie jest złotem",
    "Na darmo szukać wiatru w polu",
    "Na naukę nigdy nie jest za późno",
    "Na szczęście trzeba mieć szczęście",
    "Na tym świecie pewna tylko śmierć i podatki",
    "Nie czyń drugiemu co tobie niemiłe",
    "Nie kijem go to pałką",
    "Nie ma dymu bez ognia",
    "Nie ma róży bez kolców",
    "Nie ma ludzi nieomylnych",
    "Nie ma większego bogactwa niż zdrowie",
    "Nie taki straszny wilk jak go malują",
    "Nie wszystko co dobre jest łatwe",
    "Nie wszystko co się świeci jest złotem",
    "Nieszczęścia chodzą parami",
    "Nowe buty zawsze cisną",
    "Od słowa do czynu daleka droga",
    "Ostrożnego Pan Bóg strzeże",
    "Pieniądz rządzi światem",
    "Pies ogrodnika sam nie zje a drugiemu nie da",
    "Póki piłka w grze wszystko możliwe",
    "Prawda zawsze wyjdzie na jaw",
    "Pracowity jak mrówka",
    "Przyjaciel poznany w potrzebie jest prawdziwy",
    "Rano mądrzejsze niż wieczór",
    "Raz kozie śmierć",
    "Raz na wozie raz pod wozem",
    "Robota nie zając nie ucieknie",
    "Ręce opadają",
    "Stare nawyki trudno wykorzenić",
    "Stary lis chytry lis",
    "Szczęście sprzyja odważnym",
    "Szkoda czasu na głupoty",
    "Słowo rani bardziej niż miecz",
    "Sowa mądra po szkodzie",
    "Taka praca taka płaca",
    "Taki los",
    "Ten sam chleb różne zęby",
    "Trafiło się ślepej kurze ziarno",
    "Trudno dogodzić wszystkim",
    "Ucz się ucz bo nauka to potęgi klucz",
    "Uczony głupiemu ustąpi",
    "Uderz w stół a nożyce się odezwą",
    "W biedzie poznaje się przyjaciół",
    "W jedności siła",
    "W życiu jak w teatrze",
    "Wszystko dobre co się dobrze kończy",
    "Wszystko ma swój czas",
    "Wszystko przemija",
    "Wszystko w rękach Boga",
    "Z deszczu pod rynnę",
    "Z głodu i wilk z lasu wyjdzie",
    "Z kim przystajesz takim się stajesz",
    "Za darmo to nawet ocet słodki",
    "Zgoda czyni cuda",
    "Złota zasada umiaru",
    "Złość piękności szkodzi",
    "Żadna praca nie hańbi",
    "Żeby było dobrze musi być trudno",
    "Życie pisze różne scenariusze",
  ]),
];

const rawWordBank =
  Array.isArray(window.WORD_BANK) && window.WORD_BANK.length > 0
    ? window.WORD_BANK
    : FALLBACK_WORDS;
const parsedWordBank = rawWordBank
  .map((word, index) => {
    const display = normalizeWord(word);
    return {
      id: index,
      display,
    };
  })
  .filter((entry) => POLISH_WORD_REGEX.test(entry.display));
const WORD_BANK = [
  ...new Map(parsedWordBank.map((entry) => [entry.display, entry])).values(),
];
const VALID_GUESSES = new Set(parsedWordBank.map((entry) => entry.display));
const targetEntry = pickTargetEntry();

let hasStarted = false;
let isLocked = false;
let isGameOver = false;
let proverbQueue = [];
let proverbIndex = 0;
let proverbAnimationId = null;
let proverbLoopToken = 0;
let proverbResizeTimerId = null;
let activeProverb = null;
let isPagerResizeBound = false;
let lastPagerViewportWidth = 0;

init();

function init() {
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
  hydrateHeroImageState();
  syncWordCountBadge();
  startProverbPager();
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

function syncWordCountBadge() {
  if (wordCountBadge == null) {
    return;
  }

  wordCountBadge.textContent = `${WORD_BANK.length} haseł z twojego słownika`;
}

function startProverbPager() {
  if (pagerSentence == null || pagerViewport == null || PROVERBS.length === 0) {
    return;
  }

  proverbQueue = prepareNextProverbQueue();
  proverbIndex = 0;
  lastPagerViewportWidth = pagerViewport.clientWidth;
  runProverbLoop();

  if (!isPagerResizeBound) {
    window.addEventListener("resize", handleProverbPagerResize, { passive: true });
    isPagerResizeBound = true;
  }
}

function runProverbLoop(restartCurrent = false) {
  proverbLoopToken += 1;
  const loopToken = proverbLoopToken;
  cancelPendingProverbAnimation();

  if (restartCurrent && activeProverb != null) {
    animateProverb(activeProverb, loopToken, () => {
      if (loopToken !== proverbLoopToken) {
        return;
      }

      proverbIndex += 1;
      playNextProverb(loopToken);
    });
    return;
  }

  playNextProverb(loopToken);
}

function playNextProverb(loopToken) {
  if (loopToken !== proverbLoopToken || proverbQueue.length === 0) {
    return;
  }

  if (proverbIndex >= proverbQueue.length) {
    const previousProverb = proverbQueue[proverbQueue.length - 1] ?? null;
    proverbQueue = prepareNextProverbQueue(previousProverb);
    proverbIndex = 0;
  }

  activeProverb = proverbQueue[proverbIndex];
  animateProverb(activeProverb, loopToken, () => {
    if (loopToken !== proverbLoopToken) {
      return;
    }

    proverbIndex += 1;
    playNextProverb(loopToken);
  });
}

function prepareNextProverbQueue(previousProverb = null) {
  const queue = shuffleArray([...PROVERBS]);

  if (queue.length > 1 && previousProverb != null && queue[0] === previousProverb) {
    const swapIndex = 1 + Math.floor(Math.random() * (queue.length - 1));
    [queue[0], queue[swapIndex]] = [queue[swapIndex], queue[0]];
  }

  return queue;
}

function animateProverb(sentence, loopToken, onComplete) {
  if (pagerSentence == null || pagerViewport == null) {
    return;
  }

  pagerSentence.textContent = sentence;

  const viewportWidth = pagerViewport.clientWidth;
  const sentenceWidth = Math.max(pagerSentence.getBoundingClientRect().width, 1);
  const startX = viewportWidth + PROVERB_SCROLL_PADDING_PX;
  const endX = -sentenceWidth - PROVERB_SCROLL_PADDING_PX;
  const distance = endX - startX;
  const durationMs = Math.max(
    PROVERB_MIN_DURATION_MS,
    (Math.abs(distance) / PROVERB_SCROLL_SPEED_PX_PER_SEC) * 1000
  );
  const startTime = performance.now();

  pagerSentence.style.transform = `translate(${startX}px, -50%)`;

  const step = (timestamp) => {
    if (loopToken !== proverbLoopToken) {
      return;
    }

    const progress = Math.min((timestamp - startTime) / durationMs, 1);
    const x = startX + distance * progress;
    pagerSentence.style.transform = `translate(${x}px, -50%)`;

    if (progress < 1) {
      proverbAnimationId = window.requestAnimationFrame(step);
      return;
    }

    proverbAnimationId = null;
    onComplete();
  };

  proverbAnimationId = window.requestAnimationFrame(step);
}

function handleProverbPagerResize() {
  if (activeProverb == null || pagerSentence == null || pagerViewport == null) {
    return;
  }

  const nextViewportWidth = pagerViewport.clientWidth;
  if (nextViewportWidth <= 0) {
    return;
  }

  if (
    Math.abs(nextViewportWidth - lastPagerViewportWidth) <
    PAGER_RESIZE_RESTART_THRESHOLD_PX
  ) {
    return;
  }
  lastPagerViewportWidth = nextViewportWidth;

  if (proverbResizeTimerId != null) {
    window.clearTimeout(proverbResizeTimerId);
  }

  proverbResizeTimerId = window.setTimeout(() => {
    proverbResizeTimerId = null;
    runProverbLoop(true);
  }, 150);
}

function cancelPendingProverbAnimation() {
  if (proverbAnimationId != null) {
    window.cancelAnimationFrame(proverbAnimationId);
    proverbAnimationId = null;
  }

  if (proverbResizeTimerId != null) {
    window.clearTimeout(proverbResizeTimerId);
    proverbResizeTimerId = null;
  }
}

function shuffleArray(items) {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }

  return items;
}

function startGame() {
  if (hasStarted) return;

  hasStarted = true;
  startScreen.classList.add("is-hidden");
  startScreen.setAttribute("aria-hidden", "true");
  startButton.disabled = true;
  showAlert(
    `Powodzenia! Dzisiejsze hasło pochodzi z puli ${WORD_BANK.length} haseł.`,
    2200
  );
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

  const letter = normalizeLetter(event.key);
  if (letter != null) {
    pressKey(letter);
  }
}

function canInteract() {
  return hasStarted && !isLocked && !isGameOver;
}

function normalizeLetter(value) {
  if (value.length !== 1) return null;

  const lowercased = value.toLocaleLowerCase("pl-PL");
  return POLISH_LETTER_REGEX.test(lowercased) ? lowercased : null;
}

function normalizeWord(value) {
  return String(value).trim().toLocaleLowerCase("pl-PL");
}

function pickTargetEntry() {
  if (WORD_BANK.length === 0) {
    return { display: "kwiat" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reference = new Date(ROTATION_REFERENCE_DATE);
  reference.setHours(0, 0, 0, 0);

  const dayOffset = Math.floor(
    (today.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24)
  );
  const index =
    ((dayOffset % WORD_BANK.length) + WORD_BANK.length) % WORD_BANK.length;

  return WORD_BANK[index];
}

function pressKey(rawKey) {
  const letter = normalizeLetter(rawKey);
  if (letter == null) {
    return;
  }

  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) {
    return;
  }

  const nextTile = guessGrid.querySelector(".tile:not([data-letter])");
  if (nextTile == null) {
    return;
  }

  nextTile.dataset.letter = letter;
  nextTile.dataset.state = "active";
  nextTile.textContent = letter.toLocaleUpperCase("pl-PL");
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
  const evaluation = evaluateGuess(guess, targetEntry.display);
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
  const keyLetter = letter.toLocaleUpperCase("pl-PL");
  const key = keyboard.querySelector(`[data-key="${keyLetter}"]`);
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
  if (guess === targetEntry.display) {
    isGameOver = true;
    showAlert(
      `Brawo! Hasło to ${targetEntry.display.toLocaleUpperCase("pl-PL")}!`,
      2600
    );
    danceTiles(tiles);
    launchCelebration();
    return;
  }

  const remainingTiles = guessGrid.querySelectorAll(".tile:not([data-letter])");
  if (remainingTiles.length === 0) {
    isGameOver = true;
    showAlert(
      `Szukane słowo: ${targetEntry.display.toLocaleUpperCase("pl-PL")}`,
      null
    );
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
