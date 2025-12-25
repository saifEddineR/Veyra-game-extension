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

async function sendDamageRequest(monsterId) {
  return fetch("https://demonicscans.org/damage.php", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      monster_id: monsterId,
      skill_id: "0",
      stamina_cost: "1",
    }),
  });
}

/**
 * Core attack function
 * Used by navbar & monster-card buttons
 */
async function joinAndAttackById({ monsterId, hits = 3 }) {
  if (!monsterId) {
    console.warn("No monster ID provided");
    return;
  }

  const USER_ID = "122747"; // make dynamic later

  const join = await joinBattle(monsterId, USER_ID);
  if (!join.success) {
    console.warn("Join failed for monster", monsterId);
    return;
  }

  for (let i = 0; i < hits; i++) {
    await sendDamageRequest(monsterId);
  }

  window.location.reload();
}
