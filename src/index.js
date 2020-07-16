import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';

import parrotModel from './assets/Parrot.glb';
import soldierModel from './assets/Soldier.glb';
import './styles.css';

import {
  renderer,
  scene,
  camera,
  clock,
} from './commonInit';

const Models = [
  {
    name: 'Soldier',
    path:  soldierModel
  },
  {
    name: 'Parrot',
    path: parrotModel
  }
]
// 动画控制
const mixers = [];
// 模型配置
const units = [
  {
    modelName: 'Soldier',
    meshName: 'vanguard_Mesh',
    position: { x: 0, y: 0, z: 0 },
    scale: 1,
    animationName: 'Idle'
  },
  {
    modelName: "Soldier",
    meshName: "vanguard_Mesh",
    position: { x: 3, y: 0, z: 0 },
    scale: 2,
    animationName: "Walk"
  },
  {
    modelName: "Soldier",
    meshName: "vanguard_Mesh",
    position: { x: 1, y: 0, z: 0 },
    scale: 1,
    animationName: "Run"
  },
  {
    modelName: "Parrot",
    meshName: "mesh_0",
    position: { x: - 4, y: 0, z: 0 },
    rotation: { x: 0, y: Math.PI, z: 0 },
    scale: 0.01,
    animationName: "parrot_A_"
  },
  {
    modelName: "Parrot",
    meshName: "mesh_0",
    position: { x: - 2, y: 0, z: 0 },
    rotation: { x: 0, y: Math.PI / 2, z: 0 },
    scale: 0.02,
    animationName: null
  },
]
// 模型加载函数
const loadModels = () => {
  const loader = new GLTFLoader();
  const len = Models.length;
  let loadNum = 0;

  Models.forEach(item => {
    loader.load(item.path, (obj) => {
      item.animations = obj.animations;
      item.scene = obj.scene

      obj.scene.traverse((thing) => {
        if(thing.isMesh) {
          thing.castShadow = true;
        }
      })
      onLoad();
    })
  })

  const onLoad = () => {
    loadNum++;
    if(loadNum === len) {
      instantiateUnits();
    }
  }
}
// 设置模型参数
const instantiateUnits = () => {
  units.forEach(item => {
    const model = Models.find( m => m.name === item.modelName);
    const clonedScene = SkeletonUtils.clone(model.scene);

    if(clonedScene) {
      const clonedMesh = clonedScene.getObjectByName(item.meshName);
      if(clonedMesh) {
        const mixer = startAnimation( clonedMesh, model.animations, item.animationName);
        mixers.push(mixer);
      }
      scene.add(clonedScene);
      if(item.position) {
        clonedScene.position.set(item.position.x, item.position.y, item.position.z);
      }

      if(item.scale) {
        clonedScene.scale.set( item.scale, item.scale, item.scale);
      }

      if(item.rotation) {
        clonedScene.rotation.x = item.rotation.x;
        clonedScene.rotation.y = item.rotation.y;
        clonedScene.rotation.z = item.rotation.z;
      }
    }
  })
}

const startAnimation = (skinnedMesh, animations, animationName) => {
  const mixer = new THREE.AnimationMixer( skinnedMesh );
  const clip = THREE.AnimationClip.findByName(animations, animationName );
  if(clip) {
    const action = mixer.clipAction( clip );
    action.play()
  }

  return mixer;
}

const animate = () => {
  requestAnimationFrame( animate );
  const mixerUpdateDelta = clock.getDelta();
  mixers.forEach(item => {
    item.update(mixerUpdateDelta);
  })
  renderer.render(scene, camera);
}

loadModels();
animate();