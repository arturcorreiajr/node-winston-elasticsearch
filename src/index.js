

const { createServer } = require('http')
const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch')
const { Client } = require('@elastic/elasticsearch')



// Inicio - Lib apm-node
//var apm = require('elastic-apm-node').start({
//    serviceName: 'node-apm',
    
//    Set custom APM Server URL (default: http://localhost:8200)
//    serverUrl: 'http://apm-server:8200'
    
//    })


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
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
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
// Resposta do servidor
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        message: 'Servidor node rodando'
      }))
    })
  }

//Iniciar o servidor
  
  start() {
    logger.info('------LOG VINDO DO WINSTON-SANDBOX----!')
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

// docker build -t arturcorreiajr/node-winston:latest .
// docker push arturcorreiajr/node-winston:latest 
// kubectl apply -f yaml/node.yaml -n elastic 
