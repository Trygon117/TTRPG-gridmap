import { Grid, CameraControls, AccumulativeShadows, RandomizedLight, Stars, Sky } from "@react-three/drei";
import { memo, useEffect, useRef } from "react";

const TestScene = (props) => {
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

        cameraControlsRef.current.mouseButtons.left = 0;
        cameraControlsRef.current.mouseButtons.right = 1;
        cameraControlsRef.current.mouseButtons.middle = 1;
    }, [cameraControlsRef]);

    return (
        <group position-y={-0.5}>
            <Ground />
            {/* <Shadows /> */}
            <Atmosphere />
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

    return (
        <>
            <Stars radius={75} depth={100} count={10000} factor={7} saturation={5} fade speed={1} />
            <Sky sunPosition={[1, .5, 0]} {...skyConfig} />
        </>
    )
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
        infiniteGrid: true,
    }
    return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />
}

const Shadows = memo(() => (
    <AccumulativeShadows temporal frames={100} color="#9d4b4b" colorBlend={0.5} alphaTest={0.9} scale={20}>
        <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
    </AccumulativeShadows>
))

export default TestScene;