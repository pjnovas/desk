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

  moment.lang("es-AR");

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

    if (window.desk.user){
      app.main.show(new Layout());
      app.footer.show(new Footer());
    }
  });

  window.desk.app = app;
  window.desk.app.start();

};
},{"./views/Footer":23,"./views/Header":24,"./views/Layout":25,"./views/ModalRegion":27}],3:[function(require,module,exports){
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

Handlebars.registerHelper('formatDateTime', function(date) {
  if (date && moment.unix(date).isValid()) {
    return moment.unix(date).format("HH:mm");
  } 
  
  return "";
});
},{}],5:[function(require,module,exports){
jQuery(function() {
  require('./Initializer')();
});
},{"./Initializer":1}],6:[function(require,module,exports){
/**
 * MODEL: Chrono
 *
 */

module.exports = Backbone.Model.extend({

  idAttribute: "_id",

  urlRoot: function(){
    return desk.apiURL + '/chronos'; 
  }

});


},{}],7:[function(require,module,exports){
/**
 * MODEL: ChronoLog
 *
 */

module.exports = Backbone.Model.extend({

  idAttribute: "_id",

  urlRoot: function(){
    return desk.apiURL + '/chronologs'; 
  }

});


},{}],8:[function(require,module,exports){
/**
 * Collection: ChronoLogs
 *
 */

var 
  ChronoLog = require('./ChronoLog');

module.exports = Backbone.Collection.extend({

  model: ChronoLog,

  idAttribute: "_id",
  
  url: function(){
    return desk.apiURL + '/chronologs'; 
  },

});

},{"./ChronoLog":7}],9:[function(require,module,exports){
/**
 * Collection: Chronos
 *
 */

var 
  Chrono = require('./Chrono');

module.exports = Backbone.Collection.extend({

  model: Chrono,

  idAttribute: "_id",
  
  url: function(){
    return desk.apiURL + '/chronos'; 
  },

});

},{"./Chrono":6}],10:[function(require,module,exports){
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


},{}],11:[function(require,module,exports){
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

},{"./Pin":10}],12:[function(require,module,exports){
/**
 * VIEW: Calendar: Shows Today's ChronoLogs
 * 
 */
 
var template = require('./templates/calendar.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  ui: {
    calendar: ".calendar"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(options){
    this.collection = options && options.collection;
    this.collection.on("reset add remove", this.render.bind(this));
  },

  onRender: function(){
    var self = this;
    _.defer(function(){
      self.initCalendar();
    });
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

  calendarCreated: false,

  initCalendar: function(){
    var calEvents = [];

    calEvents = this.collection.map(function(ele){
      var cevent = ele.toJSON();
      cevent.id = cevent._id;
      cevent.allDay = false;

      var chrono = desk.app.chronos.get(cevent.chrono);
      cevent.title = chrono.get("title");
      //cevent.backgroundColor = 'orange';
      cevent.start = moment.unix(cevent.start).format("YYYY-MM-DDTHH:mm:ss");
      cevent.end = moment.unix(cevent.end).format("YYYY-MM-DDTHH:mm:ss");

      return cevent;
    });

    if (this.calendarCreated){
      this.ui.calendar.fullCalendar('destroy');
    }

    var self = this;
    function updateEvent(event){
      var log = self.collection.get(event.id);
      log.save({
        start: moment(event.start.format()).unix(),
        end: moment(event.end.format()).unix()
      });
    }

    this.ui.calendar.fullCalendar({
      lang: 'es-AR',
      defaultView: 'agendaDay',
      editable: true,
      header: false,
      allDaySlot: false,
      height: 600,
      timeFormat: 'HH:mm',
      axisFormat: 'HH:mm',
      scrollTime: '08:00:00',
      columnFormat: {
        day: 'dddd D/MM'
      },
      events: calEvents,
      eventDrop: updateEvent,
      eventResize: updateEvent
    });

    this.calendarCreated = true;
  }

});
},{"./templates/calendar.hbs.js":18}],13:[function(require,module,exports){
/**
 * VIEW: Chrono
 * 
 */
 
var template = require('./templates/chrono.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  ui:{
    timer: ".chrono-time",
    toggle: ".toggle-chrono",
    view: ".chrono-view",

    play: ".start",
    stop: ".stop",
    reset: ".reset",
    logit: ".logit",

    edit: ".edit",
    remove: ".remove",
  },

  events: {
    "click .chrono-title": "toggleVisible",

    "click .start": "chronoStart",
    "click .stop": "chronoStop",
    "click .reset": "chronoReset",
    "click .logit": "chronoLogit",

    "click .edit": "chronoEdit",
    "click .remove": "chronoRemove",
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    var self = this;
    _.defer(function(){
      self.initTimeCircles();
    });
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  toggleVisible: function(){
    if (this.ui.view.hasClass("hide")){
      this.ui.toggle.children("i")
        .removeClass("fa-chevron-down")
        .addClass("fa-chevron-up");

      this.ui.view.removeClass("hide");
      this.ui.timer.TimeCircles().rebuild().start().stop();
    }
    else {
      this.ui.toggle.children("i")
        .removeClass("fa-chevron-up")
        .addClass("fa-chevron-down");

      this.ui.view.addClass("hide");
    }
  },

  chronoStart: function(){
    this.ui.timer.TimeCircles().start();

    if (!this.model.get("start")){
      this.model.save({
        start: moment().unix(),
        end: null
      }, {
        patch: true
      });
    }
    else {
      this.model.save({
        end: null,
      }, {
        patch: true
      });
    }

    this.showButtonsStarted();
  },

  chronoStop: function(){
    this.ui.timer.TimeCircles().stop();
    
    this.model.save({
      end: moment().unix(),
    }, {
      patch: true
    });

    this.showButtonsStopped();
  },

  chronoReset: function(){
    this.ui.timer.attr('data-timer', 0);
    this.ui.timer.TimeCircles().restart().stop();
    
    this.model.save({
      start: null,
      end: null,
    }, {
      patch: true
    });

    this.toggleButtons(["play", "edit", "remove"], true);
    this.toggleButtons(["reset", "logit", "stop"], false);
  },

  chronoLogit: function(){

    var start = moment.unix(this.model.get("start")).seconds(0);
    var end = moment.unix(this.model.get("end")).seconds(0);

    function roundMinutes(dtMoment){
      if (dtMoment.minutes() < 15){
        dtMoment.minutes(0);
      }
      else if (dtMoment.minutes() < 45){
        dtMoment.minutes(30);
      }
      else { // > 45
        dtMoment.add("hours", 1).minutes(0);
      }
    }

    roundMinutes(start);
    roundMinutes(end);

    if(start.diff(end, "minutes") < 30){
      end = start.clone().add("minutes", 30);
    }

    desk.app.chronoLogs.create({
      start: start.unix(),
      end: end.unix(),
      chrono: this.model.get("_id")
    });

    this.chronoReset();
  },

  chronoEdit: function(e){
    this.trigger('edit');
    e.stopPropagation();
  },

  chronoRemove: function(e){
    if (window.confirm("Is going to be deleted, sure?")){
      this.model.destroy();
    }

    e.stopPropagation();
  },

  showButtonsStarted: function(){
    this.toggleButtons(["play", "logit", "reset", "edit", "remove"], false);
    this.toggleButtons(["stop"], true);
  },

  showButtonsStopped: function(){
    this.toggleButtons(["play", "logit", "reset"], true);
    this.toggleButtons(["stop"], false);
  },

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

  toggleButtons: function(btns, show){
    for (var i=0; i < btns.length; i++){
      if (show){
        this.ui[btns[i]].removeClass("hide");
      }
      else {
        this.ui[btns[i]].addClass("hide");
      }
    }
  },

  initTimeCircles: function(){
    var running = false;

    var start = this.model.get("start") ? moment.unix(this.model.get("start")) : null;
    var end = this.model.get("end") ? moment.unix(this.model.get("end")) : null;

    if (start && start.isValid()){
      var secs = 0;

      if (end && end.isValid()){
        secs = start.diff(end, "seconds");
        this.showButtonsStopped();
      }
      else {
        secs = start.diff(moment(), "seconds");
        running = true;
        this.ui.view.removeClass("hide");
        this.showButtonsStarted();
      }

      this.ui.timer.attr('data-timer', secs);
    }

    this.ui.timer.TimeCircles({
      start: true,
      animation: "smooth",
      bg_width: 1.2,
      fg_width: 0.1,
      circle_bg_color: "#60686F",
      time: {
        Days: { show: false },
        Hours: {
          text: "Hours",
          color: "#99CCFF",
          show: true
        },
        Minutes: {
          text: "Minutes",
          color: "#BBFFBB",
          show: true
        },
        Seconds: {
          text: "Seconds",
          color: "#FF9999",
          show: true
        }
      }
    }).stop();

    if (running){
      this.ui.timer.TimeCircles().start();
    }

  }

});
},{"./templates/chrono.hbs.js":19}],14:[function(require,module,exports){
/**
 * VIEW: Edit Chrono
 * 
 */
 
var template = require('./templates/chronoEdit.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "chrono",
  template: template,

  ui: {
    "title": "#txt-title"
  },

  events:{
    "click .save-chrono": "saveChrono",
    "click .cancel-chrono": "cancelChrono"
  },

  templateHelpers: {
    isNew: function(){
      return this._id ? false : true;
    }
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  onRender: function(){
    
  },

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  saveChrono: function(){
    var toSave = {
      title: this.ui.title.val()
    };

    this.model
      .save(toSave, { patch: true, silent: true })
      .success(this.chronoSaved.bind(this));
  },

  chronoSaved: function(){
    this.trigger("saved");
  },

  cancelChrono: function(){
    this.trigger("cancel");
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./templates/chronoEdit.hbs.js":20}],15:[function(require,module,exports){

var 
    template = require("./templates/chronoLayout.hbs.js")
  , ChronoEditView = require("./ChronoEdit")
  , ChronoView = require("./Chrono");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  tagName: "li",
  template: template,

  regions:{
    "container": ".chrono-content"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    var self = this;

    function showChronoView(){
      var chrono = new ChronoView({
        model: self.model
      });
      
      chrono.on('edit', showChronoEditView);
      self.container.show(chrono);
    }

    function showChronoEditView(){
      var chronoEdit = new ChronoEditView({
        model: self.model
      });

      chronoEdit.on('saved', showChronoView);
      chronoEdit.on('cancel', showChronoView);

      self.container.show(chronoEdit);
    }

    showChronoView();
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
},{"./Chrono":13,"./ChronoEdit":14,"./templates/chronoLayout.hbs.js":21}],16:[function(require,module,exports){
/**
 * VIEW: Chronos
 * 
 */

var ChronoLayout = require('./ChronoLayout');

module.exports = Backbone.Marionette.CollectionView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "chronos",
  tagName: "ul",
  itemView: ChronoLayout,

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
},{"./ChronoLayout":15}],17:[function(require,module,exports){

var 
    template = require("./templates/layout.hbs.js")
  , Chrono = require("../../models/Chrono")
  , Chronos = require("../../models/Chronos")
  , ChronoLogs = require("../../models/ChronoLogs")
  , ChronoView = require("./ChronoEdit")
  , ChronosView = require("./Chronos")
  , Calendar = require("./Calendar");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  regions:{
    "createChrono": ".new-chrono",
    "chronosCtn": "#chronos",
    "chronoLogsCtn": "#chrono-logs"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    desk.app.chronos = new Chronos();
    desk.app.chronos.fetch();

    desk.app.chronoLogs = new ChronoLogs();
    desk.app.chronoLogs.fetch();
  },

  onRender: function(){

    var chronoView = new ChronoView({
      model: new Chrono()
    });

    chronoView.on("saved", function(){
      desk.app.chronos.add(chronoView.model);
      chronoView.model = new Chrono();
      chronoView.render();
    });

    this.createChrono.show(chronoView);

    this.chronosCtn.show(new ChronosView({
      collection: desk.app.chronos
    }));

    this.chronoLogsCtn.show(new Calendar({
      collection: desk.app.chronoLogs
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
},{"../../models/Chrono":6,"../../models/ChronoLogs":8,"../../models/Chronos":9,"./Calendar":12,"./ChronoEdit":14,"./Chronos":16,"./templates/layout.hbs.js":22}],18:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"calendar\"></div>";
  })
;

},{}],19:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"chrono-title\">";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " \n  <a class=\"toggle-chrono pull-right\"><i class=\"fa fa-chevron-down\"></i></a>\n</div>\n<div class=\"chrono-view hide\">\n  <div class=\"chrono-time\" data-timer=\"0\"></div>\n  <div class=\"chrono-controls\">\n    <a class=\"start\"><i class=\"fa fa-play\"></i></a>\n    <a class=\"stop hide\"><i class=\"fa fa-stop\"></i></a>\n    <a class=\"reset hide\"><i class=\"fa fa-undo\"></i></a>\n    <a class=\"logit hide\"><i class=\"fa fa-sign-in\"></i></a>\n\n    <a class=\"edit\"><i class=\"fa fa-edit\"></i></a>\n    <a class=\"remove\"><i class=\"fa fa-trash-o\"></i></a>\n  </div>\n<div>";
  return buffer;
  })
;

},{}],20:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n  <div class=\"col-md-2 col-sm-2\">\n    <a class=\"acn-btn btn success save-chrono\">\n      <i class=\"fa fa-plus\"></i>\n    </a>\n  </div>\n  ";
  }

