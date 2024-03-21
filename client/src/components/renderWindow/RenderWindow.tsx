// https://docs.pmnd.rs/react-three-fiber/api/canvas
import { Canvas } from '@react-three/fiber';

const Main = (props) => {

    return (
        <div id="canvas-container">
            <Canvas camera={{ position: [-1.5, 1, 5.5], fov: 70, near: 1, far: 20 }}>
                <color attach="background" args={['black']} />
                <ambientLight intensity={.1} />
                <directionalLight color="red" position={[0, 0, 100]} />
                <mesh>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial />
                </mesh>
            </Canvas>
        </div>
    );
}

export default Main;