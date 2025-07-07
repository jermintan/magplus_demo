// public/script.js

document.addEventListener('DOMContentLoaded', () => {

    // ===================================================================
    //  1. GLOBAL COMPONENTS (Run on EVERY page)
    // ===================================================================

    // --- Global Nav Search Form (Redirects to products page) ---
// --- REUSABLE SEARCH LOGIC FOR ALL SEARCH BARS ---
function handleSearchRedirect(formElement) {
    if (formElement) {
        formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            const searchInput = formElement.querySelector('input[name="search"]');
            const query = searchInput.value.trim();
            if (query) {
                // Redirect to the products page with the search term as a URL parameter
                window.location.href = `/products/?search=${encodeURIComponent(query)}`;
            }
        });
    }
}

// Get both search forms from the page
const navSearchForm = document.getElementById('nav-search-form');
const mobileSearchForm = document.getElementById('mobile-search-form');

// Apply the same logic to both forms
handleSearchRedirect(navSearchForm);
handleSearchRedirect(mobileSearchForm);

    // --- Slider Initialization ---
    function initializeSlider(sliderId, prevBtnId, nextBtnId) {
        const slider = document.getElementById(sliderId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!slider || !prevBtn || !nextBtn) {
            return;
        }

        const sliderTrack = slider.querySelector('.slider-track');
        if (!sliderTrack) return;
        const slides = Array.from(sliderTrack.children);
        if (slides.length === 0) return;

        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = 30; // This should match the CSS 'gap' property
        const totalSlideWidth = slideWidth + gap;
        let currentIndex = 0;

        function updateSliderPosition() {
            sliderTrack.style.transform = `translateX(-${currentIndex * totalSlideWidth}px)`;
        }

        nextBtn.addEventListener('click', () => {
            const visibleSlides = Math.floor(slider.querySelector('.slider-wrapper').clientWidth / totalSlideWidth);
            if (currentIndex < slides.length - visibleSlides) {
                currentIndex++;
                updateSliderPosition();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
            }
        });
    }

    // Initialize all sliders that might exist on the site
    initializeSlider('product-slider', 'product-prev', 'product-next');
    initializeSlider('content-slider', 'content-prev', 'content-next');

    // --- Hamburger Menu ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mainNav = document.getElementById('main-nav');
    if (hamburgerBtn && mainNav) {
        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
            mainNav.classList.toggle('is-active');
        });
    }

    // --- Accordion for Mobile Filters ---
    const filterSidebar = document.getElementById('filter-sidebar');
    if (filterSidebar) {
        const accordionHeader = filterSidebar.querySelector('.accordion-header');
        if (accordionHeader) {
            accordionHeader.addEventListener('click', () => {
                filterSidebar.classList.toggle('is-active');
                const isExpanded = filterSidebar.classList.contains('is-active');
                accordionHeader.setAttribute('aria-expanded', isExpanded);
            });
        }
    }


    // ===================================================================
    //  2. PAGE-SPECIFIC LOGIC (Product Listing Page)
    // ===================================================================
    
    const productGrid = document.getElementById('product-grid');
    const filterForm = document.getElementById('filter-form');

    // THE GATE: Only run this code if we are on the products page.
    if (productGrid && filterForm) {
        
        const sidebarSearchInput = document.getElementById('sidebar-search-input');
        const paginationContainer = document.getElementById('pagination-container');
        const allProducts = Array.from(productGrid.querySelectorAll('.product-card'));
        const itemsPerPage = 12;
        let currentPage = 1;

        // Read URL parameters on page load to get any search terms
        const urlParams = new URLSearchParams(window.location.search);
        const initialSearchTerm = urlParams.get('search') || '';

        // State management for all active filters
        let activeFilters = {
            category: [],
            search: initialSearchTerm.toLowerCase()
        };
        
        // If there was a search term in the URL, put it in the sidebar input box
        sidebarSearchInput.value = initialSearchTerm;

        function renderProducts() {
            const filteredProducts = allProducts.filter(product => {
                const category = product.dataset.category;
                const productText = (product.querySelector('h3').textContent + " " + product.querySelector('p').textContent).toLowerCase();

                const categoryMatch = activeFilters.category.length === 0 || activeFilters.category.includes(category);
                const searchMatch = activeFilters.search.length === 0 || productText.includes(activeFilters.search);
                
                return categoryMatch && searchMatch;
            });

            const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const productsToShow = filteredProducts.slice(startIndex, endIndex);

            allProducts.forEach(product => product.classList.add('hidden'));
            productsToShow.forEach(product => product.classList.remove('hidden'));

            renderPagination(totalPages);
        }

        function renderPagination(totalPages) {
            paginationContainer.innerHTML = '';
            if (totalPages <= 1) return;

            const list = document.createElement('ul');
            list.className = 'pagination-list';

            if (currentPage > 1) {
                list.innerHTML += `<li><a href="#" class="pagination-link" data-page="${currentPage - 1}">« Previous</a></li>`;
            } else {
                list.innerHTML += `<li class="disabled"><span>« Previous</span></li>`;
            }

            for (let i = 1; i <= totalPages; i++) {
                list.innerHTML += `<li><a href="#" class="pagination-link ${i === currentPage ? 'is-active' : ''}" data-page="${i}">${i}</a></li>`;
            }

            if (currentPage < totalPages) {
                list.innerHTML += `<li><a href="#" class="pagination-link" data-page="${currentPage + 1}">Next »</a></li>`;
            } else {
                list.innerHTML += `<li class="disabled"><span>Next »</span></li>`;
            }

            paginationContainer.appendChild(list);
        }

        // --- EVENT LISTENERS for the products page ---

        filterForm.addEventListener('change', event => {
            if (event.target.name === 'category') {
                const category = event.target.value;
                if (event.target.checked) {
                    activeFilters.category.push(category);
                } else {
                    activeFilters.category = activeFilters.category.filter(c => c !== category);
                }
                currentPage = 1;
                renderProducts();
            }
        });

        sidebarSearchInput.addEventListener('input', () => {
            activeFilters.search = sidebarSearchInput.value.trim().toLowerCase();
            currentPage = 1;
            renderProducts();
        });

        paginationContainer.addEventListener('click', event => {
            event.preventDefault();
            if (event.target.matches('.pagination-link') && event.target.dataset.page) {
                currentPage = parseInt(event.target.dataset.page, 10);
                renderProducts();
                productGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Initial render for the product page when it loads
        renderProducts();
    }
});