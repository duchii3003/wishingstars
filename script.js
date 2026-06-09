const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRwxbka26mFhxgk2puK9mXPl3XCAEwGERYzsesdPHc5-yeQZpZ05dT4luvWdGjgBac/exec";

const SAMPLE_WISHES = [
  {
    fullName: "Minh Anh",
    nguyenVong1: "Truyền thông Đa phương tiện",
    wish: "Mình mong đủ bình tĩnh và tự tin để làm bài thật tốt."
  },
  {
    fullName: "Gia Huy",
    nguyenVong1: "Công nghệ thông tin",
    wish: "Mong mình đậu vào ngành mình yêu thích và không phụ lòng gia đình."
  },
  {
    fullName: "Ngọc Hân",
    nguyenVong1: "Thiết kế đồ họa",
    wish: "Ước rằng mình sẽ được học ở một nơi có thể giúp mình sáng tạo mỗi ngày."
  },
  {
    fullName: "Tuấn Kiệt",
    nguyenVong1: "Kỹ thuật phần mềm",
    wish: "Mình mong kỳ thi sắp tới sẽ là bước đầu tiên cho giấc mơ trở thành lập trình viên."
  },
  {
    fullName: "Bảo Trân",
    nguyenVong1: "Quản trị kinh doanh",
    wish: "Chúc mình luôn mạnh mẽ, bền bỉ và không bỏ cuộc."
  },
  {
    fullName: "Một sĩ tử 2k8",
    nguyenVong1: "Ngành học mơ ước",
    wish: "Mong tất cả chúng ta đều có một mùa thi thật đẹp."
  }
];

const starsLayer = document.getElementById("starsLayer");
const tooltip = document.getElementById("tooltip");
const wishCount = document.getElementById("wishCount");

const openWishForm = document.getElementById("openWishForm");
const closeWishForm = document.getElementById("closeWishForm");
const modalBackdrop = document.getElementById("modalBackdrop");
const wishForm = document.getElementById("wishForm");
const hero = document.querySelector(".hero");

let remoteWishes = [];
let pendingWishes = [];
let hasLoadedRemoteWishes = false;

init();

function init() {
  prepareResultScreen();
  prepareExamTipsOverlay();

  renderWishes();

  openWishForm.addEventListener("click", showModal);
  closeWishForm.addEventListener("click", hideModal);

  modalBackdrop.addEventListener("click", function (event) {
    if (event.target === modalBackdrop) {
      hideModal();
    }
  });

  wishForm.addEventListener("submit", handleSubmit);

  loadRemoteWishes();

  setInterval(loadRemoteWishes, 15000);
  setInterval(createRandomAmbientSparkle, 520);
}

function showModal() {
  modalBackdrop.classList.add("show");
}

function hideModal() {
  modalBackdrop.classList.remove("show");
}

function prepareResultScreen() {
  if (document.getElementById("resultScreen")) {
    return;
  }

  const resultScreen = document.createElement("section");
  resultScreen.id = "resultScreen";
  resultScreen.className = "result-screen";

  resultScreen.innerHTML = `
    <div class="result-content">
      <h2 class="result-main-message">
        <span>Quên mọi lỗi lầm đi,</span>
        <span>bạn chỉ còn cách ước mơ</span>
        <span>1 bài kiểm tra nữa thôi!</span>
      </h2>

      <div class="result-blessing">
        <p class="result-blessing-title" id="resultBlessingTitle"></p>
        <p class="result-blessing-subtitle" id="resultBlessingSubtitle"></p>
      </div>

      <button class="result-note-card" id="openExamTips" type="button">
        <span class="result-note-icon">✓</span>
        <span>
          <strong>Mở một lời nhắc nhỏ trước khi vào phòng thi</strong>
          <small>Chạm vào đây để xem mẹo làm bài trắc nghiệm khi thời gian đang rất áp lực.</small>
        </span>
      </button>
    </div>
  `;

  document.body.appendChild(resultScreen);

  document.getElementById("openExamTips").addEventListener("click", openExamTipsOverlay);
}

