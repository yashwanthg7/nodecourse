const http = require('http');
const fs = require('fs');
const path = require('path');

const NOTES_FILE = path.join(__dirname, 'notes.json');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Parse request URL
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Handle GET request for all notes
  if (req.method === 'GET' && url.pathname === '/notes') {
    fs.readFile(NOTES_FILE, (err, data) => {
      if (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Internal server error');
      } else {
        const notes = JSON.parse(data);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(notes));
      }
    });
  }

  // Handle POST request to create a new note
  else if (req.method === 'POST' && url.pathname === '/notes') {
    let requestBody = '';
    req.on('data', (chunk) => {
      requestBody += chunk.toString();
    });
    req.on('end', () => {
      try {
        const note = JSON.parse(requestBody);
        fs.readFile(NOTES_FILE, (err, data) => {
          if (err) {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal server error');
          } else {
            const notes = JSON.parse(data);
            note.id = Date.now();
            notes.push(note);
            fs.writeFile(NOTES_FILE, JSON.stringify(notes), (err) => {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Internal server error');
              } else {
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(note));
              }
            });
          }
        });
      } catch (err) {
        console.error(err);
        res.statusCode = 400;
        res.end('Bad request');
      }
    });
  }

  // Handle DELETE request for a specific note
  else if (req.method === 'DELETE' && url.pathname.startsWith('/notes/')) {
    const id = parseInt(url.pathname.substring(7));
    if (isNaN(id)) {
      res.statusCode = 400;
      res.end('Bad request');
    } else {
      fs.readFile(NOTES_FILE, (err, data) => {
        if (err) {
          console.error(err);
          res.statusCode = 500;
          res.end('Internal server error');
        } else {
          const notes = JSON.parse(data);
          const noteIndex = notes.findIndex((note) => note.id === id);
          if (noteIndex === -1) {
            res.statusCode = 404;
            res.end('Not found');
          } else {
            notes.splice(noteIndex, 1);
            fs.writeFile(NOTES_FILE, JSON.stringify(notes), (err) => {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end('Internal server error');
              } else {
                res.statusCode = 204;
                res.end();
              }
            });
          }
        }
      });
    }
  }

  // Handle all other requests
  else {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});