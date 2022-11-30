const express = require("express");
const morgan = require("morgan");
const proxy = require("express-http-proxy");
const app = express();
const port = 3000;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

let routes = require('./routes.json');
if (process.argv.slice(2)?.length > 0) {
    const path = process.argv[2];
    try {
        routes = require(path);
    } catch(e) {
        console.log(`Could not load routes from file [${path}]`, e);
        return;
    }
}

app.use(morgan("combined"));

Object.keys(routes).forEach((k) => {
  ({ forwardTo, method = "get" } = routes[k]);

  if (forwardTo) {
    ({ path } = forwardTo);
    app.use(
      k,
      proxy(forwardTo.host, {
        proxyReqPathResolver: function (_) {
          return path;
        },
      })
    );
    return;
  }

  app[method.toLowerCase()](k, async (_, res) => {
    ({ delay, statusCode, body } = routes[k]);
    statusCode = statusCode ?? 200;
    body = body ?? "empty body";
    if (delay) {
      await sleep(delay);
    }
    res.status(statusCode).set("Access-Control-Allow-Origin", "*").send(body);
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
