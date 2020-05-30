import React from "react";
import ReactDOM from "react-dom";
import Container from "react-bootstrap/Container";

class Main extends React.Component {
    render() {
        return (
            <Container>
                TEST1
            </Container>
        );
    }
}

const domContainer = document.getElementById("react-app");
ReactDOM.render(<Main/>, domContainer);
