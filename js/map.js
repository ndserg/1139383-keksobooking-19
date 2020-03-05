'use strict';
(function () {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var PIN_POINTER_HEIGHT = 22;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var houseTypesRu = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];

  var adForm = document.querySelector('.ad-form');
  var adFormAddress = document.querySelector('#address');
  var pinsBlock = document.querySelector('.map__pins');
  var mapPinMain = pinsBlock.querySelector('.map__pin--main');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var filtersForm = document.querySelector('.map__filters');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var parentMapFiltersContainer = mapFiltersContainer.parentNode;

  //  Значение поля адрес при открытии страницы до активции карты
  adFormAddress.setAttribute('value', window.util.getCoordinates(mapPinMain, window.MAIN_PIN_WIDTH, window.MAIN_PIN_HEIGHT).itemX + ', ' + window.util.getCoordinates(mapPinMain, window.MAIN_PIN_WIDTH, window.MAIN_PIN_HEIGHT / 2).itemY);

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 0) {
      mapActivation();
    }
  });

  mapPinMain.addEventListener('keydown', function (evt) {
    if (evt.key === ENTER_KEY) {
      mapActivation();
    }
  });

  var mapActivation = function () {
    //  Значение поля адрес при открытии страницы с учетом размера указателя
    adFormAddress.setAttribute('value', window.util.getCoordinates(mapPinMain, window.MAIN_PIN_WIDTH, window.MAIN_PIN_HEIGHT).itemX + ', ' + window.util.getCoordinates(mapPinMain, window.MAIN_PIN_WIDTH, window.MAIN_PIN_HEIGHT + PIN_POINTER_HEIGHT).itemY);

    // Активируем карту и поля форм
    window.util.removeClassOfElement(window.map, 'map--faded');
    window.util.removeClassOfElement(adForm, 'ad-form--disabled');
    window.util.formControlsToggle('remove', adForm.elements, 'disabled', 'disabled');
    window.util.formControlsToggle('remove', filtersForm.elements, 'disabled', 'disabled');

    //  Отрисовываем сгенерированные DOM-элементы в блок .map__pins и Card-элементы в блок .map перед блоком .map__filters-container
    var pinsFragment = document.createDocumentFragment();
    var cardsFragment = document.createDocumentFragment();

    window.adverts.forEach(function (item, n) {
      var pinElement = pinTemplate.cloneNode(true);
      var avatarImg = pinElement.querySelector('img');

      var cardElement = cardTemplate.cloneNode(true);
      var advertTitle = cardElement.querySelector('.popup__title');
      var advertAddress = cardElement.querySelector('.popup__text--address');
      var advertPrice = cardElement.querySelector('.popup__text--price');
      var advertHouseType = cardElement.querySelector('.popup__type');
      var advertRoomAndGuest = cardElement.querySelector('.popup__text--capacity');
      var advertCheckTime = cardElement.querySelector('.popup__text--time');
      var advertFeatures = cardElement.querySelector('.popup__features');
      var advertDescription = cardElement.querySelector('.popup__description');
      var advertPhotos = cardElement.querySelector('.popup__photos');
      var advertAvatar = cardElement.querySelector('.popup__avatar');

      // данные для Pins
      pinElement.style.left = (window.adverts[n].location.x < PIN_WIDTH) ? window.adverts[n].location.x + 'px' : (window.adverts[n].location.x - PIN_WIDTH) + 'px';
      pinElement.style.top = (window.adverts[n].location.y < PIN_HEIGHT) ? window.adverts[n].location.y + 'px' : (window.adverts[n].location.y - PIN_HEIGHT) + 'px';

      avatarImg.src = window.adverts[n].author.avatar;
      avatarImg.alt = window.adverts[n].offer.title;

      // данные для Cards
      advertTitle.textContent = window.adverts[n].offer.title;
      advertAddress.textContent = window.adverts[n].offer.address;
      advertPrice.textContent = window.adverts[n].offer.price + '₽/ночь';
      advertHouseType.textContent = houseTypesRu[window.houseTypes.indexOf(window.adverts[n].offer.type)];
      advertRoomAndGuest.textContent = window.adverts[n].offer.rooms + window.util.numbersEnding(window.adverts[n].offer.rooms, [' комната', ' комнаты', ' комнат']) + ' для ' + window.adverts[n].offer.guests + window.util.numbersEnding(window.adverts[n].offer.guests, [' гостя', ' гостей', ' гостей']);
      advertCheckTime.textContent = 'Заезд после ' + window.adverts[n].offer.checkin + ', выезд до ' + window.adverts[n].offer.checkout;
      advertDescription.textContent = window.adverts[n].offer.description;
      advertAvatar.src = window.adverts[n].author.avatar;

      // очищаем список feature
      while (advertFeatures.firstChild) {
        advertFeatures.removeChild(advertFeatures.firstChild);
      }

      // добавляем элементы в список feature
      window.adverts[n].offer.features.forEach(function (feature) {
        var advertFeaturesItem = document.createElement('li');

        advertFeaturesItem.className = 'popup__feature';
        advertFeaturesItem.classList.add('popup__feature--' + feature);

        advertFeatures.appendChild(advertFeaturesItem);
      });

      // очищаем блок photos
      while (advertPhotos.firstChild) {
        advertPhotos.removeChild(advertPhotos.firstChild);
      }

      // добавляем элементы в блок photos
      window.adverts[n].offer.photos.forEach(function (photo) {
        var advertPhotosItem = document.createElement('img');

        advertPhotosItem.className = 'popup__photo';
        advertPhotosItem.src = photo;
        advertPhotosItem.width = 45;
        advertPhotosItem.height = 40;
        advertPhotosItem.alt = 'Фотография жилья';

        advertPhotos.appendChild(advertPhotosItem);
      });

      //  добавляем pins & cards в fragments
      pinElement.classList.add('pin__num--' + n);
      cardElement.classList.add('map__card--' + n);
      cardElement.style.visibility = 'hidden';

      pinsFragment.appendChild(pinElement);
      cardsFragment.appendChild(cardElement);
    });

    //  добавляем pins & cards fragments в DOM
    pinsBlock.appendChild(pinsFragment);
    parentMapFiltersContainer.insertBefore(cardsFragment, mapFiltersContainer);

    //  Конец отрисовки сгенерированных DOM-элементов в блок .map__pins и Card-элементов в блок .map перед блоком .map__filters-container
  };

  // Узнаем клик на пине
  var pinsClickHandler = function (evt) {
    var mapCards = window.map.querySelectorAll('.map__card');
    mapCards.forEach(function (item, i) {
      mapCards[i].style.visibility = 'hidden';
      return mapCards;
    });

    for (var i = 0; i <= evt.target.classList.length; i++) {
      var pinClass = String(evt.target.classList[i]);

      if (pinClass.includes('pin__num--')) {
        var pinNum = pinClass.slice(10);
        var mapCard = window.map.querySelector('.map__card--' + pinNum);

        mapCard.style.visibility = 'visible';

        var closeMapCard = mapCard.querySelector('.popup__close');

        var closeCardOnEsc = function (closekey) {
          if (closekey.key === ESC_KEY) {
            mapCard.style.visibility = 'hidden';
            document.removeEventListener('keydown', closeCardOnEsc);
          }
        };

        closeMapCard.addEventListener('click', function () {
          mapCard.style.visibility = 'hidden';
        });

        document.addEventListener('keydown', closeCardOnEsc);
      }
    }
  };

  pinsBlock.addEventListener('click', pinsClickHandler);
  pinsBlock.addEventListener('keydown', function (evt) {
    if (evt.key === ENTER_KEY) {
      pinsClickHandler();
    }
  });
})();
