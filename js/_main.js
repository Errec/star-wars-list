var loadBalloonImg  = document.querySelector('.load-screen__balloon');
var loadGif         = document.querySelector('.load-screen__img');
var searchInput     = document.querySelector('.header__input');
var peopleDataLocal = [];
var planetDataLocal = [];
var peopleName; // hold people list name DOM el
var peopleWrapper; // hold people list wrapper DOM el

function renderPersonItem() {
  peopleDataLocal.forEach( function(person, index) {
    peopleName[index].dataset.name = person.name;
    peopleName[index].innerHTML = person.name;
    peopleName[index].parentElement.classList.add('people-list__item-wrapper--show');
    peopleName[index].parentElement.classList.remove('people-list__item-wrapper--fade');
    searchInput.value = "";

  });
}

function renderPlanetItem() {
  var planetName  = document.querySelectorAll('.people-list__planet');

  peopleDataLocal.forEach( function(person, index) {
    var personPlanet = getPersonPlanetName(person.planet);
    planetName[index].innerHTML = personPlanet;
    planetName[index].dataset.planet = personPlanet;
  });
}

function getPersonPlanetName(planetId) {
  var myPlanet = '';
  planetDataLocal.forEach(function(planet) {
    if (planet.id === parseInt(planetId)) {
      myPlanet = planet.name;
      return;
    }
  });
  return myPlanet;
}

function requestSWInfo(url, methodType){
  var promiseObj = new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    xhr.open(methodType, url, true);
    xhr.send();
    xhr.onreadystatechange = function(){
      if(xhr.readyState === 4){
         if(xhr.status === 200){
          var resp = xhr.responseText;
            var respJson = JSON.parse(resp);
            resolve(respJson);
         } else{
            reject(xhr.status);
            console.log("xhr failed"); // TODO: append 'cant find' msg
           }
      } else{
         console.log("xhr processing going on"); // TODO: add loading animation
         }
    };
  });
  return promiseObj;
}

function errorHandler(statusCode){
  console.log("failed with status", status);
}

function reflect(promise){
  return promise.then(function(resolved){ return {resolved:resolved, status: "resolved" };},
                      function(rejected){ return {rejected:rejected, status: "rejected" };});
}
