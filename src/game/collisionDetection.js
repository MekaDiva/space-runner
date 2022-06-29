import * as THREE from "three";
import Game, { sceneConfiguration } from "../game";

class CollisionDetection extends THREE.EventDispatcher {
    constructor() {
        super();

        this.detectCollisions = this.detectCollisions.bind(this);
    }

    detectCollisions () {
        // Create a box for the player on its barrel
        const playerBox = new THREE.Box3().setFromObject(Game.player.barrel);

        
        Game.objects.obstaclesContainer.children.forEach(element => {
            const obstacleBox = new THREE.Box3().setFromObject(element);

            if (obstacleBox.intersectsBox(playerBox)) {
                console.log("Obstacle touched");

                Game.playerDie();
            }
        });

        Game.objects.awardsContainer.children.forEach(element => {
            const awardBox = new THREE.Box3().setFromObject(element);

            if (awardBox.intersectsBox(playerBox)) {
                sceneConfiguration.data.oilCollected += 1;
                console.log("oilCollected: " + sceneConfiguration.data.oilCollected);

                Game.objects.awardsContainer.remove(element); 
            }
        });
    }
}

export default new CollisionDetection();