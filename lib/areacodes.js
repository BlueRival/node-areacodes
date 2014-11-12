"use strict";

var __ = require( 'doublescore' );
var data = require( './data.json' );

var AreaCodes = function() {

};

AreaCodes.prototype.get = function( phoneNumber, done ) {

	phoneNumber = phoneNumber.replace( /^\+?[10]/, '' ).replace( /[^0-9]/g, '' ).match( /^([0-9]{3})/ );

	if ( !phoneNumber ) {
		done( new Error( 'phone number not valid' ) );
		return;
	}

	phoneNumber = phoneNumber[ 1 ];

	if ( data.hasOwnProperty( phoneNumber ) ) {
		done( null, __( data[ phoneNumber ] ).clone() );
		return;
	}

	done( new Error( 'not found' ) );

};

AreaCodes.prototype.getAll = function( done ) {

	done( null, __( data ).clone() );

};

module.exports = AreaCodes;
