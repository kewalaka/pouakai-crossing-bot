var restify = require('restify');
var builder = require('botbuilder');
var envy = require('envy');

// Load environment variables
const env = envy();

// Setup Restify Server
var server = restify.createServer();
// must use process.env.PORT to make sure you're hooked up to iisnode
// https://github.com/tjanczuk/iisnode/issues/564
server.listen(process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: env.microsoftAppId,
    appPassword: env.microsoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Bot Storage: Here we register the state storage for your bot. 
// Default store: volatile in-memory store - Only for prototyping!
// We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
// For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
var inMemoryStorage = new builder.MemoryBotStorage();

// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:')
var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
}).set('storage', inMemoryStorage); // Register in memory storage

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(env.luisModelUrl);
bot.recognizer(recognizer);

bot.dialog('CheckHazards', (session,args) => {
    session.endDialog(`4th April '18 - The Holly Hut Track between Boomerang Slip and the Kokowai Track junction is closed due to a large landslide which is still active and unsafe to cross.`)
}).triggerAction({
    matches: 'GetWeather'
});

