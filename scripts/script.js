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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
};

function convertToLocalString(dt) {
    return dt.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
};

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
    const dayNumber = currentTime.getDate();
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
};

function showWeatherInfo (obj) {
    const nextMax = document.querySelectorAll('.weather-city__next-temp_max');
    const nextMin = document.querySelectorAll('.weather-city__next-temp_min');
    const nextIcon = document.querySelectorAll('.weather-city__icon_detail-forecast');
    const nextDay = document.querySelectorAll('.weather-city__value_field_day');
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
    nextMax[0].textContent = Math.floor(obj.daily[0]['temp_max']);
    nextMax[1].textContent = Math.floor(obj.daily[1]['temp_max']);
    nextMax[2].textContent = Math.floor(obj.daily[2]['temp_max']);
    nextMin[0].textContent = Math.floor(obj.daily[0]['temp_min']);
    nextMin[1].textContent = Math.floor(obj.daily[1]['temp_min']);
    nextMin[2].textContent = Math.floor(obj.daily[2]['temp_min']);
    nextIcon[0].src = "https://openweathermap.org/img/wn/"+ obj.daily[0]['iconId'] +"@4x.png";
    nextIcon[1].src = "https://openweathermap.org/img/wn/"+ obj.daily[1]['iconId'] +"@4x.png";
    nextIcon[2].src = "https://openweathermap.org/img/wn/"+ obj.daily[2]['iconId'] +"@4x.png";
    nextDay[0].textContent = obj.daily[0]['next_day'];
    nextDay[1].textContent = obj.daily[1]['next_day'];
    nextDay[2].textContent = obj.daily[2]['next_day'];
};


function addCity(obj) {
    const cardTemplate = document.querySelector('#locations-template').content;
    const cardElement = cardTemplate.querySelector('.locations__item').cloneNode(true);
    const cardCity = cardElement.querySelector('.locations__city');
    const cardTemperature = cardElement.querySelector('.locations__temp');
    const name = obj.name;
    const temperature = obj.temperature;

    cardCity.textContent = name;
    cardTemperature.textContent = temperature + String.fromCharCode(176);
    cardContainer.append(cardElement);
    cardCity.addEventListener('click', () => showWeatherInfo(obj));
    return cardContainer;
};


getWeather = async (name) => {
    
    const tmp = {};
    const daily = [];
    const actualDate = new Date().toISOString().slice(0,10);
    const fetchText = url => fetch(url).then(r => r.json());
 
    const [weather, forecast] = await Promise.all([
        fetchText(`https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${apiKey}&units=metric`),
        fetchText(`https://api.openweathermap.org/data/2.5/forecast?q=${name}&cnt=24&appid=${apiKey}&units=metric`)
    ]);
    tmp.name = weather.name;
    tmp.temperature = Math.floor(weather.main.temp);
    tmp.temp_min = Math.floor(weather.main.temp_min);
    tmp.temp_max = Math.floor(weather.main.temp_max);
    tmp.pressure = weather.main.pressure;
    tmp.wind = weather.wind.speed;
    tmp.humidity = weather.main.humidity;
    tmp.status = weather.weather[0].main;
    tmp.iconId = weather.weather[0].icon;
    tmp.country = weather.sys.country;
    tmp.sunrise = convertTime(weather.sys.sunrise, weather.timezone);
    tmp.sunset = convertTime(weather.sys.sunset, weather.timezone);

    
    const dateList = forecast.list.reduce((a,o) => (!o.dt_txt.includes(actualDate)&& a.push(o.dt_txt.split(' ')[0]), a.filter(onlyUnique)), []);
    for (day in dateList) {
        const filteredDay = forecast.list.filter(function (el) {
            return el.dt_txt.includes(dateList[day]);
        });
        const ymd = new Date(dateList[day]);
        const dayNumber = ymd.getDate();
        const dayName = dayList[ymd.getDay()];
        const tempMin = Math.min.apply(Math, filteredDay.map(a => a.main.temp_min));
        const tempMax  = Math.max.apply(Math, filteredDay.map(a => a.main.temp_max));
        const weatherIcon = filteredDay.map(a => a.weather[0].icon)[3];
        const obj = {'temp_min': tempMin, 
                     'temp_max': tempMax, 
                     'iconId': weatherIcon, 
                     'next_day': dayName + ', '+ dayNumber};
        daily.push(obj);
    }
    tmp.daily = daily;
    addCity(tmp);
};

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
        getWeather(list[index]);
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

renderList(cityList.sort());

input.addEventListener('keyup', filterCity);



