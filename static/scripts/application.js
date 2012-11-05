/////////////////////////////////////////////
////////////Macarons Earth ver 2.0////////////
/////////////////////////////////////////////
// http://www.adverblog.com/2011/11/29/webgl-twitter-visualizer-holographic-installation/
// Stewart's suggestions:
		//  1. Only shine the sun on the part of Earth that is actually
		//     currently experience daylight!
		//  2. Rotate the globe to face the tweet you’re plotting.
		//  3. Don’t just place the pin, but animate its appearance;
		//     maybe it grows out of the Earth?
		//  4. Display the contents of the tweet. I know, I know. We haven’t
		//     even talked about text in Three.js yet. That’s why you’d get
		//     über bragging rights.

//functions to think about:
//lookat.OBJECT3D (facing only a certain point)

//sunlight would be nicer if I use point light? (source: webGL book)

$( document ).ready( function(){
	
	setupThree();
	addLights();
	addControls();

	window.geocoder = new google.maps.Geocoder();

	window.tweets = [];
	window.tweetsIndex = -1; //what does it mean?
	window.timePerTweet = (3).seconds(); //setInterval(seconds)
	window.tweetApiArmed = true ; //if it's FALSE, we will only play with data.js file.
								 //which is not real-time deal.


/////Let's make a text group!!!//////////
/////thanks mark for teach me how to create text in an easy way!///
	window.textGroup = new THREE.Object3D();

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
	textGroup.add(twitterWord);

/////////////2. "+" sign
	window.plusSign = new THREE.Mesh(
		new THREE.TextGeometry("+", {
			size: 12, height: 5, curveSegments: 6, 
			font: "droid serif", 
			weight: "normal", style: "normal" 
		}),
		new THREE.MeshBasicMaterial({ 
			color:0xab7dec4, wireframe: true, side: THREE.DoubleSide
		})
	)

	plusSign.position.set (0,109,0);
	plusSign.receiveShadow = true;
	plusSign.castShadow = true;
	textGroup.add(plusSign);

//////////////3. "twitter"
	// window.twitterLogo = new THREE.Mesh(
	// 	new THREE.TextGeometry("twitter", {
	// 		size: 10, height: 5, curveSegments: 6, 
	// 		font: "droid sans", 
	// 		weight: "normal", style: "normal" 
	// 	}),
	// 	new THREE.MeshPhongMaterial({ 
	// 		color:0x45c4f6, wireframe: false, side: THREE.DoubleSide
	// 	})//Phong Material has a smooth, non-angular texture
	// )

	// twitterLogo.position.set (30,110,0);
	// twitterLogo.receiveShadow = true;
	// twitterLogo.castShadow = true;
	// textGroup.add(twitterLogo);


//twitter content trials
	// window.twitterContents = new THREE.Mesh(
	// 	new THREE.TextGeometry(window.tweetLocation, {
	// 		size: 10, height: 5, curveSegments: 6, 
	// 		font: "droid sans", 
	// 		weight: "normal", style: "normal" 
	// 	}),
	// 	new THREE.MeshPhongMaterial({ 
	// 		color:0x45c4f6, wireframe: false, side: THREE.DoubleSide
	// 	})//Phong Material has a smooth, non-angular texture
	// )

	// twitterContents.position.set (30,110,0);
	// twitterContents.receiveShadow = true;
	// twitterContents.castShadow = true;
	// textGroup.add(twitterContents);


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


//Let's add clouds to the earth group
//We are giving some transparency so earth is visible through the clouds
//Blender mode is used for this effect
	
	window.clouds = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius + 2, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
			//map: THREE.ImageUtils.loadTexture( 'media/cloudsTexture.png' ),
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


 ////this is Moon Group!!!
 //why do we need a new moonGroup that contains only a mesh?
 //by rotating a group, not a mesh, we can make our moon orbit to Earth,
 //not rotating itself standing in one position
	window.moonGroup = new THREE.Object3D()
	moonGroup.rotation.x = ( 10 ).degreesToRadians()

	//Let's draw moon
	window.moonRadius = 15;
	window.moon = new THREE.Mesh(
		new THREE.SphereGeometry (moonRadius, 32, 32),
		new THREE.MeshLambertMaterial ({
			map: THREE.ImageUtils.loadTexture ('media/moonTexture.png')

		})
	)
	var moonX = 180, moonY = 0, moonZ = 0;
	moon.position.set(moonX, moonY, moonZ);
	moon.receiveShadow = true;
	moon.castShadow = true;

	scene.add( textGroup );
	scene.add( earthGroup );
	scene.add( moonGroup );
	
	//  But also, did you want to start out looking at a different part of
	//  the Earth?
	earthGroup.rotation.x = 0.41
	//earthGroup.rotation.y = ( -40 ).degreesToRadians()
	//moon.rotation.y = Math.PI;
	//.rotation.y = Math.PI;
	//earthGroup.rotation.z = (  23 ).degreesToRadians()

	//moon.rotation.y = ( 90 ).degreesToRadians()
	//moon.rotation.z = (  45 ).degreesToRadians()
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

function loop(){

	earthGroup.rotation.y  += ( 0.10 ).degreesToRadians()
	clouds.rotation.y += ( 0.05 ).degreesToRadians()
	//rose.rotation.y  += ( 0.02 ).degreesToRadians()
	//moon.position.x += 0.3; 
	//moon.position.z -= 0.3;
	//marker.position.y += 0.3;
	
	moonGroup.rotation.y += ( 0.2 ).degreesToRadians()
	//moonGroup.rotation.x = +0.2;

	render();
	controls.update();
	
	window.requestAnimationFrame( loop );
}
	

//similar to dropPin
function tweetTwits( location ){
		var twitterContents = new THREE.Mesh(
			new THREE.TextGeometry( location, {
			size: 10, height: 5, curveSegments: 6, 
	 		font: "droid sans", 
	 		weight: "normal", style: "normal" 
	 	}),
	 	new THREE.MeshPhongMaterial({ 
	 		color:0x45c4f6, wireframe: false, side: THREE.DoubleSide
	 	}));

	 	twitterContents.position.set (30,110,0);
		twitterContents.receiveShadow = true;
		twitterContents.castShadow = true;
		textGroup.add(twitterContents);
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
	
	//marker stands straight around the center point in the beginning.
	//so we push the marker to the North Pole to stand on the surface.
	//while (marker.position.y <=  earthRadius){
	//marker.position.y += 0.05;
	//}
	marker.position.y = earthRadius;
	
	
	//then rotate towards the latitude
	group1.add( marker )
	group1.rotation.x = ( 90 - latitude  ).degreesToRadians()
	
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


	//  Here we’re going to use jQuery ($) to make an Ajax call to the simple
	//  version of Twitter’s API. Why the simple version? Because the simple
	//  version doesn’t require you to setup authorization, etc.
	//  Beware, this API version is deprecated so enjoy it while it lasts!

	//  Read more on Twitter’s API page:
	//  https://dev.twitter.com/docs/api/1

	console.log( '\n\nFetching fresh tweets from Twitter.' )
	$.ajax({

//		url: 'http://search.twitter.com/search.json?geocode=0,0,6400km',
//		url:"http://search.twitter.com/search.json?q=macaron&src=typd&geocode=0,0,6400km",
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
					tweets.push( tweet.location );
//					tweetAddress = window.tweet.location;

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
	var markerLength = 30;
	//markerLength += 1;
	
	if( tweetsIndex + 1 < tweets.length ){

		tweetsIndex ++

		earthGroup.add( dropPin(

			tweets[ tweetsIndex ].latitude,
			tweets[ tweetsIndex ].longitude,
			0x8df5ec,
			markerLength
		))

		textGroup.add( tweetTwits(
			tweets[ tweetsIndex ].latitude
		));

		earthGroup.add( dropPinhead(
			tweets[ tweetsIndex ].latitude,
			tweets[ tweetsIndex ].longitude,
			0x8df5cc
			//0x0000ff
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

	//these variables would define the dimensions of the camera's view
	var
	WIDTH      = window.innerWidth,
	HEIGHT     = window.innerHeight,
	VIEW_ANGLE = 45,
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1,
	FAR        = 6000;
	

	window.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR )
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
	scene.add( ambient )	
	
	// Now let's create a Directional light as our pretend sunshine.
	// Directional light has an infinite source.
	
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


	//references
	//point light: emanate from a particular position in all directions,
	//regardless of all positions
}	// spotlight: emanate from a partlcular position and in a specific directions

// vertex shader to draw three vertex skeleton
// fragment shader to draw the rest of trianglular plain inside of the three vertex
// (think as drawing color, texture and line)

// uniforms: for both of vertex and fragments shader. e.g. drawing light position
// tend to be single value
// attributes: for individual verteces. only for vertex
// should match attributes array and the number of vertices
// varings: originally for vertex but can be shared with fragments. e g . light calculation