

const addProductForm = document.getElementById("productForm");
const goBackLink = document.querySelector(".button-container a");

addProductForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addProductFromForm();
});

goBackLink.addEventListener("click", function (event) {
    event.preventDefault();
    window.location.href = "./../index.html"; 
});


function addProductFromForm() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = parseFloat(document.getElementById("price").value);
    const img = document.getElementById("img").value;

    if (isNaN(price) || price < 0) {
        alert("Please enter a valid positive numeric price.");
        return;
    }

    // if (!img.match(/\.webp$/i)) {
    //     alert("Please enter a valid image file name ('shoe-name.webp').");
    //     return;
    // }

    const product = createProduct(title, description, price, img);
    uploadProducts(product, products);
    updateProductCards();
    saveProductsToLocalStorage();
}

function saveProductsToLocalStorage() {
    const productsJSON = JSON.stringify(products);
    localStorage.setItem('products', productsJSON);
}

function createProduct(title, description, price, img) {
    let product = {
        title,
        description,
        price,
        img,
    };
    return product;
}

function uploadProducts(product, array) {
    array.push(product);
    return array;
}

function updateProductCards() {
    const productCardContainer = document.querySelector(".product-card-container");
    productCardContainer.innerHTML = ""; 

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        addProductCard(product.img, product.title, product.description, product.price);
    }
}

function addProductCard(img, title, description, price) {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
        <img class="imgs" src="./../imgs/shoes/${img}" alt="">
        <h3 class="title">${title}</h3>
        <p class="description">${description}</p>
        <p class="price">Price: $${price.toFixed(2)}</p>
    `;

    const productCardContainer = document.querySelector(".product-card-container");
    productCardContainer.appendChild(productCard);
}

window.addEventListener("load", function () {
    products = JSON.parse(localStorage.getItem('products')) || [];
    updateProductCards();

    // Restore dark mode state
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.checked = true;
        darkModeToggleLabel.textContent = "Light Mode";
        darkModeToggleLabel.classList.add("dark-mode-label");
    }
});

const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const darkModeToggleLabel = document.querySelector(".dark-mode-toggle label");

darkModeToggle.addEventListener("change", function () {
    if (darkModeToggle.checked) {
        body.classList.add("dark-mode");
        darkModeToggleLabel.textContent = "Light Mode";
        darkModeToggleLabel.classList.add("dark-mode-label"); // Add dark mode class
        localStorage.setItem("darkMode", "enabled"); // Save dark mode state
    } else {
        body.classList.remove("dark-mode");
        darkModeToggleLabel.textContent = "Dark Mode";
        darkModeToggleLabel.classList.remove("dark-mode-label"); // Remove dark mode class
        localStorage.removeItem("darkMode"); // Remove dark mode state
    }
});
