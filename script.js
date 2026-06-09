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
  }
];

const starsLayer = document.getElementById("starsLayer");
const tooltip = document.getElementById("tooltip");
const wishCount = document.getElementById("wishCount");

const openWishForm = document.getElementById("openWishForm");
const closeWishForm = document.getElementById("closeWishForm");
const modalBackdrop = document.getElementById("modalBackdrop");
const wishForm = document.getElementById("wishForm");

let wishes = [];

init();

function init() {
  wishes = [...SAMPLE_WISHES, ...getLocalWishes()];
  renderWishes();

  openWishForm.addEventListener("click", showModal);
  closeWishForm.addEventListener("click", hideModal);

  modalBackdrop.addEventListener("click", function (event) {
    if (event.target === modalBackdrop) {
      hideModal();
    }
  });

  wishForm.addEventListener("submit", handleSubmit);
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

  const size = randomBetween(4, 9);
  const color = pickRandom([
    "#ffffff",
    "#fff4bb",
    "#8be9ff",
    "#f7b6ff"
  ]);

  star.style.setProperty("--x", `${wish.x}%`);
  star.style.setProperty("--y", `${wish.y}%`);
  star.style.setProperty("--size", `${size}px`);
  star.style.setProperty("--star-color", color);
  star.style.setProperty("--speed", `${randomBetween(2.2, 4.6)}s`);

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
    x: randomBetween(12, 88),
    y: randomBetween(14, 72),
    isNew: true
  };

  if (!newWish.fullName || !newWish.nguyenVong1 || !newWish.wish) {
    showToast("Bạn hãy điền đầy đủ thông tin nha.");
    return;
  }

  hideModal();

  const target = getTargetPosition(newWish.x, newWish.y);
  await playWishAnimation(target.x, target.y);

  wishes.push(newWish);
  saveLocalWish(newWish);
  renderWishes();

  sendWishToGoogleSheet(newWish);

  wishForm.reset();

  showToast("Điều ước của bạn đã được gửi lên bầu trời ✨");
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
    const startY = window.innerHeight * 0.9;

    comet.style.setProperty("--fly-x", `${targetX - startX}px`);
    comet.style.setProperty("--fly-y", `${targetY - startY}px`);

    document.body.appendChild(comet);

    setTimeout(() => {
      comet.remove();
      resolve();
    }, 1450);
  });
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
  const tooltipWidth = 300;

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

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}
