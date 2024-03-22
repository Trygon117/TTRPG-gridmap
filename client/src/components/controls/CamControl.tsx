import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { useEffect, useRef } from "react";
import * as THREE from "three";

const CamControl = (props) => {
    const cameraControlsRef = useRef<CameraControls>(null);
    let wPreviousTime;
    let wInterval;
    let aPreviousTime;
    let aInterval;
    let sPreviousTime;
    let sInterval;
    let dPreviousTime;
    let dInterval;

    useEffect(() => {
        if (cameraControlsRef.current == null) {
            return
        }

        console.log("Camera Controls: ", cameraControlsRef.current);
        console.log("Camera Controls Camera: ", cameraControlsRef.current.camera);

        document.addEventListener("keydown", (e) => {
            const newTime = Date.now();
            console.log(e.key);

            if (e.key === 'w') {
                if (wInterval == null) {
                    wPreviousTime = newTime;
                    wInterval = setInterval(() => {
                        console.log("wKeyHeld");
                        const newTime = Date.now();
                        const wDeltaTime = newTime - wPreviousTime;
                        wPreviousTime = newTime;
                        cameraControlsRef.current!.forward(0.01 * wDeltaTime, true);
                    }, 10);
                }
            }

            if (e.key === "a") {
                if (aInterval == null) {
                    aPreviousTime = newTime;
                    aInterval = setInterval(() => {
                        console.log("aKeyHeld");
                        const newTime = Date.now();
                        const aDeltaTime = newTime - aPreviousTime;
                        aPreviousTime = newTime;
                        cameraControlsRef.current!.truck(-0.01 * aDeltaTime, 0, true);
                    })
                }
            }

            if (e.key === "s") {
                if (sInterval == null) {
                    sPreviousTime = newTime;
                    sInterval = setInterval(() => {
                        console.log("sKeyHeld");
                        const newTime = Date.now();
                        const sDeltaTime = newTime - sPreviousTime;
                        sPreviousTime = newTime;
                        cameraControlsRef.current!.forward(-0.01 * sDeltaTime, true);
                    })
                }
            }

            if (e.key === "d") {
                if (dInterval == null) {
                    dPreviousTime = newTime;
                    dInterval = setInterval(() => {
                        console.log("dKeyHeld");
                        const newTime = Date.now();
                        const dDeltaTime = newTime - dPreviousTime;
                        dPreviousTime = newTime;
                        cameraControlsRef.current!.truck(0.01 * dDeltaTime, 0, true);
                    })
                }
            }
        });


        document.addEventListener("keyup", (e) => {
            switch (e.key) {
                case "w":
                    console.log("wKeyUp");
                    clearInterval(wInterval);
                    wInterval = null;
                    break;
                case "a":
                    console.log("aKeyUp");
                    clearInterval(aInterval);
                    aInterval = null;
                    break;
                case "s":
                    console.log("sKeyUp");
                    clearInterval(sInterval);
                    sInterval = null;
                    break;
                case "d":
                    console.log("dKeyUp");
                    clearInterval(dInterval);
                    dInterval = null;
                    break;
                default:
                    return;
            }
        });

        // https://stackoverflow.com/questions/7956442/detect-clicked-object-in-three-js
        document.addEventListener('mousedown', (e) => {
            console.log("mousedown");
            if (cameraControlsRef.current == null) {
                return;
            }
            const camera = cameraControlsRef.current.camera;
            if (camera.type != "PerspectiveCamera") {
                return;
            }
            console.log(camera);

            var vectorMouse = new THREE.Vector3( //vector from camera to mouse
                -(window.innerWidth / 2 - e.clientX) * 2 / window.innerWidth,
                (window.innerHeight / 2 - e.clientY) * 2 / window.innerHeight,
                // @ts-ignore
                -1 / Math.tan((camera.fov / 2) * Math.PI / 180));
            vectorMouse.applyQuaternion(camera.quaternion);
            vectorMouse.normalize();

            console.log("vectorMouse", vectorMouse);
        }, false);

        cameraControlsRef.current.mouseButtons.left = 0;
        cameraControlsRef.current.mouseButtons.right = 1;
        cameraControlsRef.current.mouseButtons.middle = 1;
    }, [cameraControlsRef]);

    const Controls = (props) => {
        const controlConfig = {
            minDistance: 1,
            enabled: true,
            verticalDragToForward: true,
            dollyToCursor: false,
            infinityDolly: true,
        };

        const control = <CameraControls ref={props.cameraControlsRef} {...controlConfig} />;

        return control;
    }

    return (
        <Controls cameraControlsRef={cameraControlsRef} />
    );
}
export default CamControl;