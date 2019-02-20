'use strict';

// const CSV = require( 'csv' );
const assert = require( 'assert' );
const async = require( 'async' );
const reference = require( '../lib/reference' );
const AreaCodes = require( '../lib/areacodes' );
const database = require( '../lib/data' );

let referenceDatabase = {};

const getReference = function ( done ) {

	async.waterfall( [
		( done ) => {
			reference.nanpa( done );
		},
		( data, done ) => {
			referenceDatabase = data;
			done();
		}
	], done );

};

const successCheck = function ( areaCode, phoneNumber, done ) {

	const areaCodes = new AreaCodes();

	async.waterfall( [
		( done ) => {
			areaCodes.get( phoneNumber, done );
		},
		( result, done ) => {

			try {

				assert.ok( database.hasOwnProperty( areaCode ), 'test area code is not found: ' + areaCode );

				const data = database[ areaCode ];

				assert.deepStrictEqual( result, data, 'result should match' );

				if ( result.type === 'local' ) {

					[
						[ 'type', 'string' ],
						[ 'city', 'string' ],
						[ 'state', 'string' ],
						[ 'stateCode', 'string', 2 ],
						[ 'location', 'object' ]
					].forEach( function ( checks ) {

						assert.ok( result.hasOwnProperty( checks[ 0 ] ),
							'result has property: ' + checks[ 0 ] + ' for area code: ' + areaCode );

						assert.strictEqual( typeof result[ checks[ 0 ] ],
							checks[ 1 ],
							'result[' + checks[ 0 ] + '] should be correct type for area code: ' + areaCode );

						if ( checks.length > 2 ) {

							assert.strictEqual( result[ checks[ 0 ] ].length,
								checks[ 2 ],
								'result[' + checks[ 0 ] + '].length should be expected value for area code: ' + areaCode );

						}

					} );

					assert.strictEqual( typeof result.location.latitude,
						'number',
						'latitude should be a number for area code: ' + areaCode );
					assert.strictEqual( typeof result.location.longitude,
						'number',
						'longitude should be a number for area code: ' + areaCode );

				}

			} catch ( e ) {
				return done( e );
			}

			done();
		}
	], done );

};

const errorCheck = function ( errorMessage, phoneNumber, done ) {

	const areaCodes = new AreaCodes();

	areaCodes.get( phoneNumber, ( err, result ) => {

		try {

			assert.ok( err, 'should return error for ' + phoneNumber );
			assert.ok( !result, 'should not return a result for ' + phoneNumber );
			assert.strictEqual( err.message, errorMessage, 'should be correct error message for ' + phoneNumber );

		} catch ( e ) {
			return done( e );
		}

		done();

	} );

};

describe( 'general', function () {

	before( function ( done ) {
		this.timeout( 20000 );
		getReference( done );
	} );

	describe( 'compare with NANPA data', function () {

		it( 'should have the same area codes active', function () {

			const actual = Object.keys( database ).sort();
			const expected = Object.keys( referenceDatabase ).sort();

			const actualObjects = actual
				.filter( areaCode => { // skip area codes for future use that are not returning from NANPA database yet
					return expected.indexOf( areaCode ) > -1;
				} )
				.map( ( areaCode ) => {
					return {
						areaCode: areaCode,
						stateCode: database[ areaCode ].stateCode,
						type: database[ areaCode ].type
					};
				} );
			const expectedObjects = expected
				.map( areaCode => {
					return {
						areaCode: areaCode,
						stateCode: referenceDatabase[ areaCode ].stateCode,
						type: referenceDatabase[ areaCode ].type
					};
				} );

			// assert.strictEqual( actual.length, expected.length, 'should have the correct number of area codes' );
			assert.deepStrictEqual( actualObjects, expectedObjects );

		} );

	} );

	describe( 'success cases for all area codes in database', function () {

		Object.keys( database ).forEach( ( areaCode ) => {

			it( 'should parse version 1 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, '+1-' + areaCode + '-123-4567', done );
			} );

			it( 'should parse version 2 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, '1-' + areaCode + '-123-4567', done );
			} );

			it( 'should parse version 3 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, '1 (' + areaCode + ') 123-4567', done );
			} );

			it( 'should parse version 4 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, '(' + areaCode + ') 123-4567', done );
			} );

			it( 'should parse version 5 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, ' (' + areaCode + ') 123-4567', done );
			} );

			it( 'should parse version 6 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, areaCode + ' 123-4567', done );
			} );

			it( 'should parse version 7 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, areaCode + '123-4567', done );
			} );

			it( 'should parse version 8 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, areaCode + '1234567', done );
			} );

			it( 'should parse version 9 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, areaCode + '.123.4567', done );
			} );

			it( 'should parse version 10 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, '1.' + areaCode + '.123.4567', done );
			} );

			it( 'should parse version 11 format for area code ' + areaCode, function ( done ) {
				successCheck( areaCode, '+-' + areaCode + '-123-4567', done );
			} );

		} );

	} );

	describe( 'error cases for all area codes in database', function () {

		// invalid formats
		Object.keys( database ).forEach( ( areaCode ) => {

			it( 'should not parse version 12 format for area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '+1-' + areaCode + '-123-456', done );
			} );

			it( 'should not parse version 13 format for area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '1-' + areaCode + '-123-456', done );
			} );

			it( 'should not parse version 14 format for area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '0-' + areaCode + '-123-456', done );
			} );

			it( 'should not parse version 15 format for area code ' + areaCode, function ( done ) {
				errorCheck( 'phone number not valid', '0-' + areaCode + '-123-4567', done );
			} );

			it( 'should not parse version 16 format for area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '0-' + areaCode + '-12-4567', done );
			} );

			it( 'should not parse version 17 format for area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '0-' + areaCode + '-12-4567', done );
			} );

		} );

	} );

	describe( 'error cases for all non-existent codes (001-999)', function () {

		// generate a list of all three digit numbers from 001-999 that are not in our database
		const nonExistentCodes = [];

		for ( let i = 0; i < 1000; i++ ) {
			let areaCode = i + ''; // convert to string

			while ( areaCode.length < 3 ) {
				areaCode = '0' + areaCode;
			}

			if ( !database.hasOwnProperty( areaCode ) ) {
				nonExistentCodes.push( areaCode );
			}
		}

		nonExistentCodes.forEach( ( areaCode ) => {

			it( 'should parse version 1 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '+1-' + areaCode + '-123-4567', done );
			} );

			it( 'should parse version 2 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '1-' + areaCode + '-123-4567', done );
			} );

			it( 'should parse version 3 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '1 (' + areaCode + ') 123-4567', done );
			} );

			it( 'should parse version 4 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '(' + areaCode + ') 123-4567', done );
			} );

			it( 'should parse version 5 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', ' (' + areaCode + ') 123-4567', done );
			} );

			it( 'should parse version 6 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', areaCode + ' 123-4567', done );
			} );

			it( 'should parse version 7 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', areaCode + '123-4567', done );
			} );

			it( 'should parse version 8 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', areaCode + '1234567', done );
			} );

			it( 'should parse version 9 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', areaCode + '.123.4567', done );
			} );

			it( 'should parse version 10 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '1.' + areaCode + '.123.4567', done );
			} );

			it( 'should parse version 11 format for non-existent area code ' + areaCode, function ( done ) {
				errorCheck( 'not found', '+-' + areaCode + '-123-4567', done );
			} );

		} );

	} );

} );
