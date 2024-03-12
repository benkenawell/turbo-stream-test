# Turbo Stream + Express Demo

This repo is an absolute minimum example of what it takes to load a [Turbo Stream](https://turbo.hotwired.dev/handbook/streams).

![Turbo Example gif](./demo.gif)

## Download and install

1. have node installed
1. clone the repo
1. run `npm install`, this will download the only dependency: [express](https://expressjs.com/)

## Run the example

1. in this directory, run `npm start`
1. open a browser to the address printed to the console, it will likely be http://localhost:7155

### Run with a different port

If you get an error in your console, maybe with a EADDRINUSE message, you can change the port by running the command with a PORT variable:

```bash
PORT=3000 npm start
```

_note where the spaces are, it's important there are no spaces around the "="_

## Modifying the code

There is no hot reloading (at all) in this example repo.  After making any changes to the code in this repo, you will need to shut down the server (Ctrl + C in the terminal where it is running) and restart it (`npm start` again).

