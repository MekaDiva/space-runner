import * as THREE from "three";
import Game from "../game";
import Objects from "game/objects";
import Player from "game/player";

class CollisionDetection extends THREE.EventDispatcher {
    constructor() {
        super();

        this.detectCollisions = this.detectCollisions.bind(this);
    }

    detectCollisions () {
        // Create a box for the player on its barrel
        const playerBox = new THREE.Box3().setFromObject(Game.player.barrel);

        Game.objects.obstaclesContainer.forEach(element => {
            
        });
    }
}

export default new CollisionDetection();