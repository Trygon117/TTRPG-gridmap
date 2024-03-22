import RenderWindow from "../renderWindow/RenderWindow";

const Main = (props) => {

    return (
        <div style={{ border: "5px solid grey", height: "calc(100vh - 10px)" }}>
            <RenderWindow />
        </div>
    );
}

export default Main;