document.addEventListener('DOMContentLoaded', function () {
  console.log("✅ Variant price sync script loaded (ProductJson version)");

  // ---- Helpers ----
  function formatMoney(cents) {
    let moneyFormat = window.theme?.moneyFormat || "${{amount}}";
    let value = (cents / 100).toFixed(2);
    return moneyFormat.replace("{{amount}}", value);
  }

  function getProductData() {
    const productJsonEl = document.getElementById('ProductJson');
    if (!productJsonEl) {
      console.warn("⚠️ No ProductJson element found in DOM");
      return null;
    }
    try {
      return JSON.parse(productJsonEl.textContent);
    } catch (err) {
      console.error("❌ Error parsing ProductJson:", err);
      return null;
    }
  }

  function getSelectedVariant(productData) {
    const variantIdInput = document.querySelector('form[action*="/cart/add"] [name="id"]');
    if (!variantIdInput) {
      console.warn("⚠️ No variant ID input found");
      return null;
    }

    const variantId = parseInt(variantIdInput.value, 10);
    const variant = productData.variants.find(v => v.id === variantId) || null;
    console.log("🔍 Selected variant ID:", variantId);
    console.log("📦 Variant data:", variant);
    return variant;
  }

  function updatePrices(variant, quantity) {
    if (!variant) return;
    const totalPrice = variant.price * quantity;

    document.querySelectorAll('.price--main .money, .product__price .money, .money').forEach(el => {
      el.textContent = formatMoney(totalPrice);
    });

    console.log(`💰 Updated price: ${formatMoney(totalPrice)}`);
  }

  // ---- Main ----
  const productForm = document.querySelector('form[action*="/cart/add"]');
  if (!productForm) {
    console.warn("⚠️ No product form found");
    return;
  }

  const quantityInput = productForm.querySelector('[name="quantity"]') || { value: 1 };
  const productData = getProductData();
  if (!productData) return;

  function syncPrice() {
    const variant = getSelectedVariant(productData);
    const qty = parseInt(quantityInput.value, 10) || 1;
    console.log("🔢 Quantity:", qty);
    updatePrices(variant, qty);
  }

  // Listeners
  quantityInput.addEventListener('change', syncPrice);
  quantityInput.addEventListener('input', syncPrice);
  productForm.querySelectorAll('select[name="id"], input[name="id"]').forEach(sel => {
    sel.addEventListener('change', syncPrice);
  });

  // First run
  syncPrice();
});
