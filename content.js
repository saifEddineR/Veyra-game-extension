// Prevent duplicate injection
if (!document.getElementById("demonic-nav")) {
  window.DemonicHelper.getCurrentUsername();
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
    { name: "🗡️3", url: "/active_wave.php?gate=3&wave=8" },
    { name: "⚔️", url: "/pvp.php" },
    { name: "⚒️", url: "/blacksmith.php" },
    { name: "🏰", url: "guild_dungeon.php" },
    { name: "🛡️", url: "/adventurers_guild.php" },
    { name: "🐾", url: "/pets.php" },
    { name: "🛒", url: "/merchant.php" },
    { name: "🎒", url: "/inventory.php" },
    { name: "📊", url: "/stats.php" },
    { name: "📚", url: "/collections.php" },
    { name: "🏆", url: "/achievements.php" },
    { name: "🎟️", url: "/battle_pass.php" },
  ];

  links.forEach((link) => {
    const btn = document.createElement("button");
    btn.textContent = link.name;
    btn.onclick = () => (window.location.href = link.url);
    nav.appendChild(btn);
  });

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

/* ───── MONSTER CARD ×3 BUTTON ───── */

if (window.location.pathname.includes("active_wave")) {
  window.newContent.injectMonsterCardButtons();
  // repeat every 3 seconds
  setInterval(async () => {
    await window.updateContent.updateActiveWaveContent();
    window.newContent.injectMonsterCardButtons();
  }, 2000);
}

if (window.location.pathname.includes("/guild_dungeon_location.php")) {
  window.newContent.injectGuildDungeonLootIcons();
}

if (window.location.pathname.includes("/battle.php")) {
  window.newContent.dmgMobButton();
}
