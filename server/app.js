const express = require('express');
const axios = require('axios').default;
const morgan = require('morgan');
const cache = require('memory-cache');
const app = express();

app.use(morgan('dev'));

app.get('/', function(req, res) {
  const imdbID = req.query.i;
  const title = req.query.t; 
  const apiKey = '1cdea750';

  if (imdbID) {
    const cachedData = cache.get(`${imdbID}_${apiKey}`);
    if (cachedData) {
      res.send(cachedData);
    } else {
      const url = `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
      axios.get(url)
      .then(function(response) {
        const movieData = response.data;
        if (movieData.Response === 'True') {
          cache.put(`${imdbID}_${apiKey}`, movieData, 5 * 60 * 1000);
          res.send(movieData);
        } else {
          res.status(404).send('Movie not found!');
        }
      })
      .catch(function(error) {
        console.log(error);
        res.status(404).send('Movie not found!');
      });
    }
  } else if (title) {
    const cachedData = cache.get(`${title}_${apiKey}`);
    if (cachedData) {
      res.send(cachedData);
    } else {
      const url = `http://www.omdbapi.com/?apikey=${apiKey}&t=${title}`;
      axios.get(url)
      .then(function(response) {
        const movieData = response.data;
        if (movieData.Response === 'True') {
          cache.put(`${title}_${apiKey}`, movieData, 5 * 60 * 1000);
          res.send(movieData);
        } else {
          res.status(404).send('Movie not found!');
        }
      })
      .catch(function(error) {
        console.log(error);
        res.status(404).send('Movie not found!');
      });
    }
  } else {
    res.status(400).send('Bad Request');
  }
});

// When making calls to the OMDB API make sure to append the '&apikey=8730e0e' parameter

module.exports = app;