function program3(depth0,data) {
  
  
  return "\n  <div class=\"col-md-2 col-sm-2\">\n    <a class=\"acn-btn btn success save-chrono\">\n      <i class=\"fa fa-check\"></i>\n    </a>\n    <a class=\"acn-btn btn danger cancel-chrono\">\n      <i class=\"fa fa-times\"></i>\n    </a>\n  </div>\n  ";
  }

  buffer += "\n<div class=\"row\">\n  <div class=\"col-xs-10\" style=\"margin-bottom: 5px;\">\n    <input id=\"txt-title\" type=\"text\" class=\"form-control\" placeholder=\"name of what your are tracking\" value=\"";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.title; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">    \n  </div>\n\n  ";
  stack1 = helpers['if'].call(depth0, depth0.isNew, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>";
  return buffer;
  })
;

},{}],21:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"chrono-content\"></div>";
  })
;

},{}],22:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"row\">\n  <div class=\"col-md-12 new-chrono\"></div>\n</div>\n<div class=\"row\">\n  <div id=\"chronos\" class=\"col-md-12\"></div>\n</div>\n<div class=\"row\">\n  <div id=\"chrono-logs\" class=\"col-md-12\"></div>\n</div>";
  })
;

},{}],23:[function(require,module,exports){

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
},{"./templates/footer.hbs.js":39}],24:[function(require,module,exports){

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
},{"./Login":26,"./templates/header.hbs.js":40}],25:[function(require,module,exports){

var 
    template = require("./templates/layout.hbs.js")
  , PinsLayout = require("./Pins/Layout")
  , ChronosLayout = require("./Chronos/Layout");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  regions:{
    "pins": ".pins-ctn",
    "chronos": ".chronos-ctn"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(){
    
  },

  onRender: function(){

    this.pins.show(new PinsLayout());
    this.chronos.show(new ChronosLayout());

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
},{"./Chronos/Layout":17,"./Pins/Layout":28,"./templates/layout.hbs.js":41}],26:[function(require,module,exports){
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
},{"./templates/login.hbs.js":42}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){

var 
    template = require("./templates/layout.hbs.js")
  , Pin = require("../../models/Pin")
  , Pins = require("../../models/Pins")
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
},{"../../models/Pin":10,"../../models/Pins":11,"./PinEdit":30,"./Pins":32,"./SearchPins":33,"./templates/layout.hbs.js":34}],29:[function(require,module,exports){
/**
 * VIEW: Pin
 * 
 */
 
var template = require('./templates/pin.hbs.js');

module.exports = Backbone.Marionette.ItemView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  template: template,

  ui: {
    controls: ".controls",
    copyCtn: "#copy-ctn",
    text: "#txtText"
  },

  events: {
    "blur #copy-ctn": "exitCopyClipboard",

    "click .edit": "showEditMode",
    "click .remove": "removePin"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    this.$el.on("click", this.copyToClipboard.bind(this));
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  copyToClipboard: function(e){
    var h = this.$el.height() - this.ui.controls.height() - 7;
    this.ui.text.addClass("hide");
    this.ui.copyCtn.removeClass("hide").css('height', h).select();
    e.stopPropagation();
  },

  exitCopyClipboard: function(){
    this.ui.copyCtn.addClass("hide");
    this.ui.text.removeClass("hide");
  },

  showEditMode: function(e){
    this.trigger('edit');
    e.stopPropagation();
  },

  removePin: function(e){
    if (window.confirm("Is going to be deleted, sure?")){
      this.model.destroy();
    }

    e.stopPropagation();
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./templates/pin.hbs.js":35}],30:[function(require,module,exports){
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
    "click .save-pin": "savePin",
    "click .cancel-pin": "cancelPin"
  },

  templateHelpers: {
    isNew: function(){
      return this._id ? false : true;
    }
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  onRender: function(){
    this.ui.tags.tagsinput();
  },

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
  },

  cancelPin: function(){
    this.trigger("cancel");
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./templates/pinEdit.hbs.js":36}],31:[function(require,module,exports){

var 
    template = require("./templates/pinLayout.hbs.js")
  , PinEditView = require("./PinEdit")
  , PinView = require("./Pin");

module.exports = Backbone.Marionette.Layout.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  tagName: "li",
  template: template,

  regions:{
    "container": ".pin-content"
  },

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  onRender: function(){
    var self = this;

    function showPinView(){
      var pin = new PinView({
        model: self.model
      });
      
      pin.on('edit', showPinEditView);
      self.container.show(pin);
    }

    function showPinEditView(){
      var pinEdit = new PinEditView({
        model: self.model
      });

      pinEdit.on('saved', showPinView);
      pinEdit.on('cancel', showPinView);

      self.container.show(pinEdit);
    }

    showPinView();
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
},{"./Pin":29,"./PinEdit":30,"./templates/pinLayout.hbs.js":37}],32:[function(require,module,exports){
/**
 * VIEW: Pins
 * 
 */

var PinLayout = require('./PinLayout');

module.exports = Backbone.Marionette.CollectionView.extend({

  //--------------------------------------
  //+ PUBLIC PROPERTIES / CONSTANTS
  //--------------------------------------

  className: "pins",
  tagName: "ul",
  itemView: PinLayout,

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
},{"./PinLayout":31}],33:[function(require,module,exports){
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

  ui: {
    searchbox: "input[type=text]"
  },

  events: {
    "keyup input[type=text]": "search"
  },

  lastSearch: "",

  //--------------------------------------
  //+ INHERITED / OVERRIDES
  //--------------------------------------

  initialize: function(options){
    this.collection = options && options.collection;
  },

  //--------------------------------------
  //+ PUBLIC METHODS / GETTERS / SETTERS
  //--------------------------------------

  //--------------------------------------
  //+ EVENT HANDLERS
  //--------------------------------------

  search: function(){
    var self = this;
    window.clearTimeout(this.timer);

    this.timer = window.setTimeout(function(){
      var keyword = self.ui.searchbox.val();

      if (keyword !== self.lastSearch) {
        self.lastSearch = keyword;

        self.collection.fetch({
          data: $.param({ q: keyword }),
          reset: true
        });
      }
            
    }, 300);
  }

  //--------------------------------------
  //+ PRIVATE AND PROTECTED METHODS
  //--------------------------------------

});
},{"./templates/searchPins.hbs.js":38}],34:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"row\">\n  <div class=\"col-md-12 new-pin\"></div>\n</div>\n<div class=\"row search-pins-ctn\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 search-pins\"></div>\n  </div>\n</div>\n<div class=\"row\">\n  <div id=\"pins\" class=\"col-md-12\"></div>\n</div>\n";
  })
;

},{}],35:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <a class=\"acn-btn link\" href=\"";
  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" target=\"_blank\">\n    link\n  </a>\n  ";
  return buffer;
  }

  buffer += "<p id=\"txtText\" class=\"text\">";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p>\n<textarea id=\"copy-ctn\" class=\"text hide\">";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n<div class=\"controls\">\n  ";
  stack1 = helpers['if'].call(depth0, depth0.link, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <a class=\"acn-btn remove\">\n    remove\n  </a>\n  <a class=\"acn-btn edit\">\n    edit\n  </a>\n</div>";
  return buffer;
  })
