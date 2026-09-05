const navigationScript = document.createElement('script');
navigationScript.src = 'navigation.js';
document.head.append(navigationScript);

const views = [...document.querySelectorAll('.gallery-image')];
const dots = [...document.querySelectorAll('.gallery-dot')];
const thumbs = [...document.querySelectorAll('.gallery-thumb')];
let currentView = 0;
function showView(index) {
  currentView = (index + views.length) % views.length;
  views.forEach((view, i) => view.classList.toggle('active', i === currentView));
  dots.forEach((dot, i) => { dot.classList.toggle('active', i === currentView); dot.setAttribute('aria-current', i === currentView); });
  thumbs.forEach((thumb, i) => thumb.classList.toggle('active', i === currentView));
}
dots.forEach((dot, i) => dot.onclick = () => showView(i));
thumbs.forEach((thumb, i) => thumb.onclick = () => showView(i));
document.querySelector('.previous').onclick = () => showView(currentView - 1);
document.querySelector('.next').onclick = () => showView(currentView + 1);
document.getElementById('detailAdd').onclick = () => { const button = document.getElementById('detailAdd'); button.textContent = 'added to your little hoard ✓'; button.disabled = true; };
