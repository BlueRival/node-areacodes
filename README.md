node-areacodes
========

Get the city and state of all U.S. states or look them up one phone number at a time.

Area Code data is relatively small, so this library stores the data internally. No web service calls or anything like that.

Usage
========

This is all there is to it.


```
var AreaCodes = require( 'areacodes' );

areaCodes = new AreaCodes();

var areaCodes = new AreaCodes();

areaCodes.get( '+1-303-123-4567', function( err, data ) {
	console.error( 'city/state', data );
} );

// output: city/state { city: 'aurora', state: 'colorado' }

```

Coming Soon
========

- Latitude and Longitude
- Alternative cities (for area codes covering multiple major cities)
- Special area codes, like 800
- Other countries

License
========

(The MIT License)

Copyright (c) 2013 BlueRival Software <anthony@bluerival.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
