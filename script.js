/* ---------- Game library data (edit this list) ---------- */
const games = [
  { title: "Neon Drift",     genre: "Racing",    color: ["#ff5c7a", "#7b2ff7"], desc: "Slide through rain-soaked city circuits at midnight." },
  { title: "Block Bandits",  genre: "Puzzle",    color: ["#3dd6d0", "#2a6fdb"], desc: "Steal the vault by rearranging its walls, one block at a time." },
  { title: "Star Forge",     genre: "Strategy",  color: ["#ffd23f", "#ff7b00"], desc: "Build a fleet, claim asteroid belts, outsmart rival captains." },
  { title: "Moss & Mortar",  genre: "Puzzle",    color: ["#7bd88f", "#1b7f5c"], desc: "Grow a tiny village on the back of a sleeping giant." },
  { title: "Rift Runners",   genre: "Action",    color: ["#ff5c7a", "#ff9a3d"], desc: "Dash, dodge and rewind time in fast co-op arenas." },
  { title: "Tidal Kings",    genre: "Strategy",  color: ["#3dd6d0", "#1b3a8a"], desc: "Rule the seas by trading, scouting and timing the tide." },
  { title: "Turbo Tortoise", genre: "Racing",    color: ["#ffd23f", "#e0467c"], desc: "Slow and steady? Not this time. Upgrade your shell and go." },
  { title: "Pixel Brawl",    genre: "Action",    color: ["#9b6bff", "#ff5c7a"], desc: "Four-player platform fights with ten-second rounds." }
];

/* ---------- Games grid + filters ---------- */
const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const genres = ["All", ...new Set(games.map(g => g.genre))];
let activeGenre = "All";

function renderFilters() {
  filtersEl.innerHTML = "";
  genres.forEach(genre => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = genre;
    btn.setAttribute("aria-pressed", genre === activeGenre);
    btn.addEventListener("click", () => {
      activeGenre = genre;
      renderFilters();
      renderGames();
    });
    filtersEl.appendChild(btn);
  });
}

function renderGames() {
  const list = activeGenre === "All" ? games : games.filter(g => g.genre === activeGenre);
  grid.innerHTML = list.map(g => `
    <article class="card">
      <div class="card-art" style="background: linear-gradient(135deg, ${g.color[0]}, ${g.color[1]})">${g.title[0]}</div>
      <div class="card-body">
        <span class="genre">${g.genre}</span>
        <h3>${g.title}</h3>
        <p>${g.desc}</p>
        <a href="#" class="play">Play ${g.title}</a>
      </div>
    </article>
  `).join("");
}

/* ---------- Target practice mini game ---------- */
const arena = document.getElementById("arena");
const arenaMsg = document.getElementById("arenaMsg");
const startBtn = document.getElementById("startBtn");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const bestEl = document.getElementById("best");

const ROUND_SECONDS = 15;
let score = 0, timeLeft = ROUND_SECONDS, tickTimer = null, spawnTimer = null;

function loadBest() {
  try { return Number(localStorage.getItem("respawn-best")) || 0; } catch (e) { return 0; }
}
function saveBest(value) {
  try { localStorage.setItem("respawn-best", value); } catch (e) { /* storage unavailable */ }
}
let best = loadBest();
bestEl.textContent = best;

function spawnTarget() {
  arena.querySelectorAll(".target").forEach(t => t.remove());
  const t = document.createElement("button");
  t.type = "button";
  t.className = "target";
  t.setAttribute("aria-label", "Target");
  const size = 64;
  t.style.left = Math.random() * (arena.clientWidth - size) + "px";
  t.style.top = Math.random() * (arena.clientHeight - size) + "px";
  t.addEventListener("click", () => {
    score++;
    scoreEl.textContent = score;
    spawnTarget();
  });
  arena.appendChild(t);
}

function endRound() {
  clearInterval(tickTimer);
  clearInterval(spawnTimer);
  arena.querySelectorAll(".target").forEach(t => t.remove());
  if (score > best) {
    best = score;
    bestEl.textContent = best;
    saveBest(best);
    arenaMsg.textContent = `New best: ${score} targets! Play again to beat it.`;
  } else {
    arenaMsg.textContent = `Time's up. You hit ${score} targets.`;
  }
  arenaMsg.hidden = false;
  startBtn.disabled = false;
  startBtn.textContent = "Play again";
}

function startRound() {
  score = 0;
  timeLeft = ROUND_SECONDS;
  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;
  arenaMsg.hidden = true;
  startBtn.disabled = true;
  spawnTarget();
  spawnTimer = setInterval(spawnTarget, 1100); // target moves if you wait too long
  tickTimer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;
    if (timeLeft <= 0) endRound();
  }, 1000);
}
startBtn.addEventListener("click", startRound);

/* ---------- Email signup (front-end validation only) ---------- */
const form = document.getElementById("signup");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  formMsg.className = "form-msg " + (valid ? "ok" : "err");
  formMsg.textContent = valid
    ? "You're on the list. Watch your inbox for the next release."
    : "Enter a valid email address, like you@example.com.";
  if (valid) form.reset();
});

renderFilters();
renderGames();
