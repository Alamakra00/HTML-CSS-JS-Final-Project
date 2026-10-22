import { eventsStore } from './index.js';
import { categories } from './index.js';
import { cities } from './index.js';
import { frndShipPosts } from './index.js';
// тяпнул данные из модуля с JSON

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

function categoryText(event) {
  return event.category;
}

const cameraIcon = `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z"/></svg>`;

// создаём карточки основываясь на информации из json файла
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';

  const online = event.attendees
    ? ''
    : `<img class="event-card__online" src="assets/icons/Online_Event.png" alt="Online Event" />
  <p class="event-card__type">${cameraIcon} Online Event</p>`;

  const attendees = event.attendees
    ? `<p class="event-card__info event-card__attendees">
    <img src="assets/icons/check.svg" alt="" />
    ${event.attendees} attendees
  </p>`
    : '';

  card.innerHTML = `
  <img class="event-card__image" src="${event.image}" alt="${event.title}" />
  ${online}
  <h3 class="event-card__title">${event.title}</h3>
  <p class="event-card__category">${categoryText(event)}</p>
  <p class="event-card__info event-card__date">
    <img src="assets/icons/calendar.svg" alt="" />
    ${formatDate(event.date)}
  </p>
  ${attendees}
  <p class="event-card__info event-card__price">
    <img src="assets/icons/ticket.svg" alt="" />
    Free
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

//открываем вторую страницу при нажатии на кнопку
const joinBtn = document.getElementById('join');
joinBtn.addEventListener('click', () => {
  window.location.href = 'filterPage.html';
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
