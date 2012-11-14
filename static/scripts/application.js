/////////////////////////////////////////////
////////////Macarons Earth ver 2.0////////////
/////////////////////////////////////////////
// inspiration
// http://www.adverblog.com/2011/11/29/webgl-twitter-visualizer-holographic-installation/
// things to be done immediately:
// 1. introduction to keyboard keys
// 2. appropriate font
// 3. fixing duplicate geolocation

// Stewart's suggestions:
		//  2. Rotate the globe to face the tweet you’re plotting.
		//  3. Don’t just place the pin, but animate its appearance;
		//     maybe it grows out of the Earth?
		
		//mark's suggestion: make the last text's opacity as 0. 
		// it works!

	//functions to think about:
	//lookat.OBJECT3D (facing only a certain point) for the pinpoint?

	//sunlight would be nicer if I use point light? (source: webGL book)

/**
 * macarons model by mkl mkl 
 * https://profiles.google.com/mmmklmail/about
 */


$( document ).ready( function(){

	setupThree();
	addLights();
	addControls();

	window.geocoder = new google.maps.Geocoder();

	window.tweets = [];
	window.tweetsAddress = [];

	window.tweetsIndex = -1; //what does it mean?
	window.tweetsAddressIndex = -1;

	window.timePerTweet = (3).seconds(); //setInterval(seconds)
	window.tweetApiArmed = true ; //if it's FALSE, we will only play with data.js file.

/////Let's make a text group!!!//////////
/////thanks mark for teach me how to create text in an easy way!///
	window.textGroup1 = new THREE.Object3D();
	textGroup1.matrixAutoUpdate = false;


	window.textGroup2 = new THREE.Object3D();
	//textGroup2.matrixAutoUpdate = false;

//////////1. twitter search word: currently macarons ///////////////////
	window.twitterWord = new THREE.Mesh(
		new THREE.TextGeometry("macarons", {
			size: 10, height: 5, curveSegments: 6, 
			font: "droid serif", 
			weight: "bold", style: "normal" 
		}),
		new THREE.MeshBasicMaterial({ 
			color:0xf3d9f5, wireframe: false, side: THREE.DoubleSide
		})
	)

	twitterWord.position.set (-90,110,0);
	twitterWord.receiveShadow = true;
	twitterWord.castShadow = true;
	textGroup1.add(twitterWord);

/////////////2. "+" sign
	window.plusSign = new THREE.Mesh(
		new THREE.TextGeometry("in", {
			size: 10, height: 5, curveSegments: 6, 
			font: "droid serif", 
			weight: "normal", style: "normal" 
		}),
		new THREE.MeshBasicMaterial({ 
			color:0xab7dec4, wireframe: true, side: THREE.DoubleSide
		})
	)

	plusSign.position.set (-5,110,0);
	plusSign.receiveShadow = true;
	plusSign.castShadow = true;
	textGroup1.add(plusSign);



///this is earth group

	window.earthGroup = new THREE.Object3D()

	//Let's draw earth
	window.earthRadius = 90
	window.earth = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius, 32, 32 ), //default radius is 50, segmentWidth, segmentHeight
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/kubr.jpg' )
		})
	)
	earth.position.set( 0, 0, 0 )
	earth.receiveShadow = true;
	earth.castShadow = true;
	earthGroup.add(earth);
	//In MeshLambertMaterial, the apparent brightness of the surface to
	//an observer is the same regardless of the observer's angle of view

	window.clouds = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius + 2, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/world.jpg' ),
			transparent: true,
			blending: THREE.CustomBlending,
			blendSrc: THREE.SrcAlphaFactor,
			blendDst: THREE.SrcColorFactor,
			blendEquation: THREE.AddEquation
		})
	)
	clouds.position.set( 0, 0, 0 )
	clouds.receiveShadow = true
	clouds.castShadow = true
	earthGroup.add( clouds )


 ////this is Moon Group where our macarons live
 
	window.moonGroup = new THREE.Object3D()
	moonGroup.rotation.x = ( 10 ).degreesToRadians()

	scene.add( textGroup1 );
	scene.add( textGroup2 );
	scene.add( earthGroup );
	scene.add( moonGroup );

	earthGroup.rotation.x = 0.41;

	loop();

	//now is time for TWEETING!
	if ( tweetApiArmed ) {
		fetchTweets();
		fetchTweetsAddress();
	}

	else {
		console.log( "This is not a real-time. Now we are processing data from database file. ");
		console.log ( "If we want real time data, we have to change TWEETAPIARMED variable");
		importTweets();
		importTweetsAddress();
	}

	nextTweet();
	console.log(tweetsAddress);
})


