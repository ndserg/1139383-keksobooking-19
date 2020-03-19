'use strict';
(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  var pinsBlock = document.querySelector('.map__pins');
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var parentMapFiltersContainer = mapFiltersContainer.parentNode;

  //  проверка и установка типа жилья
  var getHouseType = function (house) {
    switch (house) {
      case 'house':
        return 'Дом';
      case 'flat':
        return 'Квартира';
      case 'bungalo':
        return 'Бунгало';
      case 'palace':
        return 'Дворец';
      default:
        return 'Неопределенный вид жилья';
    }
  };

  window.mapRendering = function (adverts, clear) {
    // удаление всех pins при изменении фильтра
    if (clear) {
      var pins = document.querySelectorAll('.map__pin + button:not(.map__pin--main)');

      pins.forEach(function (element) {
        element.parentNode.removeChild(element);
      });
    }

    //  Отрисовываем сгенерированные DOM-элементы в блок .map__pins и Card-элементы в блок .map перед блоком .map__filters-container
    var pinsFragment = document.createDocumentFragment();
    var cardsFragment = document.createDocumentFragment();

    adverts.forEach(function (item, n) {
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
      pinElement.style.left = (adverts[n].location.x < PIN_WIDTH) ? adverts[n].location.x + 'px' : (adverts[n].location.x - PIN_WIDTH) + 'px';
      pinElement.style.top = (adverts[n].location.y < PIN_HEIGHT) ? adverts[n].location.y + 'px' : (adverts[n].location.y - PIN_HEIGHT) + 'px';

      avatarImg.src = adverts[n].author.avatar;
      avatarImg.alt = adverts[n].offer.title;

      // данные для Cards
      advertTitle.textContent = adverts[n].offer.title;
      advertAddress.textContent = adverts[n].offer.address;
      advertPrice.textContent = adverts[n].offer.price + '₽/ночь';
      advertHouseType.textContent = getHouseType(adverts[n].offer.type);
      advertRoomAndGuest.textContent = adverts[n].offer.rooms + window.util.numbersEnding(adverts[n].offer.rooms, [' комната', ' комнаты', ' комнат']) + ' для ' + adverts[n].offer.guests + window.util.numbersEnding(adverts[n].offer.guests, [' гостя', ' гостей', ' гостей']);
      advertCheckTime.textContent = 'Заезд после ' + adverts[n].offer.checkin + ', выезд до ' + adverts[n].offer.checkout;
      advertDescription.textContent = adverts[n].offer.description;
      advertAvatar.src = adverts[n].author.avatar;

      // очищаем список feature
      while (advertFeatures.firstChild) {
        advertFeatures.removeChild(advertFeatures.firstChild);
      }

      // добавляем элементы в список feature
      adverts[n].offer.features.forEach(function (feature) {
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
      adverts[n].offer.photos.forEach(function (photo) {
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
})();
