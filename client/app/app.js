/**
 * Application
 *
 */

var ModalRegion = require('./views/ModalRegion')
  , Layout = require('./views/Layout')
  , Header = require('./views/Header')
  , Footer = require('./views/Footer');

module.exports = function(){

  var app = module.exports = new Backbone.Marionette.Application();

  function initRegions(){
    app.addRegions({
      header: "header",
      main: "#main",
      footer: "footer",
      modals: ModalRegion
    });
  }

  app.addInitializer(initRegions);

  app.addInitializer(function(){
    app.header.show(new Header());
    app.main.show(new Layout());
    app.footer.show(new Footer());
  });

  window.desk.app = app;
  window.desk.app.start();

};