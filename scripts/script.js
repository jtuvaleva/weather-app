const timeCard = document.querySelector('.weather-city__daytime');
const cityBlock = document.querySelector('.weather-city__city-block');


function getCurrentTime(textElement) {
    const currentTime =  new Date();
    const dayNumber = currentTime.getDay();
    const day = dayList[currentTime.getDay()];
    const month = monthName[currentTime.getMonth()];
    const year = currentTime.getFullYear();
    textElement.textContent = day+ ', ' + dayNumber +' '+ month + ' ' + year +  ' | ' +
    currentTime.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
};

getCurrentTime(timeCard);


