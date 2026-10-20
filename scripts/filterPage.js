import { eventsStore } from './index.js';
const eventList = document.querySelector('.event_list');
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
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card_li';

  card.innerHTML = `
    <img class="event-card__image" src="${event.image}" alt="${event.title}" />
  <h3 class="event-card__title">${event.title}</h3>
  <p class="event-card__category">${categoryText(event)}</p>
  <p class="event-card__info">
    <img src="assets/icons/calendar.svg" alt="" />
    ${formatDate(event.date)}
  </p>
  <p class="event-card__info">
    <img src="assets/icons/check.svg" alt="" />
    ${event.attendees} going
  </p>
  `;
  return card;
}

eventsStore.forEach((event) => {
  eventList.append(createEventCard(event));
});

const CITY = 'New York, NY';
// Карта OpenStreetMap без ключа. bbox — границы области: запад, юг, восток, север
const MAP_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=-74.03,40.69,-73.93,40.79&layer=mapnik';

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name) {
  return el('span', 'material-symbols-outlined', name);
}

function createMapCard() {
  const aside = el('aside', 'map-card');

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

  map.append(frame, close, browse);
  aside.append(label, city, map);
  return aside;
}

document.getElementById('map-root').append(createMapCard());

//фильтрация списка js
