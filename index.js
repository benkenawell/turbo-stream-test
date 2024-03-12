import express from 'express';
const port = process.env.PORT ?? 7155;

const app = express();

/** we load turbo from our own public directory, set it for express */
app.use(express.static('public'));

/** returns the initial html page, that will demo our example stream */
app.get('/', function (req, res) {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Turbo Stream Test</title>
      <style>
        body {
          padding: 10px 40px;
        }
        #messages > * {
          margin: 10px 0;
        }
      </style>
      <script type="module">
        import * as hotwiredTurbo from "/turbo.es2017-esm.js";
      </script>
    </head>
    <body>
      <turbo-stream-source src="http://localhost:${port}/sse"></turbo-stream-source>
      <turbo-frame id="submission">
        <form method="post" action="http://localhost:${port}/item">
          <button type="submit">Append another message</button>
        </form>
      </turbo-frame>
        <div id="messages"><div>original message</div></div>
    </body>
    </html>
    `);
});

/** this is a single item, appended to the dom, as the return from a form element submission */
app.post('/item', function(req, res) {
  res.set('Content-Type', 'text/vnd.turbo-stream.html');
  res.send(`
    <turbo-stream action="append" target="messages">
    <template>
      <div id="more_msg">
        a push message
      </div>
    </template>
    </turbo-stream>
    `);
});

const iterations = 10;
const submissionDelay = 700;
/** this is a server sent event endpoint that will send {iterations} messages to append, at {submissionDelay} intervals (in ms)
 * I could just send all the messages in a loop, but they appeared so fast you would have thought they were part of the original html
 **/
app.get('/sse', function eventsHandler(req, res) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    // if you want to point another dev environment here, you can use this header
    // but _it is UNSAFE to use most of the time_
    // 'Access-Control-Allow-Origin': '*'
  };
  res.writeHead(200, headers);

  let counter = 1;
  let interval = setInterval(() => {
    const data = `
      <turbo-stream action="append" target="messages">
        <template>
          <div id="message_${counter}">
            The content of the message, ${counter}.
          </div>
        </template>
      </turbo-stream> 
    `.replace(/\n/g, '');
    res.write(`data: ${data}\n\n`);
    if(++counter > iterations) clearInterval(interval);
  }, submissionDelay);

  req.on('close', () => {
    console.log(`Connection closed`);
    interval && clearInterval(interval);
  });
});

app.listen(port, () => {console.log(`listening on ${port}, open a browser to http://localhost:${port}`)});

