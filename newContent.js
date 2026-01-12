window.newContent = window.newContent || {};
window.newContent.injectMonsterCardButtons = async function () {
  const cards = document.querySelectorAll(".monster-card[data-monster-id]");
  if (!cards.length) return;

  cards.forEach((card) => {
    const monsterId = card.dataset.monsterId;
    const isDead = card.dataset.dead === "1";

    if (!monsterId) return;

    card.style.position = "relative";

    /** ============================
     *  DEAD → LOOT ONLY
     *  ============================ */
    if (isDead) {
      // Remove attack button if exists
      card.querySelector(".attack-x2-btn")?.remove();
      card.querySelector(".join-battle-btn")?.remove();

      if (!card.querySelector(".loot-btn")) {
        const lootBtn = document.createElement("button");
        lootBtn.textContent = "💰";
        lootBtn.className = "loot-btn";

        lootBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          DemonicHelper.lootFromCard(monsterId);
        };

        card.appendChild(lootBtn);
      }

      return;
    }

    /** ============================
     *  ALIVE → ATTACK + JOIN
     *  ============================ */

    // Remove loot button if exists
    card.querySelector(".loot-btn")?.remove();

    /* ───── ATTACK ×3 BUTTON ───── */
    if (!card.querySelector(".attack-x2-btn")) {
      const attackBtn = document.createElement("button");
      attackBtn.textContent = "×2";
      attackBtn.className = "attack-x2-btn";

      attackBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        DemonicHelper.attackFromCard(monsterId, 2);
      };

      card.appendChild(attackBtn);
    }
    /* ───── ATTACK ×1 BUTTON ───── */
    if (!card.querySelector(".attack-x1-btn")) {
      const attackBtn = document.createElement("button");
      attackBtn.textContent = "×1";
      attackBtn.className = "attack-x1-btn";

      attackBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        DemonicHelper.attackFromCard(monsterId, 1);
      };

      card.appendChild(attackBtn);
    }

    /* ───── JOIN + REDIRECT BUTTON ───── */
    if (!card.querySelector(".join-battle-btn")) {
      const joinBtn = document.createElement("button");
      joinBtn.textContent = "⚔️ Join";
      joinBtn.className = "join-battle-btn";

      joinBtn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Join the battle
        await window.DemonicHelper.joinAndAttackById({
          monsterId,
          hits: 0, // join only
        });

        // Redirect to monster page
        window.location.href = `https://demonicscans.org/battle.php?id=${monsterId}`;
      };

      card.appendChild(joinBtn);
    }
  });
};

window.newContent.injectGuildDungeonLootIcons = function () {
  document.querySelectorAll(".mon.dead").forEach((monElement) => {
    // Must have loot hint
    const lootHint = monElement.querySelector(
      'span[title="You can loot this."]'
    );
    if (!lootHint) return;

    // Prevent duplicate icon
    if (monElement.querySelector(".loot-btn")) return;

    const params = window.DemonicHelper.extractDungeonParams(monElement);
    if (!params) return;

    const lootBtn = document.createElement("button");
    lootBtn.className = "loot-dng-btn";
    lootBtn.textContent = "💰";

    lootBtn.onclick = async (e) => {
      e.preventDefault();
      e.stopPropagation();

      try {
        await window.APIcalls.lootDungeon({
          dgmid: params.dgmid,
          instance_id: params.instance_id,
          user_id: window.DemonicHelper.getCookie("demon"), // or however you expose it
        });
      } catch (err) {
        console.error("[Loot] Failed:", err);
      }
    };
    monElement.appendChild(lootBtn);
  });
};

window.newContent.showLootPopup = function (data) {
  const overlay = document.createElement("div");
  overlay.className = "loot-popup-overlay";

  const popup = document.createElement("div");
  popup.className = "loot-popup";

  popup.innerHTML = `
    <h3>🎁 Loot Acquired</h3>

    <div class="loot-message">
      ${data.message}
    </div>

    ${
      data.items?.length
        ? `
        <div class="loot-items">
          ${data.items
            .map(
              (item) => `
              <div class="loot-item ${item.TIER.toLowerCase()}">
                <img src="/${item.IMAGE_URL}" alt="${item.NAME}">
                <div class="loot-name">${item.NAME}</div>
                <div class="loot-tier">${item.TIER}</div>
              </div>
            `
            )
            .join("")}
        </div>
      `
        : ""
    }

    <button class="loot-close">Close</button>
  `;

  popup.querySelector(".loot-close").onclick = () => {
    overlay.remove();
    window.location.reload();
  };
  overlay.onclick = (e) => e.target === overlay && overlay.remove();

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
};

window.newContent.dmgMobButton = function () {
  const dmgBtns = document.querySelector(".battle-actions-buttons");
  const newDiv = document.createElement("div");

  const hitx80Btn = document.createElement("button");
  hitx80Btn.textContent = "👊 ×80";
  hitx80Btn.onclick = () => DemonicHelper.attackFromUrl(8, -1, 10);
  newDiv.appendChild(hitx80Btn);

  const hitx30Btn = document.createElement("button");
  hitx30Btn.textContent = "👊 ×30";
  hitx30Btn.onclick = () => DemonicHelper.attackFromUrl(3, -1, 10);
  newDiv.appendChild(hitx30Btn);

  const hitx6Btn = document.createElement("button");
  hitx6Btn.textContent = "👊 ×6";
  hitx6Btn.onclick = () => DemonicHelper.attackFromUrl(6);
  newDiv.appendChild(hitx6Btn);

  const hitx3Btn = document.createElement("button");
  hitx3Btn.textContent = "👊 ×3";
  hitx3Btn.onclick = () => DemonicHelper.attackFromUrl(3);
  newDiv.appendChild(hitx3Btn);

  dmgBtns.parentNode.insertBefore(newDiv, dmgBtns);
};
