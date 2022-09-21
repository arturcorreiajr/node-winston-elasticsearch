
const { createServer } = require('http')
const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch')
const { Client } = require('@elastic/elasticsearch')
const users = ['Tipscode', 'Dukeza', 'Tux']


// ESModules
let esTransportOpts = {
    level: 'info',
    clientOpts: { node: 'http://elasticsearch-es-http.elastic.svc.cluster.local:9200',
      auth: {
        username: "elastic",
        password: "F2xrJp7CYe9Jdf48pc8059T0" // token do elasticsearch
      }
    }

  }
const esTransport = new ElasticsearchTransport(esTransportOpts);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(), 
    winston.format.json()
),
  defaultMeta: { service: 'test-service-APM', enviroment: 'elastic'},
  transports: [
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'all.log' }),
    esTransport

  ],
})

//App Teste Node + Winston + Elastic + ApM
class App {
  constructor() {
    this.server = createServer((req, res) => {
      // http://localhost:8080/stop -> Parar o servidor.
      if (req.url === '/stop') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
        message: 'Servidor parou'
      }))
        return this.stop()
      }
      if (req.url === '/users') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
        message: users
      }))
      return null
      }
      if (req.url === '/users/:index') {
        const { index } = req.params
        const { name } = req.body
        users[index] = name

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({
        message: users
      }))
        return null
      }


// Resposta do servidor
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        message: 'Servidor node rodando'
      }))
    })
  }

//Iniciar o servidor
  
  start() {
    var myInt = setInterval(function () {
      myInt++;
      logger.info('[Count] : ' + myInt)
      console.log('[Count] : ' + myInt)
    }, 5000);

    this.server.listen(8080)
  }

//Parar o Servidor
  stop() {
    logger.error('Servidor Stopado')
    this.server.close()
    process.exit(0)
  }
}
let app = new App()
app.start()