function loop(){

	earthGroup.rotation.y  += ( 0.10 ).degreesToRadians();
	clouds.rotation.y += ( 0.05 ).degreesToRadians();

	moonGroup.rotation.y += ( 0.2 ).degreesToRadians();

	textGroup2.position.z -= 0.33;

	render();
	controls.update();
	window.requestAnimationFrame( loop );
	
}


//similar to dropPin
function tweetTwits( location ){
		window.twitterContents = new THREE.Mesh(
			new THREE.TextGeometry( location , {
			size: 10, height: 5, curveSegments: 6, 
	 		font: "droid sans", 
	 		weight: "normal", style: "normal" 
	 	}),
	 	new THREE.MeshPhongMaterial({ 
	 		color:0x45c4f6, wireframe: false, side: THREE.DoubleSide, opacity: 1.0
	 	}));

	 	twitterContents.position.set (25,109,0);
		twitterContents.receiveShadow = true;
		twitterContents.castShadow = true;

		twitterContents.position.z = textGroup2.position.z * -1

		textGroup2.add(twitterContents);

}


//Let's drop the pins!
function dropPin( latitude, longitude, color, markerLength ){

	var 
	group1 = new THREE.Object3D(),
	group2 = new THREE.Object3D(),
	marker = new THREE.Mesh(
		new THREE.CubeGeometry( 1, markerLength, 1 ),
		new THREE.MeshBasicMaterial({ 
			color: color, wireframe: true, side: THREE.DoubleSide
		}
		)
	)	

	marker.position.y = earthRadius;


	//then rotate towards the latitude
	group1.add( marker )
	group1.rotation.x = ( 90 - latitude ).degreesToRadians()

	//and then rotate followed by the longitude
	group2.add( group1 )
	group2.rotation.y = ( 90 + longitude ).degreesToRadians()

	return group2
}


function dropPinhead( latitude, longitude, color ){

	var 
	group3 = new THREE.Object3D(),
	group4 = new THREE.Object3D(),

	pinhead = new THREE.Mesh(
		new THREE.SphereGeometry(3,3,3),
		new THREE.MeshLambertMaterial( { 
		color: color, shading: THREE.SmoothShading, overdraw: true } )
	)

	pinhead.position.y = earthRadius + 15;

	group3.add( pinhead )
	group3.rotation.x = ( 90 - latitude  ).degreesToRadians()


	group4.add( group3 )
	group4.rotation.y = ( 90 + longitude ).degreesToRadians()

	return group4;
}

//  Why separate this simple line of code from the loop() function?
//  So that our controls can also call it separately.

function render(){
	renderer.autoClear = false;
	renderer.clear();

	renderer.render(bgScene,bgCam);
	renderer.render( scene, camera );

}

///////////////////////////////////////////
//this is the function for real-time data// 
function fetchTweets(){

	console.log( '\n\nFetching fresh tweets from Twitter.' )
	$.ajax({

		url:"http://search.twitter.com/search.json?q=macaron&geocode=0,0,6400km",

		dataType: 'jsonp',
		success: function( data ){

			console.log( 'Received the following data from Twitter:' )
			console.log( data )

			//  If you check the console we’ve just ouput the Twitter data,
			//  and the tweets themselves are stored in the data.results[]
			//  array which we will loop through now:

			data.results.forEach( function( tweet, i ){

				console.log( '\nInspecting tweet #'+ (i+1) +' of '+ data.results.length +'.' )
				if( tweet.geo && 
					tweet.geo.coordinates && 
					tweet.geo.coordinates.type === 'Point' ){

					console.log( 'Yay! Twitter had the latitude and longitude:' )
					console.log( tweet.geo )
					tweets.push({

						latitude:  tweet.geo.coordinates[ 0 ],
						longitude: tweet.geo.coordinates[ 1 ]

					})
				}
				else if( tweet.location ){

					console.log( 'At least the name of the location found. will try Google Maps for:' )
					setTimeout( function(){
						locateWithGoogleMaps( tweet.location )
					}, i * timePerTweet.divide(2).round() )
				}
				else if( tweet.iso_language_code ){

					console.log( 'Non-English data: Resorting to the ISO language code as last hope:' )
					console.log( tweet.iso_language_code )
					setTimeout( function(){
						locateWithGoogleMaps( tweet.iso_language_code )
					}, i * timePerTweet.divide(2).round() )
				}
				else {

					console.log( ':( We couldn’t find any useful data in this tweet.' )
				}
			})
		},
		error: function(){

			console.log( 'Oops. Something went wrong requesting data from Twitter.' )
		}
	})
}

