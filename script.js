const products = [
    {id: 1, name: "Smart Watch", price: 1299, image: "⌚", category: "Electronics"},
    {id: 2, name: "Headphones", price: 899, image: "🎧", category: "Electronics"},
    {id: 3, name: "Backpack", price: 699, image: "🎒", category: "Accessories"},
    {id: 4, name: "Sneakers", price: 1499, image: "👟", category: "Fashion"},
    {id: 5, name: "Sunglasses", price: 499, image: "🕶️", category: "Fashion"},
    {id: 6, name: "Camera", price: 2499, image: "📷", category: "Electronics"},
    {id: 7, name: "Perfume", price: 799, image: "🌸", category: "Beauty"},
    {id: 8, name: "Water Bottle", price: 299, image: "🧴", category: "Lifestyle"}
];

let cart = JSON.parse(localStorage.getItem("cart")) || {};

const money = amount =>
    amount.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR"
    });

function renderProducts() {
    const container = document.getElementById("products");

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image}</div>
            <h3>${product.name}</h3>
            <p>${money(product.price)}</p>
            <small>${product.category}</small>
            <br><br>
            <button class="add-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `).join("");
}

function addToCart(id) {
    cart[id] = (cart[id] || 0) + 1;
    saveCart();
}

function changeQuantity(id, delta) {
    cart[id] = (cart[id] || 0) + delta;

    if (cart[id] <= 0) {
        delete cart[id];
    }

    saveCart();
}

function removeItem(id) {
    delete cart[id];
    saveCart();
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const container = document.getElementById("cartItems");

    let count = 0;
    let subtotal = 0;

    const items = Object.keys(cart);

    if (items.length === 0) {
        container.innerHTML = "<p>Your cart is empty!</p>";
    } else {
        container.innerHTML = items.map(id => {
            const product = products.find(p => p.id === Number(id));
            const quantity = cart[id];

            count += quantity;
            subtotal += product.price * quantity;

            return `
                <div class="cart-item">
                    <div>
                        <strong>${product.name}</strong>
                        <p>${money(product.price * quantity)}</p>
                    </div>

                    <div>
                        <button class="quantity-btn"
                            onclick="changeQuantity(${id}, -1)">−</button>

                        ${quantity}

                        <button class="quantity-btn"
                            onclick="changeQuantity(${id}, 1)">+</button>

                        <button class="remove-btn"
                            onclick="removeItem(${id})">Remove</button>
                    </div>
                </div>
            `;
        }).join("");
    }

    const delivery = subtotal > 0 && subtotal < 500 ? 40 : 0;

    document.getElementById("cartCount").textContent = count;
    document.getElementById("subtotal").textContent = money(subtotal);
    document.getElementById("delivery").textContent = money(delivery);
    document.getElementById("total").textContent = money(subtotal + delivery);
}

function checkout() {
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty!");
        return;
    }

    let summary = "";

    Object.keys(cart).forEach(id => {
        const product = products.find(p => p.id === Number(id));

        summary += `
            <p>${product.name} × ${cart[id]} =
            ${money(product.price * cart[id])}</p>
        `;
    });

    const subtotal = Object.keys(cart).reduce((sum, id) => {
        const product = products.find(p => p.id === Number(id));
        return sum + product.price * cart[id];
    }, 0);

    const delivery = subtotal < 500 ? 40 : 0;

    summary += `
        <hr>
        <p>Subtotal: ${money(subtotal)}</p>
        <p>Delivery: ${money(delivery)}</p>
        <h3>Total: ${money(subtotal + delivery)}</h3>
    `;

    document.getElementById("orderSummary").innerHTML = summary;

    document.getElementById("checkoutModal").showModal();
}

function closeCheckout() {
    document.getElementById("checkoutModal").close();
}

document.getElementById("cartBtn").addEventListener("click", () => {
    document.querySelector(".cart-section").scrollIntoView({
        behavior: "smooth"
    });
});

renderProducts();
renderCart();