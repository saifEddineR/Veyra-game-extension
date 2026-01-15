/* ───── UTIL ───── */

function getMonsterIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getBattleParamsFromUrl() {
  const params = new URLSearchParams(window.location.search);

  // Normal monster battle
  if (params.has("id")) {
    return {
      type: "monster",
      monster_id: params.get("id"),
    };
  }

  // Dungeon / guild battle
  if (params.has("dgmid") && params.has("instance_id")) {
    return {
      type: "dungeon",
      dgmid: params.get("dgmid"),
      instance_id: params.get("instance_id"),
    };
  }

  return null;
}

/* ───── NETWORK ───── */

async function joinBattle(monsterId, userId) {
  const response = await fetch(
    "https://demonicscans.org/user_join_battle.php",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        monster_id: monsterId,
        user_id: userId,
      }),
    }
  );

  const text = await response.text();

  const success =
    response.ok &&
    !text.toLowerCase().includes("error") &&
    !text.toLowerCase().includes("failed");

  return { success, text };
}

async function sendDamageRequest(skillId = 0, staminaCost = 1, monsterId) {
  const battle = getBattleParamsFromUrl();

  if (!battle && monsterId === undefined) {
    console.warn("No valid battle params in URL");
    return;
  }

  const body = new URLSearchParams({
    skill_id: skillId,
    stamina_cost: staminaCost,
  });

  // Attach correct identifiers
  if (monsterId) {
    body.set("monster_id", monsterId);
  } else if (battle.type === "monster") {
    body.set("monster_id", battle.monster_id);
  } else if (battle.type === "dungeon") {
    body.set("dgmid", battle.dgmid);
    body.set("instance_id", battle.instance_id);
  }

  return fetch("https://demonicscans.org/damage.php", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
}

/* ───── CORE LOGIC ───── */

async function joinAndAttackById({ monsterId, hits = 3 }) {
  if (!monsterId) {
    console.warn("No monster ID provided");
    return;
  }

  const USER_ID = getCookie("demon");
  if (!USER_ID) {
    console.warn("User ID cookie (demon) not found");
    return;
  }

  const join = await joinBattle(monsterId, USER_ID);
  if (!join.success) {
    console.warn("Join failed for monster", monsterId);
    return;
  }

  for (let i = 0; i < hits; i++) {
    await sendDamageRequest(0, 1, monsterId);
  }

  //window.location.reload();
}

/* ───── PUBLIC API ───── */

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const found = cookies.find((row) => row.startsWith(name + "="));
  return found ? found.split("=")[1] : null;
}

function getCurrentUsername() {
  let username = localStorage.getItem("demonic_username");
  if (!username) {
    username = prompt("Enter your DemonicScans username:");
    if (!username) return null;
    localStorage.setItem("demonic_username", username.trim());
  }
  return username;
}

async function lootMonster(monsterId, userId) {
  const response = await fetch("https://demonicscans.org/loot.php", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      monster_id: monsterId,
      user_id: userId,
    }),
  });

  const text = await response.text();

  const success =
    response.ok &&
    !text.toLowerCase().includes("error") &&
    !text.toLowerCase().includes("failed");

  return { success, text };
}

async function sendBattleDamage({ monsterId, skillId, staminaCost }) {
  if (!monsterId) return;

  return fetch("https://demonicscans.org/damage.php", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      monster_id: monsterId,
      skill_id: skillId,
      stamina_cost: staminaCost,
    }),
  });
}

function extractDungeonParams(monElement) {
  const link = monElement.querySelector("a.btn");
  if (!link) return null;

  const url = new URL(link.href, window.location.origin);
  const dgmid = url.searchParams.get("dgmid");
  const instance_id = url.searchParams.get("instance_id");

  if (!dgmid || !instance_id) return null;

  return { dgmid, instance_id };
}

window.DemonicHelper = {
  attackFromUrl(hits, skillId = 0, staminaCost = 1) {
    for (let i = 0; i < hits; i++) {
      sendDamageRequest(skillId, staminaCost);
    }
  },
  attackFromCard(monsterId, hits) {
    joinAndAttackById({ monsterId, hits });
  },
  lootFromCard(monsterId) {
    if (!monsterId) return;

    const USER_ID = getCookie("demon");

    lootMonster(monsterId, USER_ID).then((res) => {
      if (!res.success) {
        console.warn("Loot failed for monster", monsterId);
        return;
      }

      //window.location.reload();
    });
  },
  getCookie: getCookie,
  getMonsterIdFromUrl: getMonsterIdFromUrl,
  sendBattleDamage: sendBattleDamage,
  joinAndAttackById: joinAndAttackById,
  getCurrentUsername: getCurrentUsername,
  extractDungeonParams: extractDungeonParams,
};
