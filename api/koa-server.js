require('dotenv').config();
const Koa = require('koa');
const cors = require('@koa/cors');
const HomeRoutes = require('./routes/home.router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());
app.use(cors());

app.use(HomeRoutes.routes()).use(HomeRoutes.allowedMethods())

app.listen(4000);