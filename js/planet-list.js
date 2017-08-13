function getPlanetData() {
  var planetURL = 'https://swapi.co/api/planets/';
  var promises = [];

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
}
