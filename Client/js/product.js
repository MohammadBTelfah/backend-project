// product.js

const API_URI = "http://localhost:5050/api/products";
const CREATE_PRODUCT_URI = "http://localhost:5050/api/products";
const UPDATE_PRODUCT_URI = "http://localhost:5050/api/products";
const DELETE_PRODUCT_URI = "http://localhost:5050/api/products";

const token = sessionStorage.getItem("token");
const role = sessionStorage.getItem("role");

if (!token) {
    window.location.href = "login.html";
}

// ✅ عرض كل المنتجات
async function getAllProducts() {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";

    try {
        const response = await fetch(API_URI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const products = await response.json();

        const html = products.map(product => `
            <div class="col">
                <div class="card h-100">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p>${product.description}</p>
                        <p><strong>$${product.price}</strong></p>
                        <div class="d-flex justify-content-center gap-2 mt-3">
                            <button class="btn btn-outline-primary" onclick="compareProduct('${product._id}')">Compare</button>
                            <button class="btn btn-primary" onclick="addToCart('${product._id}')">Add to Cart</button>
                        </div>
                        ${role === 'admin' ? `
                        <div class="d-flex justify-content-center gap-2 mt-2">
                            <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
                            <button class="btn btn-warning" onclick="fillUpdateForm('${product._id}')">Update</button>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join("");

        productContainer.innerHTML = `<div class="row row-cols-1 row-cols-md-3 g-4">${html}</div>`;

    } catch (error) {
        console.error("Error fetching products:", error);
        productContainer.innerHTML = `<p class="text-danger">Failed to load products. Please try again later.</p>`;
    }
}

getAllProducts();

// ✅ حذف المنتج
async function deleteProduct(productId) {
    const confirmation = confirm("Are you sure you want to delete this product?");
    if (!confirmation) return;

    try {
        const response = await fetch(`${DELETE_PRODUCT_URI}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Delete failed");

        alert("Product deleted successfully");
        getAllProducts();
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product.");
    }
}

// ✅ تحميل بيانات المنتج في الفورم للتعديل
async function fillUpdateForm(productId) {
    try {
        const response = await fetch(`${UPDATE_PRODUCT_URI}/${productId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        // عيّن القيم في الفورم
        document.getElementById("updateProductId").value = data._id;
        document.getElementById("updateProductName").value = data.name;
        document.getElementById("updateProductDescription").value = data.description;
        document.getElementById("updateProductPrice").value = data.price;
        document.getElementById("updateProductImage").value = data.image;
    } catch (error) {
        alert("Failed to load product data.");
    }
}

// ✅ تحديث المنتج
const updateForm = document.getElementById("update");
updateForm.onsubmit = async (e) => {
    e.preventDefault();

    const productId = document.getElementById("updateProductId").value;

    try {
        const response = await fetch(`${UPDATE_PRODUCT_URI}/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: document.getElementById("updateProductName").value,
                description: document.getElementById("updateProductDescription").value,
                price: document.getElementById("updateProductPrice").value,
                image: document.getElementById("updateProductImage").value
            })
        });

        const data = await response.json();

        if (response.ok && data.message === "Product updated successfully") {
            alert("Product updated successfully");
            getAllProducts();
        } else {
            alert("Update failed");
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("Failed to update product.");
    }
}
