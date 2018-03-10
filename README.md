# alexa-skill-uw-recipes
Serverless based RESTful Webservice for UW Recipes &amp; Alexa Skill as voice interface

## Setup and Initial Requirements:
1.	AWS account & active AWS credentials with permissions to deploy to API Gateway, AWS Lambda & Cloudwatch
2.	[AWS Developer Account](https://developer.amazon.com) to develop, configure & deploy Alexa Skills
3.	API key for [Mashape](https://market.mashape.com) developer account to access spoonacular APIs hosted in mashape.com
4.	Following should be installed/configured on your workstation
    - NodeJS (version 6.X or later)
    - [Serverless framework](https://github.com/serverless/)
    - [Setup](https://serverless.com/framework/docs/providers/aws/guide/credentials/) AWS credentials 

## Create Web Services:
- Two RESTful Webservices are developed that interact with spoonacular APIs to fetch recipes based on ingredients and calories.
- APIs will be developed in AWS API Gateway & Lambda services in AWS us-west-2 regions.
- APIs are developed & deployed using opensource framework – '[serverless](https://github.com/serverless/)'.
### Deploying APIs to AWS environment:
- Clone code from Github (https://github.com/tejaswiuw/alexa-skill-uw-recipes.git).
- Go to *recipe-service* folder.
- This contains the code that when deployed would create two APIs in API Gateway.
- Open files *searchByIngredientsHandler.js* & *searchRecipesByCaloriesHandler.js* and replace the API_KEY with the API key that you would have created in Mashape.com.
- Make sure that the aws cli is configured with credentials as described [here](https://serverless.com/framework/docs/providers/aws/guide/credentials/)
- Deploy APIs using serverless cli command – ```serverless deploy –v```. This command, if gets executed successfully, would display the two API endpoints for the web services. APIs will be created with the following path - 
  - */uwrecipes/searchByIngredients*
  - */uwrecipes/searchByCalories*

## Alexa skill for UW Recipes web service:
Configuring Alexa Skill is a two-step process. First, we’ll need to create a lambda function in AWS to interact with UW Recipes web services. This function is responsible to call the two APIs that are created in the previous step based on user input from Alexa and respond back with appropriate response. Secondly, create an Alexa Skill with configure it with the lambda function as the endpoint to trigger whenever user interacts with Alexa. 

### Step 1: Create a lambda function
1.	From previous steps, code is already cloned locally from Github.
2.	Go to *uw-recipes-alexa-skill* folder.
3.	This contains the code that when deployed would create a lambda function.
4.	Open files handler.js & replace *SEARCH_BY_INGREDIENTS* & *SEARCH_BY_CALORIES* with respective API endpoints that got created during API deployment steps discussed previously.
5.	Deploy the function using serverless cli command – ```serverless deploy –v```. This command, if gets executed successfully, would display the function ARN (Amazon Resource Name).
6.	Take a note of the ARN which is required while configuring the Alexa skill. 

### Step 2: Create & Configure Alexa Skill
1.	Go to the Alexa Console and click 'Add a New Skill'.
2.	Set 'UW Recipes' as the skill name and 'you dub recipes' as the invocation name (this is what is used to activate your skill). For example, you would say: 'Alexa, open you dub recipes and ask what can I make with milk and eggs.'
3.	Click Interaction Model & copy/paste the contents of *model/alexa-model.json* into Code Editor.
4.	Click 'Save Model' & 'Build Model'. Remember to build the model whenever a change is made to your Alexa model.
5.	Click Configuration, select AWS Lambda ARN as service endpoint type & provide the ARN of the lambda function that was created in Step #1.
6.	Click Save & Build Model. 
7.	You are now able to start testing your sample skill! You should be able to go to the Echo webpage and see your skill enabled.
8.	To test it, try to say some of the sample utterances from the examples section below.
9.	Your skill is now saved and once you are finished testing using the simulator, you can continue to publish your skill.

## Example Alexa Interactions:
### Example 1:
*User:* Alexa, open UW recipes and ask what can i make with tomatoes and chicken

*Alexa:* I found some great recipes for you! You can make Chicken Salad-Stuffed Tomatoes , 2-Ingredient Slow Cooker Salsa Chicken , Sweet and Spicy Slow Cooker Chicken , Easy Roasted Chicken and Tomatoes – Low Carb and Gluten Free , Velvetta Southwestern Chicken Dip

### Example 2:
*User:* Alexa, open UW recipes and give recipes below two thousand calories

*Alexa:* I found some great recipes for you for 2000 calories! You can make Pumpkin Banana Bread, blackened salmon tacos with cilantro yogurt sauce, blackened salmon tacos with cilantro yogurt sauce

### Example 3:
*User:* Alexa, open UW recipes and suggest me some recipes using sand

*Alexa:* Sorry, I couldn't find any recipes using sand, but you can try with different ingredients!
