const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const port = 3000
app.use(bodyParser.urlencoded({ extended: false }));
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const url = require('url');

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)

})

app.get('/', (request, response) => {
  response.send('Hello World!')
})


app.post('/recommend', (request, response) => {
  
  
  //collect the inconming user submisison
    let usersubmission = request.body.Body;
    console.log('the user submitted '+usersubmission) //outputs the user submission to the console log

  


  async function getrecommendedmusic () {

    let payload = { q:usersubmission };
    console.log(payload)
    const params = new url.URLSearchParams(payload);
    let res = await axios.get(`https://tastedive.com/api/similar?${params}`);
    
    let data = res.data;
    

let mycount = data.Similar.Results.length;
console.log ('my count is '+mycount)
  

// defining a variable that will be used to pick a result from all the recommended music . In this case, the 9 means that a number will be selected from 0 - 9 (inclusive of those)
randomnumber = getRandomInt(mycount);
//This is the function to generate a random number that is stored in the above variable
function getRandomInt(max)
{
  return Math.floor(Math.random() * max);
}
console.log('the random number generated is '+randomnumber)


    console.log(res.status);

    console.log(randomnumber)
    let submitted = data.Similar.Info[0].Name
    console.log('submitted '+submitted)


    if(mycount == '0')
    {
        
    // Send a message to the console log that based on the incomingBody and StartGame check, a new game is starting
    console.log('recommended count was 0');
    // here the random number that was selected is now printed out to the console for troubleshooting and monitoring 
    console.log('asking user to retry with a different artist');
    // Here we are now going to send a response back to the user who sent in the message. This is formatted using the TwiML XML Response / message tags 
    response.send( "<Response><Message>Sorry, but that search resulted in no results. Ensure spelling was correct or try another artist</Message></Response>");
    } 
    // if the users submitted text does not match the word start, we are now going to assume that it must be a guess. We are now going to compare the users submitted message (incomingBody) to the current random number (gamenumber). This case is testing for a guess thats too low.
    else if(mycount !=='0')
    {
        let result1 = data.Similar.Results[randomnumber].Name
        console.log('You may Like '+result1)
        const twiml = new MessagingResponse();

   twiml.message('If you like '+submitted +' we think you will also like '+result1);
   //twiml.message('There are other recommendations, would you like to see them?');
   
  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(twiml.toString()); 
    // Here we are logging a message to the console that the users guess was too low and they should aim higher
    console.log('Got some matches! There are '+mycount +' suggested artists')
    // here we are now sending a message back to the user with the result of their guess. Again this is formatted using the TwiML response / message tags
    
    }
    // if the users submitted text does not match the word or the too low check, we are now still going to assume that it must be a guess. We are now going to compare the users submitted message (incomingBody) to the current random number (gamenumber). This case is testing for a guess thats too high.
    
    // finally the users submitted text does not match the word start, and all the number evaluations fail, we are now going to assume that it must not be a valid guess. 
    else
    {
    // Here we are logging a message to the console that the users guess didnt match any of the expected values, a number or the word "start".
    console.log('unknown entry')
    // here we are now sending a message back to the user with the result of their guess. In this case, that we were unable to match it aginst an expected value and they should say Start to begin a game. Again this is formatted using the TwiML response / message tags
    response.send( "<Response><Message>im not sure what you mean, try another artist</Message></Response>");
    }



  }


  getrecommendedmusic();


})