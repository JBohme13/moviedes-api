require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const STORE = require('./STORE')

app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function handleAuth(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    if(!authToken  || authToken.split(' ')[1] !== apiToken) {
        res.status(401)
           .json({error: 'Unauthorized request'})
    }
    next()
})

function handleMovieRequest(req, res) {
    const { genre, country, avgVote} = req.query;

    let movies = STORE;

    if(genre) {
        movies = movies.filter(movie => {
                    return(
                        movie
                        .genre
                        .toLowerCase()
                        .includes(genre.toLowerCase())

                    )
                })
    }

    if(country) {
        movies = movies.filter(movie => {
                    return(
                        movie
                        .country
                        .toLowerCase()
                        .includes(country.toLowerCase())
                    )
        })
    }

    if(avgVote) {
        movies = movies.filter(movie => movie.avg_vote >= parseInt(avgVote))
                 .sort((a, b) => {
                     return a['avg_vote'] < b['avg_vote'] ? 1 : a['avg_vote'] > b['avg_vote'] ? -1 : 0;
                 })
    }

    res.json(movies)
}

app.get('/movie', handleMovieRequest)

const PORT = 8001

app.listen(PORT, () => {
    console.log('server is listening on port ${PORT}')
})