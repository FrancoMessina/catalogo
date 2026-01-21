/**
 * Anime Figures Store - Main JavaScript
 * Catálogo de figuras coleccionables de anime
 */

// ================================
// Configuration
// ================================
const CONFIG = {
    dataUrl: 'data/products.json',
    whatsappBaseUrl: 'https://wa.me/',
    defaultWhatsapp: '5491123456789',
    defaultMessage: 'Hola! Me interesa la figura: '
};

// ================================
// DOM Elements
// ================================
const elements = {
    productsGrid: document.getElementById('products-grid'),
    productCount: document.getElementById('product-count'),
    loading: document.getElementById('loading'),
    error: document.getElementById('error'),
    whatsappFloat: document.getElementById('whatsapp-float'),
    mobileMenuBtn: document.querySelector('.mobile-menu-btn'),
    nav: document.querySelector('.nav'),
    navLinks: document.querySelectorAll('.nav-link')
};

// ================================
// State
// ================================
let state = {
    products: [],
    config: {},
    currentCategory: 'all',
    carousels: {} // Track carousel states
};

// ================================
// Utility Functions
// ================================

/**
 * Formatea un precio según la moneda
 */
function formatPrice(price, currency = 'ARS') {
    const formatters = {
        ARS: new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 0 }),
        USD: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }),
        default: new Intl.NumberFormat('es-AR', { style: 'currency', currency: currency, minimumFractionDigits: 0 })
    };
    
    const formatter = formatters[currency] || formatters.default;
    return formatter.format(price);
}

/**
 * Genera la URL de WhatsApp con mensaje predefinido
 */
function generateWhatsAppUrl(productName) {
    const phone = state.config.whatsapp || CONFIG.defaultWhatsapp;
    const message = encodeURIComponent(`${CONFIG.defaultMessage}${productName}`);
    return `${CONFIG.whatsappBaseUrl}${phone}?text=${message}`;
}

/**
 * Muestra u oculta el estado de carga
 */
function toggleLoading(show) {
    elements.loading.classList.toggle('hidden', !show);
}

/**
 * Muestra el mensaje de error
 */
function showError() {
    elements.loading.classList.add('hidden');
    elements.error.classList.remove('hidden');
}

// ================================
// Carousel Functions
// ================================

/**
 * Inicializa el estado del carrusel para un producto
 */
function initCarousel(productId, totalImages) {
    state.carousels[productId] = {
        currentIndex: 0,
        totalImages: totalImages
    };
}

/**
 * Cambia la imagen del carrusel
 */
function changeCarouselImage(productId, direction) {
    const carousel = state.carousels[productId];
    if (!carousel) return;

    if (direction === 'next') {
        carousel.currentIndex = (carousel.currentIndex + 1) % carousel.totalImages;
    } else {
        carousel.currentIndex = (carousel.currentIndex - 1 + carousel.totalImages) % carousel.totalImages;
    }

    updateCarouselDisplay(productId);
}

/**
 * Va a una imagen específica del carrusel
 */
function goToCarouselImage(productId, index) {
    const carousel = state.carousels[productId];
    if (!carousel) return;

    carousel.currentIndex = index;
    updateCarouselDisplay(productId);
}

/**
 * Actualiza la visualización del carrusel
 */
function updateCarouselDisplay(productId) {
    const carousel = state.carousels[productId];
    if (!carousel) return;

    const container = document.querySelector(`[data-product-id="${productId}"]`);
    if (!container) return;

    const track = container.querySelector('.carousel-track');
    const dots = container.querySelectorAll('.carousel-dot');
    const counter = container.querySelector('.carousel-counter');

    // Move track
    if (track) {
        track.style.transform = `translateX(-${carousel.currentIndex * 100}%)`;
    }

    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === carousel.currentIndex);
    });

    // Update counter
    if (counter) {
        counter.textContent = `${carousel.currentIndex + 1} / ${carousel.totalImages}`;
    }
}

// ================================
// Product Card Component
// ================================

/**
 * Crea el HTML de una tarjeta de producto con carrusel
 */
