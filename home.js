let currentSlide = 0;
let autoSlideTimer = null;

function getSlides() {
    return document.querySelectorAll('.slide');
}

function getIndicators() {
    return document.querySelectorAll('.indicator');
}

function showSlide(index) {
    const slides = getSlides();
    const indicators = getIndicators();

    if (!slides.length) return;

    slides.forEach((slide) => slide.classList.remove('active'));
    indicators.forEach((indicator) => indicator.classList.remove('active'));

    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    indicators[currentSlide]?.classList.add('active');
}

function changeSlide(step) {
    showSlide(currentSlide + step);
}

function goToSlide(index) {
    showSlide(index);
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => changeSlide(1), 5000);
}

function stopAutoSlide() {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    startAutoSlide();
});
