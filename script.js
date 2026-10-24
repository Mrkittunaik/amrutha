// mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('mainnav');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }));
document.addEventListener('click', e => { if (nav.classList.contains('open') && !nav.contains(e.target) && !toggle.contains(e.target)) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); } });

// donate modal
const PLANS = {
  veg:    {label: 'Veg',     rows: [[30,1000],[60,2000],[90,3000],[120,4000]]},
  nonveg: {label: 'Non-Veg', rows: [[20,1000],[40,2000],[60,3000],[80,4000],[100,5000],[120,6000]]}
};
const modal = document.getElementById('donate-modal');
const plansEl = document.getElementById('plans');
const summary = document.getElementById('summary');
const tabs = modal.querySelectorAll('.tab');
const inr = n => '\u20B9' + n.toLocaleString('en-IN');
let curTab = 'veg', curPlan = null;

function renderPlans() {
  plansEl.className = 'plans ' + curTab;
  plansEl.innerHTML = '';
  PLANS[curTab].rows.forEach(([packs, amt], i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'plan' + (curPlan === i ? ' sel' : '');
    b.innerHTML = '<span>' + packs + '</span><span class="eq">=</span><span class="amt">' + inr(amt) + '</span>';
    b.addEventListener('click', () => { curPlan = i; renderPlans(); });
    plansEl.appendChild(b);
  });
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === curTab));
  if (curPlan === null) { summary.textContent = 'Select a plan above'; return; }
  const [packs, amt] = PLANS[curTab].rows[curPlan];
  summary.innerHTML = '<b>' + packs + ' ' + PLANS[curTab].label + ' food packs</b> = <b>' + inr(amt) + '</b><br>Advance now: <b>' + inr(amt / 2) + '</b> &middot; Balance after photos/videos: <b>' + inr(amt / 2) + '</b>';
}
function openModal(tab) {
  curTab = tab || 'veg'; curPlan = null;
  renderPlans();
  document.getElementById('don-msg').textContent = '';
  modal.hidden = false;
  document.body.classList.add('modal-open');
}
function closeModal() { modal.hidden = true; document.body.classList.remove('modal-open'); }
tabs.forEach(t => t.addEventListener('click', () => { curTab = t.dataset.tab; curPlan = null; renderPlans(); }));
document.querySelectorAll('[data-open-donate]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openModal(b.dataset.tab); }));
modal.addEventListener('click', e => { if (e.target === modal || e.target.hasAttribute('data-close')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

// WhatsApp number of the trust (country code + number, digits only).
const WHATSAPP_NUMBER = '918074996352';
document.getElementById('don-form').addEventListener('submit', e => {
  e.preventDefault();
  const m = document.getElementById('don-msg');
  const name = document.getElementById('d-name').value.trim();
  const phone = document.getElementById('d-phone').value.trim();
  const mail = document.getElementById('d-email').value.trim();
  m.className = 'form-msg err';
  if (curPlan === null) { m.textContent = 'Please select a plan.'; return; }
  if (!name) { m.textContent = 'Please enter your name.'; return; }
  if (!/^[+\d][\d\s-]{8,14}$/.test(phone)) { m.textContent = 'Please enter a valid phone number.'; return; }
  if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) { m.textContent = 'Please enter a valid email.'; return; }
  const [packs, amt] = PLANS[curTab].rows[curPlan];
  const text = 'Hello, I am ' + name + ' (' + phone + '). I want to donate ' + packs + ' ' + PLANS[curTab].label + ' food packs for ' + inr(amt) + '. I will pay half (' + inr(amt / 2) + ') in advance.';
  if (WHATSAPP_NUMBER) {
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text), '_blank');
  }
  m.className = 'form-msg ok';
  m.textContent = 'Thank you, ' + name + '! We will contact you to confirm your donation.';
});

// testimonial switching
const testimonials = [
  {name: 'A Kind Donor', text: 'I sponsored a meal for the children and got photos and a video of each food packet being handed out. Seeing their smiles made it worth every rupee.'},
  {name: 'A Monthly Supporter', text: 'It is easy to give and easy to trust. The team keeps us updated, and we can see exactly where our help goes.'},
  {name: 'A Volunteer', text: 'Serving food to the children on weekends is the best part of my week. They are full of joy and hope.'},
  {name: 'A Family Donor', text: 'We donated on our child\'s birthday. The photo with our name on the food packets was a lovely surprise.'},
  {name: 'A Well-Wisher', text: 'Food, care and education together can truly change a child\'s life. I am proud to support this work.'}
];
const tText = document.getElementById('testi-text');
const tName = document.getElementById('testi-name');
const avs = document.querySelectorAll('.av');
avs.forEach(av => av.addEventListener('click', () => {
  const t = testimonials[+av.dataset.i];
  tText.textContent = t.text;
  tName.textContent = t.name;
  avs.forEach(a => a.classList.remove('active'));
  av.classList.add('active');
}));

// subscribe validation
const form = document.getElementById('sub-form');
const email = document.getElementById('sub-email');
const msg = document.getElementById('sub-msg');
form.addEventListener('submit', e => {
  e.preventDefault();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
  msg.textContent = ok ? 'Thanks for subscribing!' : 'Please enter a valid email address.';
  msg.classList.add('show');
  if (ok) {
    window.open('https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Hello, please keep me updated. My email: ' + email.value.trim()), '_blank');
    form.reset();
  }
  setTimeout(() => msg.classList.remove('show'), 3500);
});

