const addProductButton = document.getElementById("addProductButton");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const darkModeToggleLabel = document.querySelector(".dark-mode-toggle label");
const productCardContainer = document.querySelector(".product-card-container");

let products = [];

window.addEventListener("load", function () {
    loadProductsFromLocalStorage();
    loadDarkMode();
    addProductButton.addEventListener("click", addProductHandler);
});

function loadProductsFromLocalStorage() {
    products = JSON.parse(localStorage.getItem('products')) || [];
    updateProductCards();
}

function loadDarkMode() {
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "enabled") {
        enableDarkMode();
    }
}

function enableDarkMode() {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
    darkModeToggleLabel.textContent = "Light Mode";
    darkModeToggleLabel.classList.add("dark-mode-label");
}

function disableDarkMode() {
    body.classList.remove("dark-mode");
    darkModeToggle.checked = false;
    darkModeToggleLabel.textContent = "Dark Mode";
    darkModeToggleLabel.classList.remove("dark-mode-label");
}

function createProduct(title, description, price, img) {
    return {
        title,
        description,
        price,
        img
    };
}

function saveProductsToLocalStorage(products) {
    const productsJSON = JSON.stringify(products);
    localStorage.setItem('products', productsJSON);
}

function addProductHandler() {
    const newProduct = createProduct("Sample Title", "Sample Description", 9.99, "sample.jpg");
    products = uploadProducts(newProduct, products);
    saveProductsToLocalStorage(products);
    addProductCard(newProduct);
    showProductAddedMessage();
}

function showProductAddedMessage() {
    const feedbackDiv = document.createElement("div");
    feedbackDiv.classList.add("feedback-message");
    feedbackDiv.textContent = "Product added successfully!";
    document.body.appendChild(feedbackDiv);

    setTimeout(() => {
        document.body.removeChild(feedbackDiv);
    }, 3000);
}

function addProductCard(product) {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
        <img class="imgs" src="./imgs/${product.img}" alt="">
        <h3 class="title">${product.title}</h3>
        <p class="description">${product.description}</p>
        <p class="price">Precio: $${product.price.toFixed(2)}</p>
    `;

    productCardContainer.appendChild(productCard);
}

function updateProductCards() {
    products.forEach(addProductCard);
}

darkModeToggle.addEventListener("change", function () {
    if (darkModeToggle.checked) {
        enableDarkMode();
        localStorage.setItem("darkMode", "enabled");
    } else {
        disableDarkMode();
        localStorage.removeItem("darkMode");
    }
});
