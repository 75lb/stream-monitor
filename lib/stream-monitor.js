"use strict";
var util = require("util");
var dope = require("console-dope");
var stream = require("stream");
var Transform = stream.Transform;
var s = require("string-tools");
var a = require("array-tools");

/**
This module extends the base [Stream class](https://nodejs.org/api/stream.html#stream_stream) with a `.monitor()` method. Invoking this method on a stream with print all event activity to the console. 
@module stream-monitor
@example
This script:
```js
var monitor = require("stream-monitor");
var fs = require("fs");

fs.createReadStream("file.txt")
    .monitor()
    .pipe(fs.createWriteStream("file-copy.txt"))
    .monitor();
```
Will output something like:
```
Monitoring: ReadStream [n/a, 65536]
Monitoring: WriteStream [16384, n/a]
ReadStream  READABLE [0]
ReadStream  END
UNPIPE: ReadStream X WriteStream
WriteStream FINISH
ReadStream  CLOSE
WriteStream CLOSE
```
*/

stream.prototype.monitor = function(){
    monitorStream(this);
    return this;
};

var colWidth = {
    one: 0    
};

function monitorStream(stream){
    var name = stream.name || stream.constructor.name;
    if (name.length > colWidth.one) colWidth.one = name.length;
    dope.bold.underline.error(
        "Monitoring: %s [%s, %s]",
        name,
        stream._writableState ? stream._writableState.highWaterMark : "n/a",
        stream._readableState ? stream._readableState.highWaterMark : "n/a"
    );
    function logMsg(){
        dope.underline.error.apply(null, arguments);
    }
    function log(evt){
        var msg;
        if (evt === "pipe"){
            msg = util.format("%blue{PIPE: %s -> %s}", arguments[1], name);
            logMsg(msg);
        } else if (evt === "unpipe"){
            msg = util.format("%blue{UNPIPE: %s X %s}", arguments[1], name);
            logMsg(msg);
        } else if (evt === "readable"){
            var buf;
            if(stream._readableState.objectMode){
                buf = JSON.stringify(stream._readableState.buffer[0]) || "";
            } else {
                buf = Buffer.concat(stream._readableState.buffer);
            }
            
            dope.error(
                "%s %green{%s} [%d] %s", 
                s.padRight(name, colWidth.one),
                "READABLE", 
                stream._readableState.length,
                buf.slice(0, 80)
            );
        } else if ([ "readable", "connect" ].indexOf(evt) > -1){
            msg = name + ": " + "%green{" + evt.toUpperCase() + "}";
            logMsg(msg); 
            dope.error("stats here");
        } else if ([ "end", "close", "finish"].indexOf(evt) > -1){
            dope.error(
                "%s %red{%s}", 
                s.padRight(name, colWidth.one), evt.toUpperCase()
            );
        } else if (evt === "error"){
            dope.underline.error(
                "%s: %red{%s: %s}", 
                name, evt.toUpperCase(), arguments[1]
            );
        } else {
            msg = name + ": " + evt.toUpperCase();
            logMsg(msg);
            dope.error("stats here");
        }
    }
    stream
        .on("readable", function(){ log("readable"); })
        .on("error", function(err){ log("error", err.message); })
        .on("end", function(){ log("end"); })
        .on("close", function(){ log("close"); })
        .on("drain", function(){ log("drain"); })
        .on("finish", function(){ log("finish"); })
        .on("pipe", function(src){ log("pipe", src.name || src.constructor.name); })
        .on("unpipe", function(src){ log("unpipe", src.name || src.constructor.name); })
        .on("connect", function(){ log("connect"); })
        .on("timeout", function(){ log("timeout"); });
}

