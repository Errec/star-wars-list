function getPlanetData(){
  var itemWrapper    = document.querySelectorAll('.people-list__item-wrapper');
  var main           = document.querySelector('.main');
  var loadScreen     = document.querySelector('.load-screen');
  var planetURL      = 'https://swapi.co/api/planets/';
  var promises       = [];

  requestSWInfo(planetURL, "GET").then(_startList, errorHandler);

  function _startList(data) {
    var planetNumber = data.count;
    _populateList(planetNumber);
  }

  function _populateList(planetNumber) {
    for (var i = 1; i <= planetNumber; i++) {
      currentPlanetURL = planetURL + i;
      promises.push(requestSWInfo(currentPlanetURL, "GET"));
    }
    Promise.all(promises.map(reflect)).then(function(planetsData){
      _storePlanetData(planetsData);
      _setPlanetNameToPeople();
      renderPlanetItem();
      _startAnimation();
    });
  }

  function _storePlanetData(planetsData) {
    var id = 1;
    planetsData.forEach(function(planetData) {
      if (planetData.resolved) {
        var newPlanet = {
          id: id,
          name: planetData.resolved.name,
          terrain: planetData.resolved.terrain,
          population: planetData.resolved.population,
          diameter: planetData.resolved.diameter
        };

        if (planetData.resolved.residents.length) {
          newPlanet.residents = planetData.resolved.residents.map(function(residentURL) {
            return residentURL.replace(/[^0-9]/g,'');
          });
        } else {
          newPlanet.residents = "unknown";
        }
        planetDataLocal.push(newPlanet);
      }
      id++;
    });
  }

  function _setPlanetNameToPeople() {
    peopleDataLocal.forEach(function(person) {
      person.planetName = getPersonPlanetName(person.planet);
    });
  }

  function _startAnimation() {
    loadScreen.classList.add('load-screen--fadeout');
    loadGif.classList.add('load-screen__img--moveout');
    loadBalloonImg.classList.add('load-screen__balloon--hide');
    setTimeout(function() {
      main.classList.add('main--show');
    }, 1000);
   setTimeout(function() {
      itemWrapper.forEach( function(element) {
        element.classList.add('people-list__item-wrapper--show-items');
      });
    }, 1200);
  }
}