;

},{}],36:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n  <div class=\"col-md-3 col-sm-12\">\n    <a class=\"acn-btn btn success save-pin\">\n      <i class=\"fa fa-plus\"></i>\n    </a>\n  </div>\n  ";
  }

function program3(depth0,data) {
  
  
  return "\n  <div class=\"col-md-3 col-sm-12\">\n    <a class=\"acn-btn btn success save-pin\">\n      <i class=\"fa fa-check\"></i>\n    </a>\n    <a class=\"acn-btn btn danger cancel-pin\">\n      <i class=\"fa fa-times\"></i>\n    </a>\n  </div>\n  ";
  }

  buffer += "\n<div class=\"row\">\n  <div class=\"col-xs-12\" style=\"margin-bottom: 5px;\">\n    <textarea id=\"txt-text\" class=\"form-control\" placeholder=\"type something to save\">";
  if (stack1 = helpers.text) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.text; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n  </div>\n</div>\n\n<div class=\"row\" style=\"margin-bottom: 5px;\">\n  <div class=\"col-xs-12\">\n    <div class=\"input-group\">\n      <span class=\"input-group-addon\">\n        <i class=\"fa fa-tags\"></i>  \n      </span>\n\n      <input id=\"txt-tags\" type=\"text\" class=\"form-control\" data-role=\"tagsinput\" \n        placeholder=\"type a tag and press enter\" value=\"";
  if (stack1 = helpers.tags) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.tags; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n  </div>\n</div>\n\n<div class=\"row\">\n\n  <div class=\"col-md-9 col-sm-12\">\n    <div class=\"input-group\">\n      <span class=\"input-group-addon\">\n        <i class=\"fa fa-link\"></i>  \n      </span>\n      <input id=\"txt-link\" type=\"text\" class=\"form-control pretty\" \n      placeholder=\"paste some link\" value=\"";
  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.link; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n    </div>\n  </div>\n\n  ";
  stack1 = helpers['if'].call(depth0, depth0.isNew, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  })
;

},{}],37:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"pin-content\"></div>";
  })
;

},{}],38:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<input type=\"text\" class=\"form-control\" placeholder=\"search\">";
  })
;

},{}],39:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "";


  return buffer;
  })
;

},{}],40:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n      <form class=\"navbar-form navbar-right\">\n        <img src=";
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

  buffer += "<div class=\"navbar navbar-inverse navbar-fixed-top\" role=\"navigation\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-collapse\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <label class=\"navbar-brand\">Warrior Desk</label>\n    </div>\n    <div class=\"navbar-collapse collapse\">\n      ";
  options = {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.isLoggedIn) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.isLoggedIn; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.isLoggedIn) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n  </div>\n</div>";
  return buffer;
  })
;

},{}],41:[function(require,module,exports){
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<div class=\"col-md-6 pins-ctn\"></div>\n<div class=\"col-md-6 chronos-ctn\"></div>";
  })
;

},{}],42:[function(require,module,exports){
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