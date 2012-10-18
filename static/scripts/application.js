/////////////////////////////////////////////
////////////Shining Earth ver 2.0////////////////////
/////////////////////////////////////////////

//  https://api.twitter.com/1/account/rate_limit_status.json
// http://www.adverblog.com/2011/11/29/webgl-twitter-visualizer-holographic-installation/


$( document ).ready( function(){
	
	setupThree();
	addLights();
	addControls();

	window.geocoder = new google.maps.Geocoder();

	window.tweets = [];
	window.tweetsIndex = -1; //what does it mean?
	window.timePerTweet = (3).seconds(); // what does it mean?
	window.tweetApiArmed = true ; //if it's FALSE, we will only play with data.js file.
								 //which is not real-time deal.

////We are creating group to manipulate them more easily

////this is earth group

	window.earthGroup = new THREE.Object3D()

	//Let's draw earth
	window.earthRadius = 90
	window.earth = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/world.jpg' )
		})
	)
	earth.position.set( 0, 0, 0 )
	earth.receiveShadow = true;
	earth.castShadow = true;
	earthGroup.add (earth);


	//Let's add clouds to the earth group
	//We are giving some transparency so earth is visible through the clouds
	//Blender mode is used for this effect
	window.clouds = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius + 2, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/earthTexture.png' ),
			transparent: true,
			blending: THREE.CustomBlending,
			blendSrc: THREE.SrcAlphaFactor,
			blendDst: THREE.SrcColorFactor,
			blendEquation: THREE.AddEquation
		})
		//extra MeshLamnertMaterial parameters:
		//color, opacity, lightMap, reflectivity(float), wireframe, 
	)
	clouds.position.set( 0, 0, 0 )
	clouds.receiveShadow = true
	clouds.castShadow = true
	earthGroup.add( clouds )


 ////this is Moon Group!!!
	window.moonGroup = new THREE.Object3D()
	moonGroup.rotation.x = ( 20 ).degreesToRadians()

	//Let's draw moon
	window.moonRadius = 30;
	window.moon = new THREE.Mesh(
		new THREE.SphereGeometry (moonRadius, 100, 100),
		new THREE.MeshLambertMaterial ({
			map: THREE.ImageUtils.loadTexture ('media/moonTexture.png')
		})
	)
	var moonX = 200, moonY = 0, moonZ = 0;
	moon.position.set(moonX, moonY, moonZ)
	moon.receiveShadow = true;
	moon.castShadow = true;


	window.moonSatelliteRadius = 8 ; 
	window.moonSatellite = new THREE.Mesh(
		new THREE.SphereGeometry (moonSatelliteRadius, 8, 8),
		new THREE.MeshBasicMaterial({ 
			color:0xFFFFFF, wireframe: true, side: THREE.DoubleSide
		})
	) 
	moonSatellite.position.set (moonX + 130, moonY, moonZ);
	moonSatellite.receiveShadow = true;
	moonSatellite.castShadow = true;

	moonGroup.add (moonSatellite);

	/////////////////////////////////////////////////////
	//////////////particle experiments////////////////////////
	///////////////////////////////////////////////////
	//var particleCount = 180;
/*	
	window.particleSystem = new THREE.ParticleSystem(
    	new THREE.Geometry(),
    	new THREE.ParticleBasicMaterial({
        	color: 0xFFFFFF,
        	size: 5
    	  })
    	)
    
     
	// now create the individual particles
	for(var p = 0; p < 180; p++) {
 
 	 	var pX = Math.random() * 500 - 250,
    	  	pY = Math.random() * 500 - 250,
      		pZ = Math.random() * 500 - 250,
      		particle = new THREE.Vertex(
      	  new THREE.Vector3(pX, pY, pZ)
      	);
  		particleSystem.geometry.vertices.push(particle);
	}
	

	scene.add(particleSystem);
*/

