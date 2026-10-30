/* ========================================
   OJA KITCHEN - JAVASCRIPT
======================================== */


/* ========================================
   1. SCROLL REVEAL ANIMATION
======================================== */

const revealElements = document.querySelectorAll(
    '.menu-card, .about-content, .about-image, .contact-card'
);

if ('IntersectionObserver' in window) {
    revealElements.forEach((element) => {
        element.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}


/* ========================================
   2. ORDER / CART SYSTEM
======================================== */

// Store selected dishes.
const cart = new Map();

const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const whatsappButton = document.getElementById('whatsapp-order');

// Format prices in Nigerian Naira.
const formatPrice = (amount) => {
    return '₦' + amount.toLocaleString('en-NG');
};


// Add a dish to the cart.
document.querySelectorAll('.add-to-order').forEach((button) => {
    button.addEventListener('click', () => {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (!name || !Number.isFinite(price) || price <= 0) {
            return;
        }

        const existingDish = cart.get(name);

        if (existingDish) {
            existingDish.quantity++;
        } else {
            cart.set(name, {
                price: price,
                quantity: 1
            });
        }

        // Highlight the selected dish.
        document.querySelectorAll('.menu-card').forEach((card) => {
            card.classList.remove('selected');
        });

        button.closest('.menu-card')?.classList.add('selected');

        // Update the order summary.
        renderCart();

        // Show the order summary.
        document.getElementById('order-summary')
            ?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
    });
});


// Increase or decrease dish quantities.
cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');

    if (!button) return;

    const name = button.dataset.name;
    const action = button.dataset.action;
    const dish = cart.get(name);

    if (!dish) return;

    if (action === 'increase') {
        dish.quantity++;
    }

    if (action === 'decrease') {
        dish.quantity--;

        if (dish.quantity <= 0) {
            cart.delete(name);
        }
    }

    renderCart();
});


// Display the cart and calculate the total.
function renderCart() {
    cartItems.replaceChildren();

    let total = 0;

    if (cart.size === 0) {
        const emptyMessage = document.createElement('p');

        emptyMessage.className = 'empty-cart';
        emptyMessage.textContent =
            'Your order is empty. Add a dish from our menu to get started!';

        cartItems.appendChild(emptyMessage);
    }

    cart.forEach((dish, name) => {
        const subtotal = dish.price * dish.quantity;

        total += subtotal;

        const item = document.createElement('div');
        item.className = 'cart-item';

        const info = document.createElement('div');
        info.className = 'cart-item-info';

        const heading = document.createElement('h3');
        heading.textContent = name;

        const price = document.createElement('p');
        price.textContent =
            `${formatPrice(dish.price)} each · Subtotal: ${formatPrice(subtotal)}`;

        info.append(heading, price);

        const controls = document.createElement('div');
        controls.className = 'cart-item-controls';

        const decreaseButton = document.createElement('button');
        decreaseButton.type = 'button';
        decreaseButton.textContent = '−';
        decreaseButton.setAttribute('aria-label', `Decrease ${name}`);
        decreaseButton.dataset.action = 'decrease';
        decreaseButton.dataset.name = name;

        const quantity = document.createElement('span');
        quantity.textContent = dish.quantity;

        const increaseButton = document.createElement('button');
        increaseButton.type = 'button';
        increaseButton.textContent = '+';
        increaseButton.setAttribute('aria-label', `Increase ${name}`);
        increaseButton.dataset.action = 'increase';
        increaseButton.dataset.name = name;

        controls.append(
            decreaseButton,
            quantity,
            increaseButton
        );

        item.append(info, controls);
        cartItems.appendChild(item);
    });

    cartTotal.textContent = formatPrice(total);

    // Enable WhatsApp only when the cart has items.
    whatsappButton.disabled = cart.size === 0;
}

/* ========================================
   3. WHATSAPP ORDERING
======================================== */

whatsappButton.addEventListener('click', () => {

    if (cart.size === 0) {
        return;
    }

    let orderMessage = '*OJA KITCHEN - ORDER REQUEST*';

    orderMessage += '\n\nHello! I would like to order:\n';

    let total = 0;

    cart.forEach((dish, name) => {
        const subtotal = dish.price * dish.quantity;

        total += subtotal;

        orderMessage +=
            `\n${name}` +
            `\nQuantity: ${dish.quantity}` +
            `\nPrice: ${formatPrice(dish.price)}` +
            `\nSubtotal: ${formatPrice(subtotal)}\n`;
    });

    orderMessage +=
        `\n*TOTAL: ${formatPrice(total)}*`;

    orderMessage +=
        '\n\nThis is an order request from the Oja Kitchen demo website.';

    const whatsappURL =
        `https://wa.me/?text=${encodeURIComponent(orderMessage)}`;

    window.open(whatsappURL, '_blank', 'noopener,noreferrer');
});


/* ========================================
   4. BACK-TO-TOP BUTTON
======================================== */

const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}