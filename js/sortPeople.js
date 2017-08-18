var sortPeople = (function() {
  var sectType = document.querySelector('.header__select');

  sectType.addEventListener('change', _sortPeopleDataLocal);

  function _sortPeopleDataLocal() {
    _sortBy(sectType.value);
    renderPersonItem();
    renderPlanetItem();

    function _sortBy(property) {
      peopleDataLocal.sort(function(a, b){
        if(a[property] < b[property]) return -1;
        if(a[property] > b[property]) return 1;
        return 0;
      });
    }
  }
})();

