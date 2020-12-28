const express = require('express')
const exp_hbs = require('express-handlebars')


const cookieParser = require('cookie-parser')
const expressSession = require('express-session')
const crypto = require('crypto')
const passport = require('passport')
const GithubStrategy = require('passport-github').Strategy
const { stringify } = require('flatted')
const _ = require('underscore')



require('dotenv').config()

const app = express()
const port = 3006
const COOKIE = process.env.PROJECT_DOMAIN

let scopes = ['notifications', 'user:email', 'read:org', 'repo']
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:3006/login/github/return',
            scope: scopes.join(' ')
        },
        function (token, tokenSecret, profile, cb) {
            return cb(null, { profile: profile, token: token })
        }
    )
)
passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((obj, done) => {
    done(null, obj)
})

app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(
    expressSession({
        secret: crypto.randomBytes(64).toString('hex')
            .randomBytes(64)
            .toString('hex'),
        resave: true,
        saveUninitialized: true
    })
)


app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const hbs = exp_hbs.create({
    layoutsDir: __dirname + '/views'
})
app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')

app.get('/t', (req, res) => {
    res.status(200).send('Working!')
})

app.get('/', (req, res) => {
    res.render('main')
})

app.get('/falafel', (req, res) => {
    res.status(200).send('../Login/Login')
})

app.listen(port, () => {
    console.log(`🌏 Server is running at http://localhost:${port}`)
})