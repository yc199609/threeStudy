import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {
  renderer,
  scene,
  camera,
  clock,
} from './commonInit';

import ballModal from './assets/ball.glb';

let mixer;
let EmptyAction;
const btn = document.getElementById('btn');

// 模型加载函数
const loadModels = () => {
  const loader = new GLTFLoader();
  loader.load(ballModal, (gltf) => {
    scene.add(gltf.scene);
    console.log(gltf)
    EmptyAction = gltf.animations.find(item => item.name === 'EmptyAction');
    mixer = new THREE.AnimationMixer(gltf.scene);
    mixer.clipAction(EmptyAction).play();
  })
}

const animate = () => {
  requestAnimationFrame( animate );
  const dt = clock.getDelta();
  if(mixer) {
    mixer.update(dt);
  }
  renderer.render(scene, camera);
}

btn.onclick = () => {
  mixer.clipAction(EmptyAction).fadeOut();
}

loadModels();
animate();