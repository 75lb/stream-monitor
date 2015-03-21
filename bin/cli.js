#!/usr/bin/env node
"use strict";
var monitor = require("../");

process.stdin.monitor().pipe(process.stdout).monitor();
