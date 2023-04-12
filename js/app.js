const wrapper = document.querySelector(".wrapper"),
inputPart = document.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
weatherPart = wrapper.querySelector(".weather-part"),
wIcon = weatherPart.querySelector("img"),
arrowBack = wrapper.querySelector("header i");

let api;
const API_KEY = 'dc6dfc813f098f0c339bb224af932efd';

inputField.addEventListener("keyup", e =>{
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click", () =>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert("Your browser not support geolocation api");
    }
});

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    fetchData();
}

function onSuccess(position){
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add("error");
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");
    fetch(api).then(res => res.json()).
    then(result => weatherDetails(result)).
    catch(() =>{
        infoTxt.innerText = "Algo salio mal";
        infoTxt.classList.replace("pending", "error");
    });
}



let bodyclass=""; //asi remuevo la clase del body cuando vuelvo atras
const body = document.querySelector(".body"); //cambiar el fondo dependiendo el clima

function weatherDetails(info){
    if(info.cod == "404"){
        infoTxt.classList.replace("pending", "error");
        infoTxt.innerText = `${inputField.value} nombre de la ciudad invalida`;
    }else{
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {temp, feels_like, humidity} = info.main;

        if(id == 800){
            wIcon.src = "icons/soleado.png";
            // body.classList.add('soleado');

        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/tormenta.png";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/nieve.png";
            body.classList.add('nieve');
            body.style.backgroundColor = '#d2e2e2';
            bodyclass ="nieve";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/niebla.png";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/nublado.png";  body.classList.add('nublado');
            body.style.backgroundColor = '#d2e2e2';
            bodyclass ="nublado";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/lluvia.png";
            body.classList.add('lluvia');
            body.style.backgroundColor = '#d2e2e2';
            bodyclass ="lluvia";
        }
        weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
        weatherPart.querySelector(".weather").innerText = description;
        weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
        weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;
        infoTxt.classList.remove("pending", "error");
        infoTxt.innerText = "";
        inputField.value = "";
        wrapper.classList.add("active");
    }
}

arrowBack.addEventListener("click", ()=>{
    wrapper.classList.remove("active");
    body.classList.remove(bodyclass);
    body.style.backgroundColor = '#c2e5fd';
    bodyclass ="";
});