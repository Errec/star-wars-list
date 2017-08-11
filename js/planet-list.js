var renderList = (function() {
  var planetURL = 'https://swapi.co/api/planets/';

  requestSWInfo(planetURL, "GET").then(_startList, errorHandler);

  function _startList(data) {
    var planetNumber = data.count;
    _populateList(planetNumber);
  }

  function _populateList(planetNumber) {
    for (var i = 1; i <= planetNumber; i++) {
      currentPlanetURL = planetURL + i;
      requestSWInfo(currentPlanetURL, "GET").then(_getPlanteData.bind(null, i - 1), errorHandler);
    }
  }

  function _getPlanteData(i, data) {
    _storePlanetData(i,data);
  }

  function _storePlanetData(i, data) {
    var newPlanet = {
      position: i,
      name: data.name,
      terrain: data.terrain,
      population: data.population,
      diameter: data.diameter
    };

    if (data.residents.length) {
      newPlanet.residents = data.residents.map(function(residentURL) {
        return residentURL.replace(/[^0-9]/g,'');
      });
    } else {
      newPlanet.residents = "unknown";
    }

    planetData.push(newPlanet);
    planetData.sort(function(a, b) {
    return a.position - b.position;
    });
  }
})();
