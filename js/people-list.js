var renderList = (function() {
  var peopleLi      = document.querySelector('.people-list__item');

  var peopleURL = 'https://swapi.co/api/people/';
  var promises = [];

  document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      loadGif.classList.add('load-screen__img--movein');
    }, 200);
    setTimeout(function() {
      loadBalloonImg.classList.add('load-screen__balloon--show');
    }, 2200);
  });

  requestSWInfo(peopleURL, "GET").then(_startList, errorHandler);

  function _startList(data) {
    var peopleNumber = data.count;
    _buildList(peopleNumber);
    _populateList(peopleNumber);
  }

  function _buildList(peopleNumber) {
    for (var i = 1; i < peopleNumber; i+=2) {
      var peopleLiClone = peopleLi.cloneNode(true);
      peopleGrid.appendChild(peopleLiClone);
    }
    peopleName    = document.querySelectorAll('.people-list__name');
    peopleWrapper = document.querySelectorAll('.people-list__item-wrapper');
  }

  function _populateList(peopleNumber) {
    for (var i = 1; i <= peopleNumber; i++) {
      currentPersonURL = peopleURL + i;
      promises.push(requestSWInfo(currentPersonURL, "GET"));
    }
    Promise.all(promises.map(reflect)).then(function(peopleData){
      _storePeopleData(peopleData);
      renderPersonItem();
      getPlanetData();
    });
  }

  function _storePeopleData(peopleData) {
    var id = 1;
    peopleData.forEach(function(personData) {
      if (personData.resolved) {
        var newPerson = {
          id         : id,
          name       : personData.resolved.name,
          height     : personData.resolved.height,
          mass       : personData.resolved.mass,
          birth_year : personData.resolved.birth_year,
          gender     : personData.resolved.gender
        };
        personData.resolved.homeworld ?
        newPerson.planet = personData.resolved.homeworld.replace(/[^0-9]/g,'') :
        newPerson.planet = "Unknown";

        personData.resolved.species[0] ?
        newPerson.species = personData.resolved.species[0].replace(/[^0-9]/g,'') :
        newPerson.species = "Unknown";

        peopleDataLocal.push(newPerson);
      }
      id++;
    });
  }
})();
