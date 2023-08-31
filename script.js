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
function createDOMElement(tag, classNames = []) {
    const element = document.createElement(tag);
    element.classList.add(...classNames);
    return element;
}
function addProductCard(product) {
    const productCard = createDOMElement("div", ["container"]);

    const infoSection = createDOMElement("div", ["info"]);

    const imgElement = createDOMElement("img");
    imgElement.src = `./imgs/shoes/${product.img}`;
    imgElement.alt = "";

    const titleElement = createDOMElement("h3", ["title"]);
    titleElement.textContent = product.title;

    const idElement = createDOMElement("p");
    idElement.textContent = "id number";

    infoSection.appendChild(imgElement);
    infoSection.appendChild(titleElement);
    infoSection.appendChild(idElement);

    const bottomSection = createDOMElement("div", ["bottom"]);

    const addButton = createDOMElement("button", ["addCart"]);

    addButton.classList.add("button-flex-container");

    const shoppingBagIcon = createDOMElement("img");
    shoppingBagIcon.src = "./imgs/card/shopping-bag.svg";
    shoppingBagIcon.alt = "Shopping Bag";

    const plusIcon = createDOMElement("img");
    plusIcon.src = "./imgs/card/plus.svg";
    plusIcon.alt = "Add to Cart";

    addButton.appendChild(shoppingBagIcon);
    addButton.appendChild(plusIcon);

    const pricesDiv = createDOMElement("div", ["prices"]);

    const listPrice = createDOMElement("p", ["listPrice"]);

    const price = createDOMElement("p", ["price"]);
    price.textContent = `$${product.price.toFixed(2)}`;

    pricesDiv.appendChild(listPrice);
    pricesDiv.appendChild(price);

    bottomSection.appendChild(addButton);
    bottomSection.appendChild(pricesDiv);

    productCard.appendChild(infoSection);
    productCard.appendChild(bottomSection);

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
addProductButton.addEventListener("click", addProductHandler);
