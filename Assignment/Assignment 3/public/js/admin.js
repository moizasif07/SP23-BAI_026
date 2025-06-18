// Product Management
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`/admin/products/delete/${productId}`, {
            method: 'DELETE'
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

// Order Management
document.addEventListener('DOMContentLoaded', function() {
    // Handle order details toggle
    document.querySelectorAll('.toggle-details').forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.dataset.orderId;
            const detailsDiv = document.getElementById(`details-${orderId}`);
            detailsDiv.classList.toggle('active');
            this.textContent = detailsDiv.classList.contains('active') ? 'Hide Details' : 'View Details';
        });
    });

    // Handle status updates
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async function() {
            const orderId = this.dataset.orderId;
            const newStatus = this.value;
            
            try {
                const response = await fetch(`/admin/orders/${orderId}/status`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus })
                });

                const data = await response.json();
                if (data.success) {
                    // Update status badge
                    const statusBadge = this.previousElementSibling;
                    statusBadge.className = `status-badge status-${newStatus}`;
                    statusBadge.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                } else {
                    alert('Error updating order status');
                    this.value = this.getAttribute('data-original-value');
                }
            } catch (err) {
                console.error('Error:', err);
                alert('Error updating order status');
                this.value = this.getAttribute('data-original-value');
            }
        });

        // Store original value for rollback
        select.setAttribute('data-original-value', select.value);
    });
}); 