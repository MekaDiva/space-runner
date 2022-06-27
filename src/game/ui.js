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
        
    }


}

export default new Ui();