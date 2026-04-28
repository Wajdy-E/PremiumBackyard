document.addEventListener("DOMContentLoaded", function() {
  const thumbnails = document.querySelectorAll("[data-gallery-thumbnail]");

  // Function to set active thumbnail based on media ID
  function setActiveThumbnail(mediaId) {
    thumbnails.forEach((thumb) => {
      if (thumb.dataset.media === String(mediaId)) {
        thumb.classList.add("product-gallery--media-thumbnail--active");
      } else {
        thumb.classList.remove("product-gallery--media-thumbnail--active");
      }
    });
  }

  // Initial active thumbnail on page load
  const selectedThumbnail = document.querySelector("[data-gallery-thumbnail][data-gallery-selected='true']");
  if (selectedThumbnail) {
    setActiveThumbnail(selectedThumbnail.dataset.media);
  }

  // Listen for variant changes
  document.querySelectorAll("[name='id'], .single-option-selector").forEach((selector) => {
    selector.addEventListener("change", function(event) {
      const selectedVariantId = event.target.value;

      // Find the selected variant element in the product JSON
      const selectedVariantEl = document.querySelector(`[data-media][data-variant-id='${selectedVariantId}']`);

      if (selectedVariantEl) {
        setActiveThumbnail(selectedVariantEl.dataset.media);
      } else {
        // fallback: highlight first thumbnail
        setActiveThumbnail(thumbnails[0].dataset.media);
      }
    });
  });
});
