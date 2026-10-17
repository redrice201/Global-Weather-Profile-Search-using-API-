let countrydetails = document.getElementById("details-country");
let flags = document.getElementById("flags");
let description = document.getElementById("description");
let located = document.getElementById("located");
let error1 = document.getElementById("error");

let weather1 = document.getElementById("weather");
let Time = document.getElementById("Time");
let winddetails = "";
let City = "Manila";
let country1 = "";
let searchcity = "";
let location1 = document.getElementById("location");

const WORKER_URL = "super-block-cf48.robertrosal132.workers.dev";

async function weather(place) {
  try {
    const weatherurl = await fetch(
      `${WORKER_URL}/weather?q=${encodeURIComponent(place)}`,
    );

    if (!weatherurl.ok) {
      throw new Error("Not Connected");
    }

    const data = await weatherurl.json();
    const tempdata = data.main.temp;
    const celcius = tempdata - 273.15;
    const kelvin = tempdata;
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
    } else {
      winddetails = `${windspeed} km/h 🌫: 'Storm' Very strong wind, stay indoors if possible.`;
    }
    weather1.innerHTML = "";

    weather1.innerHTML += `
                     <h3>Forecast</h3>
                     
                     
                     <p>Celcius: ${celcius.toFixed(1)} <span style='color:Blue'>❄</span></p>
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
    const weatherurl1 = await fetch(`${WORKER_URL}/country?code=${place1}`);

    if (!weatherurl1.ok) {
      const err = await weatherurl1.json().catch(() => null);
      console.log(weatherurl1.status, err); // look at errors[0].message
      throw new Error(err?.errors?.[0]?.message || "Not Connected");
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
      `${WORKER_URL}/time?tz=${encodeURIComponent(city)}`,
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
