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
const cameraControlClock = new THREE.Clock();
let previewGrid;
let tiles = [];
let mouseDownInterval = null;

let movementClock = new THREE.Clock();
let movementInterval;
let keysPressed = [];

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
    cameraControls.minZoom = 0.2; // zooming out
    cameraControls.maxZoom = 2; // zooming in
    cameraControls.dollySpeed = 5; // zoom speed
    // cameraControls.truckSpeed = 2;
    // cameraControls.maxSpeed = Infinity;

    console.log(cameraControls);

    let light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(3, 5, 8);
    light.castShadow = true;

    const size = 1000;
    const divisions = 1000;
    const gridHelper = new THREE.GridHelper(size, divisions);
    scene.add(gridHelper);

    scene.add(light, new THREE.AmbientLight(0xffffff, 0.5));
    // const helper = new THREE.DirectionalLightHelper(light, 5);
    // scene.add(helper);

    window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    setupMouseControls();
    setUpKeyboardControls();
    render();
}

const setUpKeyboardControls = () => {
    window.addEventListener('keydown', (e) => {
        if (e.key == "w") {
            keysPressed.push("w");
        } else if (e.key == "s") {
            keysPressed.push("s");
        } else if (e.key == "a") {
            keysPressed.push("a");
        } else if (e.key == "d") {
            keysPressed.push("d");
        }

        if (movementInterval == null) {
            movementClock.getDelta();
            movementInterval = setInterval(() => {
                const delta = movementClock.getDelta();
                if (keysPressed.includes("w")) {
                    // console.log('move forwards');
                    cameraControls.forward(10 * delta, true);
                }
                if (keysPressed.includes("s")) {
                    // console.log('move backwards');
                    cameraControls.forward(-10 * delta, true);
                }
                if (keysPressed.includes("a")) {
                    // console.log('move left');
                    cameraControls.truck(-10 * delta, 0, true);
                }
                if (keysPressed.includes("d")) {
                    // console.log('move right');
                    cameraControls.truck(10 * delta, 0, true);
                }
            }, 10);
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key == "w") {
            keysPressed = keysPressed.filter((key) => {
                return key != "w";
            });
        } else if (e.key == "s") {
            keysPressed = keysPressed.filter((key) => {
                return key != "s";
            });
        } else if (e.key == "a") {
            keysPressed = keysPressed.filter((key) => {
                return key != "a";
            });
        } else if (e.key == "d") {
            keysPressed = keysPressed.filter((key) => {
                return key != "d";
            });
        }

        if (keysPressed.length <= 0 && movementInterval != null) {
            clearInterval(movementInterval);
            movementInterval = null;
        }
    });
}

