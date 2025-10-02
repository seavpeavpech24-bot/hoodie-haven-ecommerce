// Product Data
const productData = {
    id: 'HH-BLK-001',
    name: 'Classic Black Hoodie',
    price: 49.99,
    oldPrice: 69.99,
    discount: 30,
    rating: 4.5,
    reviewCount: 128,
    colors: ['black', 'gray', 'blue', 'red'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
        'https://i.pinimg.com/736x/d3/88/9e/d3889e3a818a6ab8fbe6933d31c6a32d.jpg',
        'https://i.pinimg.com/736x/93/f6/e4/93f6e4c42f24c2a9433fa46e9f9fcebe.jpg',
        'https://i.pinimg.com/736x/58/40/20/5840206289671285071817096173af96.jpg',
        'https://i.pinimg.com/736x/28/e2/df/28e2df99edd4dc354cb7225207929d46.jpg'
    ],
    description: `Premium quality black hoodie made from 100% cotton blend. Features include:
        - Kangaroo pocket for storage and warmth
        - Adjustable drawstring hood
        - Ribbed cuffs and hem for a snug fit
        - Double-lined hood for extra comfort
        - Machine washable`
};

// DOM Elements
const mainImage = document.querySelector('.main-image');
const thumbnails = document.querySelectorAll('.thumbnail');
const colorButtons = document.querySelectorAll('.color-button');
const sizeButtons = document.querySelectorAll('.size-button');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');
const quantityInput = document.querySelector('.quantity-input');
const addToCartBtn = document.querySelector('.add-to-cart');
const buyNowBtn = document.querySelector('.buy-now');
const wishlistBtn = document.querySelector('.wishlist-btn');

// State
let selectedColor = 'black';
let selectedSize = 'M';
let quantity = 1;

// Image Gallery
function initImageGallery() {
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('ring-2', 'ring-blue-600'));
            // Add active class to clicked thumbnail
            thumbnail.classList.add('ring-2', 'ring-blue-600');
            // Update main image
            mainImage.src = thumbnail.querySelector('img').src;
        });
    });
}

// Color Selection
function initColorSelection() {
    colorButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all color buttons
            colorButtons.forEach(btn => btn.classList.remove('ring-2', 'ring-blue-600'));
            // Add active class to clicked button
            button.classList.add('ring-2', 'ring-blue-600');
            selectedColor = button.dataset.color;
            updateProductInfo();
        });
    });
}

// Size Selection
function initSizeSelection() {
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all size buttons
            sizeButtons.forEach(btn => btn.classList.remove('border-blue-600', 'text-blue-600'));
            // Add active class to clicked button
            button.classList.add('border-blue-600', 'text-blue-600');
            selectedSize = button.textContent;
            updateProductInfo();
        });
    });
}

// Tab Switching
function initTabs() {
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('tab-active'));
            button.classList.add('tab-active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.add('hidden');
                if (content.id === tabId) {
                    content.classList.remove('hidden');
                }
            });
        });
    });
}

// Quantity Input
function initQuantityInput() {
    const minusBtn = document.querySelector('.quantity-minus');
    const plusBtn = document.querySelector('.quantity-plus');
    
    minusBtn.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityInput.value = quantity;
            updateProductInfo();
        }
    });
    
    plusBtn.addEventListener('click', () => {
        quantity++;
        quantityInput.value = quantity;
        updateProductInfo();
    });
    
    quantityInput.addEventListener('change', (e) => {
        quantity = parseInt(e.target.value) || 1;
        updateProductInfo();
    });
}

// Add to Cart
function initAddToCart() {
    addToCartBtn.addEventListener('click', () => {
        const cartItem = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            image: mainImage.src
        };
        
        // Get existing cart items
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        // Check if item already exists in cart
        const existingItemIndex = cartItems.findIndex(item => 
            item.id === cartItem.id && 
            item.color === cartItem.color && 
            item.size === cartItem.size
        );
        
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cartItems[existingItemIndex].quantity += cartItem.quantity;
        } else {
            // Add new item if it doesn't exist
            cartItems.push(cartItem);
        }
        
        // Save to localStorage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Show success message
        showNotification('Item added to cart successfully!');
        
        // Update cart count
        updateCartCount();
    });
}

// Buy Now
function initBuyNow() {
    buyNowBtn.addEventListener('click', () => {
        // Add to cart first
        const cartItem = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            color: selectedColor,
            size: selectedSize,
            quantity: quantity,
            image: mainImage.src
        };
        
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems.push(cartItem);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Redirect to checkout
        window.location.href = '/checkout.html';
    });
}

// Wishlist
function initWishlist() {
    wishlistBtn.addEventListener('click', () => {
        const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems')) || [];
        const wishlistItem = {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            image: mainImage.src
        };
        
        // Check if item is already in wishlist
        const exists = wishlistItems.some(item => item.id === wishlistItem.id);
        
        if (!exists) {
            wishlistItems.push(wishlistItem);
            localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
            wishlistBtn.classList.remove('far');
            wishlistBtn.classList.add('fas', 'text-red-500');
            showNotification('Item added to wishlist!');
        } else {
            // Remove from wishlist
            const updatedWishlist = wishlistItems.filter(item => item.id !== wishlistItem.id);
            localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
            wishlistBtn.classList.remove('fas', 'text-red-500');
            wishlistBtn.classList.add('far');
            showNotification('Item removed from wishlist!');
        }
    });
}

// Update Product Info
function updateProductInfo() {
    // Update price display
    const totalPrice = productData.price * quantity;
    document.querySelector('.current-price').textContent = `$${totalPrice.toFixed(2)}`;
    
    // Update selected options display
    document.querySelector('.selected-color').textContent = selectedColor;
    document.querySelector('.selected-size').textContent = selectedSize;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 translate-y-0';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-y-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Update Cart Count
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
}

// Initialize all features
document.addEventListener('DOMContentLoaded', () => {
    initImageGallery();
    initColorSelection();
    initSizeSelection();
    initTabs();
    initQuantityInput();
    initAddToCart();
    initBuyNow();
    initWishlist();
    updateCartCount();
}); 