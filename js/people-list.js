var renderList = (function() {
  var peopleGrid = document.getElementById('people-grid');

  var peopleURL = 'https://swapi.co/api/people/';

  requestSWInfo(peopleURL, "GET").then(_startList, errorHandler);

  function _startList(data) {
    var peopleNumber = data.count;
    _buildList(peopleNumber);
    _populateList(peopleNumber);
  }

  function _buildList(peopleNumber) {
    for (var i = 0; i < peopleNumber; i++) {
      peopleGrid.appendChild(document.createElement("LI"));
    }
  }

  function _populateList(peopleNumber) {
    for (var i = 1; i <= peopleNumber; i++) {
      currentPersonURL = peopleURL + i;
      requestSWInfo(currentPersonURL, "GET").then(_getPeopleData.bind(null, i - 1), errorHandler);
    }
  }

  function _getPeopleData(i, data) {
    _renderPersonItem(i, data);
    _storePersonData(i,data);
  }

  function _renderPersonItem(i, data) {
    peopleGrid.children[i].innerHTML = data.name;
  }

  function _storePersonData(i, data) {
    var newPerson = {
      position: i,
      name: data.name,
      height: data.height,
      weight: data.mass,
      birth_year: data.birth_year,
      gender: data.gender
    };

    data.homeworld ? newPerson.planet = data.homeworld.replace(/[^0-9]/g,'') : newPerson.planet = "unknown";
    data.species[0] ? newPerson.species = data.species[0].replace(/[^0-9]/g,'') : newPerson.species = "unknown";

    peopleData.push(newPerson);
    peopleData.sort(function(a, b) {
    return a.position - b.position;
    });
  }
})();
