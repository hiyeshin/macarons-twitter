/**
 * macarons model by mkl mkl 
 * https://profiles.google.com/mmmklmail/about
 */
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


	// var chocolate;
	// var loader2 = new THREE.ColladaLoader();
	// loader2.load('models/chocolate_big.dae', function ( collada ){

	// 	window.chocolate = collada.scene;
	// 	chocolate.scale.x = chocolate.scale.y = chocolate.scale.z = 5;

	// 	chocolate.position.x = 120;
	// 	chocolate.position.y = -125;
	// 	chocolate.position.z = 0;

	// 	chocolate.updateMatrix();

	// 	});

	// 	moonGroup.add( chocolate );

	// })

	
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
 