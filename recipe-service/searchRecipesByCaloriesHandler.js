/*jslint node: true */
/*jshint esversion: 6 */

'use strict';

var request = require('request');

module.exports.searchRecipesByCalories = (event, context, callback) => {

  // Replace this with your spoonacular API Key
  var API_KEY = 'XXXXXXXXXXXXXXXXX';
  var cal = "";
  
  if (event.queryStringParameters && event.queryStringParameters.calories) {
    cal = event.queryStringParameters.calories;
  }
  else {
    const invalid_input_response = {
      statusCode: 400,
      body: JSON.stringify({ "message": "Sorry, please provide calories!" })
    };
    callback(null, invalid_input_response);
  }

  console.log('calories:' + cal);
  var options = {
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/mealplans/generate?targetCalories=' + cal + '&timeFrame=day',
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
      var recipeList = [];

      responseMsg = responseMsg.meals;

      console.log('Length of recipe list: ' + responseMsg.length);

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
          body: JSON.stringify({ "message": "No recipes found for your calories!" })
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
      const ser_response = {
        statusCode: 500,
        body: JSON.stringify({
          message: "Sorry, there is a problem in your request!"
        })
      };
      callback(null, ser_response);
    }
  });
};