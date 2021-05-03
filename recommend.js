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


app.post('/weather', (request, response) => {
  const incomingBody = request.body.Body;
  console.log(incomingBody)
  const twiml = new MessagingResponse();

  /* twiml.message('The Robots are coming! Head for the hills!' +incomingBody);

  response.writeHead(200, {'Content-Type': 'text/xml'});
  response.end(twiml.toString()); */

  async function gettempincity () {

    let payload = { q:incomingBody, units:'imperial', appid:'625e442a1bc2aae1cd29e570d83e9658' };
    console.log(payload)
    const params = new url.URLSearchParams(payload);

    let res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?${params}`);
    console.log(res)
    let data = res.data;
    console.log(res.status);
    
    let temperature = data.main.temp
    console.log(data);
    console.log(data.main.temp)
    console.log(temperature)
    twiml.message('The current temp in ' +incomingBody +' is ' +temperature);

    response.writeHead(200, {'Content-Type': 'text/xml'});
    response.end(twiml.toString());
    
  }
  gettempincity();



})