// floating nav: shrink and add shadow once scrolled past the top bar
const navEl = document.querySelector('.nav');
const onScroll = () => navEl.classList.toggle('stuck', window.scrollY > 35);
window.addEventListener('scroll', onScroll, {passive: true});
onScroll();

// plan cards (mobile): own swipe handling so both directions always work.
// The card nearest the middle is the big one; swipe either way to move one card.
const cGrid = document.querySelector('.cause-grid');
if (cGrid) {
  const cards = [...cGrid.querySelectorAll('.cause')];
  const track = document.createElement('div');
  track.className = 'cause-track';
  cards.forEach(c => track.appendChild(c));
  cGrid.appendChild(track);
  track.querySelectorAll('img').forEach(im => { im.draggable = false; });
  const dots = document.createElement('div');
  dots.className = 'cause-dots';
  cards.forEach(() => dots.appendChild(document.createElement('i')));
  cGrid.after(dots);

  let idx = 0, base = 0, startX = 0, startY = 0, dragging = false, moved = false, locked = null, lastX = 0, lastT = 0, vel = 0, cur = 0;
  const isMobile = () => window.innerWidth <= 820;
  const posFor = i => cGrid.clientWidth / 2 - (cards[i].offsetLeft + cards[i].offsetWidth / 2);
  const mark = i => {
    cards.forEach((c, k) => c.classList.toggle('active', k === i));
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
  };
  const nearestTo = x => {                       // x = translate value
    const mid = cGrid.clientWidth / 2 - x;
    let b = 0, bd = 1e9;
    cards.forEach((c, k) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; b = k; } });
    return b;
  };
  const show = (i, animate) => {
    idx = Math.max(0, Math.min(cards.length - 1, i));
    cur = posFor(idx);
    track.style.transition = animate ? 'transform .38s cubic-bezier(.22,.8,.3,1)' : 'none';
    track.style.transform = 'translate3d(' + cur + 'px,0,0)';
    mark(idx);
  };
  const layout = () => {
    if (!isMobile()) { track.style.transform = ''; track.style.transition = ''; cards.forEach(c => c.classList.remove('active')); return; }
    show(idx, false);
  };

  cGrid.addEventListener('pointerdown', e => {
    if (!isMobile() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    dragging = true; moved = false; locked = null;
    startX = lastX = e.clientX; startY = e.clientY; lastT = performance.now(); vel = 0; base = cur;
    track.style.transition = 'none';
  });
  cGrid.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (locked === null && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) locked = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    if (locked === 'y') { dragging = false; show(idx, true); return; }   // let the page scroll
    if (locked !== 'x') return;
    if (!moved) { moved = true; try { cGrid.setPointerCapture(e.pointerId); } catch (_) {} }
    const now = performance.now();
    vel = (e.clientX - lastX) / Math.max(1, now - lastT);
    lastX = e.clientX; lastT = now;
    let x = base + dx;
    const lo = posFor(cards.length - 1), hi = posFor(0);          // soft resistance at both ends
    if (x > hi) x = hi + (x - hi) * .35;
    if (x < lo) x = lo + (x - lo) * .35;
    cur = x;
    track.style.transform = 'translate3d(' + x + 'px,0,0)';
    mark(nearestTo(x));
  });
  const end = () => {
    if (!dragging) return;
    dragging = false;
    if (!moved) { show(idx, true); return; }
    let target = nearestTo(cur);
    if (vel < -0.35) target = Math.max(target, idx + 1);
    else if (vel > 0.35) target = Math.min(target, idx - 1);
    show(target, true);
  };
  cGrid.addEventListener('pointerup', end);
  cGrid.addEventListener('pointercancel', end);
  cGrid.addEventListener('click', e => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
  [...dots.children].forEach((d, i) => d.addEventListener('click', () => show(i, true)));
  cards.forEach((c, i) => c.addEventListener('click', e => { if (isMobile() && i !== idx && !e.target.closest('a')) show(i, true); }));
  window.addEventListener('resize', layout);
  window.addEventListener('load', layout);
  layout();
}
