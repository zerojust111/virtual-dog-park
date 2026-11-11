/* Virtual Dog Park — script (round 1: dog encyclopedia)
   The page is still static HTML; this file only fills the list with cards. */

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

/* ---------- 2. Elements ---------- */
const dogList = document.getElementById("dog-list");

/* ---------- 3. Build one card per dog ---------- */
function createDogCard(dog) {
  const item = document.createElement("li");
  item.className = "dog-card";
  item.innerHTML = `
    <span class="dog-emoji" aria-hidden="true">${dog.emoji}</span>
    <h3>${dog.name}</h3>
    <p class="dog-meta">${dog.breed} · ${dog.age}</p>
    <p class="dog-trait">${dog.trait}</p>
  `;
  return item;
}

/* ---------- 4. Draw the encyclopedia ---------- */
function renderDogs() {
  dogList.innerHTML = "";
  DOGS.forEach(function (dog) {
    dogList.appendChild(createDogCard(dog));
  });
}

renderDogs();
