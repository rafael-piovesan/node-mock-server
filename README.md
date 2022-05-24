# node-mock-server

Simple and easy-to-use Mock-Server for simulating REST responses.

## Setup

```sh
# install the dependencies
npm i

# start the server
node app.js
```

The server starts on `http://localhost:3000` by default.

## Managing routes
Check out the [routes file](routes.json) and edit it as needed. Its basic structure is as follows:

```js
{
  // the URL path to mock, it accepts parameters, e.g., "/shelves/:sid/books/:bid"
  "/path-to-mock": {
    // [optional] HTTP status code to be returned (default: 200)
    "statusCode": 200,
    // [optional] delay in millisec to be applied before sending the response (default: 0)
    "delay": 0,
    // [optional] response body to be returned, also accepts an array (default: 'empty body')
    "body": {},
    // [optional] enables request forwarding to a real HTTP server (default: not set)
    "forwardTo": {
      // real HTTP server's host
      "host": "http://example.com",
      // real request path
      "path": "/real-path"
    }
  }
}
```
