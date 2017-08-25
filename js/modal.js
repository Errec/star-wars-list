var modal = (function() {
  var modal    = document.querySelector('.modal');

  peopleGrid.addEventListener('click', _buildModal, false);
  modal.addEventListener('click', _closeModal, false);
  modal.addEventListener('click', _openPlanetModal, false);
  window.addEventListener('click', function(event) {if (event.target == modal) { modal.classList.remove('modal-show');}}); // close modal if click outside of it

  function _buildModal(e) {
    if(e.target !== e.currentTarget && e.target.classList.contains('people-list__value')) {
      if (e.target.dataset.name) {
        _renderPersonData(e.target);
      } else {
        _renderPlanetData(e.target);
      }
    }
    e.stopPropagation();
  }

  function _renderPersonData(target) {
    peopleDataLocal.forEach(function(person) {
      if (person.name === target.dataset.name) {
        var imgClass = 'modal__side-img--people';
        var title = person.name;
        var subtitle = 'Planet</span><span data-planet="' + person.planetName + '" class="modal__card-subtitle modal__card-planet">' + person.planetName;
        var dataList = _getDataListHTML({key:'ID:', value:person.id}, {key:'Gender:', value:person.gender},{key:'Birth Year:', value:person.birth_year},{key:'Height:', value:person.height + ' cm'}, {key:'Mass:', value: person.mass + ' Kg'});

        modal.innerHTML = _getModalHTML(imgClass, title, subtitle, dataList);
        modal.classList.add('modal-show');
      }
    });
  }

  function _renderPlanetData(target) {
    planetDataLocal.forEach(function(planet) {
      if (planet.name === target.dataset.planet) {
        var imgClass = 'modal__side-img--planet';
        var title = planet.name;
        var subtitle = '';
        var dataList = _getDataListHTML({key:'ID:', value:planet.id}, {key:'Terrain:', value:planet.terrain},{key:'Population:', value:planet.population},{key:'Diameter:', value:planet.diameter + ' Km'}, {key:'Residents:', value: planet.residentsNames});

        modal.innerHTML = _getModalHTML(imgClass, title, subtitle, dataList);
        modal.classList.add('modal-show');
      }
    });
  }

  function _getModalHTML(imgClass, title, subtitle, dataList) {
    var modalHTML = '<div class="modal__card"><div class="modal__close-btn"></div><div class="modal__side-img ' + imgClass + '"></div><div class="modal__card-info"><div class="modal__card-subject"><p class="modal__card-title">' + title + '</p><span class="modal__card-subtitle">' + subtitle + '</span></div><ul class="modal__info-grid">' + dataList + '</ul></div></div>';
    return modalHTML;
  }

  function _getDataListHTML(){
    var dataList = '';
    var args = Array.prototype.slice.call(arguments);
    args.forEach(function(el) {
      dataList +=  '<li class="modal__info-item"><span class="modal__info-item-key">' + el.key + '</span><span class="modal__info-item-value">' + el.value + '</span></li>';
    });
    return dataList;
  }

  // event delegation to the new div inside modal
  function _closeModal(e) {
    if (e.target && e.target.classList.contains("modal__close-btn")) {
      modal.classList.remove('modal-show');
    }
  }

  function _openPlanetModal(e) {
    if (e.target && e.target.classList.contains("modal__card-planet")) {
      _renderPlanetData(e.target);
    }
  }
})();
