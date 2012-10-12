/////////////////////////////////////////////
////////////Shining Earth///////////////////
//////////////////////////////////////////


$( document ).ready( function(){
	
	setupThree();
	addLights();
	addControls();

	window.group = new THREE.Object3D()

	//  useful resource: http://www.celestiamotherlode.net/catalog/earth.php

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

	//	http://mrdoob.github.com/three.js/examples/webgl_materials_blending_custom.html

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

/*
	window.particleSystem = new THREE.ParticleSystem(
		new THREE.Geometry (),
		new THREE.ParticleBasicMaterial({
			color: 0xFFFFFF,
			map: ,
			size: 20,
			sizeAttenuation: ,
			vertexColors: true,
			fog: true;
		})


		)
	*/


	group.add( dropPin( 37.542672, 127.027308, 0xFF0000)) //  Red is Han River, Seoul, South Korea
	group.add( dropPinhead( 37.542672, 127.027308, 0xFF0000))

	group.add( dropPin( 13.4125, 103.866667, 0x00FF00 )) //Green is for Angkore Wat, Cambodia	
	group.add( dropPin( 48.872224,2.303339, 0xFF00FF )) //Purple is for Laduree, Paris, France
	group.add( dropPin( 22.296372, 114.172469, 0xFFFF00 )) //yellow is Chungking mansion, Hong kong
	group.add( dropPin( 42.640278, 18.108333, 0x00CCFF))//Blue is Dubrovnik, Croatia

	scene.add( group );

	//  But also, did you want to start out looking at a different part of
	//  the Earth?

	group.rotation.y = ( -40 ).degreesToRadians()
	group.rotation.z = (  23 ).degreesToRadians()


	loop()	
})




function loop(){

	//  Let's rotate the entire group a bit.
	//  Then we'll also rotate the cloudsTexture slightly more on top of that.

	group.rotation.y  += ( 0.10 ).degreesToRadians()
	clouds.rotation.y += ( 0.05 ).degreesToRadians()

	render()
	controls.update()
	
	window.requestAnimationFrame( loop )
}


function dropPin( latitude, longitude, color ){

	var 
	group1 = new THREE.Object3D(),
	group2 = new THREE.Object3D(),
	markerLength = 36,
	marker = new THREE.Mesh(
		new THREE.CubeGeometry( 2, markerLength, 2 ),
		new THREE.MeshBasicMaterial({ 
			color: color
		})
	)	

	marker.position.y = earthRadius;
	

	group1.add( marker )
	group1.rotation.x = ( 90 - latitude  ).degreesToRadians()
	

	group2.add( group1 )
	group2.rotation.y = ( 90 + longitude ).degreesToRadians()

	return group2
}

function dropPinhead( latitude, longitude, color ){

	var 
	group3 = new THREE.Object3D(),
	group4 = new THREE.Object3D(),

	pinhead = new THREE.Mesh(
		new THREE.SphereGeometry(10,10,10),
		new THREE.MeshBasicMaterial({
			color:color
		})
	)

	
	pinhead.position.y = earthRadius + 90;

	group3.add( pinhead )
	group3.rotation.x = ( 90 - latitude  ).degreesToRadians()
	

	group4.add( group3 )
	group4.rotation.y = ( 90 + longitude ).degreesToRadians()

	return group4
}


/*
function stars() = {
	//var group3 = new THREE.Object3D();

	var particleCount = 100,
	particles = new THREE.Geometry(),
	pMaterial = new THREE.ParticleBasicMaterial({color: 0xFFFFFF, size: 20});

	for (var p=0; p<particleCount; p++){
		var pX = Math.random()*500 -250,
			pY = Math.random()*500-250,
			pZ = Math.random()*500-250,
			particle = new THREE.Vertex(new THREE.Vector3(pX, pY, pZ));

		particles.vertices.push(particle); 
	}

	var particleSystem = new THREE.ParticleSystem(particles, pMaterial);

	scene.addChild(particleSystem);

	//return group3;
}
*/


/*

function texts(latitude, longitude, textText){
	var materialFront = new THREE.MeshBasicMaterial({color: 0xFF0000}),
		materialSide = new THREE.MeshBasicMaterial({color: 0x000088}),
		materialArray = [materialFront, materialSide];
		
	
	var textGeom = new THREE.TextGeometry("Seoul",{
		size: 30, height: 4, curveSegments: 3, font: "droid_sans", weight: "normal",
		bevelThickness: 1, bevelSize:2, bevelEnabled: true,
		material:0, extrudeMaterial:1
	});

	textGeom.materials = [materialFront, materialSide];
	var meshMaterial = new THREE.MeshBasicMaterial({color: 0xCC0000}),
		textMesh = new THREE.Mesh(textGeom, new THREE.MeshFaceMaterial() );

	textGeom.computeBoundingBox();

	var textWidth = textGeom.boundingBox.max.x - textGeom.boundingBox.min.x ;

	textMesh.position.set( -0.5 * textWidth, 50, 100);
	textMesh.rotation.x = -Math.PI / 4;
	scene.add (textMesh);
}
*/



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

	return new THREE.Vector3( x, y, z )
}

function setupThree(){
	
	window.scene = new THREE.Scene();
	
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

	//  Finally, create a Renderer to render the Scene we're looking at.
	//  A renderer paints our Scene onto an HTML5 Canvas from the perspective 
	//  of our Camera.
	
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



