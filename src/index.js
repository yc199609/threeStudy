import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import patternImg from './assets/circuit_pattern.png';
import grassImg from './assets/grasslight-big.jpg';

const global = {
  scene: null,
  camera: null,
  renderer: null,
  loader: null,
}

const init = () => {
  const container = document.createElement( 'div' );
  document.body.appendChild(container);

  // 场景
  global.scene = new THREE.Scene();
  const scene = global.scene;
  scene.background = new THREE.Color( 0xcce0ff );
  scene.fog = new THREE.Fog( 0xcce0ff, 500, 10000 ); // 雾气效果

  // 相机
  global.camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
  const camera = global.camera;
  camera.position.set( 1000, 50, 1500 );

  // 灯光
  scene.add( new THREE.AmbientLight( 0x666666 )); // 环境光

  const light = new THREE.DirectionalLight( 0xdfebff, 1 ); // 方向光源
  light.position.set( 50, 200, 100 );
  light.position.multiplyScalar( 1.3 ); // 向量乘1.3
  light.castShadow = true; // 灯光产生的阴影
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.left = -300;
  light.shadow.camera.right = 300;
  light.shadow.camera.top = 300;
  light.shadow.camera.bottom = -300;
  light.shadow.camera.far = 1000;
  scene.add(light);

  // 渲染器
  global.renderer = new THREE.WebGLRenderer( { antialias: true } );
  const renderer = global.renderer;
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;

  // 控制器
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 1000;
  controls.maxDistance = 5000;

  // loader
  global.loader = new THREE.TextureLoader();

  // 地板
  const groundTexture = global.loader.load( grassImg );
  groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
  groundTexture.repeat.set( 25, 25 );
  groundTexture.anisotropy = 16;
  groundTexture.encoding = THREE.sRGBEncoding;

  const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
  const groundMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(20000, 20000), groundMaterial);
  groundMesh.position.y = - 250;
  groundMesh.rotation.x = - Math.PI / 2;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);
}

const animate = () => {
  requestAnimationFrame( animate );
  render()
}

const render = () => {
  const { renderer, scene, camera } = global;
  renderer.render(scene, camera )
}

const ClothInit = () => {
  const { loader, scene } = global;
  const clothTexture = loader.load(patternImg);
  clothTexture.anisotropy = 16;

  const clothMaterial = new THREE.MeshLambertMaterial({
    map: clothTexture,
    side: THREE.DoubleSide,
    alphaTest: 0.5,
  })

  const clothFN = (u, v, target ) => {
    const width = 250;
    const height = 250;
    const x = (u - 0.5 ) * width;
    const y = (v + 0.5 ) * height;
    const z = 0;
    target.set(x, y, z);
  }

  const clothGeometry = new THREE.ParametricBufferGeometry( clothFN, 10, 10 );

  const object = new THREE.Mesh(clothGeometry, clothMaterial);
  object.position.set( 0, 0, 0 );
  object.castShadow = true;
  scene.add( object );

  object.customDepthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    map: clothTexture,
    alphaTest: 0.5
  });

    // 下面是3根杆子
    var poleGeo = new THREE.BoxBufferGeometry( 5, 375, 5 );
    var poleMat = new THREE.MeshLambertMaterial();
  
    var mesh1 = new THREE.Mesh( poleGeo, poleMat );
    mesh1.position.x = - 125;
    mesh1.position.y = - 62;
    mesh1.receiveShadow = true;
    mesh1.castShadow = true;
    scene.add( mesh1 );

    var mesh2 = new THREE.Mesh( poleGeo, poleMat );
    mesh2.position.x = 125;
    mesh2.position.y = - 62;
    mesh2.receiveShadow = true;
    mesh2.castShadow = true;
    scene.add( mesh2 );

    var mesh3 = new THREE.Mesh( new THREE.BoxBufferGeometry( 255, 5, 5 ), poleMat );
    mesh3.position.y = - 250 + ( 750 / 2 );
    mesh3.position.x = 0;
    mesh3.receiveShadow = true;
    mesh3.castShadow = true;
    scene.add( mesh3 );

    // 杆子下的支持点
    var gg = new THREE.BoxBufferGeometry( 10, 10, 10 );
    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = - 250;
    mesh.position.x = 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );

    var mesh = new THREE.Mesh( gg, poleMat );
    mesh.position.y = - 250;
    mesh.position.x = - 125;
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );
}

init();
ClothInit();
animate();