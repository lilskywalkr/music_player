const Router = require('@koa/router');
const router = new Router();
const { callWeather } = require("../utils/weather.js");

router.get('/hello', ctx => {
    ctx.body = "Hello Koa!";
});

router.get('/weather/:lan,:lon', async (ctx) => {
    try {
        const weatherData = await callWeather(ctx.params.lan, ctx.params.lon); 
        ctx.body = weatherData;
    } catch (error) {
        console.error("Error in /weather route:", error.message);
        
        ctx.status = 500;
        ctx.body = {
            error: "Failed to fetch weather data",
            message: error.message
        };
    }
});

module.exports = router