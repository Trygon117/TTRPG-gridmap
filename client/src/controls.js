import * as THREE from '/three';
import { previewTile, setTile, previewRemoveTile, removeTile, noPreview } from '/src/build.js';

let scene;
let camera;
let cameraControls;

let mouseDownInterval = null;
let movementClock = new THREE.Clock();
let movementInterval;
let keysPressed = [];

const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
// const mousePlane = new THREE.Plane();
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const raycaster = new THREE.Raycaster();

export const setupControls = (givenScene, givenCamera, givenCameraControls) => {
    scene = givenScene;
    camera = givenCamera;
    cameraControls = givenCameraControls;

    window.addEventListener('keydown', handleKeyboardInputStart);

    window.addEventListener('keyup', handleKeyboardInputStop);

    window.addEventListener('mousemove', handleMouseMove);

    window.addEventListener('mousedown', handleMouseInputStart);

    window.addEventListener('mouseup', handleMouseInputStop);

    window.addEventListener('beforeunload', (e) => {
        e.stopPropagation();
        e.preventDefault();

        setTimeout(() => {
            keysPressed = [];
            document.body.style.cursor = "default";
            noPreview(scene, intersectionPoint);
            clearInterval(movementInterval);
            movementInterval = null;
        }, 100);

        return 'Dont go!';
    });
}

const handleKeyboardInputStart = (e) => {
    let setMovementInterval = false;
    if (e.key.toLowerCase() == "w") {
        e.stopPropagation();
        e.preventDefault();
        keysPressed.push("w");
        setMovementInterval = true;
    } else if (e.key.toLowerCase() == "s") {
        e.stopPropagation();
        e.preventDefault();
        keysPressed.push("s");
        setMovementInterval = true;
    } else if (e.key.toLowerCase() == "a") {
        e.stopPropagation();
        e.preventDefault();
        keysPressed.push("a");
        setMovementInterval = true;
    } else if (e.key.toLowerCase() == "d") {
        e.stopPropagation();
        e.preventDefault();
        keysPressed.push("d");
        setMovementInterval = true;
    } else if (e.key.toLowerCase() == "shift") {
        e.stopPropagation();
        e.preventDefault();
        document.body.style.cursor = "pointer";
        // document.body.style.cursor = "crosshair";
        previewTile(scene, intersectionPoint);
    } else if (e.key.toLowerCase() == "control") {
        e.stopPropagation();
        e.preventDefault();
        document.body.style.cursor = "pointer";
        // document.body.style.cursor = "crosshair";
        previewRemoveTile(scene, intersectionPoint);
    }

    if (setMovementInterval && movementInterval == null) {
        movementClock.getDelta();
        movementInterval = setInterval(() => {
            const delta = movementClock.getDelta();
            if (keysPressed.includes("w")) {
                // console.log('move forwards');
                cameraControls.forward(20 * delta, true);
            }
            if (keysPressed.includes("s")) {
                // console.log('move backwards');
                cameraControls.forward(-20 * delta, true);
            }
            if (keysPressed.includes("a")) {
                // console.log('move left');
                cameraControls.truck(-20 * delta, 0, true);
            }
            if (keysPressed.includes("d")) {
                // console.log('move right');
                cameraControls.truck(20 * delta, 0, true);
            }
        }, 10);
    }
}

const handleKeyboardInputStop = (e) => {
    keysPressed = keysPressed.filter((key) => {
        return key.toLowerCase() != e.key.toLowerCase();
    });

    if (e.key == "Shift" || e.key == "Control") {
        document.body.style.cursor = "default";
        noPreview(scene, intersectionPoint);
    }

    if (keysPressed.length <= 0 && movementInterval != null) {
        clearInterval(movementInterval);
        movementInterval = null;
    }
}

const handleMouseMove = (e) => {
    updateMouse(e);
    if (e.shiftKey) {
        previewTile(scene, intersectionPoint);
    } else if (e.ctrlKey) {
        previewRemoveTile(scene, intersectionPoint);
    } else {
        noPreview(scene, intersectionPoint);
    }
}

const updateMouse = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    planeNormal.copy(camera.position).normalize();
    // mousePlane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
    raycaster.setFromCamera(mouse, camera);
    // raycaster.ray.intersectPlane(mousePlane, intersectionPoint);
    raycaster.ray.intersectPlane(floorPlane, intersectionPoint);
}

const handleMouseInputStart = (e) => {
    if (e.button == 0 && mouseDownInterval == null) {
        if (e.ctrlKey) {
            mouseDownInterval = setInterval(() => {
                removeTile(scene, intersectionPoint);
            }, 10);
        } else if (e.shiftKey) {
            mouseDownInterval = setInterval(() => {
                setTile(scene, intersectionPoint);
            }, 10);
        }
    }
};

const handleMouseInputStop = (e) => {
    if (e.button == 0) {
        clearInterval(mouseDownInterval);
        mouseDownInterval = null;
    }
}