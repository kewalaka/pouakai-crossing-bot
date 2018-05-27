require('dotenv-extended').load();

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
// must use process.env.PORT to make sure you're hooked up to iisnode
// https://github.com/tjanczuk/iisnode/issues/564
server.listen(process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
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
    session.send('Sorry, I did not understand \'%s\'. I\'m only new, and still not very bright.', session.message.text);
}).set('storage', inMemoryStorage); // Register in memory storage

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('Place.CheckHazards', (session,args) => {
    setTimeout(() => {
        session.endDialog(`4th April '18 - The Holly Hut Track between Boomerang Slip and the Kokowai Track junction is closed due to a large landslide which is still active and unsafe to cross.`)
    }, 1500);
}).triggerAction({
    matches: 'Place.CheckHazards'
});

bot.dialog('Weather', (session,args) => {
    session.endDialog(`It's Taranaki, the weather is always awesome!`)
}).triggerAction({
    matches: 'Weather'
});

bot.dialog('Greeting', (session,args) => {
    session.endDialog(`Hello, one day, I'll be able to tell you lots about the Pouakai crossing, why not ask me about hazards or the weather?`)
}).triggerAction({
    matches: 'Greeting'
});

bot.dialog('Greeting.HowAreYou', (session,args) => {

    var Reponses = [
        'Doing great, but I wish I was out hiking!',
        'I\'m really good, thanks for asking!'
    ];

    session.endDialog(`${Reponses[Math.floor(Math.random() * Reponses.length)]}`)
}).triggerAction({
    matches: 'Greeting.HowAreYou'
});