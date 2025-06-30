import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AnimationMixer } from 'three';

// Setup basic scene
const scene = new THREE.Scene();

// Setup camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(0, 1.5, 5);

// Setup renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Setup OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;

//add light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(2, 2, 5);
scene.add(directionalLight);


// Setup clock
const clock = new THREE.Clock();

// Load 3D model
let model;
let mixer;

const loader = new GLTFLoader();
loader.load('butterflies.glb', (gltf) => {
  model = gltf.scene;
  scene.add(model);
  model.traverse((child) => {
  if (child.isMesh) {
    child.material.metalness = 0;
    child.material.roughness = 0.4;
    child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
  }
});

  // Setup animations if any
  if (gltf.animations && gltf.animations.length > 0) {
    mixer = new AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
  }
}, undefined, (error) => {
  console.error('Error loading model:', error);
});

// Animate everything
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (mixer) {
    mixer.update(delta);
  }

  if (model) {
    model.rotation.y += 0.005;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();
