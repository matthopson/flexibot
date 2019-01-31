//var acronymicon = require("./acronymicon.json");
var fetch = require("node-fetch");

var options = {
  sheet: process.env.ARC_SHEET,
  key: process.env.ARC_KEY
};

// TEST
// node -e 'require("./acronymicon").summon({ sheet: [ARC_SHEET], key: [ARC_KEY] }).then(data => console.log(data));'

var summonAcronymicon = function(opt) {
  var url =
    "https://sheets.googleapis.com/v4/spreadsheets/" +
    opt.sheet +
    "/values/Sheet1!A1:C999?key=" +
    opt.key;
  return fetch(url)
    .then(response => response.json())
    .then(json => {
      var data = json.values ? json.values.slice(1) : [];
      const normalize = data.reduce((acc, cur) => {
        acc[cur[0]] = { title: cur[1], definition: cur[2] };
        return acc;
      }, {});
      return normalize;
    });
};

// TEST
// node -e 'var d = require("./acronymicon").default({reply: (a,b) => {console.log(b)}}, { text: "wtf is TIN"})'

var runAcronymicon = function(bot, message) {
  summonAcronymicon(options).then(acronymicon => {
    var acr = message.text.split(" ").pop();
    var term = acronymicon[acr];
    var msg = term
      ? term.title + ": " + term.definition
      : "https://media.giphy.com/media/KOc9VDl9U06s0/giphy.gif";
    // test by running the following command:
    // node -e 'var d = require("./acronymicon").default({reply: (a,b) => {console.log(b)}}, { text: "wtf is TIN"})'
    bot.reply(message, msg);
  });
};

module.exports = {
  default: runAcronymicon,
  summon: summonAcronymicon
};