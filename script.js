const visitCounter = document.querySelector('#visit-count');
const typewriterText = document.querySelector('.eyebrow-text');
const projectFilters = document.querySelectorAll('[data-project-filter]');
const projectCards = document.querySelectorAll('[data-project-category]');
const projectResults = document.querySelector('#project-results');
const COUNTER_API_URL = 'https://erik-portfolio-counter.erik-koi.workers.dev/api/visits';

if (projectFilters.length && projectCards.length && projectResults) {
  projectFilters.forEach((filter) => {
    filter.addEventListener('click', () => {
      const selectedCategory = filter.dataset.projectFilter;
      let visibleProjects = 0;

      projectFilters.forEach((button) => {
        const isSelected = button === filter;
        button.classList.toggle('is-active', isSelected);
        button.setAttribute('aria-pressed', String(isSelected));
      });

      projectCards.forEach((card) => {
        const isVisible = selectedCategory === 'all' || card.dataset.projectCategory === selectedCategory;
        card.hidden = !isVisible;
        if (isVisible) visibleProjects += 1;
      });

      projectResults.textContent = `Showing ${visibleProjects} ${visibleProjects === 1 ? 'project' : 'projects'}.`;
    });
  });
}

if (typewriterText && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const characters = Array.from(typewriterText.textContent);
  typewriterText.textContent = '';

  let index = 0;
  const typeNextCharacter = () => {
    typewriterText.textContent += characters[index];
    index += 1;

    if (index < characters.length) {
      window.setTimeout(typeNextCharacter, 45);
    }
  };

  window.setTimeout(typeNextCharacter, 350);
}

async function updateVisitCounter() {
  if (!visitCounter) return;

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