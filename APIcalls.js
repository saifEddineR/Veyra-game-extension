// Create namespace (safe if file is loaded multiple times)
window.APIcalls = window.APIcalls || {};

/**
 * Fetch active_wave HTML
 * Runs ONLY when URL contains /active_wave.php
 * Returns full HTML text
 */
window.APIcalls.fetchActiveWaveHTML = async function () {
  if (!window.location.pathname.includes("active_wave.php")) {
    return null;
  }

  // Keep ALL query params (gate, wave, event, etc.)
  const query = window.location.search || "";

  const url = `/active_wave.php${query}`;

  const res = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
  });

  return await res.text();
};

// loot guild mob
window.APIcalls.lootDungeon = async function ({ dgmid, instance_id, user_id }) {
  return fetch("/dungeon_loot.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      instance_id,
      dgmid,
      user_id: user_id,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("data", data);
      if (data.status === "success") {
        window.newContent.showLootPopup(data);
      }
    })
    .catch(() => {});
};
