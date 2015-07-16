'use strict';

/**
 * Controllers
 */

var page = require('../../controllers/page/page');

module.exports = function (app) {
  app.get('/', page.index);
}
