import * as THREE from '/three';
import CameraControls from '/camera-controls';
import { setupControls } from '/src/controls.js';

CameraControls.install({ THREE: THREE });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
const cameraControls = new CameraControls(camera, renderer.domElement);
const cameraControlClock = new THREE.Clock();

const start = () => {
    console.log("starting...");
    console.log('Three version: ', THREE.REVISION)
    console.log("scene", scene);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
    cameraControls.mouseButtons.right = CameraControls.ACTION.ROTATE;
    cameraControls.mouseButtons.middle = CameraControls.ACTION.ROTATE;
    cameraControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    cameraControls.minPolarAngle = THREE.MathUtils.degToRad(10);
    cameraControls.maxPolarAngle = THREE.MathUtils.degToRad(75);
    cameraControls.minZoom = 0.4; // zooming out
    cameraControls.maxZoom = 2; // zooming in
    cameraControls.dollySpeed = 3.5; // zoom speed
    // cameraControls.truckSpeed = 2;
    // cameraControls.maxSpeed = Infinity;

    console.log("cameraControls", cameraControls);

    let light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 5, 8);
    light.castShadow = true;

    const size = 3;
    const divisions = 3;
    const gridHelper = new THREE.GridHelper(size, divisions);
    gridHelper.position.y = -.1;
    scene.add(gridHelper);

    scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));
    // const helper = new THREE.DirectionalLightHelper(light, 5);
    // scene.add(helper);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    setupControls(scene, camera, cameraControls);
    render();
}

const render = () => {
    requestAnimationFrame(render);

    const delta = cameraControlClock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);

    renderer.render(scene, camera);
}

export {
    start
};