/*jslint node: true */
/*jshint esversion: 6 */

'use strict';
var request = require('request');

module.exports.searchByIngredients = (event, context, callback) => {

  // Replace this with your spoonacular API Key
  var API_KEY = 'XXXXXXXXXXXXXXXXX';

  // accessing values from event sent by API gateway
  var ingreds = "";

  if (event.queryStringParameters && event.queryStringParameters.ingredients) {
    ingreds = event.queryStringParameters.ingredients;
  }
  else {
    const invalid_input_response = {
      statusCode: 400,
      body: JSON.stringify({ "message": "Sorry, please provide ingredients!" })
    };

    callback(null, invalid_input_response);
  }
  console.log('Ingredients:' + ingreds);

  var options = {
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=' + ingreds + '&limitLicense=false&number=5&ranking=1',
    headers: {
      'Accept': 'application/json',
      'X-Mashape-Key': API_KEY
    }
  };

  // invoke backend api
  request.get(options, function (error, response, body) {
    console.log('Backend API responded with status code:  ' + response.statusCode);

    if (!error && response.statusCode == 200) {
      
      // if the request is successfully processed 
      var responseMsg = JSON.parse(response.body);

      console.log('Length of recipe list: ' + responseMsg.length);
      var recipeList = [];

      for (var i = 0; i < responseMsg.length; i++) {
        console.log(responseMsg[i]);
        if (responseMsg[i].title) {
          recipeList.push(responseMsg[i].title);
        }
      }

      var ser_response = {};
      if (recipeList.length == 0) {
        ser_response = {
          statusCode: 404,
          body: JSON.stringify({ "message": "No recipes found for your ingredients!" })
        };
      } else {
        ser_response = {
          statusCode: 200,
          body: JSON.stringify({
            recipes: recipeList
          })
        };
      }
      callback(null, ser_response);
    }
    else {
      // error handling 
      const ser_response = {
        statusCode: 500,
        body: JSON.stringify({
          message: "Sorry, there is a problem in your request!",
        })
      };
      callback(null, ser_response);
    }
  });
};