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
const gameOverBar = document.querySelector("[data-game-over-bar]");
const gameOverMessage = document.querySelector("[data-game-over-message]");
const nextGameBtn = document.querySelector("[data-next-game-btn]");
const shareBtn = document.querySelector("[data-share-btn]");
const statsToggle = document.querySelector("[data-stats-toggle]");
const statsBackdrop = document.querySelector("[data-stats-backdrop]");
const statsCloseBtn = document.querySelector("[data-stats-close]");
const statsDistribution = document.querySelector("[data-stats-distribution]");

const WORD_LENGTH = 5;
const FLIP_STEP_DURATION = 320;
const DANCE_ANIMATION_DURATION = 500;
const PROVERB_SCROLL_SPEED_PX_PER_SEC = 43;
const PROVERB_SCROLL_PADDING_PX = 24;
const PROVERB_MIN_DURATION_MS = 4000;
const PAGER_RESIZE_RESTART_THRESHOLD_PX = 8;
const TARGET_ROTATION_STORAGE_KEY = "wordle-polish-target-list-v2";
const STATS_STORAGE_KEY = "wordle-polish-stats-v1";
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
const WORD_BANK_BY_DISPLAY = new Map(
  WORD_BANK.map((entry) => [entry.display, entry])
);
const VALID_GUESSES = new Set(parsedWordBank.map((entry) => entry.display));
let targetEntry = pickTargetEntry();

let hasStarted = false;
let isLocked = false;
let isGameOver = false;
let guessHistory = [];
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
  bindStatsModal();
  bindGameOverBar();
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

  const remainingWordCount = getRemainingWordCount();
  wordCountBadge.textContent = `Pozostało ${remainingWordCount} z ${WORD_BANK.length} słów na liście`;
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
    "Powodzenia! Słowo znika z listy dopiero po poprawnym odgadnięciu.",
    2400
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

  const resolvedRotation = resolveCurrentTargetRotationState(
    readTargetRotationState()
  );
  writeTargetRotationState(resolvedRotation);

  return WORD_BANK_BY_DISPLAY.get(resolvedRotation.currentWord) ?? WORD_BANK[0];
}

function readTargetRotationState() {
  try {
    const rawState = window.localStorage.getItem(TARGET_ROTATION_STORAGE_KEY);
    if (rawState == null) {
      return createEmptyTargetRotationState();
    }

    return normalizeTargetRotationState(JSON.parse(rawState));
  } catch (error) {
    return createEmptyTargetRotationState();
  }
}

function writeTargetRotationState(state) {
  try {
    window.localStorage.setItem(
      TARGET_ROTATION_STORAGE_KEY,
      JSON.stringify({
        currentWord: state.currentWord,
        remainingWords: state.remainingWords,
        solvedWords: state.solvedWords,
      })
    );
  } catch (error) {
    // Ignore storage write failures and keep the current in-memory target.
  }
}

function resolveCurrentTargetRotationState(state) {
  const normalizedState = normalizeTargetRotationState(state);
  if (
    normalizedState.currentWord != null &&
    WORD_BANK_BY_DISPLAY.has(normalizedState.currentWord)
  ) {
    return normalizedState;
  }

  if (normalizedState.remainingWords.length === 0) {
    return refillTargetRotationState(normalizedState);
  }

  const [currentWord, ...remainingWords] = normalizedState.remainingWords;
  return {
    currentWord,
    remainingWords,
    solvedWords: normalizedState.solvedWords,
  };
}

function refillTargetRotationState(state) {
  let solvedWords = [...state.solvedWords];
  const solvedSet = new Set(solvedWords);
  let availableWords = WORD_BANK.map((entry) => entry.display).filter(
    (word) => !solvedSet.has(word)
  );

  if (availableWords.length === 0) {
    solvedWords = [];
    availableWords = WORD_BANK.map((entry) => entry.display);
  }

  const shuffledWords = shuffleArray([...availableWords]);

  return {
    currentWord: shuffledWords.shift() ?? WORD_BANK[0].display,
    remainingWords: shuffledWords,
    solvedWords,
  };
}

function markTargetWordAsSolved(word) {
  const normalizedWord = normalizeWord(word);
  const resolvedRotation = resolveCurrentTargetRotationState(
    readTargetRotationState()
  );

  if (resolvedRotation.currentWord !== normalizedWord) {
    return getRemainingWordCount(resolvedRotation);
  }

  const solvedWords = resolvedRotation.solvedWords.includes(normalizedWord)
    ? [...resolvedRotation.solvedWords]
    : [...resolvedRotation.solvedWords, normalizedWord];
  const nextRotation = normalizeTargetRotationState({
    currentWord: null,
    remainingWords: resolvedRotation.remainingWords,
    solvedWords,
  });

  writeTargetRotationState(nextRotation);
  return getRemainingWordCount(nextRotation);
}

function getRemainingWordCount(state = readTargetRotationState()) {
  const normalizedState = normalizeTargetRotationState(state);
  return (
    normalizedState.remainingWords.length +
    (normalizedState.currentWord != null ? 1 : 0)
  );
}

