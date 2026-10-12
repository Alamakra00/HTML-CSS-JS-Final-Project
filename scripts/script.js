import { eventsStore } from './index.js';
// тяпнул данные из модуля с JSON

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

function createEventCard(event) {
  const card = document.createElement('div');
  card.className = 'event-card';

  card.innerHTML = `
    <img class="event-card__image" src="${event.image}" alt="${event.title}" />
    <h3 class="event-card__title">${event.title}</h3>
    <p class="event-card__category">${event.category} (${event.distance} km)</p>
    <p class="event-card__date">${formatDate(event.date)}</p>
    <p class="event-card__attendees">${event.attendees} going</p>
  `;
  return card;
}

const eventsContainer = document.querySelector('.eventsList');
eventsStore.forEach((event) => {
  eventsContainer.append(createEventCard(event));
});

const sAllBtn = document.querySelector('.seAllEventsBtn');

sAllBtn.addEventListener('click', () => {
  eventsContainer.style.height = '1600px';
  sAllBtn.textContent = 'Show less elements';
});
