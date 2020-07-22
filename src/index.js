import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import {
  renderer,
  scene,
  camera,
  clock,
} from './commonInit';
import robotModel from './assets/RobotExpressive.glb';

const btn = document.getElementById('btn');

let mixer;
let animations; // 模型上带的动画

// 模型加载函数
const loadModels = () => {
  const loader = new GLTFLoader();
  loader.load(robotModel, (gltf) => {
    scene.add(gltf.scene);
    animations = gltf.animations;
    testFn(gltf.scene)
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

let walkAn;

const testFn = (model) => {
  mixer = new THREE.AnimationMixer(model);
  walkAn = animations.find(item => item.name === 'Walking');
  mixer.clipAction(walkAn).play()
}

btn.onclick = () => {
  mixer.clipAction(walkAn).fadeOut();
  const danceAn = animations.find(item => item.name === 'Wave');
  mixer.clipAction(danceAn).clampWhenFinished = true;
  mixer.clipAction(danceAn).loop = THREE.LoopOnce;
  mixer.clipAction(danceAn)
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight( 1 )
    .fadeIn(1)
    .play();

  const onFinished = () => {
    mixer.removeEventListener('finished', onFinished);
    mixer.clipAction(danceAn)
      .fadeOut();
    mixer.clipAction(walkAn)
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight( 1 )
      .fadeIn(1)
      .play();
  }

  mixer.addEventListener('finished', onFinished)
}


// ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp']
// ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing']


loadModels();
animate();