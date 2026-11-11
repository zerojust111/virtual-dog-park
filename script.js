/* Virtual Dog Park — script (round 2: adoption + feed + play)
   New in this round: a small state object, and buttons that change it. */

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

/* ---------- 2. State: the only thing that changes over time ---------- */
const MAX_STAT = 10;

const state = {
  adoptedId: null,   // 还没有狗
  hunger: 5,         // 0 = 饿坏了, 10 = 很饱
  happiness: 5       // 0 = 不开心, 10 = 很开心
};

/* ---------- 3. Elements ---------- */
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
const careMessage = document.getElementById("care-message");

const feedButton = document.getElementById("feed-btn");
const playButton = document.getElementById("play-btn");
const releaseButton = document.getElementById("release-btn");

/* ---------- 4. Helpers ---------- */
// 保证数值永远留在 0–10 之间
function clamp(value) {
  return Math.max(0, Math.min(MAX_STAT, value));
}

function getAdoptedDog() {
  return DOGS.find(function (dog) {
    return dog.id === state.adoptedId;
  });
}

/* ---------- 5. Encyclopedia ---------- */
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

/* ---------- 6. Care panel ---------- */
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
}

/* ---------- 7. Actions ---------- */
function adoptDog(dogId) {
  state.adoptedId = dogId;
  state.hunger = 5;
  state.happiness = 5;

  const dog = getAdoptedDog();
  careMessage.textContent = `${dog.name} is now yours. Say hello! 🎉`;
  renderCare();
}

function feedDog() {
  const dog = getAdoptedDog();
  if (!dog) return;

  state.hunger = clamp(state.hunger + 2);
  careMessage.textContent = `${dog.name} happily eats the snack. 🍖`;
  renderCare();
}

function playWithDog() {
  const dog = getAdoptedDog();
  if (!dog) return;

  state.happiness = clamp(state.happiness + 2);
  state.hunger = clamp(state.hunger - 1); // 玩累了也会饿
  careMessage.textContent = `${dog.name} chases the ball around the park. 🎾`;
  renderCare();
}

function releaseDog() {
  state.adoptedId = null;
  state.hunger = 5;
  state.happiness = 5;
  careMessage.textContent = "";
  renderCare();
}

/* ---------- 8. Events ---------- */
// 事件委托：一个监听器处理所有 “Adopt me” 按钮
dogList.addEventListener("click", function (event) {
  const button = event.target.closest(".adopt-btn");
  if (!button) return;
  adoptDog(button.dataset.dogId);
});

feedButton.addEventListener("click", feedDog);
playButton.addEventListener("click", playWithDog);
releaseButton.addEventListener("click", releaseDog);

/* ---------- 9. Start ---------- */
renderDogs();
renderCare();