function normalizeTargetRotationState(state) {
  if (state == null || typeof state !== "object") {
    return createEmptyTargetRotationState();
  }

  const solvedWords = Array.isArray(state.solvedWords)
    ? sanitizeStoredWords(state.solvedWords)
    : [];
  const excludedWords = new Set(solvedWords);
  const rawCurrentWord =
    typeof state.currentWord === "string" ? normalizeWord(state.currentWord) : null;
  const currentWord =
    rawCurrentWord != null &&
    WORD_BANK_BY_DISPLAY.has(rawCurrentWord) &&
    !excludedWords.has(rawCurrentWord)
      ? rawCurrentWord
      : null;

  if (currentWord != null) {
    excludedWords.add(currentWord);
  }

  const remainingWords = Array.isArray(state.remainingWords)
    ? sanitizeStoredWords(state.remainingWords, excludedWords)
    : [];

  return {
    currentWord,
    remainingWords,
    solvedWords,
  };
}

function sanitizeStoredWords(words, excludedWords = new Set()) {
  const seen = new Set();
  const sanitizedWords = [];

  for (const word of words) {
    if (typeof word !== "string") {
      continue;
    }

    const normalizedWord = normalizeWord(word);
    if (
      excludedWords.has(normalizedWord) ||
      !WORD_BANK_BY_DISPLAY.has(normalizedWord) ||
      seen.has(normalizedWord)
    ) {
      continue;
    }

    seen.add(normalizedWord);
    sanitizedWords.push(normalizedWord);
  }

  return sanitizedWords;
}

