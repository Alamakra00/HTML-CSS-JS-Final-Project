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
