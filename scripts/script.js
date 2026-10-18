import { eventsStore } from './index.js';
import { categories } from './index.js';
import { cities } from './index.js';
import { frndShipPosts } from './index.js';
// тяпнул данные из модуля с JSON

// маленький помощник: создаёт элемент с классом и текстом
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// конвертировал дату и время в удобный формат
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

// создаём карточки основываясь на информации из json файла
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';

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

//создаем пост
function createPost(post) {
  const post_card = document.createElement('div');
  post_card.className = 'post';
  post_card.innerHTML = `
  <img src = "${post.img}" alt = "PostPhoto">
  <h3>${post.title}</h3>
  <p>${post.text}</p>
  ${post.btn}
  `;
  return post_card;
}

//заполняем div сгенерированными карточками
const eventsContainer = document.querySelector('.eventsList');
eventsStore.forEach((event) => {
  eventsContainer.append(createEventCard(event));
});

// эта кнопка короче помогает открыть ВСЕ карточки сразу
const sAllBtn = document.querySelector('.seAllEventsBtn');

let isExpanded = false;

sAllBtn.addEventListener('click', () => {
  if (isExpanded) {
    eventsContainer.style.height = '';
    sAllBtn.textContent = 'See all events';
  } else {
    eventsContainer.style.height = '1600px';
    sAllBtn.textContent = 'Show less elements';
  }
  isExpanded = !isExpanded;
});

const upcommingList = document.querySelector('.upcommingList');

eventsStore.forEach((event) => {
  upcommingList.append(createEventCard(event));
});

//открываем основной сайт при нажатии на лого
const logoBtn = document.getElementById('logo');
logoBtn.addEventListener('click', () => {
  window.open('index.html');
  window.close('filterPage.html');
});

//открываем вторую страницу при нажатии на кнопку
const joinBtn = document.getElementById('join');
joinBtn.addEventListener('click', () => {
  window.open('filterPage.html');
  window.close('index.html');
});

const boxes = document.querySelector('.boxes');

categories.forEach((category) => {
  const box = document.createElement('div');
  box.className = 'box';

  box.innerHTML = `
    <img class="box__icon" src="${category.icon}" alt="" />
    <p>${category.title}</p>
  `;
  boxes.append(box);
});

const cities_box = document.querySelector('.cities_box');

cities.forEach((city) => {
  const city_card = document.createElement('div');
  city_card.classList = 'city_card';
  city_card.innerHTML = `
    <img class="box__icon" src="${city.img}" alt="" />
    <p>${city.title}</p>
  `;
  cities_box.append(city_card);
});

const postsBox = document.querySelector('.frendshipsPosts');

frndShipPosts.forEach((posts) => {
  postsBox.append(createPost(posts));
});

// ---- Map (Leaflet + OpenStreetMap) ----
// Collapsed: a static preview. "Browse in map" opens it full screen and interactive.
// Весь блок обёрнут в if (mapBox), чтобы скрипт не падал на страницах без карты.
const NEW_YORK = [40.7128, -74.006];
const mapBox = document.getElementById('map-box');

if (mapBox) {
  const mapBtn = mapBox.querySelector('.map__btn');
  const mapClose = mapBox.querySelector('.map__close');
  let map = null;
  let markers = null;

  function setMapInteractive(on) {
    if (!map) return;
    const handlers = [
      map.dragging,
      map.touchZoom,
      map.doubleClickZoom,
      map.scrollWheelZoom,
      map.boxZoom,
      map.keyboard,
    ];
    handlers.forEach((h) => (on ? h.enable() : h.disable()));
  }

  function popupContent(ev) {
    const box = el('div', 'map-popup');
    box.appendChild(el('p', 'map-popup__date', formatDate(ev.date)));
    box.appendChild(el('p', 'map-popup__title', ev.title));
    box.appendChild(el('p', 'map-popup__cat', categoryText(ev)));
    return box;
  }

  // Если у события нет coords, ставим временную точку рядом с Нью-Йорком.
  // Лучше добавить в каждый объект eventsStore поле coords: [lat, lng].
  function eventPosition(ev, index) {
    if (ev.coords) return ev.coords;
    const angle = (index / eventsStore.length) * 2 * Math.PI;
    return [
      NEW_YORK[0] + Math.sin(angle) * 0.25,
      NEW_YORK[1] + Math.cos(angle) * 0.25,
    ];
  }

  if (window.L) {
    map = L.map('map', {
      center: NEW_YORK,
      zoom: 9,
      zoomControl: false,
      attributionControl: false,
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    markers = L.featureGroup().addTo(map);
    L.control.attribution({ prefix: false }).addTo(map);
    setMapInteractive(false);
    mapBox.classList.add('map--live');

    // маркеры для всех событий
    eventsStore.forEach((ev, index) => {
      L.marker(eventPosition(ev, index))
        .bindPopup(popupContent(ev))
        .addTo(markers);
    });

    // открыть карту на весь экран
    mapBtn.addEventListener('click', () => {
      mapBox.classList.add('map--open');
      setMapInteractive(true);
      map.invalidateSize();
    });

    // закрыть обратно в превью
    mapClose.addEventListener('click', () => {
      mapBox.classList.remove('map--open');
      setMapInteractive(false);
      map.invalidateSize();
    });
  }
}
