// Prevent duplicate injection
if (!document.getElementById("demonic-nav")) {
  const nav = document.createElement("div");
  nav.id = "demonic-nav";

  const toggleBtn = document.createElement("div");
  toggleBtn.id = "demonic-toggle";
  toggleBtn.textContent = "≡";

  /* ───── NAV LINKS ───── */

  const links = [
    { name: "🏠", url: "/game_dash.php" },
    { name: "🗡️1", url: "/active_wave.php?gate=3&wave=3" },
    { name: "🗡️2", url: "/active_wave.php?gate=3&wave=5" },
    { name: "🎄", url: "/active_wave.php?event=4&wave=2" },
    { name: "⚒️", url: "/blacksmith.php" },
    { name: "🏰", url: "guild_dungeon.php" },
    { name: "🛡️", url: "/adventurers_guild.php" },
    { name: "🐾", url: "/pets.php" },
    { name: "🛒", url: "/merchant.php" },
    { name: "🎒", url: "/inventory.php" },
    { name: "📊", url: "/stats.php" },
    { name: "🏆", url: "/achievements.php" },
  ];

  links.forEach((link) => {
    const btn = document.createElement("button");
    btn.textContent = link.name;
    btn.onclick = () => (window.location.href = link.url);
    nav.appendChild(btn);
  });

  /* ───── ATTACK BUTTONS ───── */

  const hit3Btn = document.createElement("button");
  hit3Btn.textContent = "👊 ×3";
  hit3Btn.onclick = () => joinAndAttack({ hits: 3 });

  const hit5Btn = document.createElement("button");
  hit5Btn.textContent = "👊 ×5";
  hit5Btn.onclick = () => joinAndAttack({ hits: 5 });

  nav.appendChild(hit3Btn);
  nav.appendChild(hit5Btn);

  /* ───── REDUCE BUTTON ───── */

  const reduceBtn = document.createElement("button");
  reduceBtn.textContent = "⟨";
  reduceBtn.className = "reduce-btn";

  reduceBtn.onclick = () => {
    nav.classList.add("collapsed");
    toggleBtn.style.display = "flex";
  };

  toggleBtn.onclick = () => {
    nav.classList.remove("collapsed");
    toggleBtn.style.display = "none";
  };

  nav.appendChild(reduceBtn);
  document.body.appendChild(nav);
  document.body.appendChild(toggleBtn);
}

// x3 button for monster-card
if (window.location.pathname.includes("active_wave")) {
  injectMonsterCardButtons();
}

function injectMonsterCardButtons() {
  const cards = document.querySelectorAll(".monster-card[data-monster-id]");
  if (!cards.length) return;

  cards.forEach((card) => {
    if (card.querySelector(".attack-x3-btn")) return;

    const monsterId = card.getAttribute("data-monster-id");

    // Ensure card positioning
    card.style.position = "relative";

    const btn = document.createElement("button");
    btn.textContent = "×3";
    btn.className = "attack-x3-btn";

    btn.onclick = (e) => {
      e.stopPropagation();
      joinAndAttackById({
        monsterId,
        hits: 3,
      });
    };

    card.appendChild(btn);
  });
}
