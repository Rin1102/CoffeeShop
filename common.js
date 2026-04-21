function toggleMenu() {
    var nav = document.getElementById('mainNav');
    var menuToggle = document.querySelector('.menu-toggle');

    if (nav && menuToggle) {
        nav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open', nav.classList.contains('active'));
    }
}

document.addEventListener('click', function (e) {
    var nav = document.getElementById('mainNav');
    var menuToggle = document.querySelector('.menu-toggle');

    if (nav && menuToggle && !nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

window.addEventListener('resize', function () {
    var nav = document.getElementById('mainNav');
    var menuToggle = document.querySelector('.menu-toggle');

    if (!nav || !menuToggle) {
        return;
    }

    if (window.innerWidth > 1100) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') {
        return;
    }

    var nav = document.getElementById('mainNav');
    var menuToggle = document.querySelector('.menu-toggle');

    if (nav && menuToggle && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});
