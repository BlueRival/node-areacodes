'use strict';

const async = require( 'async' );
const parse = require( 'csv-parser' );
const turf = require( '@turf/turf' );
const request = require( 'request' );
const cheerio = require( 'cheerio' );
const shapefile = require( 'shapefile' );
const Readable = require( 'stream' ).Readable;

const toTitleCase = function ( str ) {
	return str.replace( /\w[^\s-']*/g, function ( txt ) {
		return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase();
	} );
};

module.exports = {
	usgsAreaCodeShapes: function ( done ) {

		const shapeFileUrl = 'https://www.sciencebase.gov/catalog/file/get/4f4e4a19e4b07f02db605716?f=03%2Fb4%2F1e%2F03b41ea45c1efd4e83992c806f77ce6a53fa3b5c';
		const dbfFileUrl = 'https://www.sciencebase.gov/catalog/file/get/4f4e4a19e4b07f02db605716?f=c6%2Fd4%2Fbc%2Fc6d4bc0d36c05a349a658788943cdb215451b916';

		const reference = {};

		const shapeFileStream = request( shapeFileUrl );
		const dbfFileStream = request( dbfFileUrl );


		const averageGPS = function ( geometry ) {

			let polygon = geometry.type === 'Polygon';

			let turfPolygon = null;

			if ( polygon ) {
				turfPolygon = turf.polygon( geometry.coordinates );
			} else {
				turfPolygon = turf.multiPolygon( geometry.coordinates );
			}

			let center = turf.centerOfMass( turfPolygon );

			let precision = 1000000;

			return {
				latitude: Math.round( center.geometry.coordinates[ 1 ] * precision ) / precision,
				longitude: Math.round( center.geometry.coordinates[ 0 ] * precision ) / precision
			};

		};

		shapefile.open( new Readable().wrap( shapeFileStream ), new Readable().wrap( dbfFileStream ) )
			.then( source => {

				let more = true;

				async.doWhilst( ( done ) => {

					source.read()
						.then( result => {

							more = !result.done;

							if ( !more ) {
								return done();
							}

							let data = result.value;
							let properties = data.properties;
							let geometry = data.geometry;

							reference[ properties.NPA ] = {
								stateCode: properties.STATE,
								location: averageGPS( geometry )
							};

							done();

						} )
						.catch( done );

				}, () => more, ( err ) => {
					if ( err ) {
						return done( err );
					}
					done( null, reference );
				} );


			} )
			.catch( done );


	},
	nanpa: function ( done ) {

		async.waterfall( [
			( done ) => {

				const referenceDatabase = {};

				const areaCodeReportURL = 'https://www.nationalnanpa.com/nanp1/npa_report.csv';

				request( areaCodeReportURL )
					.pipe( parse( {
						skipLines: 1
					} ) )
					.on( 'data', data => {

						if (
							data &&
							typeof data.NPA_ID === 'string' &&
							data.NPA_ID.match( /^[0-9]{3}$/ )
						) {

							let type = 'local';

							if (
								data.SERVICE.toLowerCase().match( 'toll-free' ) ||
								data.SERVICE.toLowerCase().match( 'toll free' ) ||
								data.NOTES.toLowerCase().match( 'toll-free' ) ||
								data.NOTES.toLowerCase().match( 'toll free' )
							) {
								type = 'toll-free';
							}

							if ( data.COUNTRY !== 'US' && type !== 'toll-free' ) {
								return;
							}

							let state = null;

							if ( data.LOCATION.trim().length === 2 ) {
								state = data.LOCATION.trim();
							} else if ( type !== 'toll-free' ) {
								return;
							}

							referenceDatabase[ data.NPA_ID ] = {
								type: type,
								stateCode: state
							};

						}

					} )
					.on( 'error', done )
					.on( 'end', () => {
						done( null, referenceDatabase );
					} );

			},
			( nanpa, done ) => {

				async.mapValuesLimit( nanpa, 10, ( record, areaCode, done ) => {

					async.waterfall( [
						( done ) => {
							request( {
								url: 'https://nationalnanpa.com/enas/displayNpaCityReport.do',
								method: 'POST',
								form: {
									npaId: areaCode
								}
							}, done );
						},
						( response, html, done ) => {

							if ( !response || response.statusCode !== 200 ) {
								console.error( 'Could not get city data for area code', areaCode );
								return done( null, record );
							}

							const $ = cheerio.load( html );

							const $table = $( 'tr.tableSubHead' ).parent();

							$table.children( 'tr' ).each( function ( i ) {

								if ( i === 0 || i > 1 ) {
									return;
								}

								const fields = [];
								$( this ).children( 'td' ).each( function () {
									fields.push( $( this ).text().trim() );
								} );

								if ( fields.length === 4 ) {
									record.city = toTitleCase( fields[ 1 ] );
								}

							} );

							done( null, record );
						}
					], done );

				}, done );

			}
		], done );

	}
};
