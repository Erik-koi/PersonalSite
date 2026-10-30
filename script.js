const visitCounter = document.querySelector('#visit-count');
const COUNTER_API_URL = 'https://erik-portfolio-counter.erik-koi.workers.dev/api/visits';

async function updateVisitCounter() {
  if (!visitCounter || COUNTER_API_URL.includes('YOUR-SUBDOMAIN')) return;

  try {
    const response = await fetch(COUNTER_API_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`Counter returned ${response.status}`);

    const result = await response.json();
    if (!Number.isSafeInteger(result.total) || result.total < 0) {
      throw new Error('Counter returned an invalid total');
    }

    visitCounter.textContent = String(result.total).padStart(6, '0');
  } catch {
    visitCounter.textContent = '------';
    visitCounter.title = 'The shared visitor counter is not available right now.';
  }
}

updateVisitCounter();
