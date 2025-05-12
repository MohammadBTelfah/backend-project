API_URI="http://localhost:5050/api/products"
CREATE_PRODUCT_URI="http://localhost:5050/api/addproduct"
UPDATE_PRODUCT_URI="http://localhost:5050/api/updateproduct"
DELETE_PRODUCT_URI="http://localhost:5050/api/deleteproduct"
const token = sessionStorage.getItem("token");
if (!token) {
    window.location.href = "login.html";
}

//get all products and fill the cards
async function getAllProducts() {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = ""; // Clear existing content

    try {
        const response = await fetch(API_URI, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log("API URI:", API_URI);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const products = await response.json();

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";
            productCard.innerHTML = `
          <div class="card mb-3">
<div class="row row-cols-1 row-cols-md-3 g-4">
    ${products.map(product => `
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
                <div class="d-flex justify-content-center gap-2 mt-2">
                    <button class="btn btn-danger" onclick="deleteProduct('${product._id}')">Delete</button>
                    <button class="btn btn-warning" onclick="updateProduct('${product._id}', UPDATE_PRODUCT_URI)">Update</button>
                </div>
            </div>
        </div>
    </div>
    `).join('')}
</div>

    `;
            productContainer.appendChild(productCard);
            console.log(productCard);
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        productContainer.innerHTML = `<p class="text-danger">Failed to load products. Please try again later.</p>`;
    }
}
// Call the function to fetch and display products
getAllProducts();

// Function to delete a product
async function deleteProduct(productId) {
    const confirmation = confirm("Are you sure you want to delete this product?");
    if (!confirmation) {
        return; // Exit if the user cancels the action
    }

    try {
        const response = await fetch(`${DELETE_PRODUCT_URI}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        alert("Product deleted successfully");
        getAllProducts(); // Refresh the product list
    } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again later.");
    }
}
// Function to update a product
async function updateProduct(productId, UPDATE_PRODUCT_URI) {
    try {
        const response = await fetch(`${UPDATE_PRODUCT_URI}/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const product = await response.json();

        document.getElementById("updateProductName").value = product.Name;
        document.getElementById("updateProductDescription").value = product.Description;
        document.getElementById("updateProductPrice").value = product.Price;
        document.getElementById("updateProductImage").value = product.Image;

        const updateModal = new bootstrap.Modal(document.getElementById("updateProductModal"));
        updateModal.show();

        document.getElementById("updateProductForm").onsubmit = async (event) => {
            event.preventDefault();

            const updatedProduct = {
                Name: document.getElementById("updateProductName").value,
                Description: document.getElementById("updateProductDescription").value,
                Price: parseFloat(document.getElementById("updateProductPrice").value),
                Image: document.getElementById("updateProductImage").value
            };

            try {
                const updateResponse = await fetch(`${UPDATE_PRODUCT_URI}/${productId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(updatedProduct)
                });

                if (!updateResponse.ok) {
                    throw new Error(`Error: ${updateResponse.status} - ${updateResponse.statusText}`);
                }

                alert("Product updated successfully");
                updateModal.hide();
                getAllProducts();

            } catch (error) {
                console.error("Error updating product:", error);
                alert("Failed to update product. Please try again later.");
            }
        };

    } catch (error) {
        console.error("Error fetching product details:", error);
        alert("Failed to load product details. Please try again later.");
    }
}