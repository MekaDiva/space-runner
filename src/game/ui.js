import * as THREE from "three";
import Game, { sceneConfiguration } from "../game";

const pathOilTexture = process.env.PUBLIC_URL + "/img/Oil.png";

class Ui extends THREE.EventDispatcher {
    constructor() {
        super();

        this.init = this.init.bind(this);
        this.toggleStartButton = this.toggleStartButton.bind(this);
        this.toggleResetButton = this.toggleResetButton.bind(this);
        this.toggleAlert = this.toggleAlert.bind(this);
    }

    init() {
        // Add game explication
        let gameExplication = document.createElement("p");
        gameExplication.id = "gameExplication";
        gameExplication.innerText = "Use mouse to move the player to collect oil and avoid obstacle \n Success when the oil number reach the target number";
        gameExplication.style.fontSize = "25px";
        gameExplication.style.color = "black";
        gameExplication.style.textAlign = "center";
        gameExplication.style.position = "absolute";
        gameExplication.style.left = "calc(50% - 500px)";
        gameExplication.style.top = "calc(0% - 20px)";
        gameExplication.style.width = "1000px";
        gameExplication.style.height = "100px";

        document.body.appendChild(gameExplication);

        // Add the oil image for the score
        let oilImg = document.createElement("IMG");
        oilImg.src = pathOilTexture;
        oilImg.style.position = "absolute";
        oilImg.style.left = "calc(0%)";
        oilImg.style.bottom = "calc(0%)";
        oilImg.style.width = "100px";
        oilImg.style.height = "100px";

        document.body.appendChild(oilImg);

        // Add score for the oil collected
        let gameScore = document.createElement("p");
        gameScore.id = "gameScore";
        gameScore.innerText = "0 / 10";
        gameScore.style.fontSize = "40px";
        gameScore.style.color = "black";
        gameScore.style.position = "absolute";
        gameScore.style.textAlign = "center";
        gameScore.style.left = "calc(0%)";
        gameScore.style.bottom = "calc(0%)";
        gameScore.style.width = "300px";
        gameScore.style.height = "30px";

        document.body.appendChild(gameScore);
    }

    toggleStartButton(isActive) {
        if (isActive) {
            // Add start button
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
            startButton.onmouseenter = (e) => {
                startButton.style.color = "white";
            };
            startButton.onmouseup = (e) => {
                Game.start();

                this.toggleStartButton(false);
            };
            startButton.onmouseleave = (e) => {
                startButton.style.color = "black";
            };

            document.body.appendChild(startButton);
        } else {
            document.getElementById("startButton").remove();
        }
    }

    toggleResetButton(isActive) {
        if (isActive) {
            // Add reset button
            let resetButton = document.createElement("p");
            resetButton.id = "resetButton";
            resetButton.innerText = "reset";
            resetButton.style.fontSize = "50px";
            resetButton.style.color = "black";
            resetButton.style.textAlign = "center";
            resetButton.style.position = "absolute";
            resetButton.style.left = "calc(50% - 100px)";
            resetButton.style.top = "calc(50% - 50px)";
            resetButton.style.width = "200px";
            resetButton.style.height = "100px";
            resetButton.style.cursor = "pointer";
            resetButton.onmouseenter = (e) => {
                resetButton.style.color = "white";
            };
            resetButton.onmouseup = (e) => {
                Game.reset();

                this.toggleResetButton(false);
            };
            resetButton.onmouseleave = (e) => {
                resetButton.style.color = "black";
            };

            document.body.appendChild(resetButton);
        } else {
            document.getElementById("resetButton").remove();
        }
    }

    toggleAlert(isActive, text = "Alert") {
        console.log("toggleAlert");
        if (isActive) {
            // Add reset button
            let alert = document.createElement("p");
            alert.id = "alert";
            alert.innerText = text;
            alert.style.fontSize = "50px";
            alert.style.color = "black";
            alert.style.textAlign = "center";
            alert.style.position = "absolute";
            alert.style.left = "calc(50% - 250px)";
            alert.style.top = "calc(50% - 50px)";
            alert.style.width = "500px";
            alert.style.height = "100px";

            document.body.appendChild(alert);
        } else {
            document.getElementById("alert").remove();
        }
    }

    showCurrentOilScore() {
        let gameScore = document.getElementById("gameScore");
        gameScore.innerText = sceneConfiguration.data.oilCollected + " / " + sceneConfiguration.targetOilCollected;
    }
}

export default new Ui();