function fetchTweetsAddress(){

	$.ajax({
		url:"http://search.twitter.com/search.json?q=macaron&geocode=0,0,6400km",

		dataType: 'jsonp',
		success: function( dataAddress ){
			console.log( dataAddress )

			dataAddress.results.forEach( function( tweet, i ){

				if( tweet.location ){
					tweetsAddress.push(tweet.location);
					setTimeout( function(){
						locateWithGoogleMaps( tweet.location )
					}, i * timePerTweet.divide(2).round() )
				}
			})
		},
		error: function(){

			console.log( 'Oops. Something went wrong requesting data from Twitter.' )
		}
	})
}


function locateWithGoogleMaps( text ){	
	//  API key and include that key in your HTML file. How? See here:
	//  https://developers.google.com/maps/documentation/javascript/tutorial

	//  For more on the geocoding service that we’re using see here:
	//  https://developers.google.com/maps/documentation/javascript/geocoding

	geocoder.geocode( { 'address': text }, function( results, status ){

		if( status == google.maps.GeocoderStatus.OK ){

			console.log( '\nGoogle maps found a result for “'+ text +'”:' )
			console.log( results[0].geometry.location )
			tweets.push({

				latitude:  results[0].geometry.location.lat(),
				longitude: results[0].geometry.location.lng()
			})
		} 
		else {

			console.log( '\nNOPE. Even Google cound’t find “'+ text +'.”' )
			console.log( 'Status code: '+ status )
		}
	})
}



function nextTweet(){
	var markerLength = 30;

	if( tweetsIndex + 1 < tweets.length  ){

		tweetsIndex ++;


		earthGroup.add( dropPin(
			tweets[ tweetsIndex ].latitude,
			tweets[ tweetsIndex ].longitude,
			0x8df5ec,
			markerLength
		));

		earthGroup.add( dropPinhead(
			tweets[ tweetsIndex ].latitude,
			tweets[ tweetsIndex ].longitude,
			0x8df5cc
		));

		textGroup2.add( tweetTwits(
		 	tweetsAddress[ tweetsIndex ]

		))
		
		timeMachine([tweetsIndex]);

		textGroup2.updateMatrix();

		//if( tweetsIndex === tweets.length - 1 ) fetchTweets() // Let’s only try fetching more tweets only when we’ve exhausted ou tweets[] array supply.
	}




	
	//setTimeout( scene.remove( tweetTwits(tweetsAddress[ tweetsIndex ] )), 2000);
	setTimeout( fadeOut, 3500 );
	setTimeout( nextTweet, 3500 );
	//scene.remove(tweetTwits(tweetsAddress[ tweetsIndex ] ));
}


function fadeOut(){
	twitterContents.material.opacity = 0.25;
}

function timeMachine(retro){
	twitterContents.position.z -= - (15 * retro) ;
}
 

function exportTweets(){

	//  Another way to be mindful of rate limiting is to PLAN AHEAD.
	//  Why not save out this data you’ve already acquired?
	//  This will dump your tweet data into the console for you
	//  so you can copy + paste it into your /scripts/database.js file.

	var data = 'database = database.concat(['
	tweets.forEach( function( tweet, i ){

		data += '\n	{'
		data += '\n		latitude:  '+ tweet.latitude +','
		data += '\n		longitude: '+ tweet.longitude
		data += '\n	}'
		if( i < tweets.length - 1 ) data += ','
	})
	data += '\n])'
	console.log( data )
}

//If we export the data and then save it into the database file,
//then we can use that data here.
function importTweets(){
	tweets = tweets.concat(database);
}

 // I'll leave this in for the moment for reference, but it seems to be
 // having some issues ...



 // function exportTweetsAddress(){
 // 	var dataAddress = 'databaseAddress = databaseADdress.concat(['
 // 	tweetsAddress.forEach(function(tweet, i){
 // 		dataAddress += '\n {'
 // 		dataAddress += '\n location: ' + tweet.tweetAddress
 // 		dataAddress += '\n }'
 // 		if (i < tweetsAddress.length -1 ) dataAddress += ','
 // 	})
 // 	dataAddress += '\n])'
	// console.log (dataAddress)
 // }

 // function importTweetsAddress(){
 // 	tweetsAddress = tweetsAddress.concat(databaseAddress);
 // }




