node-areacodes
========

Get the city, state and GPS coordinates of all (as far as we know) U.S. area codes. Look them up one phone number at a time, or dump the entire DB object.

Area code data is relatively small, so this library stores the data internally. No web service calls or anything like that. It's fast baby.

Usage
========

Pull by phone number (requires country code for forward compatibility):

```
var AreaCodes = require( 'areacodes' );

areaCodes = new AreaCodes();

var areaCodes = new AreaCodes();

areaCodes.get( '+1-303-123-4567', function( err, data ) {
	console.error( 'city/state', data );
} );

// output: city/state { city: 'aurora', state: 'colorado' }

```

Get entire DB:

```
var AreaCodes = require( 'areacodes' );

areaCodes = new AreaCodes();

var areaCodes = new AreaCodes();

areaCodes.getAll( function( err, data ) {
	console.error( 'all area codes', data );
} );
```

License
========

(The MIT License)

Copyright (c) 2013 BlueRival Software <support@bluerival.com>

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
