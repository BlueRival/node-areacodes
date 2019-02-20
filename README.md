Area Codes
========

Get the city, state and GPS coordinates of all (as far as we know) U.S. area codes and North American Toll-Free Numbers. Look them up one phone number at a time, or dump the entire DB object.

Area code data is relatively small, so this library stores the data internally, and loads it into memory. No web service calls or anything like that. It's fast baby.

Memory impact should be < 100KB.

### A Note on Accuracy

Area codes are not geographically precise things. Technically some spam country borders, let alone stick to a single 
city, or even U.S. State. Therefore it is best to treat all the geographic data as good to within +/- 200 miles. 


Data Source
========

Raw list of Area Codes and associated U.S. States pulled from https://www.nationalnanpa.com/nanp1/npa_report.csv. Some not-yet published area codes where identified via https://areacode.org, such a area codes slated for future use, but not yet assigned.

City names added from https://nationalnanpa.com/enas/displayNpaCityReport.do by selecting the city at the top of the list of cities serviced by the area code.

Shape data for GPS information provided by https://www.sciencebase.gov/catalog/item/4f4e4a19e4b07f02db605716. Area code GPS point is calculated using the Centroid of all polygon coordinates for the area code coverage area.

Any missing City, State and/or GPS information is back-filled using https://nominatim.openstreetmap.org, using City, State to back-fill missing GPS, or by using GPS to back-fill City, State.

Usage
========

Pull by phone number (include country code or not, but only 1, United States, is supported). Also, many phone number formats
are supported:

```txt
+1-###-###-####
1-###-###-####
###-###-####
+1 (###) ###-####
1 (###) ###-####
(###) ###-####
+1.###.###.####
1.###.###.####
###.###.####
+1##########
1##########
##########
etc.
```

Basically, if there are 10-11 digits (first digit being 1 if 11) in the format, it should parse fine.

```javascript
let AreaCodes = require( 'areacodes' );

let areaCodes = new AreaCodes();

areaCodes.get( '+1-303-123-4567', function( err, data ) {
	console.error( 'city/state/GPS', data );
} );

/** output:
{
  "type": "local", 
  "city": "Aurora",
  "state": "Colorado",
  "stateCode": "CO",
  "location": {
    "latitude": 39.729431,
    "longitude": -104.831919
  }
}
*/

```

Get entire DB:

```
let AreaCodes = require( 'areacodes' );

let areaCodes = new AreaCodes();

areaCodes.getAll( function( err, data ) {
	console.error( 'all area codes', data );
} );
```

Contribute
========

If you want to help contribute to the library, this is how development goes. In all cases, make sure that you only add
new test cases to the test suite in the test directory. The only time we should consider deleting/editing old test cases
is if we are doing a non-backward compatible change. 

Make sure your pull-requests go to the develop branch only. 

## To Update Data

If you want to help update data, look at the update.js file. This is how we currently pull down data from all the data
sources and mash it into lib/data.json. Notice that we merge new data in, and don't delete old data. This is because there
is no expectation that existing area code data will change much. Even if an existing area code is expanded to cover new
geographic regions, we are OK with the GPS coordinates remaining approximate, to within +/- 200 miles. To run the update
method as is, simply execute:

```node update.js```

If new data is found, the lib/data.json file will be updated. Although update.js does some validation, you must also run
the full test suite before committing the new data file. Do so like this:

```npm test```

All tests passed? Great, issue your pull request.

If you update the data sources themselves, or anything else in update.js, or lib/reference.js, you should still run both
the `node update.js` and the `npm test` commands to verify that everything works end-to-end.

## Just editing lib/areacode.js

If you are just changing the code for how the in-memory database is loaded and accessed, you are only going to need to 
edit the lib/areacode.js file. And, you will only need to run `npm test` to verify your changes. 


License
========

(The MIT License)

Copyright (c) 2019 BlueRival Software <support@bluerival.com>

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
