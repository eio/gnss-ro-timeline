import * as THREE from './lib/three.module.js';

import { TWEEN } from './lib/jsm/tween.module.min.js';
import { TrackballControls } from './lib/jsm/TrackballControls.js';
import { CSS3DRenderer, CSS3DObject } from './lib/jsm/CSS3DRenderer.js';

var table = [
	"2020", "[event]", "1.00794", 1, 4,
	"2020", "[event]", "1.00794", 2, 4,
	"2020", "[event]", "1.00794", 3, 4,
	"2019", "[event]", "40.078", 4, 4,
	"2018", "[event]", "44.955912", 5, 4,
	"2017", "[event]", "47.867", 6, 4,
	"2016", "[event]", "50.9415", 7, 4,
	"2015", "[event]", "51.9961", 8, 4,
	"2014", "[event]", "54.938045", 9, 4,
	"2013", "[event]", "55.845", 10, 4,
	"2012", "[event]", "58.933195", 11, 4,
	"2011", "[event]", "58.6934", 12, 4,
	"2010", "[event]", "63.546", 13, 4,
	"2009", "[event]", "65.38", 14, 4,
	"2002-1999", "NASA followed the GPS/MET success with experiments on six international partnership missions, refining the systems and techniques of GPS sounding and demonstrating the robust low-cost technology.", "", 15, 4,
	"1998", "The University Corporation for Atmospheric Research partnered with Taiwan's National Space Organization to take GPS remote sensing to the operational level with Cosmic - the first operational GPS occultation constellation - which is known as FORMOSAT-3 in Taiwan.", "", 16, 4,
	"1995", "GPS/MET, proposed by the University Corporation for Atmospheric Research and sponsored by the U.S. National Science Foundation, was remarkably successful in measuring properties of the atmosphere and ionosphere with a low-cost and reliable instrument.", "", 17, 4,
	"1988", "JPL submitted the first GPS occultation proposal to NASA.", "", 18, 4,
	"1980s", "As GPS emerged, NASA devised new analysis techniques and equipment which soon led to GPS-derived measurements of the atmosphere and ionosphere.", "", 19, 4,
	"1960s", "Teams from NASA JPL and Stanford University exploited radio links between Earth and the Mariner 3 and 4 spacecraft to probe the atmosphere and other properties of Mars.", "", 20, 4
];

var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

init();
animate();

function init() {

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 7000;

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

		var symbol = document.createElement( 'div' );
		symbol.className = 'symbol';
		symbol.textContent = table[ i ];
		element.appendChild( symbol );

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
		var xpos = ( table[ i + 3 ] * 140 ) - 1330;
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

		object.position.setFromSphericalCoords( 800, phi, theta );

		vector.copy( object.position ).multiplyScalar( 2 );

		object.lookAt( vector );

		targets.sphere.push( object );

	}

	// helix

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var theta = i * 0.175 + Math.PI;
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

		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
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