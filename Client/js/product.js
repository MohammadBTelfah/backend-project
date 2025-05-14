API_URI="http://localhost:5050/api/products"
CREATE_PRODUCT_URI="http://localhost:5050/api/addproduct"
UPDATE_PRODUCT_URI="http://localhost:5050/api/getproductbyid"
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
                    <button class="btn btn-warning" onclick="updateForm('${product._id}', UPDATE_PRODUCT_URI)">Update</button>
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
const updateForm = document.getElementById("update");
updateForm.onsubmit = async (e) => {
    e.preventDefault();
    console.log("updated product",productId,updateProductName.value,updateProductDescription.value,updateProductPrice.value,updateProductImage.value);
try {
    const response = await fetch(`${UPDATE_PRODUCT_URI}/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            Name: updateProductName.value,
            Description: updateProductDescription.value,
            Price: updateProductPrice.value,
            Image: updateProductImage.value
        })
    });
    const data = await response.json();
    if(response.ok && data.message === "Product updated successfully") {
        alert("Product updated successfully");
        getAllProducts(); // Refresh the product list
    }
    else {
        alert("Failed to update product. Please try again later.");
    }
} catch (error) {
    console.error("Error updating product:", error);
    alert("Failed to update product. Please try again later.");
}}