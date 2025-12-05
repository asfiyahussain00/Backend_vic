// // server.js - updated simple demo receiver + static dashboard server
// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '5mb' })); // body parser JSON

// // Path to events file
// const EVENTS_FILE = path.join(__dirname, 'events.json');

// // Ensure events.json exists
// if (!fs.existsSync(EVENTS_FILE)) {
//   fs.writeFileSync(EVENTS_FILE, '[]', 'utf8');
//   console.log('Created events.json');
// }

// // Helper to read events safely
// function readEvents() {
//   try {
//     const data = fs.readFileSync(EVENTS_FILE, 'utf8');
//     return JSON.parse(data);
//   } catch (err) {
//     console.error('Error reading events.json:', err);
//     return [];
//   }
// }

// // Helper to write events safely
// function writeEvents(events) {
//   try {
//     fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf8');
//     return true;
//   } catch (err) {
//     console.error('Error writing events.json:', err);
//     return false;
//   }
// }

// // Receive tracking events
// app.post('/track', (req, res) => {
//   const ev = req.body;
//   if (!ev || typeof ev !== 'object') {
//     return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
//   }

//   ev._receivedAt = new Date().toISOString();

//   const events = readEvents();
//   events.push(ev);

//   if (!writeEvents(events)) {
//     return res.status(500).json({ ok: false, error: 'Failed to save event' });
//   }

//   console.log('Event tracked:', ev);
//   res.json({ ok: true });
// });

// // Serve events (for dashboard)
// app.get('/events', (req, res) => {
//   const events = readEvents();
//   res.json(events);
// });

// // Serve static dashboard
// app.use('/', express.static(path.join(__dirname, 'public')));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Tracking server running on port ${PORT}`));




// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const EVENTS_FILE = path.join(__dirname, 'events.json');
if (!fs.existsSync(EVENTS_FILE)) fs.writeFileSync(EVENTS_FILE, '[]');

// Helpers to read & write events
const readEvents = () => JSON.parse(fs.readFileSync(EVENTS_FILE,'utf8'));
const writeEvents = (events) => fs.writeFileSync(EVENTS_FILE, JSON.stringify(events,null,2),'utf8');

// // POST /track endpoint
// app.post('/track', (req,res) => {
  
//   const ev = req.body;
//   if(!ev) return res.status(400).json({ok:false,error:'Invalid data'});
//   ev._receivedAt = new Date().toISOString();
//   const events = readEvents();
//   events.push(ev);
//   writeEvents(events);
//   console.log('Tracked:', ev);
//   res.json({ok:true});
// });

app.post('/track', (req, res) => {
  const events = JSON.parse(fs.readFileSync(EVENTS_FILE));
  events.push({ time: Date.now(), page: req.body.page });
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events));
  res.send({ status: 'ok' });
});



// GET /events endpoint
app.get('/events', (req,res)=>res.json(readEvents()));

// Serve frontend files from /public
app.use('/', express.static(path.join(__dirname,'public')));

app.listen(3000, ()=>console.log('Server running on http://localhost:3000'));
