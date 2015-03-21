"use strict";
var monitor = require("../");
var fs = require("fs");

var file = fs.createReadStream(__filename);
monitor(file);
file.pipe(fs.createWriteStream("dupe.js"));
