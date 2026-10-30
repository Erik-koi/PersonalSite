const visitCounter = document.querySelector('#visit-count');
const VISIT_COUNT_KEY = 'erik-portfolio-visits';

if (visitCounter) {
  try {
    const storedCount = Number.parseInt(localStorage.getItem(VISIT_COUNT_KEY) || '0', 10);
    const nextCount = Number.isSafeInteger(storedCount) && storedCount >= 0 ? storedCount + 1 : 1;
    localStorage.setItem(VISIT_COUNT_KEY, String(nextCount));
    visitCounter.textContent = String(nextCount).padStart(6, '0');
  } catch {
    visitCounter.textContent = '000001';
  }
}
