/*! 
* desk - v0.0.1
* Copyright (c) 2014  
*  
*/ 

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

module.exports = function(){

  window.desk = window.desk || {};

   // Init Helpers
  require('./helpers/handlebars');
  require('./helpers/backboneOverrides');
  
  //Placeholders.init({ live: true, hideOnFocus: true });
  
  window.desk.apiURL = "/api";

  require('./app')();
};

},{"./app":2,"./helpers/backboneOverrides":3,"./helpers/handlebars":4}],2:[function(require,module,exports){
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
},{"./views/Footer":6,"./views/Header":7,"./views/Layout":8,"./views/ModalRegion":10}],3:[function(require,module,exports){
/*
 * Backbone Global Overrides
 *
 */

// Override Backbone.sync to use the PUT HTTP method for PATCH requests
//  when doing Model#save({...}, { patch: true });

var originalSync = Backbone.sync;

Backbone.sync = function(method, model, options) {
  if (method === 'patch') {
    options.type = 'PUT';
  }

  return originalSync(method, model, options);
};

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
jQuery(function() {
  require('./Initializer')();
});
},{"./Initializer":1}],6:[function(require,module,exports){

var 
    template = require("./templates/footer.hbs.js");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./templates/footer.hbs.js":12}],7:[function(require,module,exports){

var 
    template = require("./templates/header.hbs.js"),
    Login = require("./Login");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  events: {
    "click #show-login": "showLogin"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    if (window.desk.user){
      this.model = new Backbone.Model(window.desk.user);
    }
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  showLogin: function(){
    window.desk.app.modals.show(new Login());
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./Login":9,"./templates/header.hbs.js":13}],8:[function(require,module,exports){

var 
    template = require("./templates/content.hbs.js");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./templates/content.hbs.js":11}],9:[function(require,module,exports){
/**
 * VIEW: Login Modal
 * 
 */
 
var template = require('./templates/login.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    this.model = new Backbone.Model({ providers: window.desk.providers.split(',') });
  }

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./templates/login.hbs.js":14}],10:[function(require,module,exports){
/**
 * REGION: ModalRegion
 * Used to manage Twitter Bootstrap Modals with Backbone Marionette Views
 */

module.exports = Backbone.Marionette.Region.extend({
  el: "#modals-container",

  constructor: function(){
    Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
    this.on("show", this.showModal, this);
  },

  getEl: function(selector){
    var $el = $(selector);
    $el.on("hidden", this.close);
    return $el;
  },

  showModal: function(view){
    view.on("close", this.hideModal, this);
    this.$el.parents('.modal').modal('show');
  },

  hideModal: function(){
    this.$el.parents('.modal').modal('hide');
  }
  
});

},{}],11:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"starter-template\">\n  <h1>Bootstrap starter template</h1>\n  <p class=\"lead\">Use this document as a way to quickly start any new project.<br> All you get is this text and a mostly barebones HTML document.</p>\n</div>";
  })
;

},{}],12:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "footer";
  })
;

},{}],13:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <form class=\"navbar-form navbar-right\" style=\"color: white;\">\n        <img src=";
  if (stack1 = helpers.picture) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.picture; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " style=\"width: 30px; height: 30px;\">\n        <span>";
  if (stack1 = helpers.username) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.username; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " </span>\n        (<a href=\"/logout\">exit</a>)\n      </form>\n      ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return "\n      <form class=\"navbar-form navbar-right\">\n        <button id=\"show-login\" type=\"button\" class=\"btn btn-success\">Sign in</button>\n      </form>\n      ";
  }

  buffer += "<div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Desk</a>\n    </div>\n    <div class=\"navbar-collapse collapse\">\n      ";
  options = {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.isLoggedIn) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.isLoggedIn; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.isLoggedIn) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n  </div>\n</div>";
  return buffer;
  })
;

},{}],14:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, options;
  buffer += "\n    <a href=\"/auth/"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" class=\"btn btn-large signup-btn signup-"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\" data-bypass>\n      <i></i>Access with ";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.firstUpper || depth0.firstUpper),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "firstUpper", depth0, options)))
    + "\n    </a>\n    ";
  return buffer;
  }

  buffer += "\n<div class=\"modal-header\">\n  <button type=\"button\" data-dismiss=\"modal\" aria-hidden=\"true\" class=\"close\">×</button>\n  <h3>Log in</h3>\n</div>\n<div class=\"row\">\n  <div class=\"span4 offset1\">\n    ";
  stack1 = helpers.each.call(depth0, depth0.providers, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>";
  return buffer;
  })
;

},{}]},{},[5])