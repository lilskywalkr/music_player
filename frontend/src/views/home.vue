<script setup>
import { onMounted, ref } from 'vue';
import { callWeather, helloExpressServer, helloKoaServer } from '@@/requestHandler';  // fetch request functions
import Tools from '@/components/Tools.vue';
import getLocations from '@@@/getLocation'; // function for getting curretn location
import * as WeatherColors from '@@@/weatherColors'  // weather colors

const container = ref(null) // container ref
const metadata = ref(null); // track metadata ref
const cover = ref(null);  // track cover ref

// Function for changing the background gradient based on weather
async function changeGradient() {
  const coords = await getLocations(); // getting current location coordinates
  const weatherInfo = await callWeather(coords.lat, coords.lon);  // getting weather info for given coordinates

  if (WeatherColors[weatherInfo.weather[0].main]) {
    const weather = WeatherColors[weatherInfo.weather[0].main][weatherInfo.weather[0].description.split(" ").join("_")];  // getting proper weather colors

    // setting the background gradient color based on weather
    container.value.style.setProperty("--left", weather.left);
    container.value.style.setProperty("--right", weather.right);
  }
}

// Function for handling metadata transfer from child component to parent
function handleMetaDataTransfer(data) {
  metadata.value = data;
  
  const coverBuffer = metadata.value?.common.picture[0].data; // getting track cover in binary format
  const coverBlob = new Blob([coverBuffer], { type: "image/png" })  // converting buffer to a blob
  cover.value = URL.createObjectURL(coverBlob); // creating a url to the blob file
}

onMounted(async () => {
  await helloExpressServer();
  await helloKoaServer();
  
  // Setting up a gradient color changing interval for every 10 mins
  window.setInterval(async () => {
    await changeGradient();
  }, 5000 /*5 * 60 * 1000*/);

  // registering custom css properties for gradient color transition
  window.CSS.registerProperty({
    name: "--left",
    syntax: "<color>",
    inherits: false,
    initialValue: "transparent",
  });

  window.CSS.registerProperty({
    name: "--right",
    syntax: "<color>",
    inherits: false,
    initialValue: "transparent",
  });
})
</script>

<template>
    <div ref="container" class="container">
      <div class="dashboard">
        <div class="logo_box">
          <img class="player_logo" v-if="cover" :src="cover" alt="player logo">
        </div>

        <div class="track_desc">
          <h2>{{ metadata?.common?.artist }}</h2>
          <h3>{{ metadata?.common?.title }}</h3>
          <p>{{ metadata?.common?.album }}</p>
        </div>

        <Tools @metadata="handleMetaDataTransfer" />
      </div>
    </div>
</template>

<style scoped lang="scss">
  @keyframes bg_animation {
    from {background-position: left;}
    to {background-position: right;}
  }

  .container {
    --left: #87CEEB;
    --right: #FFE5B4;
    width: 100vw;
    height: 100vh;
    background: #141518;
    background-image: -webkit-linear-gradient(to right, var(--left), var(--right));
    background-image: linear-gradient(to right, var(--left), var(--right));
    background-size: 300%;
    background-position: left;
    transition: all 2s ease-in-out;
    animation: bg_animation 15s infinite alternate;
    transition-property: --left, --right;
    display: grid;
    place-items: center;

    .dashboard {
      width: calc(100% - 2em);
      height: calc(100% - 2em);
      border-radius: 2em;
      background: rgba(255, 255, 255, 0.15);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(5.8px);
      -webkit-backdrop-filter: blur(5.8px);
      position: relative;

      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: end;
      gap: 3em;
      padding: 2em 0;

      .logo_box {
        width: 20em;
        height: 20em;

        .player_logo {
          width: 100%;
          height: 100%;
        }
      }

      .track_desc {
        text-align: center;
      }
    }
  }
</style>