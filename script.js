let countrydetails = document.getElementById("details-country");
let flags = document.getElementById("flags");
let description = document.getElementById("description");
let located = document.getElementById("located");
let error1 = document.getElementById("error");

let weather1 = document.getElementById("weather");
let Time = document.getElementById("Time");
let winddetails = "";
let City = "Manila";
let apikey = "718d0b2ea09b0143d65bd7a2fb7d49fd";
let key1 = "rc_live_eb9f01c19419429a94757232c46caefe";
let country1 = "";
let searchcity = "";
let location1 = document.getElementById("location");

async function weather(place) {
  try {
    const weatherurl = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`,
    );

    if (!weatherurl.ok) {
      throw new Error("Not Connected");
    }

    const data = await weatherurl.json();
    const data1 = data.sys.country;
    const tempdata = data.main.temp;
    const celcius = tempdata - 273.15;
    const kelvincelcius = ((tempdata - 273.15) * 9) / 5 + 32;
    const kelvin = kelvincelcius * 1.8 + 32;
    const windspeed1 = data.wind.speed * 3.6;
    const windspeed = windspeed1.toFixed(2);

    if (windspeed <= 5) {
      winddetails = `${windspeed} km/h 🌫: 'Light Breeze' Often felt on the face, but it doesn't move leaves`;
    } else if (windspeed <= 11) {
      winddetails = `${windspeed} km/h 🌫: 'Moderate Breeze' Moves leaves and small twigs.`;
    } else if (windspeed <= 19) {
      winddetails = `${windspeed} km/h 🌫: 'Strong Breeze' Breaks twigs and moves larger branches.`;
    } else if (windspeed <= 30) {
      winddetails = `${windspeed} km/h 🌫: 'Gale' Large branches move, and walking against the wind becomes challenging.`;
    }
    weather1.innerHTML = "";

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
  } catch (error) {
    error1.style.display = "block";
    error1.innerHTML = `<p>Search ${place} Doesn't Found!</p>`;
    setTimeout(() => {
      error1.style.display = "none";
    }, 5000);
    console.log(error);
  }
}

async function Discription(place) {
  let place1 = place.toLowerCase();

  console.log("lowercase " + place1);
  try {
    const property = place1.length === 2 ? "codes.alpha_2" : "codes.alpha_3";

    const weatherurl1 = await fetch(
      `https://api.restcountries.com/countries/v5/${property}/${place1}`,
      { headers: { Authorization: `Bearer ${key1}` } },
    );

    if (!weatherurl1.ok) {
      throw new Error("Not Connected");
    }

    const json = await weatherurl1.json();
    const country = json.data.objects[0];
    if (!country) throw new Error("Country not found");

    countrydetails.innerHTML = "";
    countrydetails.innerHTML += `
       <p> Search: ${searchcity} 🔎</p>
       <p> Country: ${country.names?.common} 🛤</p>
       <p> Capital: ${country.capitals?.map((c) => c.name).join(", ")} 🏕</p>
       <p> Region: ${country.region} 🌏</p>
       <p> Sub-Region: ${country.subregion} 🌏</p>
       <p> Population: ${country.population} 👨🏿‍🤝‍👨🏾</p>
       `;

    let dataarray11 = country.currencies ?? {};

    Object.values(dataarray11).forEach((dataarray) => {
      countrydetails.innerHTML += `
                <p> Currencies: '${dataarray.name}', '${dataarray.symbol}' 💰</p>
            `;
    });

    let dataarray = country.languages ?? [];
    let i = 0;
    Object.values(dataarray).forEach((dataarray) => {
      i++;
      countrydetails.innerHTML += `
                <p> Language ${i}: ${dataarray.name?.english ?? dataarray.name ?? dataarray}</p>
            `;
    });

    console.log(json);
    flags.innerHTML = "";
    flags.innerHTML = `
            <h3>${country.names?.alternates?.[0] ?? country.names?.common}</h3>
                <div class="images">
               <img src="${country.flag.url_png}">
                </div>
    `;
    description.innerHTML = "";
    description.innerHTML = ` 
    <h3>${country.names?.common} Flags:</h3>
    <p>${country.flag.description}</p>
            `;
    return `${country.region}/${country.capitals?.[0]?.name}`;
  } catch (error) {
    error1.style.display = "block";
    error1.innerHTML = `<p>Region not Responding </p>`;
    setTimeout(() => {
      error1.style.display = "none";
    }, 5000);
    console.log(error);
  }
}

async function clock(city) {
  try {
    const clockdata = await fetch(
      `https://api.ipgeolocation.io/timezone?apiKey=${key1}&tz=${city}`,
    );

    if (!clockdata.ok) {
      throw new Error("Not Connected");
    }
    const data = await clockdata.json();

    console.log(data);
    let name = data.date_time_txt.split(" ").slice(0, 4).join(" ");
    Time.innerHTML = "";
    Time.innerHTML = `
        <h3>${data.timezone}</h3>
        <h3>${data.time_12}</h3>
        <p>${name} 🗓</p>

        `;
  } catch (error) {
    error1.style.display = "block";
    error1.innerHTML = `<p>Time not Responding </p>`;
    setTimeout(() => {
      error1.style.display = "none";
    }, 5000);
    console.log(error);
  }
}
located.addEventListener("click", () => {
  if (location1.value) {
    City = location1.value;
  } else {
    error1.style.display = "block";
    error1.innerHTML = `<p>Enter the City/Country you want to search.</p>`;
    setTimeout(() => {
      error1.style.display = "none";
    }, 5000);
  }
  info();
});

function info() {
  weather(City).then((country) => {
    if (country) {
      Discription(country).then((country) => {
        if (country) {
          clock(country);
        }
      });
    }
  });
}
if (!location1.value) {
  located.click();
}
