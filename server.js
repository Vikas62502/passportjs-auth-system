const express = require('express');
const app = express();
const { connectMongoose, User } = require('./database.js');
const ejs = require('ejs');
const passport = require('passport');
const { initializingPassport, isAuthenticated } = require('./passportConfig.js');
const expressSession = require('express-session')
const port = 5000;


connectMongoose();
initializingPassport(passport);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render("index");
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/register', (req, res) => {
    res.render("register");
});

app.post('/register', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user) return res.status(400).send('User already registered.');

    const newUser = await User.create(req.body);
    res.status(200).send(newUser);
});

app.post('/login', passport.authenticate("local", { failureRedirect: "/register", successRedirect: "/" }), async (req, res) => {
    res.send("Logged in");
});

app.get("/profile", isAuthenticated, (req, res) => { res.send(req.user) });

// app.get('/logout', (req, res) => {
//     console.log(req.user, "before logout");

//     req.logout();
//     console.log(req.user, "after logout");
//     res.send("Logged out");
// });

app.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/'); //Inside a callback… bulletproof!
    });
    // req.logout();
    // res.redirect('/');
});


app.listen(port, () => console.log(`Server started on port ${port}`)); 