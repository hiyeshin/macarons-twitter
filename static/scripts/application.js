/////////////////////////////////////////////
////////////Shining Earth////////////////////
/////////////////////////////////////////////

$( document ).ready( function(){
	
	setupThree();
	addLights();
	addControls();

////this is earth group!
	window.group = new THREE.Object3D()

	//Let's draw earth
	window.earthRadius = 90
	window.earth = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/earthTexture.png' )
		})
	)
	earth.position.set( 0, 0, 0 )
	earth.receiveShadow = true
	earth.castShadow = true
	group.add( earth )


	//clouds
	window.clouds = new THREE.Mesh(
		new THREE.SphereGeometry( earthRadius + 2, 32, 32 ),
		new THREE.MeshLambertMaterial({ 
			map: THREE.ImageUtils.loadTexture( 'media/cloudsTexture.png' ),
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
	group.add( clouds )


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
	group.add( dropPin( 37.542672, 127.027308, 0x8edf9f)) //  Green is Han River, Seoul, South Korea
	group.add( dropPinhead( 37.542672, 127.027308, 0x8edf9f))

	group.add( dropPin( 13.4125, 103.866667, 0xd4b698)) //Beige is for Angkore Wat, Cambodia	
	group.add( dropPinhead( 13.4125, 103.866667, 0xd4b698 ))

	group.add( dropPin( 48.872224,2.303339, 0xeab8fa )) //Purple is for Laduree, Paris, France
	group.add( dropPinhead( 48.872224,2.303339, 0xeab8fa ))

	group.add( dropPin( 22.296372, 114.172469, 0xffffbf)) //yellow is Chungking mansion, Hong kong
	group.add( dropPinhead( 22.296372, 114.172469, 0xffffbf ))

	group.add( dropPin( 42.640278, 18.108333, 0x8df5ec))//Blue is Dubrovnik, Croatia
	group.add( dropPinhead( 42.640278, 18.108333, 0x8df5ec))

	scene.add( group );
	
	scene.add( moonGroup );
	moonGroup.add( moon );

	//  But also, did you want to start out looking at a different part of
	//  the Earth?

	group.rotation.y = ( -40 ).degreesToRadians()
	group.rotation.z = (  23 ).degreesToRadians()

	moon.rotation.y = ( 90 ).degreesToRadians()
	moon.rotation.z = (  45 ).degreesToRadians()

	loop()	
})




function loop(){

	//  Let's rotate the entire group a bit.
	//  Then we'll also rotate the cloudsTexture slightly more on top of that.

	group.rotation.y  += ( 0.10 ).degreesToRadians()
	clouds.rotation.y += ( 0.05 ).degreesToRadians()
	/*moon.rotation.y  += ( 0.50 ).degreesToRadians()

	moon.position.x += 0.3; 
	moon.position.z -= 0.3;
	*/
	moonGroup.rotation.y += ( 2 ).degreesToRadians()




	render()
	controls.update()
	
	window.requestAnimationFrame( loop )
}


//Let's drop the pins!
function dropPin( latitude, longitude, color ){

	var 
	group1 = new THREE.Object3D(),
	group2 = new THREE.Object3D(),
	markerLength = 36,
	marker = new THREE.Mesh(
		new THREE.CubeGeometry( 2, markerLength, 2 ),
		new THREE.MeshBasicMaterial({ 
			color: color, wireframe: true, side: THREE.DoubleSide
		})
	)	

	marker.position.y = earthRadius;
	

	group1.add( marker )
	group1.rotation.x = ( 90 - latitude  ).degreesToRadians()
	

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
		new THREE.SphereGeometry(8,8,8),
		new THREE.MeshLambertMaterial( { 
		color: color, shading: THREE.SmoothShading, overdraw: true } )
	)

	
	pinhead.position.y = earthRadius + 24;

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
	
	var
	WIDTH      = 600,
	HEIGHT     = 600,
	VIEW_ANGLE = 45,
	ASPECT     = WIDTH / HEIGHT,
	NEAR       = 0.1,
	FAR        = 10000
	
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

	controls.addEventListener( 'change', render )
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


