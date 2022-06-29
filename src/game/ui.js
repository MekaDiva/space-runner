import * as THREE from "three";
import Game from "../game";

const pathArrowIdle = process.env.PUBLIC_URL + "/img/arrowRightIdle.png";
const pathArrowOver = process.env.PUBLIC_URL + "/img/arrowRightOver.png";
const pathArrowPress = process.env.PUBLIC_URL + "/img/arrowRightPress.png";

class Ui extends THREE.EventDispatcher {
    constructor() {
        super();

        this.init = this.init.bind(this);
    }

    init() {
        // Add game explication
        let gameExplication = document.createElement("p");
        gameExplication.innerText = "Use mouse to move the player to collect oil and avoid obstacle \n Success when the oil barrel becames black";
        gameExplication.style.fontSize = "25px";
        gameExplication.style.color = "black";
        gameExplication.style.textAlign = "center";
        gameExplication.style.position = "absolute";
        gameExplication.style.left = "calc(50% - 500px)";
        gameExplication.style.top = "calc(0% - 20px)";
        gameExplication.style.width = "1000px";
        gameExplication.style.height = "100px";

        document.body.appendChild(gameExplication);

        // Add Start button
        let startButton = document.createElement("p");
        startButton.id = "startButton";
        startButton.innerText = "Start";
        startButton.style.fontSize = "50px";
        startButton.style.color = "black";
        startButton.style.textAlign = "center";
        startButton.style.position = "absolute";
        startButton.style.left = "calc(50% - 100px)";
        startButton.style.top = "calc(50% - 50px)";
        startButton.style.width = "200px";
        startButton.style.height = "100px";
        startButton.style.cursor = "pointer";
        startButton.onmouseenter = function() {
            startButton.style.color = "gray";
        }
        startButton.onmouseup = function() {
            Game.start();
        }
        startButton.onmouseleave = function() {
            startButton.style.color = "black";
        }

        document.body.appendChild(startButton);

        // Add score for the oil collected
        let gameScore = document.createElement("p");
        gameScore.innerText = "Oil collected: 0 / 10";
        gameScore.style.fontSize = "40px";
        gameScore.style.color = "black";
        gameScore.style.position = "absolute";
        gameScore.style.left = "calc(2%)";
        gameScore.style.top = "calc(90%)";
        gameScore.style.width = "500px";
        gameScore.style.height = "100px";

        document.body.appendChild(gameScore);
    }

    toggleStartButton(isButtonActive) {

    }

    toggleResetButton(isButtonActive) {
        
    }

    showCurrentOilScore() {
        
    }
}

export default new Ui();
