
var ResourceAPI = require('./ResourceAPI');
var ChronoLogsAPI = require('./ChronoLogsAPI');

var pins = {
    model: "Pin"
  , name: "pins"
  , root: "/api"
  , sort: { "created_at" : -1 }
  , limit: 30
  , query: ["text", "tags"]
  , readOnly: ["_id", "owner", "created_at"]
};

var chronos = {
    model: "Chrono"
  , name: "chronos"
  , root: "/api"
  , sort: { "created_at" : -1 }
  , readOnly: ["_id", "owner", "created_at"]
};

var chronoLogs = {
    model: "ChronoLog"
  , name: "chronologs"
  , root: "/api"
  , sort: { "start" : 1 }
  , readOnly: ["_id", "owner"]
};

module.exports = function(app) {
  
  var apiPins = new ResourceAPI(app, pins);
  var apiChronos = new ResourceAPI(app, chronos);
  var apiChronoLogs = new ChronoLogsAPI(app, chronoLogs);

};
