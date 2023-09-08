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
    idElement.textContent = product.id; // Agregar el valor de id

    
    const starsIcon = createStarsIcon(product.stars);

    infoSection.appendChild(imgElement);
    infoSection.appendChild(titleElement);
    infoSection.appendChild(idElement);
    infoSection.appendChild(starsIcon);

    return infoSection;
}

function createStarsIcon(stars) {
    const starSection = document.createElement("div");
    starSection.classList.add("stars");

    // Crear estrellas llenas
    for (let i = 0; i < stars; i++) {
        const starIcon = document.createElement("svg");
        starIcon.innerHTML = `
        <svg class="starsIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD100" stroke="#FFD100" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;
        starSection.appendChild(starIcon); // Agregar cada estrella al contenedor
    }

    // Crear estrellas vacías (suponiendo que el máximo es 5)
    const emptyStars = 5 - stars;
    for (let i = 0; i < emptyStars; i++) {
        // Crear un elemento SVG vacío o utilizar un icono de estrella vacía si tienes uno
        const emptyStarSvg = document.createElement("svg");
        emptyStarSvg.innerHTML = `
        <svg class="starsIconEmpty" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#808080" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        `;
        starSection.appendChild(emptyStarSvg);
    }

    return starSection;
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

    return addButton;
}

function createPricesDiv(product) {
    const pricesDiv = document.createElement("div");
    pricesDiv.classList.add("prices");

    const listPrice = document.createElement("p");
    listPrice.classList.add("listPrice");
    listPrice.textContent = `$${product.previousPrice.toFixed(2)}`; // Agregar el previousPrice aquí

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

}

function addRegularProduct(productCard) {
    productCardContainer.appendChild(productCard);

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
                const previousPrice = parseFloat(item.previousPrice);
                const isFeatured = item.featured === true;
                const isOnSale = item.onSale === true;
                const stars = item.stars;
                const id = item.id || ""; // Corrección aquí
        
                return {
                    title: item.title || "",
                    description: item.description || "",
                    price: isNaN(price) ? 0 : price,
                    previousPrice: isNaN(previousPrice) ? 0 : previousPrice,
                    image: item.image || "",
                    discounted: isOnSale,
                    featured: isFeatured,
                    onSale: isOnSale,
                    stars: stars || 0,
                    id: id,
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