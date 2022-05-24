const routes = require('./routes.json')
const express = require('express')
const morgan = require('morgan')
const proxy = require('express-http-proxy')
const app = express()
const port = 3000

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    });
}

app.use(morgan('combined'))

Object.keys(routes).forEach(k => {
    ({ forwardTo } = routes[k])

    if (forwardTo) {
        ({ path } = forwardTo)
        app.use(k, proxy(forwardTo.host, {
            proxyReqPathResolver: function (_) {                
                return path
              }
        }))
        return
    }

    app.all(k, async (_, res) => {
        ({ delay, statusCode, body } = routes[k])
        statusCode = statusCode ?? 200
        body = body ?? 'empty body'
        if (delay) {
            await sleep(delay)
        }
        res.status(statusCode).send(body)
    })

})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})