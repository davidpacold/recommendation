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
  const incomingBody = request.body.Body;
  console.log(incomingBody)
  
    // defining a variable that will be used to pick a result from all the recommended music . In this case, the 9 means that a number will be selected from 0 - 9 (inclusive of those)
    randomnumber = getRandomInt(9);
    //This is the function to generate a random number that is stored in the above variable
    function getRandomInt(max){
      return Math.floor(Math.random() * max);
    }

  async function getrecommendedmusic () {

    let payload = { q:incomingBody };
    console.log(payload)
    const params = new url.URLSearchParams(payload);

    let res = await axios.get(`https://tastedive.com/api/similar?${params}`);
    //console.log(res)
    let data = res.data;
    console.log(res.status);
    console.log(randomnumber)
    let submitted = data.Similar.Info[0].Name
    let result1 = data.Similar.Results[randomnumber].Name
    console.log('submitted '+submitted)
    console.log('You may Like '+result1)

    randomnumber2 = getRandomInt(9);
    let result2 = data.Similar.Results[randomnumber2].Name
    console.log(randomnumber2)
    console.log(result2)

 const twiml = new MessagingResponse();

   twiml.message('If you like '+submitted +' we think you will also like '+result1);
   twiml.message('This recommendation was provided by tastedive.com');
   
  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(twiml.toString()); 


  }
  getrecommendedmusic();



})