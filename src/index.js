import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

import negxImg from './assets/imgs/negx.jpg';
import negyImg from './assets/imgs/negy.jpg';
import negzImg from './assets/imgs/negz.jpg';
import posxImg from './assets/imgs/posx.jpg';
import posyImg from './assets/imgs/posy.jpg';
import poszImg from './assets/imgs/posz.jpg';
import myglb from './assets/LittlestTokyo.glb';

const container = document.createElement( 'div' );
document.body.appendChild(container);

const clock = new THREE.Clock();
let mixer;

// renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild( renderer.domElement );

// 场景
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );

// 相机
const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 100);
camera.position.set( 5, 2, 8 );

// 控制器
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.enablePan = false;
// 灯光
scene.add( new THREE.AmbientLight(0x404040)) // 环境光
const pointLight = new THREE.PointLight( 0xffffff, 1 );
pointLight.position.copy( camera.position );
scene.add( pointLight )
// 材质
const envMap = new THREE.CubeTextureLoader().load([
  negxImg, posxImg, negyImg, posyImg, negzImg, poszImg,
])

var dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( './static/' );

var loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );
loader.load( myglb, (obj) => {
  var model = obj.scene;
  model.position.set( 1, 1, 0 );
  model.scale.set( 0.01, 0.01, 0.01 );
  model.traverse( function ( child ) {
    if ( child.isMesh ) child.material.envMap = envMap;
  });
  scene.add( model );
  mixer = new THREE.AnimationMixer( model );
  mixer.clipAction( obj.animations[ 0 ] ).play();
  animate();
}, undefined, (err) => {
  console.error(err);
});

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight );
}

const animate = () => {
  requestAnimationFrame( animate);
  var delta = clock.getDelta();
  mixer.update( delta );
  controls.update( delta );
  renderer.render( scene, camera );
}