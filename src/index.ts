import path                                         from 'path';
import cors                                         from 'cors';
import compression                                  from 'compression';
import express, { Request, Response, NextFunction } from 'express';
import docUI                                        from 'redoc-express';

import endpoints                                    from './endpoint';
var   mongoose = require("mongoose")

const setCacheHeader = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const period = 60 * 60;

  if (req.method == 'GET') {
    res.set(
      'Cache-control', 
      `public, max-age=${period}, s-maxage=${period}`
    );
  }

  next();
};

const app = express();
app.use(cors());

if (process.env.ENV === 'local') {
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
}

// apply cache header for all get requests
app.use(setCacheHeader);
endpoints(app);

app.use(compression({ filter: shouldCompress }));

function shouldCompress(req: Request, res: Response) {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}
connect()
const PORT = process.env.PORT || 8080;
function listen() {
  app.listen(PORT, () => {
    console.log(`APP_LOG::App listening on port ${PORT}`);
  });
}


app.get(
  '/docs',
  docUI({
    title: 'ENS Metadata Service',
    specUrl: '/assets/doc_output.json',
  })
);
function connect() {
  mongoose.connection
    .on('error', console.log)
    .on('disconnected', connect)
    .once('open', listen);
  return mongoose.connect("mongodb://ethf_writer:HXNnp8Zs@43.156.149.86:28707/ethf", {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

module.exports = app;
