const plans = {
  Friday: { label: 'Friday, 12 June', title: 'Settle in slowly', routeTime: '3h 20m', routeDetail: '3.8 km on foot · 2 stops', stops: [['16:30', 'Hotel terrace', 'Check-in · waterfront', 'Your room is ready after 16:00. Ask for a west-facing balcony.'], ['19:00', 'The long table', 'Dinner · old town', 'Reservation held under Nia. A short taxi ride from the hotel.']] },
  Saturday: { label: 'Saturday, 13 June', title: 'The blue edge', routeTime: '5h 40m', routeDetail: '7.2 km on foot · 3 stops', stops: [['09:00', 'First coffee', 'Karya square · 12 min walk', 'Outdoor table saved. The bakery next door opens at 08:30.'], ['11:30', 'Milos beach', 'Swim · 28 min walk', 'Bring water shoes. The path is shaded until the final ten minutes.'], ['18:45', 'Salt & stone', 'Dinner · old harbour', 'Table for two, outdoors. Sunset begins at 20:33.']] },
  Sunday: { label: 'Sunday, 14 June', title: 'Leave room for detours', routeTime: '2h 10m', routeDetail: '2.4 km on foot · 2 stops', stops: [['10:00', 'Market provisions', 'Town market · 8 min walk', 'Pick up olive bread and fruit for the drive.'], ['13:30', 'A last swim', 'Pefkoulia beach · 16 min ride', 'Park at the north lot to avoid the busiest stretch.']] }
};

const previewParams = new URLSearchParams(window.location.search);
if (previewParams.has('embed')) {
  document.documentElement.classList.add('embed-mode');
  const fitEmbeddedPreview = () => {
    const scale = Math.min(window.innerWidth / 390, window.innerHeight / 844);
    document.documentElement.style.setProperty('--embed-scale', String(scale));
  };
  fitEmbeddedPreview();
  window.addEventListener('resize', fitEmbeddedPreview);
}

const feedback = document.querySelector('#feedback');
const timeline = document.querySelector('#timeline');
const progress = document.querySelector('#progress');
const screen = document.querySelector('.screen');
const appBar = document.querySelector('.app-bar');
const scrollArea = document.querySelector('.scroll-area');
const addStopButton = document.querySelector('#add-stop');
let activeDay = 'Saturday';
let completed = new Set();
let lastFocused = null;

function renderPlan() {
  const plan = plans[activeDay];
  document.querySelector('#day-label').textContent = plan.label;
  document.querySelector('#day-title').textContent = plan.title;
  document.querySelector('#route-time').textContent = plan.routeTime;
  document.querySelector('#route-detail').textContent = plan.routeDetail;
  timeline.innerHTML = plan.stops.map(([time, name, meta, details], index) => {
    const id = `${activeDay}-${index}`;
    const done = completed.has(id);
    return `<button class="stop${done ? ' is-complete' : ''}" type="button" data-stop="${id}" aria-expanded="false"><span class="stop-time">${time}</span><span class="marker"><svg aria-hidden="true"><use href="#i-check"></use></svg></span><span class="stop-info"><strong>${name}</strong><span><svg aria-hidden="true"><use href="#i-pin"></use></svg>${meta}</span></span><svg class="chevron" aria-hidden="true"><use href="#i-chevron"></use></svg><span class="stop-details">${details}</span></button>`;
  }).join('');
  updateProgress();
}

function updateProgress() {
  const count = plans[activeDay].stops.filter((_, index) => completed.has(`${activeDay}-${index}`)).length;
  progress.textContent = `${count} of ${plans[activeDay].stops.length} done`;
}

