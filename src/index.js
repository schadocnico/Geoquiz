import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Pin(props){
        return (
            <div 
                className="pin" 
                id="pin"
                style={{
                    "marginLeft": props.coordonnees.x - 25,
                    "marginTop": props.coordonnees.y - 51
                }}
            >
                <svg 
                    className="bi bi-geo" 
                    style={{
                        "width": 51,
                        "height": 51
                    }} 
                    viewBox="0 0 16 11" 
                    fill="currentColor" 
                    xmlns="http://www.w3.org/2000/svg" 
                >
                    <path d="M11 4a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                    <path d="M7.5 4h1v9a.5.5 0 0 1-1 0V4z"/>
                </svg>
            </div>
            
        );
}

class Board extends React.Component {

    constructor (props) {

        super(props);
        this.state = {
            // Coordonnées de la souris lors du clic sur le bouton
            "clickCoordinate": {
                "x": null,
                "y": null
            },
            "haveClicked" : false,
            // Coordonnées du bouton en pixel géneral
            "boundingMap": {
                "top": null,
                "bottom": null,
                "right": null,
                "left": null
            },
            // Si la bounding map a été initialisé
            "boundingIsInit": false
        };

    }

    calculateCoordinate(){
        /** Calcule les coordonnées local du bouton avec ceux du general 
         * retourne un JSON avec x et y
        */

        let x = this.state.clickCoordinate.x - this.state.boundingMap.left
        let y = this.state.clickCoordinate.y - this.state.boundingMap.top

        return { "x": x, "y": y }

    }

    handleClick (event, el) {

        const newCoo = {
            "x": event.pageX,
            "y": event.pageY
        };

        if(newCoo.x > this.state.boundingMap.left 
            && newCoo.x < this.state.boundingMap.right 
            && newCoo.y > this.state.boundingMap.top
            && newCoo.y < this.state.boundingMap.bottom ) {
                this.setState({ "clickCoordinate": newCoo, "haveClicked": true });
        }

    }

    render () {

        let pin = (() => {
            if(this.state.haveClicked){
                return (
                    <Pin 
                        coordonnees = {this.calculateCoordinate()}
                    />
                );
            }
        })();

        return (
            <div
                className="board-button"
                id="principale-button"
                onClick={(event) => this.handleClick(event)}
                ref={(el) => {

                    // El can be null 
                    // https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
                    if (!el) {

                        return;

                    } else if(!this.state.boundingIsInit){
                        const rect = el.getBoundingClientRect();
                        const bound = {
                            top: rect.top + window.scrollY ,
                            bottom: rect.bottom + window.scrollY,
                            left: rect.left + window.scrollX,
                            right: rect.right + window.scrollX
                        }
                        this.setState({ 
                            boundingMap : bound, 
                            boundingIsInit : true
                        });
                    }
                }}
            >{pin}</div>
        );    
    }

}

function App(props){
        return (
            <div className="container-fluid">
                <div className="game-board">
                    <Board />
                </div>
            </div>
        );
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
