// product.js

const API_URI = "http://localhost:5050/api/products";
const CREATE_PRODUCT_URI = "http://localhost:5050/api/addproduct";
const UPDATE_PRODUCT_URI = "http://localhost:5050/api/updateproduct";
const DELETE_PRODUCT_URI = "http://localhost:5050/api/deleteproduct";

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
                'Authorization': `Bearer ${token}`

            }
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const products = await response.json();
        console.log("Products:", products);
        const role = products.role;
        //console.log("User Role:", role);

        const html = products.products.map(product => `
            <div class="col">
                <div class="card h-100">
                    <img src="${product.Image}" class="card-img-top" alt="${product.Name}">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.Name}</h5>
                        <p>${product.Description}</p>
                        <p><strong>$${product.Price}</strong></p>
                        <div class="d-flex justify-content-center gap-2 mt-3">
                            <button class="btn btn-outline-primary" onclick="compareProduct('${product._id}')">Compare</button>
                            <button class="btn btn-primary" onclick="addToCart('${product._id}')">Add to Cart</button>
                        </div>
                        ${role === 'admin' ? `
                        <div class="d-flex justify-content-center gap-2 mt-2">
                            <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
                            <button class="btn btn-warning" onclick='openUpdateModal(${JSON.stringify(product)})'>Update</button>
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
    if (confirm("Are you sure you want to delete this product?")) {
        try {
            const response = await fetch(`${DELETE_PRODUCT_URI}/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok && data.message == "Product deleted successfully") {
                alert("Product deleted successfully");
                getAllProducts();
            } else {
                alert("Delete failed");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete product.");
        }
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



document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role"); // ✅ استخدم sessionStorage
    const addProductSection = document.getElementById("add-product-section");

    console.log("ROLE from sessionStorage:", role); // لتتبع القيمة في الكونسول

    if (role === "admin") {
        console.log("✅ Admin detected, showing form.");
        if (addProductSection) {
            addProductSection.style.display = "block";
        }
    } else {
        console.log("⛔ Not admin, hiding form.");
    }

    // ✅ Event listener for the add product form
    const addForm = document.getElementById("add-product-form");
    if (addForm) {
        addForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const Name = document.getElementById("addProductName").value;
            const Price = document.getElementById("addProductPrice").value;
            const Description = document.getElementById("addProductDescription").value;
            const Image = document.getElementById("addProductImage").value;

            try {
                const response = await fetch("http://localhost:5050/api/addproduct", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ Name, Price, Description, Image })
                });

                const data = await response.json();

                if (response.ok && data.message === "Product added successfully") {
                    alert("✅ Product added successfully!");
                    addForm.reset();
                    getAllProducts();
                } else {
                    alert("❌ Failed to add product: " + (data.message || "Unknown error"));
                }
            } catch (error) {
                console.error("Add product error:", error);
                alert("Something went wrong. Please try again.");
            }
        });
    }
});

function openUpdateModal(product) {
    // تعبئة البيانات
    document.getElementById('updateProductId').value = product._id;
    document.getElementById('updateProductName').value = product.Name;
    document.getElementById('updateProductDescription').value = product.Description;
    document.getElementById('updateProductPrice').value = product.Price;
    document.getElementById('updateProductImage').value = product.Image;

    // فتح المودال
    const modal = new bootstrap.Modal(document.getElementById('updateProductModal'));
modal.show();

}
document.getElementById("updateProductForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("updateProductId").value;
    const Name = document.getElementById("updateProductName").value;
    const Description = document.getElementById("updateProductDescription").value;
    const Price = document.getElementById("updateProductPrice").value;
    const Image = document.getElementById("updateProductImage").value;

    try {
        const response = await fetch(`${UPDATE_PRODUCT_URI}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Name, Description, Price, Image })
        });

        const data = await response.json();

        if (response.ok && data.message === "Product updated successfully") {
            alert("✅ Product updated successfully");
            getAllProducts();
            bootstrap.Modal.getInstance(document.getElementById('updateProductModal')).hide();
        } else {
            alert("❌ Failed to update product");
        }
    } catch (error) {
        console.error("Update error:", error);
        alert("❌ Error updating product.");
    }
});

