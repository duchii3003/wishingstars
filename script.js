const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyRwxbka26mFhxgk2puK9mXPl3XCAEwGERYzsesdPHc5-yeQZpZ05dT4luvWdGjgBac/exec";

const SAMPLE_WISHES = [
  {
    fullName: "Minh Anh",
    nguyenVong1: "Truyền thông Đa phương tiện",
    wish: "Mình mong đủ bình tĩnh và tự tin để làm bài thật tốt.",
    x: 18,
    y: 28
  },
  {
    fullName: "Gia Huy",
    nguyenVong1: "Công nghệ thông tin",
    wish: "Mong mình đậu vào ngành mình yêu thích và không phụ lòng gia đình.",
    x: 72,
    y: 22
  },
  {
    fullName: "Ngọc Hân",
    nguyenVong1: "Thiết kế đồ họa",
    wish: "Ước rằng mình sẽ được học ở một nơi có thể giúp mình sáng tạo mỗi ngày.",
    x: 38,
    y: 35
  },
  {
    fullName: "Tuấn Kiệt",
    nguyenVong1: "Kỹ thuật phần mềm",
    wish: "Mình mong kỳ thi sắp tới sẽ là bước đầu tiên cho giấc mơ trở thành lập trình viên.",
    x: 63,
    y: 48
  },
  {
    fullName: "Bảo Trân",
    nguyenVong1: "Quản trị kinh doanh",
    wish: "Chúc mình luôn mạnh mẽ, bền bỉ và không bỏ cuộc.",
    x: 25,
    y: 58
  },
  {
    fullName: "Một sĩ tử 2k8",
    nguyenVong1: "Ngành học mơ ước",
    wish: "Mong tất cả chúng ta đều có một mùa thi thật đẹp.",
    x: 82,
    y: 62
  },
  {
    fullName: "Khánh Linh",
    nguyenVong1: "Marketing",
    wish: "Ước gì mình đủ can đảm để chọn đúng điều mình thật sự yêu thích.",
    x: 54,
    y: 19
  },
  {
    fullName: "Đức Anh",
    nguyenVong1: "An toàn thông tin",
    wish: "Mong mình không bị run khi vào phòng thi và làm được hết sức.",
    x: 14,
    y: 66
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

let wishes = [];

init();

function init() {
  wishes = [...SAMPLE_WISHES, ...getLocalWishes()];
  renderWishes();
  prepareDreamMessage();
  preparePersonalBlessing();
  prepareExamTipsOverlay();

  openWishForm.addEventListener("click", showModal);
  closeWishForm.addEventListener("click", hideModal);

  modalBackdrop.addEventListener("click", function (event) {
    if (event.target === modalBackdrop) {
      hideModal();
    }
  });

  wishForm.addEventListener("submit", handleSubmit);

  setInterval(createRandomAmbientSparkle, 420);
}

function prepareDreamMessage() {
  if (document.getElementById("dreamMessage")) {
    return;
  }

  const message = document.createElement("div");
  message.id = "dreamMessage";
  message.className = "dream-message";
  message.innerHTML = `
    <span class="line">Quên mọi lỗi lầm đi,</span>
    <span class="line">bạn chỉ còn cách ước mơ của mình</span>
    <span class="line">1 bài kiểm tra nữa thôi!</span>
  `;

  document.body.appendChild(message);
}

function preparePersonalBlessing() {
  if (document.getElementById("personalBlessing")) {
    return;
  }

  const blessing = document.createElement("section");
  blessing.id = "personalBlessing";
  blessing.className = "personal-blessing";

  blessing.innerHTML = `
    <p class="blessing-title" id="blessingTitle"></p>
    <p class="blessing-subtitle" id="blessingSubtitle"></p>

    <div class="exam-note" id="examNote">
      <label class="exam-toggle-row">
        <input type="checkbox" id="examTipsToggle" />
        <span class="exam-toggle-text">
          <strong>Mở một lời nhắc nhỏ trước khi vào phòng thi</strong>
          <span>Tick vào đây để xem mẹo làm bài trắc nghiệm khi thời gian đang rất áp lực.</span>
        </span>
      </label>
    </div>
  `;

  document.body.appendChild(blessing);

  const examNote = document.getElementById("examNote");
  const toggle = document.getElementById("examTipsToggle");

  examNote.addEventListener("click", function () {
    toggle.checked = true;
    openExamTipsOverlay();
  });

  toggle.addEventListener("click", function (event) {
    event.stopPropagation();
    openExamTipsOverlay();
  });
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

  const closeButton = document.getElementById("examTipsClose");

  overlay.addEventListener("click", function (event) {
    if (event.target === overlay) {
      closeExamTipsOverlay();
    }
  });

  closeButton.addEventListener("click", closeExamTipsOverlay);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeExamTipsOverlay();
    }
  });
}

function openExamTipsOverlay() {
  const overlay = document.getElementById("examTipsOverlay");
  const toggle = document.getElementById("examTipsToggle");

  overlay.classList.add("show");

  if (toggle) {
    toggle.checked = true;
  }
}

