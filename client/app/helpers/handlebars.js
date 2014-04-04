/**
 * HELPER: Handlebars Template Helpers
 * 
 */

Handlebars.registerHelper('isLoggedIn', function(options) {
  if (window.desk.user){
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

Handlebars.registerHelper('firstUpper', function(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
});

Handlebars.registerHelper('formatDateTime', function(date) {
  if (date && moment.unix(date).isValid()) {
    return moment.unix(date).format("HH:mm");
  } 
  
  return "";
});