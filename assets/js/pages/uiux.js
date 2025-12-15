window.onload = function () {
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let slideNumber = 0;
  const slides = document.getElementsByClassName("slides");
  const totalSlides = slides.length;
  let autoPlayInterval;

  // 初始化：顯示第一張
  if (totalSlides > 0) {
    slides[0].classList.add("current");
  }

  function showSlide(index) {
    for (let i = 0; i < totalSlides; i++) {
      slides[i].classList.remove("current");
    }
    slides[index].classList.add("current");
  }

  function nextSlide() {
    slideNumber = (slideNumber + 1) % totalSlides;
    showSlide(slideNumber);
  }

  function prevSlide() {
    slideNumber = (slideNumber - 1 + totalSlides) % totalSlides;
    showSlide(slideNumber);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", function () {
      prevSlide();
      resetAutoPlay();
    });

    nextBtn.addEventListener("click", function () {
      nextSlide();
      resetAutoPlay();
    });
  }

  // 🔁 自動播放（每5秒轉一次）
  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      nextSlide();
    }, 5000); // ← 想快啲就調細秒數（1000 = 1秒）
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  startAutoPlay();
};