function closeExamTipsOverlay() {
  const overlay = document.getElementById("examTipsOverlay");
  const toggle = document.getElementById("examTipsToggle");

  overlay.classList.remove("show");

  if (toggle) {
    toggle.checked = false;
  }
}

function showModal() {
  modalBackdrop.classList.add("show");
}

function hideModal() {
  modalBackdrop.classList.remove("show");
}

function renderWishes() {
  starsLayer.innerHTML = "";

  wishes.forEach((wish, index) => {
    createStar(wish, index === wishes.length - 1 && wish.isNew);
  });

  wishCount.textContent = wishes.length;
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

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(wishForm);

  const newWish = {
    fullName: formData.get("fullName").trim(),
    nguyenVong1: formData.get("nguyenVong1").trim(),
    wish: formData.get("wish").trim(),
    x: randomBetween(14, 86),
    y: randomBetween(16, 70),
    isNew: true
  };

  if (!newWish.fullName || !newWish.nguyenVong1 || !newWish.wish) {
    showToast("Bạn hãy điền đầy đủ thông tin nha.");
    return;
  }

  hideModal();

  const target = getTargetPosition(newWish.x, newWish.y);

  await playWishAnimation(target.x, target.y);

  triggerAura(target.x, target.y);
  createSparkleStorm(95);

  wishes.push(newWish);
  saveLocalWish(newWish);
  renderWishes();

  hero.classList.add("wish-sent");
  document.getElementById("dreamMessage").classList.add("show");

  setTimeout(() => {
    revealPersonalBlessing(newWish.fullName);
  }, 1000);

  revealFloatingWishes();

  sendWishToGoogleSheet(newWish);

  wishForm.reset();

  setTimeout(() => {
    showToast("Điều ước của bạn đã được gửi lên bầu trời ✨");
  }, 700);
}

function revealPersonalBlessing(fullName) {
  const givenName = getVietnameseGivenName(fullName);
  const title = document.getElementById("blessingTitle");
  const subtitle = document.getElementById("blessingSubtitle");
  const blessing = document.getElementById("personalBlessing");

  const blessingMessages = [
    `Tự tin, bình tĩnh và thi tốt nhaaa ${givenName}!`,
    `${givenName} ơi, hít sâu một nhịp rồi làm từng câu thật chắc nha!`,
    `Cố lên ${givenName}, câu dễ lấy trước, câu khó quay lại sau nha!`,
    `${givenName}, bạn chỉ cần bình tĩnh hơn nỗi lo một chút là được!`,
    `Thi thật chắc tay nha ${givenName}, ước mơ đang ở rất gần rồi!`,
    `${givenName} cứ chậm vừa đủ, chắc từng câu và giữ nhịp thật ổn nha!`
  ];

  const subtitles = [
    "Bạn không cần hoàn hảo trong từng phút, bạn chỉ cần đủ bình tĩnh để làm tốt nhất có thể.",
    "Đừng để một câu khó làm bạn quên mất rằng mình đã chuẩn bị rất nhiều cho ngày hôm nay.",
    "Cứ đi từng bước nhỏ, từng câu hỏi nhỏ, từng điểm số nhỏ. Tất cả sẽ cộng lại thành kết quả xứng đáng.",
    "Sai một câu không sao, chậm một nhịp không sao. Quan trọng là đừng đánh mất sự bình tĩnh của mình.",
    "Mùa thi này không chỉ cần kiến thức, mà còn cần nhịp thở ổn định và một cái đầu thật tỉnh."
  ];

  title.textContent = pickRandom(blessingMessages);
  subtitle.textContent = pickRandom(subtitles);

  blessing.classList.add("show");
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
  const pool = shuffleArray([...SAMPLE_WISHES, ...getLocalWishes()]).slice(0, 7);

  pool.forEach((wish, index) => {
    setTimeout(() => {
      createFloatingWish(wish, index);
    }, 350 + index * 420);
  });
}

function createFloatingWish(wish, index) {
  const floating = document.createElement("div");
  floating.className = "floating-wish";

  const positions = [
    { x: 8, y: 18 },
    { x: 62, y: 18 },
    { x: 14, y: 58 },
    { x: 66, y: 62 },
    { x: 38, y: 72 },
    { x: 72, y: 38 },
    { x: 10, y: 38 }
  ];

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
  }, 7000);
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

function saveLocalWish(wish) {
  const localWishes = getLocalWishes();

  localWishes.push({
    fullName: wish.fullName,
    nguyenVong1: wish.nguyenVong1,
    wish: wish.wish,
    x: wish.x,
    y: wish.y
  });

  localStorage.setItem("wishingStars", JSON.stringify(localWishes));
}

function getLocalWishes() {
  try {
    return JSON.parse(localStorage.getItem("wishingStars")) || [];
  } catch (error) {
    return [];
  }
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

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
