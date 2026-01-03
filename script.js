document.addEventListener("DOMContentLoaded", () => {

  const ffInput = document.getElementById("ff-id");
  const getBotBtn = document.getElementById("get-bot-btn");
  const logBox = document.getElementById("log-box");
  const creatorBtn = document.getElementById("creator-btn");
  const inputLabel = document.getElementById("input-label");
  const botRadios = document.querySelectorAll('input[name="bot-type"]');
  const subtitle = document.getElementById("subtitle");
  const buttonGroup = getBotBtn.parentElement;

  // 🔒 API ربات معمولی
  const API_BASE =
    "https://danger-add-friend.vercel.app/adding_friend" +
    "?uid=4233040092" +
    "&password=C4FF06D2528B31F56A8FAC914B270A121D6A2F2D056B20CFCAD139F0B36815C5" +
    "&friend_uid=";

  // 🔥 API های VIP (سرور محلی)
  const VIP_START_API = "http://127.0.0.1:5000/start/";
  const VIP_STOP_API  = "http://127.0.0.1:5000/stop";

  let currentBotType = "normal";
  let stopBtn = null;

  // تغییر نوع ربات
  botRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      currentBotType = radio.value;

      ffInput.value = "";
      logBox.textContent = "";
      logBox.className = "";

      removeStopButton();

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

  // کلیک روی شروع
  getBotBtn.addEventListener("click", async () => {
    const value = ffInput.value.trim();

    logBox.className = "";
    logBox.textContent = "";

    if (currentBotType === "normal") {
      if (!value || isNaN(value)) {
        showError("❌ آیدی فری فایر معتبر نیست");
        return;
      }

      const img = new Image();
      img.src = API_BASE + value;

      showSuccess("✅ درخواست ربات دنس ارسال شد");
      return;
    }

    // VIP XP Bot
    if (!value || isNaN(value)) {
      showError("❌ کد تیم باید عددی باشد");
      return;
    }

    try {
      await fetch(VIP_START_API + value, {
        method: "GET",
        mode: "no-cors",
        signal: AbortSignal.timeout(1500)
      });

      showSuccess("🚀 فعال شد XP Bot");
      createStopButton();

    } catch (err) {
      showError("❌ فرایند پیش نیاز اجرا نشده (سرور محلی خاموش است)");
    }
  });

  // دکمه توقف زیر دکمه‌های اصلی و وسط صفحه
  function createStopButton() {
    if (stopBtn) return;

    stopBtn = document.createElement("button");
    stopBtn.className = "stop-btn";
    stopBtn.innerHTML = `<i class="fa-solid fa-ban"></i> <span>متوقف کردن</span>`;

    stopBtn.style.display = "block";
    stopBtn.style.margin = "15px auto 0 auto"; // وسط صفحه، فاصله از بالا
    stopBtn.style.textAlign = "center";

    buttonGroup.parentElement.appendChild(stopBtn);

    stopBtn.addEventListener("click", async () => {
        try {
            await fetch(VIP_STOP_API, {
                method: "GET",
                mode: "no-cors",
                signal: AbortSignal.timeout(1500)
            });

            showSuccess("🛑 ربات VIP متوقف شد");
            removeStopButton();

        } catch {
            showError("❌ عدم اتصال به سرور VIP");
        }
    });
  }

  function removeStopButton() {
    if (stopBtn) {
      stopBtn.remove();
      stopBtn = null;
    }
  }

  creatorBtn.addEventListener("click", () => {
    window.open("https://t.me/YOUR_USERNAME", "_blank");
  });

  function showSuccess(msg) {
    logBox.className = "success";
    logBox.textContent = msg;
  }

  function showError(msg) {
    logBox.className = "error";
    logBox.textContent = msg;
  }

});