/*
	earthGroup.add( dropPin( 37.542672, 127.027308, 0x8edf9f)) //  Green is Han River, Seoul, South Korea
	earthGroup.add( dropPinhead( 37.542672, 127.027308, 0x8edf9f))

	earthGroup.add( dropPin( 13.4125, 103.866667, 0xd4b698)) //Beige is for Angkore Wat, Cambodia	
	earthGroup.add( dropPinhead( 13.4125, 103.866667, 0xd4b698 ))

	earthGroup.add( dropPin( 48.872224,2.303339, 0xeab8fa )) //Purple is for Laduree, Paris, France
	earthGroup.add( dropPinhead( 48.872224,2.303339, 0xeab8fa ))

	earthGroup.add( dropPin( 22.296372, 114.172469, 0xffffbf)) //yellow is Chungking mansion, Hong kong
	earthGroup.add( dropPinhead( 22.296372, 114.172469, 0xffffbf ))

	earthGroup.add( dropPin( 42.640278, 18.108333, 0x8df5ec))//Blue is Dubrovnik, Croatia
	earthGroup.add( dropPinhead( 42.640278, 18.108333, 0x8df5ec))
*/
	scene.add( earthGroup );
	scene.add( moonGroup );
	moonGroup.add( moon );

	//  But also, did you want to start out looking at a different part of
	//  the Earth?

	earthGroup.rotation.y = ( -40 ).degreesToRadians()
	earthGroup.rotation.z = (  23 ).degreesToRadians()

	moon.rotation.y = ( 90 ).degreesToRadians()
	moon.rotation.z = (  45 ).degreesToRadians()


	moonSatellite.rotation.y = ( 90 ).degreesToRadians()
	moonSatellite.rotation.z = (  45 ).degreesToRadians()


	loop();

	//now is time for TWEETING!
	if ( tweetApiArmed ) fetchTweets();
	else {
		console.log( "This is not a real-time. Now we are processing data from database file. ");
		console.log ( "If we want real time data, we have to change TWEETAPIARMED variable");
		importTweets();
	}
	nextTweet();
})

