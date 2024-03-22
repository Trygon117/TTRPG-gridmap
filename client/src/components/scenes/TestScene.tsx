import { Grid, CameraControls, AccumulativeShadows, RandomizedLight, Stars, Sky } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { memo, useRef } from "react";

const TestScene = (props) => {
    const meshRef = useRef()
    const cameraControlsRef = useRef<CameraControls | null>(null);

    const { camera } = useThree()

    return (
        <group position-y={-0.5}>
            <Ground />
            {/* <Shadows /> */}
            <Atmosphere />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Controls cameraControlsRef={cameraControlsRef} />
        </group>
    );
}

const Controls = (props) => {
    const controlConfig = {
        minDistance: 1,
        enabled: true,
        verticalDragToForward: true,
        dollyToCursor: false,
        infinityDolly: true,
    };

    const control = <CameraControls ref={props.cameraControlsRef} {...controlConfig} />;

    props.cameraControlsRef.current.mouseButtons.left = 2;
    props.cameraControlsRef.current.mouseButtons.right = 1;

    return control;
}

const Atmosphere = () => {
    const skyConfig = {
        distance: 450000,
        inclination: 1,
        azimuth: .25,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.5,
        rayleigh: 0,
        turbidity: 1,
    }
    return <Sky sunPosition={[1, .5, 0]} {...skyConfig} />
}

const Ground = () => {
    const gridConfig = {
        cellSize: 0.5,
        cellThickness: .75,
        // cellColor: '#6f6f6f',
        sectionSize: 3,
        sectionThickness: 0,
        // sectionColor: '#9d4b4b',
        fadeDistance: 30,
        fadeStrength: 1,
        followCamera: false,
        infiniteGrid: true
    }
    return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}

const Shadows = memo(() => (
    <AccumulativeShadows temporal frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
        <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
    </AccumulativeShadows>
))

export default TestScene;