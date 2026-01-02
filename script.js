document.addEventListener("DOMContentLoaded", () => {

  const ffInput = document.getElementById("ff-id");
  const getBotBtn = document.getElementById("get-bot-btn");
  const logBox = document.getElementById("log-box");
  const creatorBtn = document.getElementById("creator-btn");

  // لینک API دقیقاً بدون هیچ تغییری
  const API_BASE =
    "https://danger-add-friend.vercel.app/adding_friend" +
    "?uid=4233040092" +
    "&password=C4FF06D2528B31F56A8FAC914B270A121D6A2F2D056B20CFCAD139F0B36815C5" +
    "&friend_uid=";

  getBotBtn.addEventListener("click", () => {
    const friendUID = ffInput.value.trim();

    logBox.className = "";
    logBox.textContent = "";

    if (!friendUID || isNaN(friendUID)) {
      showError("❌ آیدی فری فایر معتبر نیست");
      return;
    }

    // فقط چسباندن آیدی — هیچ تغییر دیگه‌ای
    const finalUrl = API_BASE + friendUID;

    // ارسال درخواست مخفی
    const img = new Image();
    img.src = finalUrl;

    // لاگ موفق نمایشی
    showSuccess("✅ درخواست با موفقیت ارسال شد");
  });

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