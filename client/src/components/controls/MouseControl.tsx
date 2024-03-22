import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const MouseControl = (props) => {
    const camera = useThree(state => state.camera);

    const init = (e) => {
        console.log('init');
        document.addEventListener('mousedown', () => {
            console.log("mousedown");
            console.log(camera);

            var vectorMouse = new THREE.Vector3( //vector from camera to mouse
                -(window.innerWidth / 2 - e.clientX) * 2 / window.innerWidth,
                (window.innerHeight / 2 - e.clientY) * 2 / window.innerHeight,
                -1 / Math.tan(22.5 * Math.PI / 180)); //22.5 is half of camera frustum angle 45 degree
            vectorMouse.applyQuaternion(camera.quaternion);
            vectorMouse.normalize();
        }, false);
    }

    return (
        <div id="mouseControl" onLoad={init}></div>
    );
}
export default MouseControl;