function prepareExamTipsOverlay() {
  if (document.getElementById("examTipsOverlay")) {
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "examTipsOverlay";
  overlay.className = "exam-tips-overlay";

  overlay.innerHTML = `
    <div class="exam-tips-card">
      <button class="exam-tips-close" id="examTipsClose" type="button">×</button>

      <h3>Mẹo làm bài trắc nghiệm khi áp lực thời gian cao</h3>

      <p class="tips-intro">
        Không cần thắng cả đề ngay từ đầu. Hãy giữ nhịp, gom điểm chắc trước,
        rồi quay lại xử lý phần khó sau.
      </p>

      <ul>
        <li><strong>Lướt nhanh toàn đề trước.</strong> Đừng lao ngay vào một câu quá dài. Hãy scan để biết đề có bao nhiêu phần dễ, vừa và khó.</li>
        <li><strong>Câu nào đọc hơn 1 phút 30 giây vẫn chưa hiểu hướng làm thì bỏ qua tạm.</strong> Đánh dấu lại rồi quay về sau, đừng để một câu kéo mất nhịp cả bài.</li>
        <li><strong>Làm chắc câu dễ trước.</strong> Mục tiêu đầu tiên là gom điểm an toàn, không phải chứng minh mình giải được câu khó nhất.</li>
        <li><strong>Dùng phương pháp loại trừ.</strong> Nếu chưa ra đáp án, hãy gạch các phương án vô lý trước để tăng xác suất chọn đúng.</li>
        <li><strong>Chia thời gian theo vòng.</strong> Vòng 1 làm câu chắc; vòng 2 xử lý câu cần suy nghĩ; vòng 3 quay lại câu khó và kiểm tra phiếu trả lời.</li>
        <li><strong>Đừng bỏ trống đáp án khi sắp hết giờ.</strong> Nếu không còn thời gian, chọn phương án hợp lý nhất sau khi loại trừ.</li>
        <li><strong>Mỗi khi hoảng, dừng 5 giây.</strong> Hít sâu, thả lỏng vai, nhìn lại câu hỏi. Bình tĩnh giúp não đọc đề chính xác hơn.</li>
        <li><strong>Kiểm tra mã đề, số báo danh và phiếu trả lời.</strong> Đặc biệt chú ý tô đúng dòng, đúng câu, không lệch thứ tự.</li>
      </ul>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("examTipsClose").addEventListener("click", closeExamTipsOverlay);

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeExamTipsOverlay();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeExamTipsOverlay();
    }
  });
}

function openExamTipsOverlay() {
  document.getElementById("examTipsOverlay").classList.add("show");
}

function closeExamTipsOverlay() {
  document.getElementById("examTipsOverlay").classList.remove("show");
}

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(wishForm);

  const newWish = normalizeWish({
    fullName: formData.get("fullName").trim(),
    nguyenVong1: formData.get("nguyenVong1").trim(),
    wish: formData.get("wish").trim(),
    timestamp: new Date().toISOString(),
    isNew: true
  });

  if (!newWish.fullName || !newWish.nguyenVong1 || !newWish.wish) {
    showToast("Bạn hãy điền đầy đủ thông tin nha.");
    return;
  }

  hideModal();

  const target = getTargetPosition(newWish.x, newWish.y);

  await playWishAnimation(target.x, target.y);

  triggerAura(target.x, target.y);
  createSparkleStorm(isMobileScreen() ? 55 : 95);

  pendingWishes.unshift(newWish);
  renderWishes();

  hero.classList.add("wish-sent");

  showResultScreen(newWish);
  revealFloatingWishes();

  sendWishToGoogleSheet(newWish);

  setTimeout(loadRemoteWishes, 2500);

  wishForm.reset();

  setTimeout(() => {
    showToast("Điều ước của bạn đã được gửi lên bầu trời ✨");
  }, 700);
}

function showResultScreen(wish) {
  const givenName = getVietnameseGivenName(wish.fullName);
  const title = document.getElementById("resultBlessingTitle");
  const subtitle = document.getElementById("resultBlessingSubtitle");
  const resultScreen = document.getElementById("resultScreen");

  const blessingMessages = [
    `Tự tin, bình tĩnh và thi tốt nhaaa ${givenName}!`,
    `${givenName} ơi, hít sâu một nhịp rồi làm từng câu thật chắc nha!`,
    `Cố lên ${givenName}, câu dễ lấy trước, câu khó quay lại sau nha!`,
    `${givenName}, bạn chỉ cần bình tĩnh hơn nỗi lo một chút là được!`,
    `Thi thật chắc tay nha ${givenName}, ước mơ đang ở rất gần rồi!`,
    `${givenName} cứ chậm vừa đủ, chắc từng câu và giữ nhịp thật ổn nha!`
  ];

  const subtitles = [
    "Bạn không cần hoàn hảo trong từng phút, chỉ cần đủ bình tĩnh để làm tốt nhất có thể.",
    "Đừng để một câu khó làm bạn quên mất rằng mình đã chuẩn bị rất nhiều.",
    "Từng câu hỏi nhỏ, từng điểm số nhỏ sẽ cộng lại thành kết quả xứng đáng.",
    "Sai một câu không sao, chậm một nhịp không sao. Quan trọng là giữ bình tĩnh.",
    "Mùa thi này cần kiến thức, nhịp thở ổn định và một cái đầu thật tỉnh."
  ];

  title.textContent = pickRandom(blessingMessages);
  subtitle.textContent = pickRandom(subtitles);

  resultScreen.classList.add("show");
}

function renderWishes() {
  starsLayer.innerHTML = "";

  const visualWishes = buildVisualWishes();

  visualWishes.forEach((wish) => {
    createStar(wish, wish.isNew);
  });

  if (!hasLoadedRemoteWishes) {
    wishCount.textContent = "...";
    return;
  }

  wishCount.textContent = remoteWishes.length + pendingWishes.length;
}

function buildVisualWishes() {
  const realWishes = [...pendingWishes, ...remoteWishes];

  if (realWishes.length === 0) {
    return SAMPLE_WISHES.map(normalizeWish);
  }

  return [
    ...realWishes,
    ...SAMPLE_WISHES.map(normalizeWish).slice(0, 4)
  ];
}

function createStar(wish, featured = false) {
  const star = document.createElement("button");
  star.className = featured ? "wish-star featured" : "wish-star";
  star.type = "button";

  const size = randomBetween(4, 10);
  const color = pickRandom([
    "#ffffff",
    "#fff4bb",
    "#8be9ff",
    "#f7b6ff",
    "#b794ff"
  ]);

  star.style.setProperty("--x", `${wish.x}%`);
  star.style.setProperty("--y", `${wish.y}%`);
  star.style.setProperty("--size", `${size}px`);
  star.style.setProperty("--star-color", color);
  star.style.setProperty("--speed", `${randomBetween(2, 4.3)}s`);

  star.addEventListener("mouseenter", function (event) {
    showTooltip(event, wish);
  });

  star.addEventListener("mousemove", function (event) {
    moveTooltip(event);
  });

  star.addEventListener("mouseleave", hideTooltip);

  star.addEventListener("click", function (event) {
    showTooltip(event, wish);
  });

  starsLayer.appendChild(star);
}

function loadRemoteWishes() {
  const callbackName = "__wishingStarsCallback" + Date.now();

  window[callbackName] = function (data) {
    try {
      if (data && data.ok && Array.isArray(data.wishes)) {
        hasLoadedRemoteWishes = true;

        remoteWishes = data.wishes
          .filter(item => item.fullName || item.wish)
          .map(normalizeWish);

        pendingWishes = pendingWishes.filter(pending => {
          return !remoteWishes.some(remote => isSameWish(remote, pending));
        });

        renderWishes();
      }
    } finally {
      cleanupJsonp(callbackName);
    }
  };

  const script = document.createElement("script");
  script.src = `${GOOGLE_SCRIPT_URL}?callback=${callbackName}&t=${Date.now()}`;
  script.id = callbackName;

  script.onerror = function () {
    hasLoadedRemoteWishes = true;
    renderWishes();
    cleanupJsonp(callbackName);
  };

  document.body.appendChild(script);

  setTimeout(() => {
    cleanupJsonp(callbackName);
  }, 10000);
}

function cleanupJsonp(callbackName) {
  const script = document.getElementById(callbackName);

  if (script) {
    script.remove();
  }

  try {
    delete window[callbackName];
  } catch (error) {
    window[callbackName] = undefined;
  }
}

function isSameWish(a, b) {
  return cleanText(a.fullName) === cleanText(b.fullName)
    && cleanText(a.nguyenVong1) === cleanText(b.nguyenVong1)
    && cleanText(a.wish) === cleanText(b.wish);
}

function normalizeWish(wish) {
  const fullName = wish.fullName || "";
  const nguyenVong1 = wish.nguyenVong1 || "";
  const message = wish.wish || "";
  const seed = `${fullName}|${nguyenVong1}|${message}`;

  return {
    fullName,
    nguyenVong1,
    wish: message,
    timestamp: wish.timestamp || "",
    x: stableNumber(seed + "x", 12, 88),
    y: stableNumber(seed + "y", 14, 72),
    isNew: wish.isNew || false
  };
}

function stableNumber(text, min, max) {
  const hash = hashString(text);
  return min + (hash % 1000) / 1000 * (max - min);
}

function hashString(text) {
  let hash = 0;

  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function cleanText(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function getVietnameseGivenName(fullName) {
  const cleanedName = String(fullName)
    .trim()
    .replace(/\s+/g, " ");

  if (!cleanedName) {
    return "bạn";
  }

  const parts = cleanedName.split(" ");

  return parts[parts.length - 1];
}

function getTargetPosition(xPercent, yPercent) {
  return {
    x: (window.innerWidth * xPercent) / 100,
    y: (window.innerHeight * yPercent) / 100
  };
}

function playWishAnimation(targetX, targetY) {
  return new Promise((resolve) => {
    const comet = document.createElement("div");
    comet.className = "wish-comet";

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight * 0.91;

    comet.style.setProperty("--fly-x", `${targetX - startX}px`);
    comet.style.setProperty("--fly-y", `${targetY - startY}px`);

    document.body.appendChild(comet);

    setTimeout(() => {
      comet.remove();
      resolve();
    }, 1550);
  });
}

function triggerAura(x, y) {
  const aura = document.createElement("div");
  aura.className = "star-aura";
  aura.style.setProperty("--aura-x", `${x}px`);
  aura.style.setProperty("--aura-y", `${y}px`);

  document.body.appendChild(aura);

  setTimeout(() => {
    aura.remove();
  }, 2000);
}

function createSparkleStorm(amount) {
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      createSparkle({
        x: randomBetween(4, 96),
        y: randomBetween(4, 96),
        size: randomBetween(3, 9),
        time: randomBetween(0.9, 2.2)
      });
    }, i * 18);
  }
}

function createRandomAmbientSparkle() {
  if (document.hidden) {
    return;
  }

  createSparkle({
    x: randomBetween(2, 98),
    y: randomBetween(2, 92),
    size: randomBetween(2, 5),
    time: randomBetween(1.2, 2.6)
  });
}

function createSparkle(config) {
  const sparkle = document.createElement("div");
  sparkle.className = "screen-sparkle";

  sparkle.style.setProperty("--sparkle-x", `${config.x}%`);
  sparkle.style.setProperty("--sparkle-y", `${config.y}%`);
  sparkle.style.setProperty("--sparkle-size", `${config.size}px`);
  sparkle.style.setProperty("--sparkle-time", `${config.time}s`);
  sparkle.style.setProperty("--sparkle-color", pickRandom([
    "#8be9ff",
    "#fff4bb",
    "#f7b6ff",
    "#ffffff"
  ]));

  document.body.appendChild(sparkle);

  setTimeout(() => {
    sparkle.remove();
  }, config.time * 1000 + 120);
}

function revealFloatingWishes() {
  const amount = isMobileScreen() ? 3 : 5;
  const pool = shuffleArray([...remoteWishes, ...SAMPLE_WISHES.map(normalizeWish)]).slice(0, amount);

  pool.forEach((wish, index) => {
    setTimeout(() => {
      createFloatingWish(wish, index);
    }, 350 + index * 520);
  });
}

function createFloatingWish(wish, index) {
  const floating = document.createElement("div");
  floating.className = "floating-wish";

  const desktopPositions = [
    { x: 8, y: 18 },
    { x: 62, y: 18 },
    { x: 14, y: 58 },
    { x: 66, y: 62 },
    { x: 38, y: 72 }
  ];

  const mobilePositions = [
    { x: 5, y: 18 },
    { x: 8, y: 72 },
    { x: 38, y: 78 }
  ];

  const positions = isMobileScreen() ? mobilePositions : desktopPositions;
  const position = positions[index % positions.length];

  floating.style.setProperty("--wish-x", `${position.x}%`);
  floating.style.setProperty("--wish-y", `${position.y}%`);

  floating.innerHTML = `
    <strong>${escapeHTML(wish.fullName)}</strong>
    <span>${escapeHTML(wish.wish)}</span>
  `;

  document.body.appendChild(floating);

  setTimeout(() => {
    floating.remove();
  }, isMobileScreen() ? 8500 : 6500);
}

function showTooltip(event, wish) {
  tooltip.innerHTML = "";

  const name = document.createElement("strong");
  name.textContent = wish.fullName;

  const aspiration = document.createElement("em");
  aspiration.textContent = `Nguyện vọng 1: ${wish.nguyenVong1}`;

  const message = document.createElement("span");
  message.textContent = wish.wish;

  tooltip.appendChild(name);
  tooltip.appendChild(aspiration);
  tooltip.appendChild(message);

  tooltip.classList.add("show");
  moveTooltip(event);
}

function moveTooltip(event) {
  const padding = 18;
  const tooltipWidth = 310;

  let left = event.clientX + padding;
  let top = event.clientY + padding;

  if (left + tooltipWidth > window.innerWidth) {
    left = event.clientX - tooltipWidth - padding;
  }

  if (top + 140 > window.innerHeight) {
    top = event.clientY - 140;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideTooltip() {
  tooltip.classList.remove("show");
}

async function sendWishToGoogleSheet(wish) {
  const payload = new URLSearchParams({
    fullName: wish.fullName,
    nguyenVong1: wish.nguyenVong1,
    wish: wish.wish,
    pageUrl: window.location.href,
    userAgent: navigator.userAgent
  });

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: payload
    });

    console.log("Đã gửi data về Google Sheet.");
  } catch (error) {
    console.error("Không gửi được data về Google Sheet:", error);
  }
}

function showToast(message) {
  const oldToast = document.querySelector(".toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 50);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 2800);
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isMobileScreen() {
  return window.innerWidth <= 760;
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
