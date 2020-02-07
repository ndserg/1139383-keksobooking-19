'use strict';
var LEADING_ZERO = 10;

var pinWidth = 50;
var pinHeight = 70;
var minMapWidth = 0;
var maxMapWidth = 1200;
var minMapHeight = 130;
var maxMapHeight = 630;
var advertNumber = 8;
var adverts = [];
var houseTypes = ['palace', 'flat', 'house', 'bungalo'];
var bookingTimes = ['12:00', '13:00', '14:00'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var photosList = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var map = document.querySelector('.map');
var pinsBlock = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

map.classList.remove('map--faded');
adverts.length = advertNumber;

//  Генератор случайных чисел
var randomNumber = function getRandomInt(min, max) {
  return (Math.floor(Math.random() * (max - min + 1)) + min);
};

//  Случайная выборка из массива
var getRandomList = function (sourceList) {
  var randomList = [];
  randomList.length = randomNumber(1, sourceList.length);
  for (var i = 0; i < randomList.length; i++) {
    randomList[i] = sourceList[randomNumber(0, sourceList.length - 1)];
  }

  return randomList;
};

//  Создаем массив обектов (объявлений)
var addAdvert = function () {
  for (var i = 0; i < adverts.length; i++) {
    adverts[i] =
    {author: {
      avatar: 'img/avatars/user' + (([i] >= LEADING_ZERO) ? [i + 1] : '0' + [i + 1]) + '.png'
    },
    offer: {
      title: 'заголовок объявления',
      address: '',
      price: randomNumber(500, 10000),
      type: houseTypes[randomNumber(0, houseTypes.length - 1)],
      rooms: randomNumber(1, 10),
      guests: randomNumber(1, 10),
      checkin: bookingTimes[randomNumber(0, bookingTimes.length - 1)],
      checkout: bookingTimes[randomNumber(0, bookingTimes.length - 1)],
      features: getRandomList(featuresList),
      description: 'строка с описанием',
      photos: getRandomList(photosList),
    },
    location: {
      x: randomNumber(minMapWidth, maxMapWidth),
      y: randomNumber(minMapHeight, maxMapHeight),
    }
    };
    adverts[i].offer.address = adverts[i].location.x + ',' + adverts[i].location.y;
  }

  return adverts;
};

addAdvert();

//  Отрисовываем сгенерированные DOM-элементы в блок .map__pins
for (var n = 0; n < adverts.length; n++) {
  var pinElement = pinTemplate.cloneNode(true);
  var avatarImg = pinElement.querySelector('img');

  pinElement.style.left = (adverts[n].location.x < pinWidth ? adverts[n].location.x + 'px' : (adverts[n].location.x - pinWidth) + 'px');
  pinElement.style.top = (adverts[n].location.y < pinHeight ? adverts[n].location.y + 'px' : (adverts[n].location.y - pinHeight) + 'px');

  avatarImg.src = adverts[n].author.avatar;
  avatarImg.alt = adverts[n].offer.title;

  pinsBlock.appendChild(pinElement);
}
