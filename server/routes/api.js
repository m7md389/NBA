const express = require('express')
const urllib = require("urllib")
const router = express.Router()
const PLAYER_PICTURE_URL = "https://nba-players.herokuapp.com/players-stats/"
const RANDOM_PLAYERS_URL = "http://data.nba.net/10s/prod/v1/2018/players.json"

let teamToIDs = {
    "lakers": "1610612747",
    "warriors": "1610612744",
    "heat": "1610612748",
    "suns": "1610612756"
}

let dreamTeam = []

let players
urllib.request(RANDOM_PLAYERS_URL, function(err, data, res) {
    if (err)
        throw err
    players = JSON.parse(data.toString()).league.standard
})

router.get('/teams/:teamName', function(req, res) {
    const teamId = teamToIDs[req.params.teamName]
    if (teamId === undefined) {
        return res.status(404).send("Item Not Found")
    }

    let teamMembers = players
        .filter(p => p.isActive && p.teamId === teamId)
        .map(p => {
            return {
                firstName: p.firstName,
                lastName: p.lastName,
                jersey: p.jersey,
                pos: p.pos,
            }
        })

    res.send(teamMembers)
})

router.get('playerStats/:lastName/:firstName', async function(req, res) {
    const lastName = req.params.lastName
    const firstName = req.params.firstName
    const playerStats = await urllib.request(`${PLAYER_PICTURE_URL}${lastName}/${firstName}`, function(err, data, res) {
        if (err)
            throw err
        return JSON.parse(data.toString())
    })
    res.send(playerStats)
})

router.put('/team', function(req, res){
    const team = req.body
    if(!team){
        res.status(400).send("Please send a team")
    }
    teamToIDs[team.teamName] = team.teamId
    res.send()
})

router.get("./dreamTeam", function(req, res){
    res.send(dreamTeam)
})

router.post("/roster", function(req, res){
    if(dreamTeam.length === 5){
        res.send("Limit reached")
    }
    const player = req.body
    // you have to check if correct request
    dreamTeam.push(player)
})

module.exports = router