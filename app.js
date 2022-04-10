require("dotenv").config()
const bodyParser = require('body-parser')
const ejs = require('ejs')
const express = require('express')
const Sequelize = require("sequelize-cockroachdb")

const ventureModel = require("./models/venture")

const sequelize = new Sequelize(process.env.DB_URL, {
    logging: false,
    sync: { alter: true }
})

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs")

const Venture = ventureModel(sequelize, Sequelize)

// render all ventures
app.get('/ventures', async function(_req, res) {
    await sequelize.sync()

    const ventures = await Venture.findAll()
    if (!ventures) {
        res.send('Failed to find ventures')
        return
    }

    res.render('ventures', { ventures })
})

// render one venture
app.get('/venture/:id', async function(req, res) {
    await sequelize.sync()

    const venture = await Venture.findByPk(req.params.id)
    if (!venture) {
        res.send('Failed to find venture')
        return
    }

    res.render('venture', { venture })
})

// invest in a venture
app.post('/venture/:id', async function(req, res) {
    await sequelize.sync()

    const venture = await Venture.findByPk(req.params.id)
    if (!venture) {
        res.send('Failed to find venture')
        return
    }

    try {
        await venture.update({ moneyRaised: Number(venture.moneyRaised) + Number(req.body.investmentAmount) })
        res.send(`Invested ${req.body.investmentAmount} in ${venture.name}`)
    } catch {
        res.send(`Failed to invest in ${venture.name}`)
    }
})

// render the create venture page
app.get('/create-venture', function(_req, res) {
    res.render('create-venture')
})

// create a venture
app.post('/create-venture', async function(req, res) {
    await sequelize.sync()

    try {
        await Venture.create({
            name: req.body.name,
            category: req.body.category,
            target: req.body.target,
            valuation: req.body.valuation,
            description: req.body.description
        })
        res.send(`Created ${req.body.name}`)
    } catch {
        res.send(`Failed to create ${req.body.name}`)
    }  
})

app.listen(3000, function() {
    console.log('Server started successfully')
  })