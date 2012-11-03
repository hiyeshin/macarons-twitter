	var rose;

	var loader = new THREE.ColladaLoader();
	loader.options.convertUpAxis = true;
	loader.load( 'models/rose_big.dae', function( collada ){
		window.rose = collada.scene;
		//skin = collada.skins[ 0 ];
		rose.scale.x = rose.scale.y = rose.scale.z = 15;
		rose.position.x = 60;
		rose.position.y = 10;
		rose.position.z = 0;
		//rose.rotation.y = 50;
		rose.rotation.z = 50;
		rose.updateMatrix();
	
		console.log(rose);
		moonGroup.add( rose );
	});

	