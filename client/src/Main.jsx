import React from "react";
import ReactDOM from "react-dom";

class Main extends React.Component {
    render() {
        return (
            <div>
                TEST1
            </div>
        );
    }
}

const domContainer = document.getElementById("react-app");
ReactDOM.render(<Main/>, domContainer);
