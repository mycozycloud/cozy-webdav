// Generated by CoffeeScript 1.6.3
var CozyInstance, WebDAVAccount, cozyInstance, davAccount, shortId;

WebDAVAccount = require('../models/webdavaccount');

CozyInstance = require('../models/cozyinstance');

shortId = require('shortid');

davAccount = null;

WebDAVAccount.first(function(err, account) {
  if (account != null) {
    return davAccount = account;
  } else {
    return davAccount = null;
  }
});

cozyInstance = null;

CozyInstance.first(function(err, instance) {
  if (instance != null) {
    return cozyInstance = instance;
  } else {
    return cozyInstance = null;
  }
});

module.exports = {
  index: function(req, res) {
    var data, domain;
    domain = cozyInstance != null ? cozyInstance.domain : 'your.cozy.url';
    data = {
      login: davAccount != null ? davAccount.login : void 0,
      password: davAccount != null ? davAccount.password : void 0,
      domain: domain
    };
    return res.render('index', data);
  },
  getCredentials: function(req, res) {
    if (davAccount != null) {
      return res.send(davAccount.toJSON());
    } else {
      return res.send({
        error: true,
        msg: 'No webdav account generated'
      }, 404);
    }
  },
  createCredentials: function(req, res) {
    var data, login, password;
    login = 'me';
    password = shortId.generate();
    data = {
      login: login,
      password: password
    };
    if (davAccount == null) {
      return WebDAVAccount.create(data, function(err, account) {
        if (err) {
          return res.send({
            error: true,
            msg: err.toString()
          }, 500);
        } else {
          davAccount = account;
          return res.send({
            success: true,
            account: account.toJSON()
          });
        }
      });
    } else {
      davAccount.login = login;
      davAccount.password = password;
      return davAccount.save(function(err) {
        if (err) {
          return res.send({
            error: true,
            msg: err.toString()
          }, 500);
        }
      });
    }
  }
};