function createEmptyTargetRotationState() {
  return {
    currentWord: null,
    remainingWords: [],
    solvedWords: [],
  };
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
  guessHistory.push({ guess, evaluation: [...evaluation] });
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
    const remainingWordCount = markTargetWordAsSolved(targetEntry.display);
    syncWordCountBadge();
    recordGameResult(true, guessHistory.length);
    showAlert(
      remainingWordCount === 0
        ? `Brawo! Hasło to ${targetEntry.display.toLocaleUpperCase("pl-PL")}! To było ostatnie słowo na liście.`
        : `Brawo! Hasło to ${targetEntry.display.toLocaleUpperCase("pl-PL")}! Skreślone z listy, pozostało ${remainingWordCount}.`,
      3200
    );
    danceTiles(tiles);
    launchCelebration();
    showGameOverBar(true);
    return;
  }

  const remainingTiles = guessGrid.querySelectorAll(".tile:not([data-letter])");
  if (remainingTiles.length === 0) {
    isGameOver = true;
    recordGameResult(false, guessHistory.length);
    showAlert(
      `Szukane słowo: ${targetEntry.display.toLocaleUpperCase("pl-PL")}`,
      5000
    );
    showGameOverBar(false);
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

function showGameOverBar(isWin) {
  if (gameOverBar == null || gameOverMessage == null) {
    return;
  }

  gameOverMessage.textContent = isWin
    ? "Gratulacje! Udało Ci się!"
    : `Nie udało się. Hasło: ${targetEntry.display.toLocaleUpperCase("pl-PL")}`;
  gameOverBar.classList.add("is-visible");
  gameOverBar.setAttribute("aria-hidden", "false");
}

function hideGameOverBar() {
  if (gameOverBar == null) {
    return;
  }

  gameOverBar.classList.remove("is-visible");
  gameOverBar.setAttribute("aria-hidden", "true");
}

function bindGameOverBar() {
  if (nextGameBtn != null) {
    nextGameBtn.addEventListener("click", startNextGame);
  }

  if (shareBtn != null) {
    shareBtn.addEventListener("click", shareResults);
  }
}

function startNextGame() {
  hideGameOverBar();

  const allTiles = guessGrid.querySelectorAll(".tile");
  allTiles.forEach((tile) => {
    tile.textContent = "";
    delete tile.dataset.letter;
    delete tile.dataset.state;
    tile.classList.remove("flip", "reveal", "shake", "dance");
  });

  const allKeys = keyboard.querySelectorAll("[data-key]");
  allKeys.forEach((key) => {
    const currentState = key.dataset.state;
    if (currentState != null) {
      key.classList.remove(currentState);
      delete key.dataset.state;
    }
  });

  const alerts = alertContainer.querySelectorAll(".alert");
  alerts.forEach((alert) => alert.remove());

  targetEntry = pickTargetEntry();
  isGameOver = false;
  isLocked = false;
  guessHistory = [];

  syncWordCountBadge();
  showAlert("Nowe słowo! Powodzenia!", 1800);
}

function isCurrentGameWon() {
  return guessHistory.length > 0 &&
    guessHistory[guessHistory.length - 1].guess === targetEntry.display;
}

function shareResults() {
  if (guessHistory.length === 0) {
    return;
  }

  const isWin = isCurrentGameWon();
  const scoreText = isWin ? `${guessHistory.length}/6` : "X/6";
  const header = `Wordle PL 🌷 ${scoreText}`;

  const emojiGrid = guessHistory
    .map((entry) =>
      entry.evaluation
        .map((state) => {
          if (state === "correct") return "🟩";
          if (state === "wrong-location") return "🟨";
          return "⬛";
        })
        .join("")
    )
    .join("\n");

  const shareText = `${header}\n\n${emojiGrid}`;

  if (navigator.clipboard != null && navigator.clipboard.writeText != null) {
    navigator.clipboard.writeText(shareText).then(
      () => showAlert("Skopiowano do schowka!", 1400),
      () => showAlert("Nie udało się skopiować", 1400)
    );
  } else {
    showAlert("Schowek niedostępny", 1400);
  }
}

function bindStatsModal() {
  if (statsToggle != null) {
    statsToggle.addEventListener("click", openStatsModal);
  }

  if (statsCloseBtn != null) {
    statsCloseBtn.addEventListener("click", closeStatsModal);
  }

  if (statsBackdrop != null) {
    statsBackdrop.addEventListener("click", (event) => {
      if (event.target === statsBackdrop) {
        closeStatsModal();
      }
    });
  }
}

function openStatsModal() {
  if (statsBackdrop == null) {
    return;
  }

  renderStats();
  statsBackdrop.classList.add("is-visible");
  statsBackdrop.setAttribute("aria-hidden", "false");
}

function closeStatsModal() {
  if (statsBackdrop == null) {
    return;
  }

  statsBackdrop.classList.remove("is-visible");
  statsBackdrop.setAttribute("aria-hidden", "true");
}

function readStats() {
  try {
    const rawStats = window.localStorage.getItem(STATS_STORAGE_KEY);
    if (rawStats == null) {
      return createEmptyStats();
    }

    const parsed = JSON.parse(rawStats);
    return normalizeStats(parsed);
  } catch {
    return createEmptyStats();
  }
}

function writeStats(stats) {
  try {
    window.localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage write failures.
  }
}

function createEmptyStats() {
  return {
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  };
}

function normalizeStats(raw) {
  if (raw == null || typeof raw !== "object") {
    return createEmptyStats();
  }

  const played = typeof raw.played === "number" && raw.played >= 0 ? Math.floor(raw.played) : 0;
  const wins = typeof raw.wins === "number" && raw.wins >= 0 ? Math.min(Math.floor(raw.wins), played) : 0;
  const currentStreak = typeof raw.currentStreak === "number" && raw.currentStreak >= 0 ? Math.floor(raw.currentStreak) : 0;
  const maxStreak = typeof raw.maxStreak === "number" && raw.maxStreak >= 0 ? Math.max(Math.floor(raw.maxStreak), currentStreak) : currentStreak;

  const distribution = {};
  for (let i = 1; i <= 6; i += 1) {
    const rawVal = raw.distribution != null ? raw.distribution[i] : 0;
    distribution[i] = typeof rawVal === "number" && rawVal >= 0 ? Math.floor(rawVal) : 0;
  }

  return { played, wins, currentStreak, maxStreak, distribution };
}

function recordGameResult(isWin, guessCount) {
  const stats = readStats();
  stats.played += 1;

  if (isWin) {
    stats.wins += 1;
    stats.currentStreak += 1;
    if (stats.currentStreak > stats.maxStreak) {
      stats.maxStreak = stats.currentStreak;
    }
    const clampedGuessCount = Math.max(1, Math.min(guessCount, 6));
    stats.distribution[clampedGuessCount] = (stats.distribution[clampedGuessCount] ?? 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  writeStats(stats);
}

function renderStats() {
  const stats = readStats();

  const playedEl = document.querySelector("[data-stat-played]");
  const winPctEl = document.querySelector("[data-stat-win-pct]");
  const streakEl = document.querySelector("[data-stat-streak]");
  const maxStreakEl = document.querySelector("[data-stat-max-streak]");

  if (playedEl != null) playedEl.textContent = String(stats.played);
  if (winPctEl != null) {
    const pct = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
    winPctEl.textContent = String(pct);
  }
  if (streakEl != null) streakEl.textContent = String(stats.currentStreak);
  if (maxStreakEl != null) maxStreakEl.textContent = String(stats.maxStreak);

  if (statsDistribution == null) {
    return;
  }

  statsDistribution.innerHTML = "";
  const maxCount = Math.max(1, ...Object.values(stats.distribution));

  const lastWinGuess = isGameOver && isCurrentGameWon()
    ? guessHistory.length
    : null;

  for (let i = 1; i <= 6; i += 1) {
    const count = stats.distribution[i] ?? 0;
    const pct = Math.max(8, (count / maxCount) * 100);

    const row = document.createElement("div");
    row.className = "dist-row";

    const label = document.createElement("span");
    label.className = "dist-label";
    label.textContent = String(i);

    const bar = document.createElement("div");
    bar.className = "dist-bar";
    if (lastWinGuess === i) {
      bar.classList.add("is-highlight");
    }
    bar.style.width = `${pct}%`;
    bar.textContent = String(count);

    row.appendChild(label);
    row.appendChild(bar);
    statsDistribution.appendChild(row);
  }
}

function wait(duration) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });
}
