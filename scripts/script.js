const timeCard = document.querySelector('.weather-city__daytime');
const cityBlock = document.querySelector('.weather-city__city-block');
const cardContainer = document.querySelector('.locations__list');
const overlay = document.querySelector('.overlay');
const weatherImg = document.querySelector('.weather-img');
const weather = [];

function getCurrentTime(textElement) {
    const currentTime =  new Date();
    const dayNumber = currentTime.getDay();
    const day = dayList[currentTime.getDay()];
    const month = monthName[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    textElement.textContent = day+ ', ' + dayNumber +' '+ month + ' ' + year +  ' | ' +
    currentTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

function addCity(name, temperature) {
    const cardTemplate = document.querySelector('#locations-template').content;
    const cardElement = cardTemplate.querySelector('.locations__item').cloneNode(true);


    const cardCity = cardElement.querySelector('.locations__city');
    const cardTemperature = cardElement.querySelector('.locations__temp');

    cardCity.textContent = name;
    cardTemperature.textContent = temperature + String.fromCharCode(176);
    cardContainer.append(cardElement);

    return cardContainer;
}

function getCityWeather(name){
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${api_key}&units=metric`;
    const tmp = {};
    
    fetch(url)
        .then(function(response){
            let data =  response.json();
            return data;
        })
        .then(function(data){
            
            tmp.name = data.name;
            tmp.country = data.sys.country;
            tmp.temperature = Math.floor(data.main.temp);
            tmp.pressure = data.main.pressure;
            tmp.humidity = data.main.humidity;
            tmp.description = data.weather[0].description;
            tmp.iconId = data.weather[0].icon;
            addCity(tmp.name, tmp.temperature);
        });
    
    return tmp;
}

function closePopupWithEsc(evt) {
    const closeElement = document.querySelector('.overlay_opened');
    if (evt.key === "Escape") {
      closePopup(closeElement);
    }
};


function openPopup(popupElement) {
    popupElement.classList.add('overlay_opened');
    document.addEventListener('keydown', closePopupWithEsc);
} 

function closePopup(popupElement) {
    popupElement.classList.remove('overlay_opened');
    document.removeEventListener('keydown', closePopupWithEsc);
}

getCurrentTime(timeCard);

cityList.forEach(function (item) {
    weather.push(getCityWeather(item));
});


cityBlock.addEventListener('click', function(){
    openPopup(overlay);
});


weatherImg.addEventListener('click', function(){
    closePopup(overlay);
});
