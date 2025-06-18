// Function to delete a product
function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/admin/products/${id}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                alert('Error deleting product');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error deleting product');
        });
    }
} 

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productId = this.dataset.id;
        const name = this.dataset.name;
        const price = parseFloat(this.dataset.price);
        const quantity = document.getElementById(`quantity-${productId}`).value;
        
        addToCart(productId, name, price, quantity);
    });
});

function addToCart(productId, name, price, quantity) {
    fetch('/cart/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId,
            name,
            price,
            quantity: parseInt(quantity)
        })
    })
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            return response.json().then(data => {
                if (data.success) {
                    window.location.href = '/products';
                } else {
                    alert('Error adding product to cart');
                }
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding product to cart');
    });
}

document.querySelectorAll('.quantity-btn').forEach(button => {
    button.addEventListener('click', async function() {
        if (this.classList.contains('remove')) return;
        
        const cartItem = this.closest('.cart-item');
        const productId = cartItem.dataset.id;
        const quantityElement = cartItem.querySelector('.quantity-display');
        let quantity = parseInt(quantityElement.textContent);

        if (this.classList.contains('decrease')) {
            quantity = Math.max(1, quantity - 1);
        } else {
            quantity += 1;
        }

        try {
            const response = await fetch(`/cart/update/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity })
            });

            const data = await response.json();
            if (data.success) {
                quantityElement.textContent = quantity;
                updateCartTotal(data.cart);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error updating quantity');
        }
    });
});

// Remove item
function removeItem(productId) {
    if (confirm('Are you sure you want to remove this item?')) {
        fetch(`/cart/remove/${productId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const cartItem = document.querySelector(`[data-id="${productId}"]`);
                cartItem.remove();
                updateCartTotal(data.cart);
                
                // If cart is empty, reload page to show empty cart message
                if (data.cart.items.length === 0) {
                    window.location.reload();
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error removing item');
        });
    }
}

function updateCartTotal(cart) {
    const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cartTotal').textContent = total.toFixed(2);
}