

var renderer, scene, camera, cubo;
var cameraControls;
var angulo = -0.01;
var time = to_rad(90)

const robot_controls = {
  base_angle: 0,
  arm_angle: 0,
  forearm_angle_y: 0,
  forearm_angle_z: 0,
  claw_angle: 0,
  claw_separation: 10,
  auto_animate: true,
}

init();
const axesHelper = new THREE.AxesHelper( 1000 );
scene.add(axesHelper);
//loadCubo(1);
loadArrow();
//loadStair(10);
//loadCacharroEjemploPract2()
brazo_robot = loadBrazoRobot()
console.log(brazo_robot)
console.log(brazo_robot.children)
scene.add(brazo_robot)


render();

document.addEventListener('keypress', (event) => {
  switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
          brazo_robot.position.x += 1
          break;
      case 'ArrowDown':
      case 'KeyS':
          brazo_robot.position.x -= 1
          break;
      case 'ArrowLeft':
      case 'KeyA':
          brazo_robot.position.z += 1
          break;
      case 'ArrowRight':
      case 'KeyD':
          brazo_robot.position.z -= 1
          break;
  }
});



function init()
{
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  document.getElementById('container').appendChild( renderer.domElement );

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 75, aspectRatio , 0.1, 10000 );
  camera.position.set( 350, 350, 270 );
  camera.lookAt(5,5,5);

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 0, 0 );

  window.addEventListener('resize', updateAspectRatio );

  var gui = new dat.GUI()
  var gui_rotation = gui.addFolder('Rotacion')
  gui_rotation.add(robot_controls, 'base_angle', -180, 180).name('Giro base').listen()
  gui_rotation.add(robot_controls, 'arm_angle', -45, 45).name('Giro brazo').listen()
  gui_rotation.add(robot_controls, 'forearm_angle_y', -180, 180).name('Giro antebrazo Y').listen()
  gui_rotation.add(robot_controls, 'forearm_angle_z', -90, 90).name('Giro antebrazo Z').listen()
  gui_rotation.add(robot_controls, 'claw_angle', -40, 220).name('Giro pinza').listen()
  gui_rotation.add(robot_controls, 'claw_separation', 0, 15).name('Separación pinza').listen()
  gui_rotation.add(robot_controls, 'auto_animate',true, false).name('Auto animar').listen()
  gui_rotation.open()
}

function loadArrow()
{
  const shaftMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const tipsMaterial = new THREE.MeshBasicMaterial( {color: 0xff0000} );

  flecha = new THREE.Object3D()

  
  let shaftGeo = new THREE.CylinderGeometry(1, 1, 10, 32);
  let shaft = new THREE.Mesh(shaftGeo, shaftMaterial);

  let tipGeo = new THREE.ConeGeometry(2, 4, 32);

  let tip = new THREE.Mesh(tipGeo, tipsMaterial);
  let bot = new THREE.Mesh(tipGeo, tipsMaterial);

  // los objetos se crean con 0,0,0 como centro.
  // Para conectar la flecha, hay que moverla a un extremo del
  // shaft

  tip.position.y = 5
  bot.position.y = -5

  //...y rotar bottom
  //                Eje X                     Theta
  bot.rotateOnAxis( new THREE.Vector3(1,0,0), -Math.PI);

  flecha.add(tip);
  flecha.add(shaft);
  flecha.add(bot);

  scene.add(flecha)
}

function loadCacharroEjemploPract2() {

  let cacharro = new THREE.Object3D()

  let mat = new THREE.MeshNormalMaterial();
  let baseMat = new THREE.MeshBasicMaterial({color: 'green'})

  let planeGeo = new THREE.PlaneGeometry(100, 100, 100, 32);
  let baseGeo = new THREE.CylinderGeometry(2, 2, 2, 32);
  let mastGeo = new THREE.BoxGeometry(1, 10, 1);
  let topGeo = new THREE.SphereGeometry(1, 32, 32);
  let fastenGeo = new THREE.CylinderGeometry(1, 1, 0.9, 32);

  let floor = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({color: 'grey'}));
  floor.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI /2 )

  let fasten = new THREE.Mesh(fastenGeo, new THREE.MeshBasicMaterial({color: 'magenta'}));
  fasten.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI /2 )


  let base = new THREE.Mesh(baseGeo, new THREE.MeshBasicMaterial({color: 'red'}));
  let mast = new THREE.Mesh(mastGeo, new THREE.MeshBasicMaterial({color: 'blue'}));
  let top = new THREE.Mesh(topGeo, new THREE.MeshBasicMaterial({color: 'magenta'}));

  // move everything over plane
  fasten.position.y=2;
  base.position.y = 1;
  mast.position.y = 5;
  top.position.y = 10;

  cacharro.add(fasten);
  cacharro.add(floor);
  cacharro.add(base);
  cacharro.add(mast);
  cacharro.add(top);

  scene.add(cacharro);
}

