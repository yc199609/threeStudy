import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import patternImg from './assets/circuit_pattern.png';
import grassImg from './assets/grasslight-big.jpg';

const global = {
  container: null,
  scene: null,
  camera: null,
  light: null,
  renderer: null,
  controls: null
}

const init = () => {
  global.container = document.createElement( 'div' );
  const container = global.container;
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
  scene.add( new THREE.AmbientLight( 0x666666 )) // 环境光

  global.light = new THREE.DirectionalLight( 0xdfebff, 1 ); // 方向光源
  const light = global.light;
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
  global.controls = new OrbitControls( camera, renderer.domElement );
  const controls = global.controls;
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 1000;
  controls.maxDistance = 5000;
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
  const loader = new THREE.TextureLoader();
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
  global.scene.add( object );

  object.customDepthMaterial = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    map: clothTexture,
    alphaTest: 0.5
  });
}

init();
ClothInit();
animate();