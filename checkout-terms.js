document.addEventListener('click', event => {
  if (!event.target.closest('.checkout-button')) return;
  location.href = 'terms.html?next=checkout';
});
