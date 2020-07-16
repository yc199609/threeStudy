import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const clock = new THREE.Clock();

export const container = document.createElement( 'div' );
document.body.appendChild(container);

// renderer
export const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild( renderer.domElement );

// 场景
export const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xa0a0a0 );
scene.fog = new THREE.Fog( 0xa0a0a0, 10, 22 );

// 相机
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set( 3, 6, -10 );
camera.lookAt( 0, 1, 0 );

// 控制器
export const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.enablePan = false;
// 灯光
scene.add( new THREE.AmbientLight(0x404040)) // 环境光
const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
hemiLight.position.set( 0, 20, 0 );
scene.add( hemiLight );
const dirLight = new THREE.DirectionalLight( 0xffffff );
dirLight.position.set( - 3, 10, - 10 );
dirLight.castShadow = true;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = - 10;
dirLight.shadow.camera.left = - 10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 40;
scene.add( dirLight );

// ground
const groundMesh = new THREE.Mesh(
  new THREE.PlaneBufferGeometry( 40, 40 ),
  new THREE.MeshPhongMaterial( {
    color: 0x999999,
    depthWrite: false
  } )
);
groundMesh.rotation.x = - Math.PI / 2;
groundMesh.receiveShadow = true;
scene.add( groundMesh );


window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight );
}
