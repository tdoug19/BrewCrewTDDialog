const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

var admin = require('firebase-admin');
var serviceAccount = require("./brew-crew-td-firebase-adminsdk-x15sd-28bd4fe7ea.json");
const { ResultStorage } = require('firebase-functions/v1/testLab');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://brew-crew-td-default-rtdb.firebaseio.com/"
  });


exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  //console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  //console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
  console.log('Going to fulfill');
  function welcome(agent) {
    agent.add(`Welcome to my console agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }

  function readDatabase(agent) {
      //agent.add('Going to Read the database');
      console.log('Read the database logging');
      const db = admin.database();
      const ref = db.ref();

      let ages = db.ref('users').orderByChild('age');
      let results = [];
      ages.once('value').then(function (snapshot){
        snapshot.forEach(function (childSnapshot) {
            let childData = childSnapshot.val();
            results.push(childData);

        });
      }).then(function () {
          console.log('Age Results');
          console.log(results);
      });
      agent.add("Read the db :");  
  }



  function writeDatabase(agent) {
    console.log('Write the database logging');
    const db = admin.database();
    const ref = db.ref();
    
    let currentUser = db.ref().child('/users/Jim');

    /*currentUser.once('value', function (snapshot){
        if (snapshot.exists() && snapshot.hasChild('age')) {
            let obj = snapshot.val();
            currentUser.update({
                age: obj.age + 1
            })
        } else {
            currentUser.set({
                age: 12
            })
        }
    });
    */
    dataRef.update(({'age': 49 }), (error) => {
        if (error) {
          console.log('Data could not be saved.' + error);
        } else {
          console.log('Data saved successfully.');
        }
      
    });


    agent.add("Updated the db :");
    
  }

  function addNewUser(agent){
    console.log('Write the database logging');

    agent.add("Updated the db with a new User.");
  }
  // // Uncomment and edit to make your own intent handler
  // // uncomment `intentMap.set('your intent name here', yourFunctionHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function yourFunctionHandler(agent) {
  //   agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
  //   agent.add(new Card({
  //       title: `Title: this is a card title`,
  //       imageUrl: 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png',
  //       text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
  //       buttonText: 'This is a button',
  //       buttonUrl: 'https://assistant.google.com/'
  //     })
  //   );
  //   agent.add(new Suggestion(`Quick Reply`));
  //   agent.add(new Suggestion(`Suggestion`));
  //   agent.setContext({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' }});
  // }

  // // Uncomment and edit to make your own Google Assistant intent handler
  // // uncomment `intentMap.set('your intent name here', googleAssistantHandler);`
  // // below to get this function to be run when a Dialogflow intent is matched
  // function googleAssistantHandler(agent) {
  //   let conv = agent.conv(); // Get Actions on Google library conv instance
  //   conv.ask('Hello from the Actions on Google client library!') // Use Actions on Google library
  //   agent.add(conv); // Add Actions on Google library responses to your agent's response
  // }
  // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
  // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Read Database', readDatabase);
  intentMap.set('Write Database', writeDatabase);
  intentMap.set('Adding User', addNewUser);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
});
