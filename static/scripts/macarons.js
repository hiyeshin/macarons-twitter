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
	
	
		console.log(rose);
		moonGroup.add( rose );
	});

	