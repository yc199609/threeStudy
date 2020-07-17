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

const api = { state: 'Walking' };
let activeAction;
let actions;
let mixer;

// 模型加载函数
const loadModels = () => {
  const loader = new GLTFLoader();
  loader.load(robotModel, (gltf) => {
    scene.add(gltf.scene);
    createGUI(gltf.scene, gltf.animations )
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

const createGUI = (model, animations) => {
  const states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
  const emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];
  const gui = new GUI();
  mixer = new THREE.AnimationMixer(model);
  actions = {};

  animations.forEach(item => {
    actions[item.name] = mixer.clipAction(item);
    if(emotes.indexOf(item.name) >= 0 || states.indexOf(item.name) >= 4) {
      actions[item.name].clampWhenFinished = true;
      actions[item.name].loop = THREE.LoopOnce;
    }
  })

  // states
  const statesFolder = gui.addFolder( 'States' );
  const clipCtrl = statesFolder.add(api, 'state').options(states)

  clipCtrl.onChange(()=>{
    fadeToAction(api.state, 0.5);
  })
  statesFolder.open();

  // emotes
  const emoteFolder = gui.addFolder( 'Emotes' );

  const createEmoteCallback = (name) => {
    api[name] = () => {
      fadeToAction(name, 0.2);
      mixer.addEventListener('finished', restoreState);
    }
    emoteFolder.add( api, name );
  }

  const restoreState = () => {
    mixer.removeEventListener('finished', restoreState);
    fadeToAction(api.state, 0.2)
  }

  emotes.forEach(item => {
    createEmoteCallback(item);
  })
  emoteFolder.open();

  // expressions
  const face = model.getObjectByName( 'Head_2' );
  const expressions = Object.keys( face.morphTargetDictionary );
  const expressionFolder = gui.addFolder( 'Expressions' );

  expressions.forEach((item, index) => {
    expressionFolder
      .add(face.morphTargetInfluences, index, 0, 1, 0.01)
      .name(item);
  })
  activeAction = actions['Walking'];
  activeAction.play();
  expressionFolder.open();
}

const fadeToAction = (name, duration) => {
  const previousAction = activeAction;
  activeAction = actions[name];
  if(previousAction !== activeAction){
    previousAction.fadeOut(duration);
  }
  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight( 1 )
		.fadeIn( duration )
		.play()
}

loadModels();
animate();