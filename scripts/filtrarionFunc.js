import { eventsStore } from './index.js';
import { createEventCard } from './filterPage.js';

const fDay = document.querySelector('#f-day');
const fType = document.querySelector('#f-type');
const fDistance = document.querySelector('#f-distance');
const fCategory = document.querySelector('#f-category');
const eventsList = document.querySelector('.event_list');

function dayKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}
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

export function getFiltered() {
  return eventsStore.filter((ev) => {
    if (fDay.value && dayKey(ev.date) !== fDay.value) return false;
    if (fType.value && ev.type !== fType.value) return false;
    if (fDistance.value && ev.distance !== fDistance.value) return false;
    if (fCategory.value && ev.category !== fCategory.value) return false;
    return true;
  });
}

export function renderEvents() {
  eventsList.innerHTML = '';
  getFilteredEvents().forEach((ev) => {
    eventsList.append(createEventCard(ev));
  });
}
