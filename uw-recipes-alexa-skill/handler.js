"use strict";

var Alexa = require("alexa-sdk");
const request = require('request');

// Replace with your AWS API Gateway endpoints
var SEARCH_BY_INGREDIENTS = "https://XXXXXX.execute-api.us-west-2.amazonaws.com/dev/uwrecipes/searchByIngredients?ingredients=";
var SEARCH_BY_CALORIES = "https://XXXXXX.execute-api.us-west-2.amazonaws.com/dev/uwrecipes/searchByCalories?calories=";

var handlers = {

  "HelloIntent": function () {
    this.response.speak("Hello, Welcome to You Dub recipes");
    this.emit(':responseReady');
  },

  "LaunchRequest": function () {
    this.response.speak("Welcome to You Dub recipes");
    this.emit(':responseReady');
  },

  // handling responses for searching recipes by ingredients
  // if the intent is to find recipes by ingredients, this part of code is executed
  "SearchByIngredients": function () {
    // handle missing slot value
    var ingredient = isIngredientSlotValid(this.event.request.intent);

    if (ingredient) {
      // console.log("Ingredients from user's voice: " + JSON.stringify(ingredient));

      // Remove empty items
      var items = ingredient.split(" ").filter(function (e) { return e === 0 || e });

      const options = {
        url: SEARCH_BY_INGREDIENTS + items.join(","),
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      };

      var that = this;
      request(options, function (err, res, body) {
        if (err) {
          // Error while calling recipe API (REST API created using API Gateway)
          console.log('Error while calling recipe API hosted in AWS API Gateway, error: ' + JSON.stringify(err));
          that.response.speak("Sorry, I'm having trouble getting you a good set of recipes, let's try after some time.");
          that.emit(':responseReady');
        }

        // Success: We've got some response from recipe API(A REST API created using API Gateway)
        let apiResponse = JSON.parse(body);
        console.log('Response from recipe API: ' + JSON.stringify(apiResponse));

        if (apiResponse && apiResponse.recipes && apiResponse.recipes.length != 0) {
          that.response.speak("I found some great recipes for you! You can make " + apiResponse.recipes.join(" , "));
        } else {
          that.response.speak("Sorry, I couldn't find any recipes using  " + items.join(" , ") + ", but you can try with different ingredients!");
        }

        // call it done!
        that.emit(':responseReady');
      });

    }
    else {
      this.response.speak("Sorry, I'm having trouble understanding your ingredient list, why don't we try this again?");
      this.emit(':responseReady');
    }
  },

  //handling the response of searching the recipes by calories
  // if the intent is to search recipes by calories, this part of code is executed
  "SearchByCalories": function () {

    // handle missing slot value
    var calories = isCaloriesInputValid(this.event.request.intent);

    if (calories) {
      // console.log("Calories from user's voice: " + JSON.stringify(calories));

      // Remove empty items
      var items = calories.split(" ").filter(function (e) { return e === 0 || e });

      const options = {
        url: SEARCH_BY_CALORIES + items.join(","),
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      };

      var that = this;
      request(options, function (err, res, body) {
        if (err) {
          // Error while calling recipe API(A REST API created using API Gateway)
          console.log('Error while calling recipe API hosted in AWS API Gateway, error: ' + JSON.stringify(err));

          that.response.speak("Sorry, I'm having trouble getting you a good set of recipes, let's try after some time.");
          that.emit(':responseReady');
        }

        // Success: We've got some response from recipe API.
        let apiResponse = JSON.parse(body);
        console.log('Response from recipe API: ' + JSON.stringify(apiResponse));

        if (apiResponse && apiResponse.recipes && apiResponse.recipes.length != 0) {
          that.response.speak("I found some great recipes for you for " + calories + " calories! You can make " + apiResponse.recipes.join(" , "));
        } else {
          that.response.speak("Sorry, I couldn't find any recipes for  " + items.join(" , ") + ", but you can try with different calories!");
        }

        // call it done!
        that.emit(':responseReady');
      });

    }
    else {
      this.response.speak("Sorry, I'm having trouble understanding your calories input, why don't we try this again?");
      this.emit(':responseReady');
    }
  }
};


function isIngredientSlotValid(intent) {
  var ingredient = intent && intent.slots &&
    intent.slots.ingredient && intent.slots.ingredient.value;
  return ingredient
}

function isCaloriesInputValid(intent) {
  var calories = intent && intent.slots &&
    intent.slots.calories && intent.slots.calories.value;
  return calories

}
a
module.exports.hello = (event, context, callback) => {
  // console.log("Input to Alexa's handler" + JSON.stringify(event));
  var alexa = Alexa.handler(event, context);
  alexa.registerHandlers(handlers);
  alexa.execute();
};
