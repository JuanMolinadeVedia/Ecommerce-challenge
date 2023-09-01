// Obtener elementos HTML por su ID o clase y asignarlos a variables
const addProductForm = document.getElementById("productForm");
const goBackLink = document.querySelector(".button-container a");
const cardTypeToggle = document.getElementById("cardTypeToggle");
const productCardContainer = document.querySelector(".product-card-container");
const darkModeToggle = document.getElementById("darkModeToggle");
const body = document.body;
const darkModeToggleLabel = document.querySelector(".dark-mode-toggle label");

// Crear una variable para almacenar los productos
let products = [];

// Manejar el evento de envío del formulario
addProductForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario (recargar la página)
    addProductFromForm(); // Llamar a la función para agregar un producto desde el formulario
});

// Manejar el enlace "Go Back"
goBackLink.addEventListener("click", function (event) {
    event.preventDefault(); // Prevenir la acción predeterminada del enlace (navegar a otra página)
    window.location.href = "./../index.html"; // Redirigir a la página principal
});

// Manejar el cambio en el toggle de tipo de tarjeta
cardTypeToggle.addEventListener("change", function () {
    if (cardTypeToggle.checked) {
        // Si el checkbox está marcado, cambiar la clase CSS a "label-card"
        productCardContainer.classList.add("label-card");
    } else {
        // Si el checkbox no está marcado, eliminar la clase CSS "label-card"
        productCardContainer.classList.remove("label-card");
    }
});

// Manejar el cambio en el toggle de modo oscuro
darkModeToggle.addEventListener("change", function () {
    if (darkModeToggle.checked) {
        // Si el toggle está marcado, habilitar el modo oscuro
        body.classList.add("dark-mode");
        darkModeToggleLabel.textContent = "Light Mode"; // Cambiar el texto del label
        darkModeToggleLabel.classList.add("dark-mode-label"); // Agregar una clase CSS
        localStorage.setItem("darkMode", "enabled"); // Guardar el estado del modo oscuro en el almacenamiento local
    } else {
        // Si el toggle no está marcado, deshabilitar el modo oscuro
        body.classList.remove("dark-mode");
        darkModeToggleLabel.textContent = "Dark Mode"; // Restaurar el texto del label
        darkModeToggleLabel.classList.remove("dark-mode-label"); // Eliminar la clase CSS
        localStorage.removeItem("darkMode"); // Eliminar el estado del modo oscuro del almacenamiento local
    }
});

// Función para agregar un producto desde el formulario
function addProductFromForm() {
    // Obtener valores del formulario
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    let price = parseFloat(document.getElementById("price").value);
    const img = document.getElementById("img").value;

    // Validar el precio ingresado
    if (isNaN(price) || price < 0) {
        alert("Please enter a valid positive numeric price.");
        return;
    }

    // Verificar si el toggle de descuento está marcado
    const discounted = cardTypeToggle.checked;

    // Aplicar un 10% de descuento al precio si es necesario
    if (discounted) {
        price = price - (price * 0.10);
    }

    // Crear un objeto de producto con los valores del formulario
    const product = {
        img,
        title,
        description,
        price,
        discounted
    };

    // Llamar a las funciones para agregar el producto a la lista, actualizar las tarjetas y guardar en el almacenamiento local
    addProductCard(product);
    uploadProducts(product, products);
    updateProductCards();
    saveProductsToLocalStorage();
}

// Función para actualizar las tarjetas de productos en el contenedor
function updateProductCards() {
    productCardContainer.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        addProductCard(product);
    }
}

// Función para guardar los productos en el almacenamiento local
function saveProductsToLocalStorage() {
    const productsJSON = JSON.stringify(products);
    localStorage.setItem('products', productsJSON);
}

// Función para crear un objeto de producto
function createProduct(title, description, price, img) {
    let product = {
        title,
        description,
        price,
        img,
    };
    return product;
}

// Función para cargar productos en el array de productos
function uploadProducts(product, array) {
    array.push(product);
    return array;
}

// Función para agregar una tarjeta de producto al contenedor
function addProductCard(product) {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const priceIcon = product.discounted ? '<i class="fas fa-percent"></i>' : '';

    const priceString = product.price.toFixed(2) + (product.discounted ? "⭐" : '');

    // Crear la estructura de la tarjeta de producto con los valores del objeto de producto
    productCard.innerHTML = `
        <img class="imgs" src="./../imgs/shoes/${product.img}" alt="">
        <h3 class="title">${product.title}</h3>
        <p class="description">${product.description}</p>
        <p class="price">${priceIcon} Price: $${priceString}</p>
    `;

    // Agregar la tarjeta de producto al contenedor
    productCardContainer.appendChild(productCard);
}

// Evento de carga de la ventana
window.addEventListener("load", function () {
    // Cargar productos desde el almacenamiento local o inicializar como un array vacío
    const savedProductsJSON = localStorage.getItem('products');
    if (savedProductsJSON) {
        products = JSON.parse(savedProductsJSON);
    }
    updateProductCards();

    // Restaurar estado de modo oscuro
    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "enabled") {
        body.classList.add("dark-mode");
        darkModeToggle.checked = true;
        darkModeToggleLabel.textContent = "Light Mode";
        darkModeToggleLabel.classList.add("dark-mode-label");
    }
});