function loadBrazoRobot() {

  brazoRobot = new THREE.Object3D()


  let planeGeo = new THREE.PlaneGeometry(1000, 1000, 1000, 32);
  let floor = new THREE.Mesh(planeGeo, new THREE.MeshBasicMaterial({color: 'grey'}));
  floor.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI /2 )

  scene.add(floor)

  material = new THREE.MeshNormalMaterial();

  base = new THREE.Mesh(
    new THREE.CylinderGeometry(50, 50, 15, 32),
    material
  )
  base.name = 'base'
  
  brazo = createBrazo(material)
  base.add(brazo)
  
  brazoRobot.add(base)
  anteBrazo = createAntebrazo(material)
  brazo.getObjectByName('articulacion').add(anteBrazo)
  
  brazoRobot.name = 'brazo_robot'

  return brazoRobot
  
}

function createBrazo(mat)
{
  brazo = new THREE.Object3D()
  eje = new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 18, 32),
    mat
  )
  eje.name = 'eje'

  

  ax = new THREE.Mesh(
    new THREE.BoxGeometry(18, 120, 12),
    mat
  )
  ax.name = 'rotula'
  ax.position.y -= 50

  
  joint = new THREE.Mesh(
    new THREE.SphereGeometry(20, 32, 32),
    mat
  )
  
  //joint.position.z += 10
  joint.position.y -= 50
  joint.rotation.x = to_rad(90)
  
  
  
  joint.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI /2 )
  joint.name = 'articulacion'
  
  eje.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI /2 )
  
  ax.rotation.x = to_rad(-90)
  ax.position.y += 50
  ax.position.z += 60
  eje.add(ax)
  ax.add(joint)
  brazo.add(eje)

  brazo.name = 'brazo'
  return brazo
}

function createAntebrazo(mat)
{

  antebrazo = new THREE.Object3D()

  base = new THREE.Mesh(
    new THREE.CylinderGeometry(22, 22, 6, 32),
    mat
  )
  base.name = 'base_antebrazo'

  bar = new THREE.BoxGeometry(4, 80, 4)

  bar_bl = new THREE.Mesh(
    bar, mat
  )
  bar_br = new THREE.Mesh(
    bar, mat
  )
  bar_fl = new THREE.Mesh(
    bar, mat
  )
  bar_fr = new THREE.Mesh(
    bar, mat
  )
  base.add(bar_bl)
  base.add(bar_fl)
  base.add(bar_br)
  base.add(bar_fr)

  bar_bl.position.y += 40
  bar_br.position.y += 40
  bar_fl.position.y += 40
  bar_fr.position.y += 40

  bar_bl.position.z += 8
  bar_bl.position.x += 8
  bar_br.position.z -= 8
  bar_br.position.x -= 8
  
  bar_fl.position.z += 8
  bar_fl.position.x -= 8
  bar_fr.position.z -= 8
  bar_fr.position.x += 8


  handCylinder = new THREE.Mesh(
    new THREE.CylinderGeometry(15, 15, 40, 32),
    mat
  )
  handCylinder.position.y += 30
  handCylinder.position.z -= 10
  handCylinder.position.x -= 15/2

  handCylinder.rotateOnAxis(new THREE.Vector3(1,0,0), Math.PI/2)
  handCylinder.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI)


  handCylinder.name = 'muñeca'


  bar_bl.add(handCylinder);

  dedo_l = createDedo(material)
  dedo_l.position.y -= 15
  dedo_l.position.x -= 15

  dedo_l.name = 'dedo_l'
  handCylinder.add(dedo_l)

  dedo_r = createDedo(material)
  dedo_r.position.y += 15
  dedo_r.position.x -= 15

  dedo_r.name = 'dedo_r'
  handCylinder.add(dedo_r)

  antebrazo.add(base);


  antebrazo.name = 'antebrazo'
  return antebrazo
}

