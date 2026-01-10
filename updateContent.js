window.updateContent = window.updateContent || {};
/**
 * Replace current page monster-container
 * with the one fetched from the server
 */
window.updateContent.updateActiveWaveContent = async function () {
  if (!window.location.pathname.includes("active_wave.php")) {
    return;
  }

  try {
    const html = await window.APIcalls.fetchActiveWaveHTML();
    if (!html) return;

    // Parse returned HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    /** ----------------------------
     *  Update monster container
     *  ---------------------------- */
    const newMonsterContainer = doc.querySelector(".monster-container");
    const currentMonsterContainer =
      document.querySelector(".monster-container");

    if (newMonsterContainer && currentMonsterContainer) {
      currentMonsterContainer.replaceWith(newMonsterContainer);
    }

    /** ----------------------------
     *  Update stamina span
     *  ---------------------------- */
    const newStamina = doc.querySelector("#stamina_span");
    const currentStamina = document.querySelector("#stamina_span");

    if (newStamina && currentStamina) {
      currentStamina.textContent = newStamina.textContent;
    }
  } catch (err) {
    console.error("[APIcalls] Failed to update active wave", err);
  }
};
