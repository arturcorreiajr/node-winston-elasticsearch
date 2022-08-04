
const { createServer } = require('http')
const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch')
const { Client } = require('@elastic/elasticsearch')
const users = ['Tipscode', 'Dukeza', 'Tux']

// Inicio - Lib apm-node
var apm = require('elastic-apm-node').start({
    serviceName: 'server-apm',
    serverUrl: 'http://apm-server.elastic.svc.cluster.local:8200',
    environment: 'production'
})

// ESModules
var esTransportOpts = {
    level: 'info',
    clientOpts: { node: 'http://elasticsearch-es-http.elastic.svc.cluster.local:9200',
      auth: {
        username: "elastic",
        password: "t23lAi86dK8u1ve19ygI27vd"
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
    logger.info('[Log teste] - Aplicação teste APM Metrics!')
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

// docker build -t misolucoestech/node-winston-apm-v9:latest .
// docker push misolucoestech/node-winston-apm-v9:latest 
// kubectl apply -f yaml/node.yaml -n elastic 
