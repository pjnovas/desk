
module.exports = function(){

  window.desk = window.desk || {};

   // Init Helpers
  require('./helpers/handlebars');
  require('./helpers/backboneOverrides');
  
  //Placeholders.init({ live: true, hideOnFocus: true });
  
  window.desk.apiURL = "/api";

  moment.lang("es-AR");

  require('./app')();
};
