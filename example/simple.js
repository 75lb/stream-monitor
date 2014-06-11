"use strict";
var monitor = require("../"),
    fs = require("fs");

var file  = fs. createReadStream(__filename);
monitor(file);
file.pipe(fs.createWriteStream("dupe.js"));
