// https://docs.pmnd.rs/react-three-fiber/api/canvas
import { Canvas, } from '@react-three/fiber';
import { PerspectiveCamera, CameraControls } from '@react-three/drei';
import TestScene from "../scenes/TestScene";

const Main = (props) => {

    return (
        <div id="canvas-container" style={{ height: "100%", width: "100%" }} >
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 60 }}>
                <TestScene />
            </Canvas>
            {/* <Canvas shadows camera={{ position: [0, 0, 5], fov: 90 }}>
                <PerspectiveCamera makeDefault position={[-1.5, 1.5, 7]} fov={90} near={1} far={20}>
                    <CameraControls />
                </PerspectiveCamera>
                <color attach="background" args={['black']} />
                <ambientLight intensity={.01} />
                <directionalLight color="red" position={[70, 50, 100]} />
                <directionalLight color="red" position={[-70, -50, -100]} />

                <mesh>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial />
                </mesh>

            </Canvas> */}
        </div>
    );
}

export default Main;