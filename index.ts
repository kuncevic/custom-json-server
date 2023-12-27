// server.js
// https://github.com/typicode/json-server
// https://github.com/typicode/json-server/issues/1028
import path from 'path';
import { fileURLToPath } from 'url';
import jsonServer from 'json-server';
import auth from 'json-server-auth';
import { Application } from 'express';
import { checkJwt, generateToken, options } from './jwt.js';
import fs from 'fs';

interface MyApplication extends Application {
  db: any;
}

const middlewares = jsonServer.defaults({ readOnly: false });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create() as MyApplication;
const router = jsonServer.router(path.resolve(__dirname, 'content/data.json'));

// https://github.com/jeremyben/json-server-auth
// /!\ Bind the router db to the app
server.db = router.db;

const rules = auth.rewriter({
  // Permission rules
  users: 600,
  other: 640,
});

// You must apply the middlewares in the following order
//server.use(rules);
//server.use(auth);

// Add checkJwt middleware to middlewares array
//server.use(checkJwt);

server.use(middlewares);

server.use(jsonServer.bodyParser);

server.get('/token', (req, res) => {
  let tokenExpiration = req.query.exp || options.tokenExpiration;

  if (typeof tokenExpiration !== 'string') {
    tokenExpiration = options.tokenExpiration;
  }

  const token = generateToken(
    options.payload,
    options.secretKey,
    tokenExpiration || options.tokenExpiration
  );
  res.json(token);
});

// Add custom routes before JSON Server router
server.get('/query*', (req, res) => {
  const data = fs.readFileSync(
    path.resolve(__dirname, 'content/data.json'),
    'utf8'
  );
  res.json(JSON.parse(data));
});

server.use(router);
server.listen(process.env.PORT || 3000, () => {
  console.log('JSON Server is running');
});