function createDedo(mat)
{

  dedo = new THREE.Object3D()
  falange = new THREE.Mesh(
    new THREE.BoxGeometry(19, 20, 4),
    mat
  )

  dedo.add(falange)
  falange.rotateOnAxis(new THREE.Vector3(0, 0, 1), -Math.PI/2)


  var vertices = new Float32Array([
    0,0,0, //a 0
    0,0,-4, //b 1
    0,20,-4, //c 2
    0,20,0, //d 3
    19,15,-1, // e 4
    19, 15, -3, //f 5
    19, 5, -1, //g 6
    19, 5, -3 //h 7
  ])

  var indices = [
    // Cara rectangular trasera
    0, 1, 3, // a-b-d
    1, 2, 3, // b-c-d
    // slope superior
    2, 3, 4, //b-d-e
    4, 5, 2,
    //slope inferior
    0, 1, 6,
    7, 6, 1,
    //lateral derecho
    3, 6, 4,
    6, 3, 0,
    // lateral izq
    5, 7, 1,
    2, 5, 1, 
    // cara frontal
    7, 5, 6,
    6, 5, 4

  ]


  var pinzaGeo = new THREE.BufferGeometry();

  pinzaGeo.setIndex(indices)
  pinzaGeo.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  pinzaGeo.computeVertexNormals()


  pinza = new THREE.Mesh(
    pinzaGeo,
    mat
  )
  dedo.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI)
  dedo.rotation.x = Math.PI/2
  pinza.position.y -= 10
  pinza.position.z += 2
  pinza.position.x += 10

  dedo.add(pinza)
  return dedo
}

function loadStair(stepno)
{

  let stair = new THREE.Object3D()

  const stepMat = new THREE.MeshNormalMaterial();
  const floorMat = new THREE.MeshBasicMaterial({color: 0x00ffff})

  let planeGeo = new THREE.PlaneGeometry(20,20,20,32);
  let plane = new THREE.Mesh(planeGeo, floorMat);
  //el plano parece un cuadrao flotante, rotar
  plane.rotateOnAxis(new THREE.Vector3(1,0,0), -Math.PI /2 )

  stair.add(plane)

  for (let i = 0; i <= stepno; i++) {

    let step_i_geo = new THREE.BoxGeometry(10, 1, 1)
    let step_i = new THREE.Mesh(step_i_geo, stepMat);

    step_i.position.y = i
    step_i.position.z = i
    stair.add(step_i);

  }

  scene.add(stair);
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function update()
{
  // Cambios para actualizar la camara segun mvto del raton
  cameraControls.update();
  time += 0.01
  if (robot_controls.auto_animate) {
    sin_t = Math.sin(time)
    robot_controls.base_angle = sin_t * 180
    robot_controls.arm_angle = sin_t * 45
    robot_controls.forearm_angle_y = sin_t * 180 
    robot_controls.forearm_angle_z = sin_t * 90
    robot_controls.claw_angle = Math.max(sin_t * 220, -40)
    robot_controls.claw_separation = Math.max(sin_t * 15, 0)
  }
  base = brazo_robot.getObjectByName('base', true)
  base.rotation.y = to_rad(robot_controls.base_angle)

  eje = brazo_robot.getObjectByName('eje', true)

  
  eje.rotation.y = to_rad(robot_controls.arm_angle)

  rotula = brazo_robot.getObjectByName('rotula', true)

  rotula.rotation.y = to_rad(robot_controls.forearm_angle_y)
  
  base_antebrazo = brazo_robot.getObjectByName('base_antebrazo', true)
  base_antebrazo.rotation.z = to_rad(robot_controls.forearm_angle_z)
  base_antebrazo.rotation.y = to_rad(robot_controls.claw_angle)

  dedo_l = base_antebrazo.getObjectByName('dedo_l')
  dedo_r = base_antebrazo.getObjectByName('dedo_r')

  dedo_r.position.y = -robot_controls.claw_separation
  dedo_l.position.y = robot_controls.claw_separation
  
}

function to_rad(deg) {
  return deg * (Math.PI/180)
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}