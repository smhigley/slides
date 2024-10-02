const TERMS = [
  'role',
  'alert (role)',
  'status (role)',
  'log (role)',
  'marquee (role)',
  'timer (role)',
  'progressbar (role)',
  'aria-live',
  'aria-live="assertive"',
  'aria-live="polite"',
  'aria-atomic',
  'aria-relevant',
  'aria-relevant="all"',
  'aria-relevant="additions"',
  'aria-relevant="removals"',
  'aria-relevant="text"',
  'aria-relevant="additions text"',
  'aria-busy',
  'output element',
  'toast',
  'feed',
  'notification',
  'screen reader',
  'focus change',
  'context change',
  '4.1.3 Status Messages'
];

// returns a filtered array of terms that contain the filter string, case-independent
function filterTerms(filter) {
  return TERMS.filter((term) => {
    const matches = term.toLowerCase().indexOf(filter.toLowerCase()) > -1;
    return matches;
  });
}

function getRandomNumberInRange(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function generateListItems(terms) {
  const listItems = terms.map((term) => `<li>${term}</li>`);
  return listItems.join('');
}

function createCat(results) {
  return `
    <div class="result-cat">
      <img src="./assets/alert-cat.jpg" alt="jumping cat">
      <p>${results} results</p>
    </div>
  `;
}

function animateCat(results, el) {
  const cat = document.createElement('div');
  cat.innerHTML = createCat(results);

  // random y start from 0 to 90%
  cat.style.top = getRandomNumberInRange(0, 90) + '%';
  cat.style.left = 0;

  // random transition duration from 500 to 2500 ms
  cat.style.transition = `all ${getRandomNumberInRange(500, 1500)}ms linear`;

  // random y end from 0 to 90%
  const y1 = getRandomNumberInRange(0, 90) + '%';

  el.appendChild(cat);
  setTimeout(() => {
    cat.style.top = y1;
    cat.style.left = 'calc(100% - 280px)';

    // remove element after transition
    cat.addEventListener('transitionend', (event) => {
      el.removeChild(event.target);
    });
  }, 10);

  setTimeout(() => {
    if (cat) {
      el.removeChild(cat);
    }
  }, 1600);

}

function onInput(event) {
  // display list of results
  const results = filterTerms(event.target.value);
  const listId = event.target.getAttribute('data-results');
  const list = document.getElementById(listId);
  list.innerHTML = generateListItems(results);

  // display flying cats
  const catList = list.parentElement.querySelector('.cat-list');
  if (catList) {
    animateCat(results.length, catList);
  }
}

// fixed version
let inputTimeoutId;

function onInputDebounced(event) {
  // clear any existing input timeout
  if (inputTimeoutId) {
    window.clearTimeout(inputTimeoutId);
  }

  // display list of results
  const results = filterTerms(event.target.value);
  const listId = event.target.getAttribute('data-results');
  const list = document.getElementById(listId);
  list.innerHTML = generateListItems(results);

  // display flying cats
  const catList = list.parentElement.querySelector('.cat-list');
  if (catList) {
    inputTimeoutId = window.setTimeout(() => {
      animateCat(results.length, catList);
    }, 500);
  }
}

function initFilters(el) {
  // input elements
  const input = el.querySelector('.terms-input');

  const betterInput = el.querySelector('.terms-input-fixed');

  if (input) {
    input.addEventListener('input', onInput);
  }

  if (betterInput) {
    betterInput.addEventListener('input', onInputDebounced);
  }
}

function showToast(slideEl) {
  const toast = slideEl.querySelector('.toast-example');

  if (toast) {
    toast.classList.remove('hidden');
    setTimeout(function() {
      console.log('show toast', toast);
      toast.classList.remove('transition-start');
    }, 1000);
  }
}

// initiate filters
Reveal.addEventListener( 'slidechanged', function( event ) {
  setTimeout(function() {
    initFilters(event.currentSlide);

    showToast(event.currentSlide);
  }, 300);
});