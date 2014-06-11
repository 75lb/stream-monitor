"use strict";
require("console-dope");
var util = require("util"),
    stream = require("stream"),
    w = require("wodge");

var colWidth = {
    one: 0    
};

function monitorStream(stream){
    var name = stream.name || stream.constructor.name;
    if (name.length > colWidth.one) colWidth.one = name.length;
    console.bold.underline.log(
        "Monitoring: %s [%d, %d]",
        name,
        stream._writableState.highWaterMark,
        stream._readableState.highWaterMark
    );
    function logMsg(){
        console.underline.log.apply(null, arguments);
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
            
            console.log(
                "%s %green{%s} [%d] %s", 
                w.padRight(name, colWidth.one),
                "READABLE", 
                stream._readableState.length,
                buf.slice(0, 80)
            );
        } else if ([ "readable", "connect" ].indexOf(evt) > -1){
            msg = name + ": " + "%green{" + evt.toUpperCase() + "}";
            logMsg(msg); 
            console.log("stats here");
        } else if ([ "end", "close", "finish"].indexOf(evt) > -1){
            console.log(
                "%s %red{%s}", 
                w.padRight(name, colWidth.one), evt.toUpperCase()
            );
        } else if (evt === "error"){
            console.underline.log(
                "%s: %red{%s: %s}", 
                name, evt.toUpperCase(), arguments[1]
            );
        } else {
            msg = name + ": " + evt.toUpperCase();
            logMsg(msg);
            console.log("stats here");
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

module.exports = function monitor(){
    w.arrayify(arguments).forEach(monitorStream);
};