function createProductCard(product) {
    const { id, name, price, currency, images, available = true, category } = product;
    const priceFormatted = formatPrice(price, currency || state.config.currency);
    const whatsappUrl = generateWhatsAppUrl(name);
    
    // Handle both single image and multiple images
    const imageArray = Array.isArray(images) ? images : [images || product.image];
    const hasMultipleImages = imageArray.length > 1;
    
    const availableClass = available ? '' : 'not-available';
    const badgeText = available ? 'Disponible' : 'Agotado';
    const buttonDisabled = available ? '' : 'disabled';

    // Initialize carousel state
    initCarousel(id, imageArray.length);

    // Create images HTML
    const imagesHtml = imageArray.map((img, index) => `
        <div class="carousel-slide">
            <img 
                src="${img}" 
                alt="${name} - Imagen ${index + 1}" 
                class="product-image"
                loading="lazy"
                onerror="this.src='https://via.placeholder.com/400x400/1a1a2e/8b5cf6?text=Imagen+no+disponible'"
            >
        </div>
    `).join('');

    // Create dots HTML
    const dotsHtml = hasMultipleImages ? imageArray.map((_, index) => `
        <button 
            class="carousel-dot ${index === 0 ? 'active' : ''}" 
            onclick="goToCarouselImage(${id}, ${index})"
            aria-label="Ir a imagen ${index + 1}"
        ></button>
    `).join('') : '';

    // Navigation arrows (only if multiple images)
    const navHtml = hasMultipleImages ? `
        <button class="carousel-btn carousel-btn-prev" onclick="changeCarouselImage(${id}, 'prev')" aria-label="Imagen anterior">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        </button>
        <button class="carousel-btn carousel-btn-next" onclick="changeCarouselImage(${id}, 'next')" aria-label="Imagen siguiente">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
        </button>
    ` : '';

    // Counter
    const counterHtml = hasMultipleImages ? `
        <div class="carousel-counter">1 / ${imageArray.length}</div>
    ` : '';
    
    return `
        <article class="product-card ${availableClass}" data-id="${id}" data-category="${category}">
            <div class="product-image-container" data-product-id="${id}">
                <div class="carousel-track">
                    ${imagesHtml}
                </div>
                ${navHtml}
                ${counterHtml}
                <span class="product-badge">${badgeText}</span>
                ${hasMultipleImages ? `<div class="carousel-dots">${dotsHtml}</div>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${name}</h3>
                <p class="product-price">${priceFormatted}</p>
                <a 
                    href="${available ? whatsappUrl : '#'}" 
                    class="product-btn" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    ${buttonDisabled}
                    onclick="${available ? '' : 'return false;'}"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar
                </a>
            </div>
        </article>
    `;
}

// ================================
// Render Functions
// ================================

/**
 * Renderiza todos los productos en la grilla
 */
function renderProducts(products) {
    if (!products || products.length === 0) {
        elements.productsGrid.innerHTML = `
            <div class="no-products">
                <p>No hay productos disponibles en esta categoría.</p>
            </div>
        `;
        elements.productCount.textContent = '0';
        return;
    }
    
    // Reset carousel states
    state.carousels = {};
    
    const html = products.map(createProductCard).join('');
    elements.productsGrid.innerHTML = html;
    elements.productCount.textContent = products.length;
    
    // Add touch/swipe support for mobile
    addTouchSupport();
}

/**
 * Agrega soporte táctil para el carrusel en móviles
 */
function addTouchSupport() {
    const carousels = document.querySelectorAll('.product-image-container');
    
    carousels.forEach(carousel => {
        let startX = 0;
        let endX = 0;
        const productId = parseInt(carousel.dataset.productId);
        
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    changeCarouselImage(productId, 'next');
                } else {
                    changeCarouselImage(productId, 'prev');
                }
            }
        }, { passive: true });
    });
}

/**
 * Filtra productos por categoría
 */
function filterByCategory(category) {
    state.currentCategory = category;
    
    const filteredProducts = category === 'all' 
        ? state.products 
        : state.products.filter(p => p.category === category);
    
    renderProducts(filteredProducts);
    
    elements.navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.category === category);
    });
}

// ================================
// Data Fetching
// ================================

/**
 * Carga los productos desde el archivo JSON
 */
async function loadProducts() {
    try {
        toggleLoading(true);
        
        const response = await fetch(CONFIG.dataUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        state.products = data.products || [];
        state.config = data.config || {};
        
        // Update WhatsApp floating button
        if (state.config.whatsapp) {
            const generalMessage = encodeURIComponent('Hola! Me interesa conocer más sobre sus productos.');
            elements.whatsappFloat.href = `${CONFIG.whatsappBaseUrl}${state.config.whatsapp}?text=${generalMessage}`;
        }
        
        // Update page title if store name is configured
        if (state.config.storeName) {
            document.title = `${state.config.storeName} - Figuras Coleccionables`;
        }
        
        toggleLoading(false);
        renderProducts(state.products);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError();
    }
}

// ================================
// Event Handlers
// ================================

/**
 * Maneja el clic en el menú móvil
 */
function handleMobileMenu() {
    elements.mobileMenuBtn.classList.toggle('active');
    elements.nav.classList.toggle('active');
}

/**
 * Maneja el clic en los links de navegación
 */
function handleNavClick(e) {
    e.preventDefault();
    const category = e.target.dataset.category;
    if (category) {
        filterByCategory(category);
        elements.mobileMenuBtn.classList.remove('active');
        elements.nav.classList.remove('active');
    }
}

// ================================
// Initialization
// ================================

/**
 * Inicializa la aplicación
 */
function init() {
    loadProducts();
    
    elements.mobileMenuBtn?.addEventListener('click', handleMobileMenu);
    elements.navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav') && !e.target.closest('.mobile-menu-btn')) {
            elements.mobileMenuBtn?.classList.remove('active');
            elements.nav?.classList.remove('active');
        }
    });
}

// Make carousel functions globally accessible
window.changeCarouselImage = changeCarouselImage;
window.goToCarouselImage = goToCarouselImage;

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
