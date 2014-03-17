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
},{"./views/Footer":8,"./views/Header":9,"./views/Layout":10,"./views/ModalRegion":12}],3:[function(require,module,exports){
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
/**
 * MODEL: Pin
 *
 */

module.exports = Backbone.Model.extend({

  idAttribute: "_id",

  urlRoot: function(){
    return desk.apiURL + '/pins'; 
  }

});


},{}],7:[function(require,module,exports){
/**
 * Collection: Pins
 *
 */

var 
  Pin = require('./Pin');

module.exports = Backbone.Collection.extend({

  model: Pin,

  idAttribute: "_id",
  
  url: function(){
    return desk.apiURL + '/pins'; 
  },

});

},{"./Pin":6}],8:[function(require,module,exports){

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
},{"./templates/footer.hbs.js":18}],9:[function(require,module,exports){

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
},{"./Login":11,"./templates/header.hbs.js":19}],10:[function(require,module,exports){

var 
    template = require("./templates/content.hbs.js")
  , Pin = require("../models/Pin")
  , Pins = require("../models/Pins")
  , SearchPinsView = require("./SearchPins")
  , PinView = require("./PinEdit")
  , PinsView = require("./Pins");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  regions:{
    "searchPins": ".search-pins",
    "createPin": ".new-pin",
    "pinsCtn": "#pins"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    this.pins = new Pins();
    this.pins.fetch();
  },

  onRender: function(){

    this.searchPins.show(new SearchPinsView({
      collection: this.pins
    }));

    var pinView = new PinView({
      model: new Pin()
    });

    var self = this;
    pinView.on("saved", function(){
      self.pins.add(pinView.model);
      pinView.model = new Pin();
      pinView.render();
    });

    this.createPin.show(pinView);

    this.pinsCtn.show(new PinsView({
      collection: this.pins
    }));
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
},{"../models/Pin":6,"../models/Pins":7,"./PinEdit":14,"./Pins":15,"./SearchPins":16,"./templates/content.hbs.js":17}],11:[function(require,module,exports){
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
},{"./templates/login.hbs.js":20}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
/**
 * VIEW: Pin
 * 
 */
 
var template = require('./templates/pin.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  tagName: "li",
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
},{"./templates/pin.hbs.js":21}],14:[function(require,module,exports){
/**
 * VIEW: Edit Pin
 * 
 */
 
var template = require('./templates/pinEdit.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "pin",
  template: template,

  ui: {
    "text": "#txt-text",
    "tags": "#txt-tags",
    "link": "#txt-link"
  },

  events:{
    "click .save-pin": "savePin"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  savePin: function(){
    var toSave = {
      text: this.ui.text.val(),
      tags: this.ui.tags.val().split(','),
      link: this.ui.link.val()
    };

    this.model
      .save(toSave, { patch: true, silent: true })
      .success(this.pinSaved.bind(this));
  },

  pinSaved: function(){
    this.trigger("saved");
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./templates/pinEdit.hbs.js":22}],15:[function(require,module,exports){
/**
 * VIEW: Pins
 * 
 */

var Pin = require('./Pin');

module.exports = Backbone.Marionette.CollectionView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "pins",
  tagName: "ul",
  itemView: Pin,

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
},{"./Pin":13}],16:[function(require,module,exports){
/**
 * VIEW: Search Pins
 * 
 */
 
var template = require('./templates/searchPins.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "search-pins-box",
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
},{"./templates/searchPins.hbs.js":23}],17:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div>\n  <div class=\"row search-pins-ctn\">\n    <div class=\"row\">\n      <div class=\"col-xs-12 search-pins\">\n      </div>\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-md-12 new-pin\"></div>\n  </div>\n  <div class=\"row\">\n    <div id=\"pins\" class=\"col-md-12\"></div>\n  </div>\n</div>";
  })
;

},{}],18:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  })
;

},{}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n<div class=\"controls\">\n  <a class=\"acn-btn\" href=\"";
  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\">\n    <i class=\"fa fa-external-link\"></i>\n  </a>\n</div>\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.link, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n<p class=\"text\">\n  ";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n</p>";
  return buffer;
  })
;

},{}],22:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "\n<div class=\"row\">\n  <div class=\"col-xs-12 separator-line\">  \n    <textarea id=\"txt-text\" class=\"form-control\">";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n  </div>\n</div>\n\n<div class=\"row\">\n\n  <div class=\"col-xs-5\">\n    <div class=\"input-group\">\n      <span class=\"input-group-addon\">\n        <i class=\"fa fa-tags\"></i>  \n      </span>\n      <input id=\"txt-tags\" type=\"text\" class=\"form-control\" placeholder=\"tags\" value=\"";
  if (stack1 = helpers.tags) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tags; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n  </div>\n\n  <div class=\"col-xs-5\">\n    <div class=\"input-group\">\n      <span class=\"input-group-addon\">\n        <i class=\"fa fa-link\"></i>  \n      </span>\n      <input id=\"txt-link\" type=\"text\" class=\"form-control\" placeholder=\"link\" value=\"";
  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n  </div>\n\n  <div class=\"col-xs-2\">\n    <a class=\"acn-btn save-pin\">\n      <i class=\"fa fa-save\"></i>\n    </a>\n  </div>\n</div>\n";
  return buffer;
  })
;

},{}],23:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<input type=\"text\" placeholder=\"search\">";
  })
;

},{}]},{},[5])