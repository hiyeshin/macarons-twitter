var fontSize = 14;

var lettersPerSide = 14;

var c = document.createElement('canvas');
c.width = 200;
c.height = window.innerHeight;
var ctx = c.getContext('2d');
ctx.font = fontSize + 'px Monospace';

//for aligning the letters. called magic number
var yOffset = -0.25;

for (var i = 0, y = 0; y< lettersPerSide; y ++){
	for (var x = 0; x< lettersPerSide; x++, i++){
		var ch = string.fromCharCode(i);
		ctx.fillText(ch, x*fontSize, yOffset*fontSize + (y+1) * fontSize );
	}
}

var tex = new THREE.Texture(c);
tex.needsUpdate = true;

var geo = new THREE.Geometry();
var v3 = function (x,y,z){
	return new THREE.Vertex( new THREE.Vector3(x,y,z));
};

var i = 0, x = 0, line = 0;
for (i=0; i<lettersPerside * lettersPerside){
	code = 0;
}
var cx = code % lettersPerSide;
var cy = Math.floor(code / lettersPerSide);

var v,t;
geo.vertices.push(
	v3 ( x* 1.1 + 0.05, line * 1.1 + 0.05, 0),
	v3 ( x* 1.1 + 0.05, line * 1.1 + 0.05, 0),
	v3 ( x* 1.1 + 0.05, line * 1.1 + 0.05, 0),
	v3 ( x* 1.1 + 0.05, line * 1.1 + 0.05, 0)
	);

	var face = new THREE].Face4 ( i*4 + 0, i* 4+1, i*4+2, i*4+3);
	geo.faces.push(face);

	var tx = cx/lettersPerSide, ty = cy/lettersPerSide, off = 1/lettersPerSide;
	var sz = lettersPerSide * fontSize;
	geo.faceVertexUvs[0].push([
		 new THREE.UV( tx, ty+off ),
    new THREE.UV( tx+off, ty+off ),
    new THREE.UV( tx+off, ty ),
    new THREE.UV( tx, ty )
  ]);

  // On newline, move to the line below and move the cursor to the start of the line.
  // Otherwise move the cursor to the right.
  if (code == 10) {
    line--;
    x=0;
  } else {
    x++;
  }
}

varying float vUv;

void main() {
  // modelViewMatrix, position and projectionMatrix are magical
  // attributes that Three.js defines for us.

  // Transform current vertex by the modelViewMatrix
  // (bundled model world position & camera world position matrix).
  vec4 mvPosition = modelViewMatrix * position;

  // Project camera-space vertex to screen coordinates
  // using the camera's projection matrix.
  vec4 p = projectionMatrix * mvPosition;

  // uv is another magical attribute from Three.js.
  // We're passing it to the fragment shader unchanged.
  vUv = uv;

  gl_Position = p;
}

uniform float uTime;
uniform float uEffectAmount;

varying float vZ;
varying vec2 vUv;

// rotateAngleAxisMatrix returns the mat3 rotation matrix 
// for given angle and axis.
mat3 rotateAngleAxisMatrix(float angle, vec3 axis) {
  float c = cos(angle);
  float s = sin(angle);
  float t = 1.0 - c;
  axis = normalize(axis);
  float x = axis.x, y = axis.y, z = axis.z;
  return mat3(
    t*x*x + c,    t*x*y + s*z,  t*x*z - s*y,
    t*x*y - s*z,  t*y*y + c,    t*y*z + s*x,
    t*x*z + s*y,  t*y*z - s*x,  t*z*z + c
  );
}

// rotateAngleAxis rotates a vec3 over the given axis by the given angle and
// returns the rotated vector.
vec3 rotateAngleAxis(float angle, vec3 axis, vec3 v) {
  return rotateAngleAxisMatrix(angle, axis) * v;
}

void main() {
  // Compute the index of the letter (assuming 80-character max line length).
  float idx = floor(position.y/1.1)*80.0 + floor(position.x/1.1);

  // Round down the vertex coords to find the bottom-left corner point of the letter.
  vec3 corner = vec3(floor(position.x/1.1)*1.1, floor(position.y/1.1)*1.1, 0.0);

  // Find the midpoint of the letter.
  vec3 mid = corner + vec3(0.5, 0.5, 0.0);

  // Rotate the letter around its midpoint by an angle and axis dependent on
  // the letter's index and the current time.
  vec3 rpos = rotateAngleAxis(idx+uTime, 
    vec3(mod(idx,16.0), -8.0+mod(idx,15.0), 1.0), position - mid) + mid;

  // uEffectAmount controls the amount of animation applied to the letter.
  // uEffectAmount ranges from 0.0 to 1.0.
  float effectAmount = uEffectAmount;

  vec4 fpos = vec4( mix(position,rpos,effectAmount), 1.0 );
  fpos.x += -35.0;

  // Apply spinning motion to individual letters.
  fpos.z += ((sin(idx+uTime*2.0)))*4.2*effectAmount;
  fpos.y += ((cos(idx+uTime*2.0)))*4.2*effectAmount;

  vec4 mvPosition = modelViewMatrix * fpos;

  // Apply wavy motion to the entire text.
  mvPosition.y += 10.0*sin(uTime*0.5+mvPosition.x/25.0)*effectAmount;
  mvPosition.x -= 10.0*cos(uTime*0.5+mvPosition.y/25.0)*effectAmount;

  vec4 p = projectionMatrix * mvPosition;

  // Pass texture coordinates and the vertex z-coordinate to the fragment shader.
  vUv = uv;
  vZ = p.z;

  // Send the final vertex position to WebGL.
  gl_Position = p;
}

// First, set up uniforms for the shader.
var uniforms = {

  // map contains the letter map texture.
  map: { type: "t", value: 1, texture: tex },

  // uTime is the urrent time.
  uTime: { type: "f", value: 1.0 },

  // uEffectAmount controls the amount of animation applied to the letters.
  uEffectAmount: { type: "f", value: 0.0 }
};

// Next, set up the THREE.ShaderMaterial.  
var shaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,

  // I have my shaders inside HTML elements like
  // <script id="vertex" type="text/x-glsl-vert">... shaderSource ... <script>

  // The below gets the contents of the vertex shader script element.
  vertexShader: document.querySelector('#vertex').textContent,

  // The fragment shader is a bit special as well, drawing a rotating
  // rainbow gradient.
  fragmentShader: document.querySelector('#fragment').textContent
});

// I set depthTest to false so that the letters don't occlude each other.
shaderMaterial.depthTest = false;

// I'm controlling the uniforms through a proxy control object.
// The reason I'm using a proxy control object is to
// have different value ranges for the controls and the uniforms.
var controller = {
  effectAmount: 0
};

// I'm using DAT.GUI to do a quick & easy GUI for the demo.
var gui = new dat.GUI();
gui.add(controller, 'effectAmount', 0, 100);

var animate = function(t) {
  uniforms.uTime.value += 0.05;
  uniforms.uEffectAmount.value = controller.effectAmount/100;
  bookModel.position.y += 0.03;

  renderer.render(scene, camera);
  requestAnimationFrame(animate, renderer.domElement);
};
animate(+new Date);