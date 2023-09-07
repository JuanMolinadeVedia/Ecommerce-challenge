// Seleccionando elementos del DOM
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const darkModeToggleLabel = document.querySelector(".dark-mode-toggle label");
const productCardContainer = document.querySelector(".product-card-container");
const productCardDiscountContainer = document.querySelector(".product-card-discount-container");
let products = [];

window.addEventListener("load", function () {
    loadProductsFromLocalStorage();
    loadDarkMode();
    fetchDataAndRenderProducts();
});

async function loadProductsFromLocalStorage() {
    products = await getProductsFromAsyncFunction();
    updateProductCards();
}

async function getProductsFromAsyncFunction() {
    try {
        const productsData = await localStorage.getItem("products");
        return JSON.parse(productsData) || [];
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        return [];
    }
}

function loadDarkMode() {
    const savedDarkMode = localStorage.getItem("darkMode");
    savedDarkMode === "enabled" ? enableDarkMode() : disableDarkMode();
}

function enableDarkMode() {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
    darkModeToggleLabel.textContent = "Light Mode";
    darkModeToggleLabel.classList.add("dark-mode-label");

    // Agregar evento change al checkbox
    darkModeToggle.addEventListener("change", handleDarkModeToggleChange);
}

function disableDarkMode() {
    body.classList.remove("dark-mode");
    darkModeToggle.checked = false;
    darkModeToggleLabel.textContent = "Dark Mode";
    darkModeToggleLabel.classList.remove("dark-mode-label");
}

function handleDarkModeToggleChange() {
    if (darkModeToggle.checked) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

function createProduct(title, description, price, img, discounted = false) {
    return {
        title,
        description,
        price,
        img,
        discounted,
    };
}

function saveProductsToLocalStorage(products) {
    localStorage.setItem("products", JSON.stringify(products));
}

function addProductHandler() {
    const newProduct = createProduct("Sample Title", "Sample Description", 9.99, "sample.jpg");
    products.push(newProduct);
    saveProductsToLocalStorage(products);
    addProductCard(newProduct);
    showProductAddedMessage();
}

function showProductAddedMessage() {
    const feedbackDiv = createDOMElement("div", ["feedback-message"]);
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
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const infoSection = createInfoSection(product);
    const bottomSection = createBottomSection(product);

    productCard.appendChild(infoSection);
    productCard.appendChild(bottomSection);

    if (product.onSale) {
        addDiscountedProduct(productCard);
    } else {
        addRegularProduct(productCard);
    }
}

function createInfoSection(product) {
    const infoSection = document.createElement("div");
    infoSection.classList.add("info");

    const imgElement = document.createElement("img");
    imgElement.classList.add("imgs");
    imgElement.src = product.image;
    imgElement.alt = "";

    const titleElement = document.createElement("h3");
    titleElement.classList.add("title");
    titleElement.textContent = product.title;

    const idElement = document.createElement("p");
    idElement.textContent = "id number";

    infoSection.appendChild(imgElement);
    infoSection.appendChild(titleElement);
    infoSection.appendChild(idElement);

    return infoSection;
}

function createBottomSection(product) {
    const bottomSection = document.createElement("div");
    bottomSection.classList.add("bottom");

    const addButton = createAddButton();
    const pricesDiv = createPricesDiv(product);

    bottomSection.appendChild(addButton);
    bottomSection.appendChild(pricesDiv);

    return bottomSection;
}

function createAddButton() {
    const addButton = document.createElement("button");
    addButton.classList.add("addCart", "button-flex-container");

    const shoppingBagIcon = createSVGIcon("shoppingBagIcon", 24, 26);
    const plusIcon = createSVGIcon("plusIcon", 13, 12);

    addButton.appendChild(shoppingBagIcon);
    addButton.appendChild(plusIcon);

    return addButton;
}

function createPricesDiv(product) {
    const pricesDiv = document.createElement("div");
    pricesDiv.classList.add("prices");

    const listPrice = document.createElement("p");
    listPrice.classList.add("listPrice");

    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = `$${product.price.toFixed(2)}`;

    pricesDiv.appendChild(listPrice);
    pricesDiv.appendChild(price);

    return pricesDiv;
}

function addDiscountedProduct(productCard) {
    productCard.classList.add("offer");

    const priceTagDiv = document.createElement("div");
    priceTagDiv.classList.add("price-tag");

    const labelImg = document.createElement("img");
    labelImg.src = "imgs/label.svg";
    labelImg.alt = "";

    const discountPercent = document.createElement("p");
    discountPercent.classList.add("discount");
    discountPercent.textContent = `10%`;

    priceTagDiv.appendChild(labelImg);
    priceTagDiv.appendChild(discountPercent);

    const bottomSection = productCard.querySelector(".bottom");
    bottomSection.appendChild(priceTagDiv);

    productCardDiscountContainer.appendChild(productCard);

    console.log("Producto descuentado");
}

function addRegularProduct(productCard) {
    productCardContainer.appendChild(productCard);

    console.log("Producto normal agregado");
}

function createSVGIcon(id, width, height) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.id = id;
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("width", width);
    svg.setAttribute("height", height);

    // Aquí puedes agregar el contenido SVG necesario para cada icono

    return svg;
}

function updateProductCards() {
    products.forEach(addProductCard);
}

async function fetchDataAndRenderProducts() {
    try {
        const response = await fetch("https://64f659ae2b07270f705e6753.mockapi.io/api/products");
        const data = await response.json();

        if (Array.isArray(data)) {
            products = data.map(item => {
                const price = parseFloat(item.price);
                const isFeatured = item.featured === true;
                const isOnSale = item.onSale === true;

                return {
                    title: item.title || "",
                    description: item.description || "",
                    price: isNaN(price) ? 0 : price,
                    image: item.image || "",
                    discounted: isOnSale,
                    featured: isFeatured,
                    onSale: isOnSale,
                };
            });

            updateProductCards();
        } else {
            console.error("API data is not a valid array:", data);
        }
    } catch (error) {
        console.error("Error fetching data from the API:", error);
    }
}