const setupMouseControls = () => {
    const mouse = new THREE.Vector2();
    const intersectionPoint = new THREE.Vector3();
    const planeNormal = new THREE.Vector3();
    // const mousePlane = new THREE.Plane();
    const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const raycaster = new THREE.Raycaster();

    window.addEventListener('mousemove', (e) => {
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        planeNormal.copy(camera.position).normalize();
        // mousePlane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
        raycaster.setFromCamera(mouse, camera);
        // raycaster.ray.intersectPlane(mousePlane, intersectionPoint);
        raycaster.ray.intersectPlane(floorPlane, intersectionPoint);

        previewTile(intersectionPoint);
    });

    window.addEventListener('mousedown', (e) => {
        console.log(e);
        if (e.button == 0 && mouseDownInterval == null) {
            if (e.ctrlKey) {
                mouseDownInterval = setInterval(() => {
                    removeTile(intersectionPoint);
                }, 10);
            } else {
                mouseDownInterval = setInterval(() => {
                    setTile(intersectionPoint);
                }, 10);
            }
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (e.button == 0) {
            clearInterval(mouseDownInterval);
            mouseDownInterval = null;
        }
    });
}

const previewTile = (position) => {
    if (position == null) {
        return;
    }

    scene.remove(previewGrid);

    const newGridSpot = new THREE.Vector3(0, 0, 0);
    if (position.x > 0) {
        newGridSpot.x = Math.trunc(position.x) + .5;
    } else {
        newGridSpot.x = Math.trunc(position.x) - .5;
    }
    newGridSpot.y = -.05;
    if (position.z > 0) {
        newGridSpot.z = Math.trunc(position.z) + .5;
    } else {
        newGridSpot.z = Math.trunc(position.z) - .5;
    }

    // check if this grid has already been made before we make a new one
    let gridExists = false;
    for (const tile of tiles) {
        if (tile.position.x == newGridSpot.x && tile.position.y == newGridSpot.y && tile.position.z == newGridSpot.z) {
            gridExists = true;
        }
    }

    if (gridExists) {
        return;
    }

    const geometry = new THREE.BoxGeometry(1, .1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "red" });
    previewGrid = new THREE.Mesh(geometry, material);
    previewGrid.castShadow = true;
    previewGrid.receiveShadow = true;
    if (position.x > 0) {
        previewGrid.position.x = Math.trunc(position.x) + .5;
    } else {
        previewGrid.position.x = Math.trunc(position.x) - .5;
    }
    previewGrid.position.y = -.05;
    if (position.z > 0) {
        previewGrid.position.z = Math.trunc(position.z) + .5;
    } else {
        previewGrid.position.z = Math.trunc(position.z) - .5;
    }

    scene.add(previewGrid);
}

const setTile = (position) => {
    if (position == null) {
        return;
    }

    const newGridSpot = new THREE.Vector3(0, 0, 0);
    if (position.x > 0) {
        newGridSpot.x = Math.trunc(position.x) + .5;
    } else {
        newGridSpot.x = Math.trunc(position.x) - .5;
    }
    newGridSpot.y = -.05;
    if (position.z > 0) {
        newGridSpot.z = Math.trunc(position.z) + .5;
    } else {
        newGridSpot.z = Math.trunc(position.z) - .5;
    }

    // check if this grid has already been made before we make a new one
    let gridExists = false;
    for (const tile of tiles) {
        if (tile.position.x == newGridSpot.x && tile.position.y == newGridSpot.y && tile.position.z == newGridSpot.z) {
            console.log("tile already exists");
            gridExists = true;
        }
    }

    if (gridExists) {
        return;
    } else {
        scene.remove(previewGrid);
    }

    const geometry = new THREE.BoxGeometry(1, .1, 1);
    const material = new THREE.MeshPhongMaterial({ color: "green" });
    const newGrid = new THREE.Mesh(geometry, material);
    newGrid.castShadow = true;
    newGrid.receiveShadow = true;

    newGrid.position.x = newGridSpot.x;
    newGrid.position.y = newGridSpot.y;
    newGrid.position.z = newGridSpot.z;



    tiles.push(newGrid);
    scene.add(newGrid);
}

const removeTile = (position) => {
    if (tiles.length <= 0) {
        return;
    }

    const selectedSpot = new THREE.Vector3(0, 0, 0);
    if (position.x > 0) {
        selectedSpot.x = Math.trunc(position.x) + .5;
    } else {
        selectedSpot.x = Math.trunc(position.x) - .5;
    }
    selectedSpot.y = -.05;
    if (position.z > 0) {
        selectedSpot.z = Math.trunc(position.z) + .5;
    } else {
        selectedSpot.z = Math.trunc(position.z) - .5;
    }

    // check if this grid has already been made before we delete it
    let tileToRemove;
    for (const tile of tiles) {
        if (tile.position.x == selectedSpot.x && tile.position.y == selectedSpot.y && tile.position.z == selectedSpot.z) {
            tileToRemove = tile;
            scene.remove(tile);
        }
    }

    if (tileToRemove) {
        tiles = tiles.filter((tile) => {
            return tile.uuid != tileToRemove.uuid;
        });
    }
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