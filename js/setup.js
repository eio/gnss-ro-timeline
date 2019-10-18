import * as THREE from './lib/three.module.js';
import { TWEEN } from './lib/jsm/tween.module.min.js';
import { TrackballControls } from './lib/jsm/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from './lib/jsm/CSS3DRenderer.js';

export { init, animate };

var table = [
	"2020", "[event]", "",
	1, 4,
	"2020", "[event]", "",
	2, 4,
	"2019", "[event]", "",
	3, 4,
	"2019", "Spire continues to grow its constellation of small satellites, each equipped with their own GNSS Radio Occultation payload. Adding to what is already one of the largest private constellations in the world, the company exceeds 100 successfully deployed satellites early in the year.", "",
	4, 4,
	"2018-2017", "The National Environmental Satellite, Data, and Information Service (NESDIS) awards contracts to 3 satellite companies for Round Two of the CWDP. NOAA plans to review space-based RO data from Spire, GeoOptics, and PlanetIQ in order to determine its quality and potential value to NOAA’s weather forecasts and warnings.", "",
	5, 4,
	"2017-2016", "NOAA begins its inaugural Commercial Weather Data Pilot (CWDP). Round One culminates in the first ever contracts for private weather satellites being issued to Spire Global and GeoOptics.", "",
	6, 4,
	"2016", "Spire opens a second U.S campus in Boulder, Colorado. The company hires Dave Ector (former program manager for NASA’s COSMIC satellites) and Alexander MacDonald (former director of NOAA’s Earth System Research Laboratory), and starts drawing on the resources of the local weather ecosystem.", "",
	7, 4,
	"2012", "Spire Global - originally called NanoSatisfi Inc. - is founded in San Francisco, California. It begins as part of ArduSat, a project aiming to \"democratize access to space\".", "",
	8, 4,
	"2007", "The U.S. National Oceanic and Atmospheric Administration (NOAA) begins using the Cosmic constellation's radio occultation data in their operational forecasts.", "",
	9, 4,
	"2002-1999", "NASA follows the GPS/MET success with experiments on 6 international partnership missions, refining the systems and techniques of GPS sounding and demonstrating the robust low-cost technology. Several of these satellites continue to provide high-quality GPS remote sensing data today.", "",
	10, 4,
	"1998", "The University Corporation for Atmospheric Research partners with Taiwan's National Space Organization to take GPS remote sensing to the operational level with Cosmic - the first operational GPS occultation constellation - which is known as FORMOSAT-3 in Taiwan.", "",
	11, 4,
	"1995", "GPS/MET, proposed by the University Corporation for Atmospheric Research and sponsored by the U.S. National Science Foundation, is remarkably successful in measuring properties of the atmosphere and ionosphere with a low-cost and reliable instrument.", "",
	12, 4,
	"1988", "JPL submits the first GPS occultation proposal to NASA. Although the “GPS Geoscience Instrument” does not fly, the concept is established, and development of GPS remote sensing technology begins. NASA starts developing GPS remote sensing receivers, and global ground networks are put in place.", "",
	13, 4,
	"1980s", "As GPS emerges, NASA devises new analysis techniques and equipment. The quest for sub-centimeter global accuracy soon leads to GPS-derived measurements of the atmosphere and ionosphere.", "",
	14, 4,
	"1960s", "Teams from NASA JPL and Stanford University exploit radio links between Earth and the Mariner 3 and 4 spacecraft to probe the atmosphere and other properties of Mars.", "",
	15, 4
];

var INIT_CAMERA_Z = 8000;
var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

function resetCamera() {
	camera.position.set(0, 0, INIT_CAMERA_Z); // Set position like this
	camera.lookAt(new THREE.Vector3(0,0,10000)); // Set look at coordinate like this
	// for (var i=0; i<objects.length; i++) {
	// 	objects[i].rotation.x = 0;
	// 	objects[i].rotation.y = 0;
	// 	objects[i].rotation.z = 0;
	// 	objects[i].quaternion.w = 1;
	// 	objects[i].quaternion.x = 0;
	// 	objects[i].quaternion.y = 0;
	// 	objects[i].quaternion.z = 0;
	// }
}

