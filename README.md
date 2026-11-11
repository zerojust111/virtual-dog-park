# 🐶 Virtual Dog Park

A tiny browser game: adopt a virtual dog, feed it, play with it, and watch it grow from
**Puppy** to **Park Legend**. Progress is saved in the browser, so it survives a reload.

Built in tested rounds — one Git commit per round.

---

## Play

Option 1 — double-click `index.html`.

Option 2 — serve the folder (closer to a real website):

```powershell
py -m http.server 8000
# then open http://localhost:8000
```

## How to play

1. **Adopt** — pick any dog in the encyclopedia and press *Adopt me*.
2. **Feed** — 🍖 raises hunger by 2 and gives **1 XP**.
3. **Play** — 🎾 raises happiness by 2, lowers hunger by 1, and gives **2 XP**.
4. **Grow** — XP moves you through four stages:

   | Stage | XP needed |
   | --- | --- |
   | 🐾 Puppy | 0 |
   | 🐕 Young Dog | 10 |
   | 🦮 Adult Dog | 25 |
   | 👑 Park Legend | 50 |

5. **Come back later** — the game is saved to `localStorage` after every action.
   *Change dog* starts a new dog (0 XP). *Reset progress* deletes the save.

Stats are clamped to `0–10`, so feeding a full dog or playing with a happy dog cannot overflow.

---

## Files

| File | Role |
| --- | --- |
| `index.html` | Structure: header, encyclopedia list, care panel |
| `style.css` | Appearance: colours, cards, stat bars, small-screen layout |
| `script.js` | Behaviour: data, state, actions, saving, rendering |
| `README.md` | This file |
| `.gitignore` | Keeps system files, secrets and build output out of Git |

The HTML is static: every dog card and every stat number is written by JavaScript.
`script.js` is organised in numbered sections — data → state → elements → helpers → save →
render → actions → events → start.

---

## Rounds and commits

| Round | Visible result | Commit message |
| --- | --- | --- |
| Setup | Header, empty panels, Git history | `chore: initialize virtual dog park` |
| 1 | Dog encyclopedia (4 cards) | `feat: add dog encyclopedia` |
| 2 | Adoption, Feed, Play, stat bars | `feat: add virtual dog adoption and care` |
| 3 | XP, growth stages, saved progress | `feat: add dog growth and saved progress` |
| Review | README, final test | `docs: finish instructions and final review` |

Check the history with:

```powershell
git log --oneline
```

---

## Development workflow used

```powershell
git status                 # see what changed
git add <files>            # stage intentionally
git commit -m "feat: ..."  # save a working checkpoint
git push                   # send commits to GitHub
```

Test first → inspect changes → stage intentionally → commit a working checkpoint → push when ready.

---

## Final test checklist

- [x] Page loads with no console errors.
- [x] Encyclopedia shows all 4 dogs with breed, age and trait.
- [x] *Adopt me* fills the care panel with the chosen dog.
- [x] *Feed* raises hunger and XP; *Play* raises happiness, lowers hunger, raises XP.
- [x] Stats stop at 10 and never go below 0.
- [x] XP 10 switches the badge to 🐕 Young Dog and the bar refills for the next stage.
- [x] Reloading the page restores the dog, stats and XP.
- [x] *Change dog* and *Reset progress* clear the right things.
- [x] Layout still works on a narrow window (cards stack, buttons wrap).
