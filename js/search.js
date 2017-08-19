var search  = (function() {
  var searchInput = document.querySelector('.header__input');
  var planetName  = document.querySelectorAll('.people-list__planet');

  searchInput.addEventListener('change', _filterMatches);
  searchInput.addEventListener('keyup', _filterMatches);

  function _filterMatches() {
    term = searchInput.value;
    var matchFlag = 0;
    var regex = new RegExp(term, 'gi');
    peopleWrapper.forEach(function(personWrapper) {
      if(personWrapper.children[0].dataset.name) {
        if (personWrapper.children[0].dataset.name.match(regex) || personWrapper.children[1].dataset.planet.match(regex)) {
          matchFlag++;
          personWrapper.classList.add('people-list__item-wrapper--show');
        } else {
          personWrapper.classList.remove('people-list__item-wrapper--show');
        }
      }
    });
    matchFlag === 0 ? searchInput.classList.add('header__input--no-results') : searchInput.classList.remove('header__input--no-results')
  }
})();
