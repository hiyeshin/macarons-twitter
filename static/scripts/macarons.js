	var rose, skin;

	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( 'models/rose.dae', function( collada ){
		rose = collada.scene;
		//skin = collada.skins[ 0 ];
		rose.scale.x = rose.scale.y = rose.scale.z = 25;
		rose.position.x = 100;
		//rose.position.y = 200;
		//rose.position.z = -210;
		rose.updateMatrix();
		// rose.receiveShadow = true;
		// rose.castShadow = true;
		console.log(rose);
		moonGroup.add( rose );
	});

	