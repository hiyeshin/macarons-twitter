var rose;
	window.loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( "models/rose.dae", function( collada ){
		rose = collada.scene;
		rose.scale.x = rose.scale.y = rose.scale.z = 15;
		rose.position.x = -210;
		rose.position.y = 210;
		rose.updateMatrix();
		// rose.receiveShadow = true;
		// rose.castShadow = true;
		console.log("rose macaron is ready");
	});