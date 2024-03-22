import { Grid, AccumulativeShadows, RandomizedLight, Stars, Sky } from "@react-three/drei";
import { memo } from "react";

const TestScene = (props) => {

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

    return (
        <group position-y={-0.5}>
            <Ground />
            {/* <Shadows /> */}
            <Atmosphere />
        </group>
    );
}

export default TestScene;