///////////////////////////////////////////
//this is the function for real-time data// 
function fetchTweets(){


	//  Here we’re going to use jQuery ($) to make an Ajax call to the simple
	//  version of Twitter’s API. Why the simple version? Because the simple
	//  version doesn’t require you to setup authorization, etc.
	//  Beware, this API version is deprecated so enjoy it while it lasts!

	//  Read more on Twitter’s API page:
	//  https://dev.twitter.com/docs/api/1

	//  WARNING: With this API you are only allowed 150 requests per hour!!
	//  This is tracked by IP address, so be wary of testing on NYU’s network.
	//  You can check your rate limit status at anytime by pinging this
	//  address, most easily done by just visiting it in your browser:
	//  https://api.twitter.com/1/account/rate_limit_status.json

	console.log( '\n\nFetching fresh tweets from Twitter.' )
	$.ajax({

		url: 'http://search.twitter.com/search.json?geocode=0,0,6400km',


		//  We have to use the datatype 'JSONp' (JavaScript Object Notation with
		//  Padding) in order to safely fetch data that’s not coming from our own
		//  domain name. (Basically, side-stepping a browser security issue.)

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
					console.log( tweet.location )
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





function locateWithGoogleMaps( text ){	


	//  We also need to be wary of exceeding Google’s rate limiting.
	//  But Google seems to be much more forgiving than Twitter.
	//  If you want to be a good citizen you should sign up for a free 
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
	
	if( tweetsIndex + 1 < tweets.length ){

		tweetsIndex ++

		//  Ideas for you crazy kids to spruce up your homework:
		//  1. Only shine the sun on the part of Earth that is actually
		//     currently experience daylight!
		//  2. Rotate the globe to face the tweet you’re plotting.
		//  3. Don’t just place the pin, but animate its appearance;
		//     maybe it grows out of the Earth?
		//  4. Display the contents of the tweet. I know, I know. We haven’t
		//     even talked about text in Three.js yet. That’s why you’d get
		//     über bragging rights.

		earthGroup.add( dropPin(

			tweets[ tweetsIndex ].latitude,
			tweets[ tweetsIndex ].longitude,
			0x8df5ec
		));

		earthGroup.add( dropPinhead(
			tweets[ tweetsIndex ].latitude,
			tweets[ tweetsIndex ].longitude,
			0x8df5ec
		));
		

		//  I’m trying to be very mindful of Twitter’s rate limiting.
		//  Let’s only try fetching more tweets only when we’ve exhausted our
		//  tweets[] array supply.
		//  But leave this commented out when testing!
		
		//if( tweetsIndex === tweets.length - 1 ) fetchTweets()
	}	
	setTimeout( nextTweet, timePerTweet )
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

function loop(){

	//  Let's rotate the entire group a bit.
	//  Then we'll also rotate the cloudsTexture slightly more on top of that.

	earthGroup.rotation.y  += ( 0.10 ).degreesToRadians()
	clouds.rotation.y += ( 0.05 ).degreesToRadians()
	moon.rotation.y  += ( 0.50 ).degreesToRadians()
	moon.position.x += 0.3; 
	moon.position.z -= 0.3;
	
	moonGroup.rotation.y += ( 2 ).degreesToRadians()

	render();
	controls.update();
	
	window.requestAnimationFrame( loop );
}

//Let's drop the pins!
function dropPin( latitude, longitude, color ){

	var 
	group1 = new THREE.Object3D(),
	group2 = new THREE.Object3D(),
	markerLength = 36,
	marker = new THREE.Mesh(
		new THREE.CubeGeometry( 1, markerLength, 1 ),
		new THREE.MeshBasicMaterial({ 
			color: color, wireframe: true, side: THREE.DoubleSide
		})
	)	
	//marker stands straight around the center point in the beginning.
	//so we push the marker to the North Pole to stand on the surface.

	marker.position.y = earthRadius;
	
	
	//then rotate towards the latitude
	group1.add( marker )
	group1.rotation.x = ( 90 - latitude  ).degreesToRadians()
	
	//and then rotate followed by the longitude
	group2.add( group1 )
	group2.rotation.y = ( 90 + longitude ).degreesToRadians()

	return group2
}


//Let's make some pinhead
function dropPinhead( latitude, longitude, color ){

	var 
	group3 = new THREE.Object3D(),
	group4 = new THREE.Object3D(),

	pinhead = new THREE.Mesh(
		new THREE.SphereGeometry(4,4,4),
		new THREE.MeshLambertMaterial( { 
		color: color, shading: THREE.SmoothShading, overdraw: true } )
	)

	
	pinhead.position.y = earthRadius + 16;

	group3.add( pinhead )
	group3.rotation.x = ( 90 - latitude  ).degreesToRadians()
	

	group4.add( group3 )
	group4.rotation.y = ( 90 + longitude ).degreesToRadians()

	return group4;
}

//  Why separate this simple line of code from the loop() function?
//  So that our controls can also call it separately.

function render(){
	renderer.render( scene, camera )
}

//  I'll leave this in for the moment for reference, but it seems to be
//  having some issues ...

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
	//window.scene.fog = new THREE.FogExp2( 0x000000, 0.001 );
	
	//these variables would define the dimensions of the camera's view
	var
	WIDTH      = 600,
	HEIGHT     = 600,
	VIEW_ANGLE = 45,
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1,
	FAR        = 10000;
	
	window.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR )
	camera.position.set( 0, 0, 300 )
	camera.lookAt( scene.position )
	scene.add( camera )

	
	window.renderer = new THREE.WebGLRenderer({ antialias: true })
	//window.renderer = new THREE.CanvasRenderer({ antialias: true })
	renderer.setSize( WIDTH, HEIGHT )
	renderer.shadowMapEnabled = true
	renderer.shadowMapSoft = true


	//  In previous examples I've used the direct JavaScript syntax of
	//  document.getElementById( 'three' ).appendChild( renderer.domElement )
	//  but now that we're using the jQuery library in this example we can
	//  take advantage of it:	

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
	
	var
	ambient,
	directional
		
	//  Let's create an Ambient light so that even the dark side of the 
	//  earth will be a bit visible. 
	
	ambient = new THREE.AmbientLight( 0x666666 )
	scene.add( ambient )	
	
	
	//  Now let's create a Directional light as our pretend sunshine.
	
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
}


