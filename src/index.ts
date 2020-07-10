import express from 'express';
import bodyParser from 'body-parser';
import { listings } from './listings';

const app = express();
const post = 9000;

// TODO: bodyParser 原理？
// app.use 原理？
app.use(bodyParser.json());

app.get('/',(_req,res) => res.send('hello express'));

app.get('/listings',(_req,res) => {
  res.send(`listings is ${listings}`)
})

app.post('/delete-listing',(req,res) => {
  const id: string = req.body.id;
  for (let i = 0; i < listings.length; i++) {
    if (listings[i].id === id) {
      return res.send(listings.splice(i, 1)[0]);
    }
  }
  return res.send("failed to deleted listing");
})

app.listen(post);