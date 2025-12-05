import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors()); // allow all origins
app.use(express.json());

const EVENTS_FILE = path.join(process.cwd(), 'events.json');

// Ensure events file exists
if (!fs.existsSync(EVENTS_FILE)) fs.writeFileSync(EVENTS_FILE, '[]');

// POST /track → Save a new event
app.post('/track', (req, res) => {
  try {
    const { sessionId, type, pagePath, country, timeOnPageSec } = req.body;

    if (!sessionId || !type) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const events = JSON.parse(fs.readFileSync(EVENTS_FILE));
    events.push({
      sessionId,
      type,
      pagePath: pagePath || 'Home',
      country: country || 'Unknown',
      timeOnPageSec: timeOnPageSec || 0,
      timestamp: new Date().toISOString()
    });

    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving event:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /events → Return all events
app.get('/events', (req, res) => {
  try {
    const events = JSON.parse(fs.readFileSync(EVENTS_FILE));
    res.status(200).json(events);
  } catch (error) {
    console.error('Error reading events:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default app;


// // server.js
// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const cors = require('cors');

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: '5mb' }));

// const EVENTS_FILE = path.join(__dirname, 'events.json');
// if (!fs.existsSync(EVENTS_FILE)) fs.writeFileSync(EVENTS_FILE, '[]');

// // Helpers to read & write events
// const readEvents = () => JSON.parse(fs.readFileSync(EVENTS_FILE,'utf8'));
// const writeEvents = (events) => fs.writeFileSync(EVENTS_FILE, JSON.stringify(events,null,2),'utf8');

// // // POST /track endpoint
// // app.post('/track', (req,res) => {
  
// //   const ev = req.body;
// //   if(!ev) return res.status(400).json({ok:false,error:'Invalid data'});
// //   ev._receivedAt = new Date().toISOString();
// //   const events = readEvents();
// //   events.push(ev);
// //   writeEvents(events);
// //   console.log('Tracked:', ev);
// //   res.json({ok:true});
// // });

// app.post('/track', (req, res) => {
//   const events = JSON.parse(fs.readFileSync(EVENTS_FILE));
//   events.push({ time: Date.now(), page: req.body.page });
//   fs.writeFileSync(EVENTS_FILE, JSON.stringify(events));
//   res.send({ status: 'ok' });
// });



// // GET /events endpoint
// app.get('/events', (req,res)=>res.json(readEvents()));

// // Serve frontend files from /public
// app.use('/', express.static(path.join(__dirname,'public')));

// app.listen(3000, ()=>console.log('Server running on http://localhost:3000'));