function createDiscoveryView() {
  const view = document.createElement('section');
  view.className = 'discover-view';
  view.dataset.view = 'discover';
  view.hidden = true;
  view.setAttribute('aria-label', 'Travel inspiration and small discoveries');
  view.innerHTML = `
    <header class="discover-head">
      <div>
        <p class="eyebrow">Thursday, 10 August</p>
        <h2>Where are<br>you drawn?</h2>
      </div>
      <span class="discover-avatar" aria-hidden="true">AE</span>
    </header>
    <label class="discover-search">
      <svg aria-hidden="true"><use href="#i-search"></use></svg>
      <input type="search" placeholder="Search a feeling or place" aria-label="Search a feeling or place">
    </label>
    <div class="discover-filters" aria-label="Discovery filters">
      <button class="is-selected" type="button" data-discovery-filter="Slow escapes">Slow escapes</button>
      <button type="button" data-discovery-filter="By the water">By the water</button>
      <button type="button" data-discovery-filter="After dark">After dark</button>
    </div>
    <article class="discover-feature">
      <img src="assets/lisbon-coast-hero.png" alt="Red kayak beside cobalt water and limestone cliffs">
      <div class="discover-feature-scrim"></div>
      <p class="discover-location">LEFKADA, GREECE</p>
      <div class="discover-feature-copy">
        <div><span>Field note 14</span><h3>Follow the<br>blue edge.</h3></div>
        <button type="button" class="discover-save" aria-label="Save blue edge field note" aria-pressed="false"><svg aria-hidden="true"><use href="#i-bookmark"></use></svg></button>
      </div>
    </article>
    <section class="discover-nearby" aria-labelledby="discover-nearby-title">
      <div class="section-head">
        <div><p class="eyebrow">Keep close</p><h3 id="discover-nearby-title">Small discoveries</h3></div>
        <button class="discover-see-all" type="button">See all</button>
      </div>
      <div class="discover-list">
        <button type="button" data-discovery="Saltwater swimming"><span>01</span><b>Saltwater swimming</b><svg aria-hidden="true"><use href="#i-chevron"></use></svg></button>
        <button type="button" data-discovery="A table in shade"><span>02</span><b>A table in shade</b><svg aria-hidden="true"><use href="#i-chevron"></use></svg></button>
      </div>
    </section>`;
  screen.insertBefore(view, addStopButton);

  view.querySelectorAll('[data-discovery-filter]').forEach((button) => button.addEventListener('click', () => {
    view.querySelectorAll('[data-discovery-filter]').forEach((item) => item.classList.toggle('is-selected', item === button));
    feedback.textContent = `${button.dataset.discoveryFilter} discoveries selected`;
  }));
  view.querySelector('.discover-search input').addEventListener('input', (event) => {
    feedback.textContent = event.target.value ? `Searching for ${event.target.value}` : 'Discovery search cleared';
  });
  view.querySelector('.discover-save').addEventListener('click', (event) => {
    const button = event.currentTarget;
    const saved = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(saved));
    button.classList.toggle('is-saved', saved);
    feedback.textContent = saved ? 'Field note saved' : 'Field note removed from saved';
  });
  view.querySelectorAll('[data-discovery]').forEach((button) => button.addEventListener('click', () => {
    feedback.textContent = `${button.dataset.discovery} opened`;
  }));
  view.querySelector('.discover-see-all').addEventListener('click', () => {
    feedback.textContent = 'All small discoveries opened';
  });
  return view;
}

const discoveryView = createDiscoveryView();
const savedTab = document.querySelector('.tab[data-tab="Saved"]');
if (savedTab) {
  savedTab.dataset.tab = 'Discover';
  savedTab.querySelector('span').textContent = 'Discover';
  savedTab.setAttribute('aria-label', 'Discover');
}

function setPrimaryMode(mode) {
  const discoveryOpen = mode === 'Discover';
  discoveryView.hidden = !discoveryOpen;
  appBar.hidden = discoveryOpen;
  scrollArea.hidden = discoveryOpen;
  addStopButton.hidden = discoveryOpen;
  if (!discoveryOpen) scrollArea.scrollTop = 0;
}

document.querySelectorAll('.day').forEach((day) => day.addEventListener('click', () => {
  activeDay = day.dataset.day;
  document.querySelectorAll('.day').forEach((item) => { const selected = item === day; item.classList.toggle('is-selected', selected); item.setAttribute('aria-selected', String(selected)); });
  renderPlan();
  feedback.textContent = `${activeDay} itinerary open`;
}));

timeline.addEventListener('click', (event) => {
  const stop = event.target.closest('.stop');
  if (!stop) return;
  if (event.shiftKey) { completed.has(stop.dataset.stop) ? completed.delete(stop.dataset.stop) : completed.add(stop.dataset.stop); renderPlan(); feedback.textContent = 'Stop completion updated'; return; }
  const expanded = stop.classList.toggle('is-expanded');
  stop.setAttribute('aria-expanded', String(expanded));
  feedback.textContent = expanded ? 'Stop details expanded. Shift-click to mark complete.' : 'Stop details collapsed';
});

const sheet = document.querySelector('#add-sheet');
const backdrop = document.querySelector('#sheet-backdrop');
function closeSheet() { sheet.hidden = true; backdrop.hidden = true; lastFocused?.focus(); }
function openSheet() { lastFocused = document.activeElement; sheet.hidden = false; backdrop.hidden = false; document.querySelector('#place-search').focus(); }
addStopButton.addEventListener('click', openSheet);
document.querySelector('#close-sheet').addEventListener('click', closeSheet);
backdrop.addEventListener('click', closeSheet);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !sheet.hidden) closeSheet(); });
document.querySelector('#suggestions').addEventListener('click', (event) => { const choice = event.target.closest('button'); if (!choice) return; feedback.textContent = `${choice.dataset.place} added to ${activeDay}`; closeSheet(); });
document.querySelector('#share-button').addEventListener('click', () => { feedback.textContent = 'Share link copied'; });

document.querySelectorAll('.tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach((item) => {
    const active = item === tab;
    item.classList.toggle('is-active', active);
    active ? item.setAttribute('aria-current', 'page') : item.removeAttribute('aria-current');
  });
  setPrimaryMode(tab.dataset.tab);
  feedback.textContent = `${tab.dataset.tab} open`;
}));

renderPlan();
setPrimaryMode('Plan');
