"use strict";
var monitor = require("../");
var fs = require("fs");

fs.createReadStream(__filename)
    .monitor()
    .pipe(fs.createWriteStream("tmp/dupe.js"))
    .monitor();
