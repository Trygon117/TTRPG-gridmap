// https://www.npmjs.com/package/@react-three/fiber
// https://www.npmjs.com/package/@react-three/drei#perspectivecamera
// https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
import { Canvas } from '@react-three/fiber';

import TestScene from "../scenes/TestScene";
import CamControl from "../controls/CamControl";

const Main = (props) => {

    return (
        <div id="canvas-container" style={{ height: "100%", width: "100%" }} >
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 90 }} >
                <CamControl />
                <TestScene />
            </Canvas>
        </div>
    );
}

export default Main;