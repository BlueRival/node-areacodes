'use strict';

let __ = require( 'doublescore' );
let data = require( './data.json' );

class AreaCodes {

	get( phoneNumber, done ) {

		if ( typeof phoneNumber !== 'string' ) {
			return done( new Error( 'phone number not valid' ) );
		}

		phoneNumber = phoneNumber
			.replace( /[^0-9]/g, '' ); // remove any formatting such as spaces, dashes, parenthesis, etc.

		if ( phoneNumber.length > 10 ) {
			phoneNumber = phoneNumber
				.replace( /^1/, '' ); // remove US country code. Other countries not supported
		}

		// if ( phoneNumber.length > 10 ) { // if we pulled off the country code and still have more than ten digits, not valid number
		// 	return done( new Error( 'phone number not valid' ) );
		// }

		let areaCode = phoneNumber.match( /^([0-9]{3})[0-9]{7}$/ ); // grab the area code and verify it is a complete phone number

		if ( !areaCode ) {
			return done( new Error( 'phone number not valid' ) );
		}

		areaCode = areaCode[ 1 ];

		if ( data.hasOwnProperty( areaCode ) ) {
			return done( null, __( data[ areaCode ] ).clone() );
		}

		done( new Error( 'not found' ) );

	}

	getAll( done ) {
		done( null, __( data ).clone() );
	}

}

module.exports = AreaCodes;
