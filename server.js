'use strict'
//import express from the express to set up the route
const express = require('express');

//import superagent to make xhttp request to send it to API 
const superagent = require('superagent');
//import cors to handle cross origin request 
const cors = require('cors');

//initiate an instance of express
const app = express();

app.use(cors());


// listen for a get request at route '/location' and invoking getLocation function and send back the response
app.get('/location',(request,response)=>{
    getLocation(request.query.data)
    .then(res => response.send(res))
   .catch(err => response.send('<img src="http://http.cat/404" />'))
})
  
// listen for a get request at route '/weather' and invoke getWeather function
app.get('/weather',getWeather)
                

//listen for a get request at any route, this is a catch all, and send back an error
app.get('*',(request,response)=>{
    response.send('<img src="http://http.cat/404" />')
})

//declare a variable PORT that will use either the environment variable of port or 4000
const PORT = process.env.PORT || 4000;

//require in the dotenv module and call the config method for adding environment variables
require('dotenv').config()

//creating a constructor that called Location with two property
function Location(lat,long) {
    this.latitude = lat
    this.longitude = long 
}
//creating a constructor that called Weather with 
function Weather(weatherObject){
    this.summary = weatherObject.hourly.summary
}

//tell express to listen on the PORT
app.listen(PORT, ()=>{
    console.log(`server is now running on port ${PORT}`)
})

//create function that called getLocation for refactoring request to url
function getLocation(query){
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${process.env.GEOCODE_API_key}`  
    return superagent.get(url).then(res =>{
        return new Location(res.body.results[0].geometry.location.lat,
                            res.body.results[0].geometry.location.lng)
    })
}

//create function that called getWeather for refactoring request to url
function getWeather(request,response){
    const url = `https://api.darksky.net/forecast/${process.env.WEATHER_API_KEY}/${request.query.data}`
    return superagent.get(url)
        .then(res => response.send(new Weather(res.body)))
        .catch(err => response.send('<img src="http://http.cat/404" />'))
     
    }
