
let countrydetails = document.getElementById('details-country');
let flags = document.getElementById('flags');
let description = document.getElementById('description');
let located = document.getElementById('located');
let error1 = document.getElementById('error');

let weather1 = document.getElementById('weather');
let Time = document.getElementById('Time');
let winddetails = '';
let City = 'Manila';
let apikey = "718d0b2ea09b0143d65bd7a2fb7d49fd";
let key1 = "f84566b5d64844cfb59cc2448d742b76";
let country1 = ''; 
let searchcity = '';
let location1 = document.getElementById('location');

async function weather(place) {
    
try{
    
   const weatherurl = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`);

   

   if(!weatherurl.ok){
        throw new Error('Not Connected');
   }

   const data = await weatherurl.json();
   const data1 = data.sys.country;
   const tempdata = data.main.temp;
   const celcius = tempdata - 273.15;
   const kelvincelcius = (tempdata - 273.15) * 9/5 + 32;
   const kelvin = kelvincelcius * 1.8 + 32;
   const windspeed1 = data.wind.speed * 3.6;
   const windspeed = windspeed1.toFixed(2);


   if(windspeed <= 5){
        winddetails = `${windspeed} km/h 🌫: 'Light Breeze' Often felt on the face, but it doesn't move leaves`;
   }
   else if(windspeed <= 11){
        winddetails = `${windspeed} km/h 🌫: 'Moderate Breeze' Moves leaves and small twigs.`;
   }
   else if(windspeed <=19){
    winddetails = `${windspeed} km/h 🌫: 'Strong Breeze' Breaks twigs and moves larger branches.`;
  
   }
    else if(windspeed <=30){
    winddetails = `${windspeed} km/h 🌫: 'Gale' Large branches move, and walking against the wind becomes challenging.`;
  
   }
   weather1.innerHTML = '';
  

   weather1.innerHTML += `
                     <h3>Forecast</h3>
                     
                     
                     <p>Celcius: ${celcius.toFixed(1)} <span style='color:Blue'>❄</spam></p>
                     <p>Kelvin: ${kelvin.toFixed(1)}<span style='color:Red;'>🌡</span> </p>
                     <p>Weather: ${data.weather[0].description}</p>
                     <p>Wind Speed: ${winddetails}</p>
   
   `;
   searchcity = data.name;
   
   console.log(data);
   
   return data.sys.country;
}

catch(error){
    error1.style.display = 'block';
    error1.innerHTML = `<p>Search ${place} Doesn't Found!</p>`;
    setTimeout(() => {
        error1.style.display = 'none';
    }, 5000);
    console.log(error)
}
   
}


async function Discription(place) {
   
    let place1 = place.toLowerCase();
    


    console.log('lowercase ' + place1);
    try{
       const weatherurl1 = await fetch(`https://restcountries.com/v3.1/alpha/${place1}`);
    
       
    
       if(!weatherurl1){
            throw new Error('Not Connected');
       }
    
       const data = await weatherurl1.json();
        countrydetails.innerHTML = '';
       countrydetails.innerHTML += `
       <p> Search: ${searchcity} 🔎</p>
       <p> Country: ${data[0].name?.common} 🛤</p>
       <p> Capital: ${data[0].capital} 🏕</p>
       <p> Region: ${data[0].region} 🌏</p>
       <p> Sub-Region: ${data[0].subregion} 🌏</p>
       <p> Population: ${data[0].population} 👨🏿‍🤝‍👨🏾</p>
     
       
       
       `;
      
       let dataarray11 = data[0].currencies;
       
       Object.values(dataarray11).forEach(dataarray => {
   
            countrydetails.innerHTML += `
                
                <p> Currencies: '${dataarray.name}', '${dataarray.symbol}' 💰</p>
            `

       });
       
      
       let dataarray = data[0].languages;
       let i = 0;
       Object.values(dataarray).forEach(dataarray => {
        i++;
            countrydetails.innerHTML += `
                
                <p> Language ${i}: ${dataarray}</p>
            `

       });
       
    
       
    
       console.log(data);
           flags.innerHTML = '';
    flags.innerHTML = `
            <h3>${data[0].altSpellings[1]}</h3>
                <div class="images">
               <img src="${data[0].flags.png}">
               <img src="${data[0].coatOfArms.png}">
                </div>
    `;
    description.innerHTML = '';
    description.innerHTML = ` 
    <h3>${data[0].name?.common} Flags:</h3>
    <p>${data[0].flags.alt}</p>
            `
       return `${data[0].region}/${data[0].capital}`;
    }
    
    catch(error){
        error1.style.display = 'block';
        error1.innerHTML = `<p>Region not Responding </p>`;
        setTimeout(() => {
            error1.style.display = 'none';
        }, 5000);
        console.log(error)
    }
       
    }

async function clock(city) {
    

    try {
        
        const clockdata = await fetch(`https://api.ipgeolocation.io/timezone?apiKey=${key1}&tz=${city}`);


        if(!clockdata.ok){
            throw new Error("Not Connected");
            
        }
        const data = await clockdata.json();

        console.log(data);
        let name = data.date_time_txt.split(' ').slice(0, 4).join(' ');
        Time.innerHTML = '';
        Time.innerHTML = `
        <h3>${data.timezone}</h3>
        <h3>${data.time_12}</h3>
        <p>${name} 🗓</p>

        `
    } catch (error) {
        error1.style.display = 'block';
        error1.innerHTML = `<p>Time not Responding </p>`;
        setTimeout(() => {
            error1.style.display = 'none';
        }, 5000);
        console.log(error);
    }
}
located.addEventListener('click', () =>{
    if(location1.value){
    City = location1.value;
    }
    else{
        error1.style.display = 'block';
        error1.innerHTML = `<p>Enter the City/Country you want to search.</p>`;
        setTimeout(() => {
            error1.style.display = 'none';
        }, 5000);
    }
    info();
});

function info() {



weather(City).then(country => {
    if(country){
        
    Discription(country).then(country => {
        if(country){

    
    clock(country)
           
        

        }
    });
    }
});
}
if(!location1.value){

    located.click();
}