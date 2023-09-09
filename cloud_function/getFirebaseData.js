const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // replace escaped newlines
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    })
  });

const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));


app.get('/questions', async (req, res) => {
    try {
        const snapshot = await db.collection('Questions').get();
        let data = [];

        snapshot.forEach(doc => {
            let docData = doc.data();
            docData.id = doc.id;
            data.push(docData);
        });

        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.get('/games', async (req, res) => {
    try {
        const snapshot = await db.collection('Games').get();
        let data = [];

        snapshot.forEach(doc => {
            let docData = doc.data();
            docData.id = doc.id;
            data.push(docData);
        });

        res.status(200).send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

module.exports = app;