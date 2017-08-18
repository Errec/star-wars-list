var search  = (function() {
  var searchInput = document.querySelector('.header__input');
  var planetName  = document.querySelectorAll('.people-list__planet');

  searchInput.addEventListener('change', _filterMatches);
  searchInput.addEventListener('keyup', _filterMatches);

  function _filterMatches() {
    term = searchInput.value;
    var regex = new RegExp(term, 'gi');
    peopleName.forEach(function(personDiv) {
      personDiv.dataset.name.match(regex) ?
      personDiv.parentElement.classList.add('people-list__item-wrapper--show') :
      personDiv.parentElement.classList.remove('people-list__item-wrapper--show');
    });
  }
})();
