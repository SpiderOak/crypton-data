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

function render (query, title, res) {
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
        title: title,
        rows: result && result.rows
      });
    });
  });
}

module.exports = function (app) {
  app.get('/', function (req, res) {
    // TODO implement res.redirect into emerald
    render('select * from account', 'Accounts', res);
  });

  app.get('/accounts', function (req, res) {
    render('select * from account', 'Accounts', res);
  });

  app.get('/keyrings', function (req, res) {
    render('select * from base_keyring', 'Keyrings', res);
  });

  app.get('/containers', function (req, res) {
    render('select * from container', 'Containers', res);
  });

  app.get('/records', function (req, res) {
    render('select * from container_record', 'Records', res);
  });

  app.get('/messages', function (req, res) {
    render('select * from message', 'Messages', res);
  });

}
