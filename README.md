[![view on npm](http://img.shields.io/npm/v/stream-monitor.svg)](https://www.npmjs.org/package/stream-monitor)
[![npm module downloads per month](http://img.shields.io/npm/dm/stream-monitor.svg)](https://www.npmjs.org/package/stream-monitor)
[![Dependency Status](https://david-dm.org/75lb/stream-monitor.svg)](https://david-dm.org/75lb/stream-monitor)

<a name="module_stream-monitor"></a>
## stream-monitor
This module extends the base [Stream class](https://nodejs.org/api/stream.html#stream_stream) with a `.monitor()` method. Invoke this method on a stream to print all activity to the console.

**Example**  
```js
var monitor = require("stream-monitor");
var fs = require("fs");

fs.createReadStream("file.txt")
    .monitor()
    .pipe(fs.createWriteStream("file-copy.txt"))
    .monitor();
```

* * *

&copy; 2015 Lloyd Brookes \<75pound@gmail.com\>. Documented by [jsdoc-to-markdown](https://github.com/75lb/jsdoc-to-markdown).
