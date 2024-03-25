import * as THREE from '/three';
import CameraControls from '/camera-controls';

CameraControls.install({ THREE: THREE });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 5;
camera.position.y = 5;
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
const cameraControls = new CameraControls(camera, renderer.domElement);
const clock = new THREE.Clock();

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const mousePlane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    mousePlane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(mousePlane, intersectionPoint);
});

window.addEventListener('click', (e) => {
    const sphereGeo = new THREE.SphereGeometry(0.125, 30, 30);
    const sphereMat = new THREE.MeshStandardMaterial({
        color: 0xFFEA00,
        metalness: 0,
        roughness: 0
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);
    sphereMesh.position.copy(intersectionPoint);
});

const start = () => {
    console.log("starting");
    console.log('Three version: ', THREE.REVISION)
    console.log(scene);

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
    cameraControls.mouseButtons.right = CameraControls.ACTION.ROTATE;
    cameraControls.mouseButtons.middle = CameraControls.ACTION.ROTATE;
    cameraControls.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    cameraControls.minPolarAngle = THREE.MathUtils.degToRad(10);
    cameraControls.maxPolarAngle = THREE.MathUtils.degToRad(75);
    cameraControls.minZoom = 0.5; // zooming out
    cameraControls.maxZoom = 2; // zooming in

    console.log(cameraControls);

    let light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 5, 8);
    light.castShadow = true;

    scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));
    // const helper = new THREE.DirectionalLightHelper(light, 5);
    // scene.add(helper);

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "red" });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    const size = 10;
    const divisions = 10;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    render();
}

const render = () => {
    requestAnimationFrame(render);

    const delta = clock.getDelta();
    const hasControlsUpdated = cameraControls.update(delta);

    const cube = scene.children[2];
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

export {
    start
};