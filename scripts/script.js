const timeCard = document.querySelector('.weather-city__daytime');
const cityBlock = document.querySelector('.weather-city__city-block');
const input = document.getElementById('searchbar');
const cardContainer = document.querySelector('.locations__list');
const overlay = document.querySelector('.overlay');
const weatherImg = document.querySelector('.weather-img');
const weatherCity = document.querySelector('.weather-city__city');
const tempMain = document.querySelector('.weather-city__temp-main');
const tempMax = document.querySelector('.weather-city__temp_max');
const tempMin = document.querySelector('.weather-city__temp_min');
const humidity = document.querySelector('.weather-city__value_field_humidity');
const pressure = document.querySelector('.weather-city__value_field_pressure');
const weatherStatus = document.querySelector('.weather-city__status_main');
const weatherStatusIcon = document.querySelector('.weather-city__icon_main');
const sunrise = document.querySelector('.weather-city__value_field_sunrise');
const sunset = document.querySelector('.weather-city__value_field_sunset');
const dayTime = document.querySelector('.weather-city__value_field_daytime');
const wind = document.querySelector('.weather-city__value_field_wind');

const weather = [];

function convertToLocalString(dt) {
    return dt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

function convertTime(unixTime, timezone) {
    const actualDT = new Date();
    const localOffset = actualDT.getTimezoneOffset()*60;
    if (timezone+localOffset === 0) {
        let dt = new Date(unixTime * 1000);
        return dt;
    } else {
        let dt = new Date((unixTime + timezone + localOffset)* 1000);
        return dt;
    }
};


function getCurrentTime(textElement) {
    const currentTime =  new Date();
    const dayNumber = currentTime.getDay();
    const day = dayList[currentTime.getDay()];
    const month = monthName[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    textElement.textContent = day+ ', ' + dayNumber +' '+ month + ' ' + year +  ' | ' + 
    convertToLocalString(currentTime);
};

function getDayTime(diffTime) {
    const hm = diffTime/1000/3600;
    const h = Math.floor(hm);
    const m = Math.floor((hm - h)*60);
    return h +'h'+ ' ' + m +'m';
}

function showWeatherInfo (obj) {
    closePopup(overlay);
    weatherCity.textContent = obj.name + ', ' + obj.country;
    tempMain.textContent = obj.temperature;
    tempMax.textContent = obj.temp_max + String.fromCharCode(176);
    tempMin.textContent = obj.temp_min + String.fromCharCode(176);
    humidity.textContent = obj.humidity + '%';
    pressure.textContent = String(obj.pressure/1000).replace('.', ',') + 'mBar';
    weatherStatus.textContent = obj.status;
    wind.textContent = obj.wind + ' m/s';
    weatherStatusIcon.src = "https://openweathermap.org/img/wn/"+ obj.iconId +"@4x.png";
    sunset.textContent = convertToLocalString(obj.sunset);
    sunrise.textContent = convertToLocalString(obj.sunrise);
    dayTime.textContent = getDayTime(obj.sunset - obj.sunrise);
};


function addCity(obj) {
    const name = obj.name;
    const temperature = obj.temperature;
    const cardTemplate = document.querySelector('#locations-template').content;
    const cardElement = cardTemplate.querySelector('.locations__item').cloneNode(true);
    const cardCity = cardElement.querySelector('.locations__city');
    const cardTemperature = cardElement.querySelector('.locations__temp');

    cardCity.textContent = name;
    cardTemperature.textContent = temperature + String.fromCharCode(176);
    cardContainer.append(cardElement);
    cardCity.addEventListener('click', () => showWeatherInfo(obj));
    return cardContainer;
};


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
            tmp.temperature = Math.floor(data.main.temp);
            tmp.temp_min = Math.floor(data.main.temp_min);
            tmp.temp_max = Math.floor(data.main.temp_max);
            tmp.pressure = data.main.pressure;
            tmp.wind = data.wind.speed;
            tmp.humidity = data.main.humidity;
            tmp.status = data.weather[0].main;
            tmp.iconId = data.weather[0].icon;
            tmp.country = data.sys.country;
            tmp.sunrise = convertTime(data.sys.sunrise, data.timezone);
            tmp.sunset = convertTime(data.sys.sunset, data.timezone);
            addCity(tmp);
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

function renderList (list) {
    for (index in list) {
        getCityWeather(list[index]);
    }
}

function filterCity() {
    filterValue = input.value.toLowerCase();
    li = document.querySelectorAll('.locations__item');
    for (i = 0 ; i < li.length ; i++){
        a = li[i].querySelectorAll('.locations__city')[0];
        if(a.textContent.toLowerCase().indexOf(filterValue) > -1){
            li[i].style.display = "";
        }else{
            li[i].style.display = "none";
        }
    }
};


getCurrentTime(timeCard);


cityBlock.addEventListener('click', function(){
    openPopup(overlay);
});

weatherImg.addEventListener('click', function(){
    closePopup(overlay);
});

renderList(cityList);

input.addEventListener('keyup', filterCity);



