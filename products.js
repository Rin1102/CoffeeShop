document.addEventListener('DOMContentLoaded', () => {
    const cards = Array.from(document.querySelectorAll('.product-card'));
    if (!cards.length) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'menu-filters';
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">Tous</button>
        <button class="filter-btn" data-filter="boissons">Boissons</button>
        <button class="filter-btn" data-filter="patisseries">Pâtisseries</button>
        <button class="filter-btn" data-filter="sandwiches">Sandwiches</button>
        <label style="margin-left:auto;">Trier:
            <select id="sortSelect">
                <option value="none">-- Choisir --</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="popularity">Popularité</option>
            </select>
        </label>
    `;

    document.querySelector('.page-title')?.insertAdjacentElement('afterend', filterContainer);

    let currentFilter = 'all';

    function applyView() {
        const sortValue = document.getElementById('sortSelect')?.value || 'none';
        const visible = cards.filter((card) => currentFilter === 'all' || card.dataset.category === currentFilter);

        cards.forEach((card) => {
            card.style.display = visible.includes(card) ? '' : 'none';
        });

        visible.sort((a, b) => {
            const pa = Number(a.dataset.price || 0);
            const pb = Number(b.dataset.price || 0);
            const popA = Number(a.dataset.popularity || 0);
            const popB = Number(b.dataset.popularity || 0);

            if (sortValue === 'price-asc') return pa - pb;
            if (sortValue === 'price-desc') return pb - pa;
            if (sortValue === 'popularity') return popB - popA;
            return 0;
        });

        const grid = document.getElementById('productsGrid');
        visible.forEach((card) => grid?.appendChild(card));
    }

    filterContainer.addEventListener('click', (event) => {
        const btn = event.target.closest('.filter-btn');
        if (!btn) return;

        currentFilter = btn.dataset.filter || 'all';
        filterContainer.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        applyView();
    });

    filterContainer.addEventListener('change', (event) => {
        if (event.target.id === 'sortSelect') {
            applyView();
        }
    });

    applyView();
});
