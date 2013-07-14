var pg = require('pg');
var config = require('../config').postgres;
var conString = 'tcp://' +
  config.username + ':' +
  config.password + '@' +
  config.host + ':' +
  config.port + '/' +
  config.database;

function connect (callback) {
  pg.connect(conString, function (err, client, done) {
    if (err) {
      console.log('Could not connect to database:');
      console.log(err);
      process.exit(1);
    }

    callback(client, done);
  });
};

function render (query, res) {
  connect(function (client, done) {
    client.query(query, function (err, result) {
      done();
      if (err) {
        res.render('error', {
          error: err
        });
        return;
      }

      res.render('generic', {
        rows: result && result.rows
      });
    });
  });
}

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index', {
      title: 'emerald'
    });
  });

  app.get('/accounts', function (req, res) {
    render('select * from account', res);
  });

  app.get('/keyrings', function (req, res) {
    render('select * from base_keyring', res);
  });

  app.get('/containers', function (req, res) {
    render('select * from container', res);
  });

  app.get('/records', function (req, res) {
    render('select * from container_record', res);
  });

  app.get('/messages', function (req, res) {
    render('select * from message', res);
  });

}
