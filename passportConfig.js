const LocalStrategy = require('passport-local').Strategy;
const { User } = require("./database.js")

exports.initializingPassport = (passport) => {

    passport.use(new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username });
            if (!user) return done(null, false, { message: "No user with that username" });
            if (password !== user.password) return done(null, false, { message: "Password incorrect" });
            return done(null, user);

        } catch (error) {

            return done(error, false, { message: "Error" });
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id);
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, false, { message: "Error" });
        }
    })

}

exports.isAuthenticated = (req, res, next) => {
    if (req.user) return next();
    res.redirect("/login");
}