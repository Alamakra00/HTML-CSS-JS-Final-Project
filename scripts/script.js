import { eventsStore } from './index.js';
// тяпнул данные из модуля с JSON

const categories = [
  {
    title: 'Travel and Outdoor',
    icon: 'assets/images/boxes/travel_and_outdoor.svg.svg',
  },
  {
    title: 'Social Activities',
    icon: 'assets/images/boxes/social_activities.svg.svg',
  },
  {
    title: 'Hobbies and Passion',
    icon: 'assets/images/boxes/hobbies_and_passions.svg.svg',
  },
  {
    title: 'Sports and Fitness',
    icon: 'assets/images/boxes/sports_and_fitness.svg.svg',
  },
  {
    title: 'Health and Wellbeing',
    icon: 'assets/images/boxes/health_and_wellness.svg.svg',
  },
  { title: 'Technology', icon: 'assets/images/boxes/technology.svg.svg' },
  {
    title: 'Art and Culture',
    icon: 'assets/images/boxes/art_and_culture.svg.svg',
  },
  { title: 'Games', icon: 'assets/images/boxes/games.svg.svg' },
];
// обьекты бокс
const cities = [
  {
    img: 'assets/images/cities/chicago.webp.png',
    title: 'Chicago',
  },
  {
    img: 'assets/images/cities/new_york.webp.png',
    title: 'New York',
  },
  {
    img: 'assets/images/cities/san_francisco.webp.png',
    title: 'San Francisco',
  },
  {
    img: 'assets/images/cities/miami.webp.png',
    title: 'Miami',
  },
  {
    img: 'assets/images/cities/nashville.webp.png',
    title: 'Nashville',
  },
];

const frndShipPosts = [
  {
    img: '/assets/images/frendShpPosts/first_article.webp.png',
    title: 'I Used Meetup to Make Friends at Brunch',
    text: 'New Jersey-based writer and college student Brianna Stryker wanted to meet friends in her hometown. Learn how she used Meetup to make connections by joining a Girls Night Out Meetup group.',
    btn: `<button class = "altBtn">Read more</button>`,
  },
  {
    img: '/assets/images/frendShpPosts/second_article.webp.png',
    title: 'How to Turn Casual Connections into Close Friendships',
    text: 'New Jersey-based writer and college student Brianna Stryker wanted to meet friends in her hometown. Learn how she used Meetup to make connections by joining a Girls Night Out Meetup group.',
    btn: `<button class = "altBtn">Read more</button>`,
  },
  {
    img: '/assets/images/frendShpPosts/third_article.webp.png',
    title: 'Do You Have the “Right” Number of Friends?',
    text: 'New Jersey-based writer and college student Brianna Stryker wanted to meet friends in her hometown. Learn how she used Meetup to make connections by joining a Girls Night Out Meetup group.',
    btn: `<button class = "altBtn">Read more</button>`,
  },
];
// конвертировал дату и время в удобный формат
function formatDate(date) {
  const day = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const time = date.toLocaleDateString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${day} · ${time}`.toUpperCase();
}
// создаём карточки основываясь на информации из json файла
function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';

  card.innerHTML = `
    <img class="event-card__image" src="${event.image}" alt="${event.title}" />
  <h3 class="event-card__title">${event.title}</h3>
  <p class="event-card__category">${event.category} (${event.distance} km)</p>
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