function init() {

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = INIT_CAMERA_Z;

	document.body.addEventListener('keydown', function logKey(e) {
	  	console.log(camera.position)
	});

	scene = new THREE.Scene();

	// table

	for ( var i = 0; i < table.length; i += 5 ) {

		var element = document.createElement( 'div' );
		element.className = 'element';
		// var alpha = ( Math.random() * 0.5 + 0.25 );
		var alpha = 0.25;
		element.style.backgroundColor = 'rgba(0,40,128,' + alpha + ')';

		var number = document.createElement( 'div' );
		number.className = 'number';
		number.textContent = ( i / 5 ) + 1;
		element.appendChild( number );

		var year = document.createElement( 'div' );
		year.className = 'year';
		year.textContent = table[ i ];
		element.appendChild( year );

		var details = document.createElement( 'div' );
		details.className = 'details';
		details.innerHTML = table[ i + 1 ] + '<br>' + table[ i + 2 ];
		element.appendChild( details );

		var object = new CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		scene.add( object );

		objects.push( object );

		//

		var object = new THREE.Object3D();
		var xmargin = 280;
		var xoffset = 1800;
		var xpos = ( table[ i + 3 ] * xmargin ) - xoffset;
		var ypos = - ( table[ i + 4 ] * 180 ) + 990;
		object.position.x = xpos * 3;
		object.position.y = ypos * 3;

		targets.table.push( object );

	}

	// sphere

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var phi = Math.acos( - 1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;

		var object = new THREE.Object3D();

		var size = 1400;
		object.position.setFromSphericalCoords( size, phi, theta );

		vector.copy( object.position ).multiplyScalar( 2 );

		object.lookAt( vector );

		targets.sphere.push( object );

	}

	// helix

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		// var tune = 0.175;
		var tune = 0.275;
		var theta = i * tune + Math.PI;
		var y = - ( i * 80 ) + 450;

		var object = new THREE.Object3D();

		object.position.setFromCylindricalCoords( 3000, theta, y );

		vector.x = object.position.x * 2;
		vector.y = object.position.y;
		vector.z = object.position.z * 2;

		object.lookAt( vector );

		targets.helix.push( object );

	}

	// grid

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = new THREE.Object3D();

		var offset = 1600;
		var scalar = 800;
		object.position.x = ( ( i % 5 ) * scalar ) - offset;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * scalar ) + offset;
		object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

		targets.grid.push( object );

	}

	//

	renderer = new CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.getElementById( 'container' ).appendChild( renderer.domElement );

	//

	controls = new TrackballControls( camera, renderer.domElement );
	controls.minDistance = 100;
	controls.maxDistance = 10000;
	controls.addEventListener( 'change', render );

	var button = document.getElementById( 'table' );
	button.addEventListener( 'click', function () {

		transform( targets.table, 2000 );

	}, false );

	var button = document.getElementById( 'sphere' );
	button.addEventListener( 'click', function () {

		transform( targets.sphere, 2000 );

	}, false );

	var button = document.getElementById( 'helix' );
	button.addEventListener( 'click', function () {

		transform( targets.helix, 2000 );

	}, false );

	var button = document.getElementById( 'grid' );
	button.addEventListener( 'click', function () {

		transform( targets.grid, 2000 );

	}, false );

	transform( targets.table, 2000 );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function transform( targets, duration ) {

	resetCamera();

	TWEEN.removeAll();

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = objects[ i ];
		var target = targets[ i ];

		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

	}

	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function animate() {

	requestAnimationFrame( animate );

	TWEEN.update();

	controls.update();

}

function render() {

	renderer.render( scene, camera );

}