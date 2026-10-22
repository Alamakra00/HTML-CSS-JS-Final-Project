import { eventsStore } from './index.js';
import { MAP_URL } from './index.js';
import { CITY } from './index.js';

// ---- элементы страницы ----
const eventList = document.querySelector('.event_list');
const filtersForm = document.querySelector('.filters');
const fDay = document.querySelector('#f-day');
const fType = document.querySelector('#f-type');
const fDistance = document.querySelector('#f-distance');
const fCategory = document.querySelector('#f-category');

// я ленивый ,эта штука помогает быстрее создавать обьекты
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  return el('span', 'material-symbols-outlined', name);
}

function formatDate(date) {
  const day = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${day} · ${time}`.toUpperCase();
}

// текст категории: "Technology (25 km)"
function categoryText(event) {
  return `${event.category} (${event.distance} km)`;
}

// нужен для фильтра по дню
function dayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

// тяпаем карточку
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card_li';

  // строку с участниками показываем только если поле attendees есть
  const attendees = event.attendees
    ? `<p class="event-card__info">
    <img src="assets/icons/check.svg" alt="" />
    ${event.attendees} going
  </p>`
    : '';

  card.innerHTML = `
    <img class="event-card__image" src="${event.image}" alt="${event.title}" />
  <h3 class="event-card__title">${event.title}</h3>
  <p class="event-card__category">${categoryText(event)}</p>
  <p class="event-card__info">
    <img src="assets/icons/calendar.svg" alt="" />
    ${formatDate(event.date)}
  </p>
  ${attendees}
  `;
  return card;
}
// карта нью йорка

function createMapCard() {
  const card = el('div', 'map-card');

  const label = el('p', 'map-card__label', 'Find events near');
  const city = el('h2', 'map-card__city', CITY);

  const map = el('div', 'map-card__map');
  const close = el('button', 'map-card__close');
  close.type = 'button';
  close.setAttribute('aria-label', 'Close map');
  close.append(icon('close'));

  const browse = el('button', 'map-card__browse');
  browse.type = 'button';
  browse.append(el('span', '', 'Browse in map'), icon('open_in_full'));

  const frame = el('iframe', 'map-card__image');
  frame.src = MAP_URL;
  frame.title = `Map of ${CITY}`;
  frame.loading = 'lazy';
  frame.tabIndex = -1;

  // Browse in map — включает живую карту, крестик — возвращает превью
  function setMapActive(active) {
    map.classList.toggle('map-card__map--active', active);
    frame.tabIndex = active ? 0 : -1;
  }
  browse.addEventListener('click', () => setMapActive(true));
  close.addEventListener('click', () => setMapActive(false));

  map.append(frame, close, browse);
  card.append(label, city, map);
  return card;
}

document.getElementById('map-root').append(createMapCard());

// флиртуем с евентами

// заполняем "Any day" днями, которые есть в базе
const days = [...new Set(eventsStore.map((ev) => dayKey(ev.date)))].sort();

days.forEach((key) => {
  const [year, month, day] = key.split('-').map(Number);
  const option = document.createElement('option');
  option.value = key;
  option.textContent = new Date(year, month - 1, day).toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }
  );
  fDay.append(option);
});

// оставляем только события, подходящие под выбранные значения
function getFilteredEvents() {
  return eventsStore.filter((ev) => {
    if (fDay.value && dayKey(ev.date) !== fDay.value) return false;
    if (fType.value && ev.type !== fType.value) return false;
    if (fDistance.value && ev.distance > Number(fDistance.value)) return false;
    if (fCategory.value && ev.category !== fCategory.value) return false;
    return true;
  });
}

function renderEvents() {
  eventList.innerHTML = '';
  getFilteredEvents().forEach((ev) => {
    eventList.append(createEventCard(ev));
  });
}
// выводим шляпу на экран
filtersForm.addEventListener('change', renderEvents);
renderEvents();
