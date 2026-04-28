document.addEventListener('DOMContentLoaded', function () {
  var productForm = document.querySelector('form[action*="/cart/add"]');
  if (!productForm) return;

  var productHandle = window.location.pathname.split('/').pop().replace(/\?.*/, '');
  var quantityInput = productForm.querySelector('[name="quantity"]') || { value: 1 };
  var variantSelects = productForm.querySelectorAll('select[name="id"], input[name="id"][type="hidden"]');
  var productData = null;

  function formatMoney(cents) {
  // Make sure we handle integer cents and return a $XX.XX format
  let value = (cents / 100).toFixed(2);
  return `$${value}`;
}

  function updatePrices(variant, quantity) {
    if (!variant) return;
    var totalPrice = variant.price * quantity;

    document.querySelectorAll('.price-item.price-item--regular').forEach(function (el) {
  el.textContent = formatMoney(totalPrice);
});

  }

  function getSelectedVariant() {
    if (!productData) return null;
    var variantId = parseInt(productForm.querySelector('[name="id"]').value, 10);
    return productData.variants.find(v => v.id === variantId) || null;
  }

  function syncPrice() {
    var variant = getSelectedVariant();
    var qty = parseInt(quantityInput.value, 10) || 1;
    updatePrices(variant, qty);
  }

  // Fetch product JSON first
  fetch('/products/' + productHandle + '.js')
    .then(response => response.json())
    .then(data => {
      productData = data;

      // Add listeners
      quantityInput.addEventListener('change', syncPrice);
      quantityInput.addEventListener('input', syncPrice);
      variantSelects.forEach(sel => sel.addEventListener('change', syncPrice));

      // Initial run
      syncPrice();
    })
    .catch(err => console.error('Error fetching product data:', err));
});
