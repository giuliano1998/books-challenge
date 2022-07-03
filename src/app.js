const express = require('express');
const mainRouter = require('./routes/main');
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const userLoggedMiddleware = require('./middlewares/userLoggedMiddleware')
const app = express();

app.use(methodOverride('_method'))
app.use(session({
  secret: "SHHHH",
  resave: true,
  saveUninitialized: true
}
))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(cookieParser());
app.use(userLoggedMiddleware);
app.use('/', mainRouter);

app.listen(3000, () => {
  console.log('listening in http://localhost:3000');
});