const https = require('https')
const options = {
  hostname: 'tastedive.com',
  port: 443,
  path: '/api/similar?q=red+hot+chili+peppers',
  method: 'GET'
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  res.on('data', d => {
    process.stdout.write(d)
  })
})

req.on('error', error => {
  console.error(error)
})

req.end()