//macarons models were found on the site below:
//http://sketchup.google.com/3dwarehouse/details?mid=f4dd41e502bea71db6fb0dc079377ea1&ct=mdrm

	var rose;

	var loader = new THREE.ColladaLoader();
	//loader.options.convertUpAxis = true;
	loader.load( 'models/strawberry_big.dae', function( collada ){
		window.rose = collada.scene;
		//skin = collada.skins[ 0 ];
		rose.scale.x = rose.scale.y = rose.scale.z = 5;
		rose.position.x = 20;
		rose.position.y = -125;
		rose.position.z = 0;
		rose.rotation.y = 50;
		//rose.rotation.z = 50;
		//rose.rotation.y  += ( 0.02 ).degreesToRadians()
		rose.updateMatrix();

		window.macaronsShadow = new THREE.SceneUtils.traverseHierarchy ( rose, function (child) {
			child.castShadow = true;
			child.receiveShadow = true;
		});
		
		moonGroup.add( rose );

	});


	// var phMacarons;
	

	// loader.load('models/chocolate_big.dae', function (collada ){
	// 	var group5 = new THREE.Object3D();
	// 	var group6 = new THREE.Object3D();

	// 	window.phMacarons = collada.scene;
	// 	phMacarons.scale.x = phMacarons.scale.y = phMacarons.scale.z = 1;
	// 	phMacarons.position.y = 105;

	// 	group5.add( phMacarons )
	//    	group5.rotation.x = ( 90 - latitude  ).degreesToRadians()
	

	// 	group6.add( group5 )
	// 	group6.rotation.y = ( 90 + longitude ).degreesToRadians()

	// 	return group6; 
	// })

	//


	//Let's draw moon
	// window.moonRadius = 15;
	// window.moon = new THREE.Mesh(
	// 	new THREE.SphereGeometry (moonRadius, 32, 32),
	// 	new THREE.MeshLambertMaterial ({
	// 		map: THREE.ImageUtils.loadTexture ('media/moonTexture.png')

	// 	})
	// )
	// var moonX = 180, moonY = 0, moonZ = 0;
	// moon.position.set(moonX, moonY, moonZ);
	// moon.receiveShadow = true;
	// moon.castShadow = true;
 