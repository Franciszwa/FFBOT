document.addEventListener("DOMContentLoaded", () => {

  const ffInput = document.getElementById("ff-id");
  const getBotBtn = document.getElementById("get-bot-btn");
  const logBox = document.getElementById("log-box");
  const creatorBtn = document.getElementById("creator-btn");
  const inputLabel = document.getElementById("input-label");
  const botRadios = document.querySelectorAll('input[name="bot-type"]');
  const subtitle = document.getElementById("subtitle");
  const buttonGroup = getBotBtn.parentElement;

  /* ================= API ================= */
  const API_BASE =
    "https://danger-add-friend.vercel.app/adding_friend" +
    "?uid=4233040092" +
    "&password=C4FF06D2528B31F56A8FAC914B270A121D6A2F2D056B20CFCAD139F0B36815C5" +
    "&friend_uid=";

  const VIP_START_API = "http://127.0.0.1:5000/start/";
  const VIP_STOP_API  = "http://127.0.0.1:5000/stop";

  let currentBotType = "normal";

  let wrapper = null;
  let stopBtn = null;
  let liveBox = null;

  let counterInterval = null;
  let timerInterval = null;

  let gameCount = 0;
  let nextTime = 46;

  /* ================= MODE CHANGE ================= */
  botRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      currentBotType = radio.value;

      ffInput.value = "";
      logBox.textContent = "";
      logBox.className = "";
      removeXPUI();

      if (currentBotType === "vip") {
        inputLabel.innerHTML = '<i class="fa-solid fa-users"></i> کد تیم عددی';
        ffInput.placeholder = "مثال: 123456";
        subtitle.textContent = "ورود خودکار به تیم برای جمع‌آوری XP";
      } else {
        inputLabel.innerHTML = '<i class="fa-solid fa-gamepad"></i> آیدی فری فایر';
        ffInput.placeholder = "مثال: 4233040092";
        subtitle.textContent = "ارسال خودکار درخواست ربات دنس به اکانت شما";
      }
    });
  });

  /* ================= START BOT ================= */
  getBotBtn.addEventListener("click", async () => {
    const value = ffInput.value.trim();
    logBox.textContent = "";
    logBox.className = "";

    if (currentBotType === "normal") {
      if (!value || isNaN(value)) {
        showError("❌ آیدی معتبر نیست");
        return;
      }
      new Image().src = API_BASE + value;
      showSuccess("✅ درخواست ارسال شد");
      return;
    }

    if (!value || isNaN(value)) {
      showError("❌ کد تیم نامعتبر است");
      return;
    }

    try {
      await fetch(VIP_START_API + value, { method: "GET", mode: "no-cors" });
      showSuccess("🚀 XP Bot فعال شد");

      createXPUI();
      startCounter();
      startTimer();

    } catch {
      showError("❌ سرور XP در دسترس نیست");
    }
  });

  /* ================= UI ================= */
  function createXPUI() {
    if (wrapper) return;

    wrapper = document.createElement("div");
    wrapper.className = "xp-wrapper";

    const topRow = document.createElement("div");
    topRow.className = "xp-top";

    stopBtn = document.createElement("button");
    stopBtn.className = "stop-btn";
    stopBtn.innerHTML = `<i class="fa-solid fa-power-off"></i><span>STOP BOT</span>`;

    topRow.appendChild(stopBtn);

    liveBox = document.createElement("div");
    liveBox.className = "live-box";
    liveBox.innerHTML = `
      <div><i class="fa-solid fa-circle-play"></i> Bot: <b id="live-status">Active</b></div>
      <div><i class="fa-solid fa-gamepad"></i> Games: <b id="live-games">1</b></div>
      <div><i class="fa-solid fa-clock"></i> Next Match: <b id="live-timer">00:46</b></div>
      <div><i class="fa-solid fa-server"></i> Server: <b class="server-ok">Connected</b></div>
    `;

    wrapper.appendChild(topRow);
    wrapper.appendChild(liveBox);
    buttonGroup.parentElement.appendChild(wrapper);

    stopBtn.addEventListener("click", stopBot);
  }

  /* ================= GAME COUNTER ================= */
  function startCounter() {
    resetIntervals();
    gameCount = 1;
    updateGames();

    counterInterval = setInterval(() => {
      gameCount++;
      updateGames();
      nextTime = 46;
    }, 46000);
  }

  function updateGames() {
    const g = document.getElementById("live-games");
    if (g) g.textContent = gameCount;
  }

  /* ================= TIMER ================= */
  function startTimer() {
    nextTime = 46;
    updateTimer();

    timerInterval = setInterval(() => {
      nextTime--;
      updateTimer();
      if (nextTime <= 0) nextTime = 46;
    }, 1000);
  }

  function updateTimer() {
    const t = document.getElementById("live-timer");
    if (t) t.textContent = `00:${String(nextTime).padStart(2, "0")}`;
  }

  /* ================= STOP ================= */
  async function stopBot() {
    try {
      await fetch(VIP_STOP_API, { method: "GET", mode: "no-cors" });

      showSuccess("🛑 XP Bot خاموش شد");
      removeXPUI();

    } catch {
      showError("❌ خطا در توقف");
    }
  }

  function resetIntervals() {
    clearInterval(counterInterval);
    clearInterval(timerInterval);
  }

  function removeXPUI() {
    resetIntervals();
    if (wrapper) {
      wrapper.remove();
      wrapper = null;
      stopBtn = null;
      liveBox = null;
    }
  }


  function showSuccess(msg) {
    logBox.className = "success";
    logBox.textContent = msg;
  }

  function showError(msg) {
    logBox.className = "error";
    logBox.textContent = msg;
  }

});
