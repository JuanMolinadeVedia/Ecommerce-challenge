const addProductButton = document.getElementById("addProductButton");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const darkModeToggleLabel = document.querySelector(".dark-mode-toggle label");
const productCardContainer = document.querySelector(".product-card-container");
const productCardDiscountContainer = document.querySelector(".product-card-discount-container");

let products = [];

window.addEventListener("load", function () {
    loadProductsFromLocalStorage();
    loadDarkMode();
    addProductButton.addEventListener("click", addProductHandler);
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
    products = uploadProducts(newProduct, products);
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
    const infoSection = document.createElement("div");
    infoSection.classList.add("info");
    const imgElement = document.createElement("img");
    imgElement.classList.add("imgs");
    const imgSrc = `./imgs/shoes/${product.img}`;
    imgElement.src = imgSrc;
    imgElement.alt = "";
    const titleElement = document.createElement("h3");
    titleElement.classList.add("title");
    titleElement.textContent = product.title;
    const idElement = document.createElement("p");
    idElement.textContent = "id number";
    infoSection.appendChild(imgElement);
    infoSection.appendChild(titleElement);
    infoSection.appendChild(idElement);
    const bottomSection = document.createElement("div");
    bottomSection.classList.add("bottom");
    const addButton = document.createElement("button");
    addButton.classList.add("addCart", "button-flex-container");
    const shoppingBagIcon = document.createElement("svg");
    shoppingBagIcon.innerHTML = `
        <svg id="shoppingBagIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
    <g clip-path="url(#clip0_471_394)">
        <path d="M5.36048 1.91846L2.11188 6.32375V21.7423C2.11188 22.3264 2.34005 22.8867 2.74621 23.2998C3.15236 23.7128 3.70322 23.9449 4.27761 23.9449H19.4378C20.0121 23.9449 20.5630 23.7128 20.9692 23.2998C21.3753 22.8867 21.6035 22.3264 21.6035 21.7423V6.32375L18.3549 1.91846H5.36048Z" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M2.11188 6.32379H21.6035" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16.1892 10.729C16.1892 11.8974 15.7328 13.0179 14.9205 13.844C14.1082 14.6702 13.0065 15.1343 11.8577 15.1343C10.7089 15.1343 9.60718 14.6702 8.79487 13.844C7.98256 13.0179 7.52621 11.8974 7.52621 10.729" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
        <clipPath id="clip0_471_394">
        <rect width="22.7402" height="25.6057" fill="white" transform="translate(0.487579 0.266479)"/>
        </clipPath>
    </defs>
    </svg>
    `;
    shoppingBagIcon.alt = "Shopping Bag";
    
    const plusIcon = document.createElement("svg");
    plusIcon.innerHTML = `
    <svg id="plusIcon" xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
    <g clip-path="url(#clip0_471_398)">
      <path d="M6.3493 2.07715V9.7864" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2.55927 5.93176H10.1393" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <defs>
      <clipPath id="clip0_471_398">
        <rect width="11.3701" height="10.7379" fill="white" transform="translate(0.664246 0.700439)"/>
      </clipPath>
    </defs>
  </svg>
    `;
    plusIcon.alt = "Add to Cart";
    addButton.appendChild(shoppingBagIcon);
    addButton.appendChild(plusIcon);
    const pricesDiv = document.createElement("div");
    pricesDiv.classList.add("prices");
    const listPrice = document.createElement("p");
    listPrice.classList.add("listPrice");
    const price = document.createElement("p");
    price.classList.add("price");
    price.textContent = `$${product.price.toFixed(2)}`;
    pricesDiv.appendChild(listPrice);
    pricesDiv.appendChild(price);
    // Agregar el div de precio de descuento si el producto tiene descuento
    if (product.discounted) {
        productCard.classList.add("offer");
        const priceTagDiv = document.createElement("div");
        priceTagDiv.classList.add("price-tag");
        const labelImg = document.createElement("img");
        labelImg.src = "imgs/label.svg";
        labelImg.alt = "";
        const discountPercent = document.createElement("p");
        discountPercent.classList.add("discount");
        discountPercent.textContent = `10%`; // Mostrar el porcentaje de descuento real
        priceTagDiv.appendChild(labelImg);
        priceTagDiv.appendChild(discountPercent);
        bottomSection.appendChild(priceTagDiv);
        productCardDiscountContainer.appendChild(productCard);
    } else {
        productCardContainer.appendChild(productCard);
    }
    bottomSection.appendChild(addButton);
    bottomSection.appendChild(pricesDiv);
    productCard.appendChild(infoSection);
    productCard.appendChild(bottomSection);
    // Agregar la tarjeta de producto al contenedor
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