function surfacePlot( params ){

	params = cascade( params, {} )
	params.latitude  = cascade( params.latitude.degreesToRadians(),  0 )
	params.longitude = cascade( params.longitude.degreesToRadians(), 0 )
	params.center    = cascade( params.center, new THREE.Vector3( 0, 0, 0 ))
	params.radius    = cascade( params.radius, 60 )

	var
	x = params.center.x + params.latitude.cosine() * params.longitude.cosine() * params.radius,
	y = params.center.y + params.latitude.cosine() * params.longitude.sine()   * params.radius,
	z = params.center.z + params.latitude.sine()   * params.radius

	return new THREE.Vector3( x, y, z );
}


function setupThree(){
	window.scene = new THREE.Scene();

	var
	WIDTH      = window.innerWidth,
	HEIGHT     = window.innerHeight,
	VIEW_ANGLE = 45,   //should be between 0 and 180. really small number can behave as a zoom lens. larger number behave like a IMAX lens
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1, 	//usually default value is 0.1
	FAR        = 6000; //because we don't have to render something too far away that is not even visible
						// there is no limitation when it comes to far value. but the farther, the more processing
						// usually 1000 to million


	window.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR )
	//orthographic camera trial
	//window.camera = new THREE.OrthographicCamera( WIDTH / - 2, WIDTH / 2, HEIGHT / 2, HEIGHT / - 2, 1, 1000 );
	
	camera.position.set(0,0, 300 )
	camera.lookAt( scene.position )
	scene.add( camera )

	window.bg = new THREE.Mesh(
		new THREE.PlaneGeometry(2,2,0),
		new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture( 'media/starfieldwide.png' )
		})
	);

	bg.material.depthTest = false;
	bg.material.depthWrite = false;

	window.bgScene = new THREE.Scene();
	window.bgCam = new THREE.Camera();
	bgScene.add(bgCam);
	bgScene.add(bg);

	window.renderer = new THREE.WebGLRenderer({ antialias: true })
	renderer.setSize( window.innerWidth, window.innerHeight )
	renderer.shadowMapEnabled = true
	renderer.shadowMapSoft = true

	//  document.getElementById( 'three' ).appendChild( renderer.domElement )
	$( '#three' ).append( renderer.domElement )

}


function addControls(){

	window.controls = new THREE.TrackballControls( camera )

	controls.rotateSpeed = 1.0
	controls.zoomSpeed   = 1.2
	controls.panSpeed    = 0.8

	controls.noZoom = false
	controls.noPan  = false
	controls.staticMoving = true
	controls.dynamicDampingFactor = 0.3
	controls.keys = [ 65, 83, 68 ]//  ASCII values for A, S, and D

	controls.addEventListener( 'change', render );
}


function addLights(){

	var ambient, directional;

	ambient = new THREE.AmbientLight( 0xBBBBBB )
	// ambient light: has a position parameter but doesn't really matter. think as the sun.
	// it's good for making as a baseline light to everything look visible
	scene.add( ambient )	

	// Now let's create a Directional light as our pretend sunshine.
	// Directional light has an infinite source.

	//directional light does not have a particular position. (not an one source.)
	//just pushing to one direction and everything starts to illuminate. think as a plane reflector on video shooting

	directional = new THREE.DirectionalLight( 0xCCCCCC )
	directional.castShadow = true;
	scene.add( directional );

	directional.position.set( 100, 200, 300 )
	directional.target.position.copy( scene.position )
	directional.shadowCameraTop     =  600
	directional.shadowCameraRight   =  600
	directional.shadowCameraBottom  = -600
	directional.shadowCameraLeft    = -600
	directional.shadowCameraNear    =  600
	directional.shadowCameraFar     = -600
	directional.shadowBias          =   -0.0001
	directional.shadowDarkness      =    0.3
	directional.shadowMapWidth      = directional.shadowMapHeight = 2048
	//directional.shadowCameraVisible = true

	// orthographic camera : losing the depth but there's no skew(oblique angle)
	//
	//references
	//point light: emanate from a particular position in all directions. most realistic. think about a bare bulb
	// not directional. more like all direction
	//regardless of all positions

}	// spotlight: emanate from a partlcular position and in a specific directions
	//has a point source position and target position.


	//vector has magnititude: hw far it can travel1

	//matt texture: if there's low specular area and high scattering, it will look like a matt texture

	