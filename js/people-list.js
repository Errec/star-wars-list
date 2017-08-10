var renderList = (function() {
  var peopleGrid = document.getElementById('people-grid');

  var peopleURL = 'https://swapi.co/api/people/';

  requestSWInfo(peopleURL, "GET").then(_startList, errorHandler);

  function _startList(data) {
    var peopleNumber = data.count;
    _buildList(peopleNumber);
  }

  function _buildList(peopleNumber) {
    for (var i = 0; i < peopleNumber; i++) {
      peopleGrid.appendChild(document.createElement("LI"));
    }
  }
})();




