const { NodeTracerProvider } = require('@opentelemetry/node')
const { ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/tracing')
const { ZipkinExporter } = require('@opentelemetry/exporter-zipkin')
const provider = new NodeTracerProvider()
const consoleExporter = new ConsoleSpanExporter()
const spanProcessor = new SimpleSpanProcessor(consoleExporter)
provider.addSpanProcessor(spanProcessor)
provider.register()

const zipkinExporter = new ZipkinExporter({
  url: 'http://localhost:9411/api/v2/spans',
  serviceName: 'movies-service'
})

const zipkinProcessor = new SimpleSpanProcessor(zipkinExporter)
provider.addSpanProcessor(zipkinProcessor)

const express = require('express')
const app = express()
const port = 3000

app.get('/movies', async function (req, res) {
  res.type('json')
  res.send(({movies: [
    { name: 'Jaws', genre: 'Thriller'}, 
    { name: 'Annie', genre: 'Family'},
    { name: 'Jurassic Park', genre: 'Action'},
  ]}))
})


app.listen( port, () => { console.log(`Listening at http://localhost:${port}`)}
)
