/* Virtual Dog Park — script (round 3: growth + saved progress)
   New in this round: experience points, growth stages, and localStorage. */

/* ---------- 1. Data: the dogs of the park ---------- */
const DOGS = [
  {
    id: "biscuit",
    name: "Biscuit",
    breed: "Corgi",
    age: "2 years",
    trait: "Born snack detective",
    emoji: "🐕"
  },
  {
    id: "mochi",
    name: "Mochi",
    breed: "Shiba Inu",
    age: "1 year",
    trait: "Sleeps in sunbeams",
    emoji: "🐶"
  },
  {
    id: "pepper",
    name: "Pepper",
    breed: "Border Collie",
    age: "3 years",
    trait: "Fetches everything twice",
    emoji: "🦮"
  },
  {
    id: "tofu",
    name: "Tofu",
    breed: "Pug",
    age: "4 years",
    trait: "Professional couch tester",
    emoji: "🐩"
  }
];

/* ---------- 2. Growth stages: name + XP needed ---------- */
const STAGES = [
  { name: "Puppy", minXp: 0, emoji: "🐾" },
  { name: "Young Dog", minXp: 10, emoji: "🐕" },
  { name: "Adult Dog", minXp: 25, emoji: "🦮" },
  { name: "Park Legend", minXp: 50, emoji: "👑" }
];

const XP_PER_FEED = 1;
const XP_PER_PLAY = 2;

/* ---------- 3. State: the only thing that changes over time ---------- */
const MAX_STAT = 10;
const SAVE_KEY = "virtual-dog-park-save";

const state = {
  adoptedId: null,   // 还没有狗
  hunger: 5,         // 0 = 饿坏了, 10 = 很饱
  happiness: 5,      // 0 = 不开心, 10 = 很开心
  xp: 0              // 经验值：决定成长阶段
};

/* ---------- 4. Elements ---------- */
const dogList = document.getElementById("dog-list");

const careEmpty = document.getElementById("care-empty");
const careDog = document.getElementById("care-dog");
const careEmoji = document.getElementById("care-emoji");
const careName = document.getElementById("care-name");
const careMeta = document.getElementById("care-meta");
const hungerBar = document.getElementById("hunger-bar");
const hungerValue = document.getElementById("hunger-value");
const happinessBar = document.getElementById("happiness-bar");
const happinessValue = document.getElementById("happiness-value");
const stageBadge = document.getElementById("stage-badge");
const xpBar = document.getElementById("xp-bar");
const xpValue = document.getElementById("xp-value");
const nextStageText = document.getElementById("next-stage");
const careMessage = document.getElementById("care-message");

const feedButton = document.getElementById("feed-btn");
const playButton = document.getElementById("play-btn");
const releaseButton = document.getElementById("release-btn");
const resetButton = document.getElementById("reset-btn");

/* ---------- 5. Helpers ---------- */
// 保证数值永远留在 0–10 之间
function clamp(value) {
  return Math.max(0, Math.min(MAX_STAT, value));
}

function getAdoptedDog() {
  return DOGS.find(function (dog) {
    return dog.id === state.adoptedId;
  });
}

// 根据经验值找出当前阶段（取最后一个达到门槛的阶段）
function getStage(xp) {
  let current = STAGES[0];
  STAGES.forEach(function (stage) {
    if (xp >= stage.minXp) current = stage;
  });
  return current;
}

// 下一阶段：已经满级时返回 null
function getNextStage(stage) {
  const index = STAGES.indexOf(stage);
  return STAGES[index + 1] || null;
}

/* ---------- 6. Saving: localStorage keeps progress after closing the tab ---------- */
function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function loadState() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;

  try {
    const saved = JSON.parse(raw);

    // 只接受仍存在的狗狗，避免旧存档指向已删除的狗
    if (saved.adoptedId === null || getDogById(saved.adoptedId)) {
      state.adoptedId = saved.adoptedId ?? null;
      state.hunger = clamp(Number(saved.hunger) || 5);
      state.happiness = clamp(Number(saved.happiness) || 5);
      state.xp = Math.max(0, Number(saved.xp) || 0);
    }
  } catch (error) {
    // 存档损坏就丢弃，游戏仍然能玩
    console.warn("Could not read saved game:", error);
  }
}

function getDogById(dogId) {
  return DOGS.find(function (dog) {
    return dog.id === dogId;
  });
}

