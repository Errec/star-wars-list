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
      requestSWInfo(currentPersonURL, "GET").then(_renderPersonInfo.bind(null, i), errorHandler);
    }
  }

  function _renderPersonInfo(i, data) {
    peopleGrid.children[i - 1].innerHTML = data.name;
  }
})();