/* ---------- 7. Encyclopedia ---------- */
function createDogCard(dog) {
  const item = document.createElement("li");
  item.className = "dog-card";
  item.innerHTML = `
    <span class="dog-emoji" aria-hidden="true">${dog.emoji}</span>
    <h3>${dog.name}</h3>
    <p class="dog-meta">${dog.breed} · ${dog.age}</p>
    <p class="dog-trait">${dog.trait}</p>
    <button class="btn adopt-btn" type="button" data-dog-id="${dog.id}">
      Adopt me
    </button>
  `;
  return item;
}

function renderDogs() {
  dogList.innerHTML = "";
  DOGS.forEach(function (dog) {
    dogList.appendChild(createDogCard(dog));
  });
}

/* ---------- 8. Care panel ---------- */
function renderCare() {
  const dog = getAdoptedDog();

  // 没有领养：显示提示，隐藏面板
  if (!dog) {
    careEmpty.hidden = false;
    careDog.hidden = true;
    return;
  }

  careEmpty.hidden = true;
  careDog.hidden = false;

  careEmoji.textContent = dog.emoji;
  careName.textContent = dog.name;
  careMeta.textContent = `${dog.breed} · ${dog.age}`;

  hungerBar.style.width = `${(state.hunger / MAX_STAT) * 100}%`;
  hungerValue.textContent = `${state.hunger}/${MAX_STAT}`;

  happinessBar.style.width = `${(state.happiness / MAX_STAT) * 100}%`;
  happinessValue.textContent = `${state.happiness}/${MAX_STAT}`;

  // 成长进度
  const stage = getStage(state.xp);
  const next = getNextStage(stage);

  stageBadge.textContent = `${stage.emoji} ${stage.name}`;
  xpValue.textContent = `${state.xp} XP`;

  if (next) {
    // 当前阶段内的完成比例
    const span = next.minXp - stage.minXp;
    const done = state.xp - stage.minXp;
    xpBar.style.width = `${(done / span) * 100}%`;
    nextStageText.textContent =
      `${span - done} XP until ${next.emoji} ${next.name}`;
  } else {
    xpBar.style.width = "100%";
    nextStageText.textContent = "Maximum stage reached — the park legend!";
  }
}

/* ---------- 9. Actions ---------- */
function adoptDog(dogId) {
  state.adoptedId = dogId;
  state.hunger = 5;
  state.happiness = 5;
  state.xp = 0;

  const dog = getAdoptedDog();
  careMessage.textContent = `${dog.name} is now yours. Say hello! 🎉`;
  saveState();
  renderCare();
}

function feedDog() {
  const dog = getAdoptedDog();
  if (!dog) return;

  state.hunger = clamp(state.hunger + 2);
  state.xp += XP_PER_FEED;

  careMessage.textContent = `${dog.name} happily eats the snack. 🍖`;
  saveState();
  renderCare();
}

function playWithDog() {
  const dog = getAdoptedDog();
  if (!dog) return;

  state.happiness = clamp(state.happiness + 2);
  state.hunger = clamp(state.hunger - 1); // 玩累了也会饿
  state.xp += XP_PER_PLAY;

  careMessage.textContent = `${dog.name} chases the ball around the park. 🎾`;
  saveState();
  renderCare();
}

function releaseDog() {
  state.adoptedId = null;
  state.hunger = 5;
  state.happiness = 5;
  state.xp = 0;
  careMessage.textContent = "";
  saveState();
  renderCare();
}

function resetProgress() {
  localStorage.removeItem(SAVE_KEY);
  state.adoptedId = null;
  state.hunger = 5;
  state.happiness = 5;
  state.xp = 0;
  careMessage.textContent = "Save deleted. The park is empty again.";
  renderCare();
}

/* ---------- 10. Events ---------- */
// 事件委托：一个监听器处理所有 “Adopt me” 按钮
dogList.addEventListener("click", function (event) {
  const button = event.target.closest(".adopt-btn");
  if (!button) return;
  adoptDog(button.dataset.dogId);
});

feedButton.addEventListener("click", feedDog);
playButton.addEventListener("click", playWithDog);
releaseButton.addEventListener("click", releaseDog);
resetButton.addEventListener("click", resetProgress);

/* ---------- 11. Start ---------- */
loadState();
renderDogs();
renderCare();

// 有存档时告诉用户进度被恢复了
const savedDog = getAdoptedDog();
if (savedDog) {
  careMessage.textContent =
    `Welcome back! ${savedDog.name} still remembers you. 💾`;
}
