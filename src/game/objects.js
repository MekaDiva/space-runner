import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Game, { sceneConfiguration } from "../game";
// import AstroRaw from "objects/AstroRaw";

const pathFloorTexture = process.env.PUBLIC_URL + "/img/protoWhite.png";
const pathOilTexture = process.env.PUBLIC_URL + "/img/Oil.png";
//const pathOilTexture = process.env.PUBLIC_URL + "/img/protoGrey.png";

export default class Objects extends THREE.Object3D {

    constructor() {

        super();

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);

        this.addBasicGeometries = this.addBasicGeometries.bind(this);
        this.addPath = this.addPath.bind(this);

        this.visualObjectsContainer = new THREE.Object3D();
        this.add(this.visualObjectsContainer);

        this.obstaclesContainer = new THREE.Object3D();
        this.add(this.obstaclesContainer);

        this.awardsContainer = new THREE.Object3D();
        this.add(this.awardsContainer);
    }

    init() {
        console.log("objectsInit");

        this.fixedTimeStep = 1.0 / Game.FPS; // seconds
        this.maxSubSteps = 10;

        // Add ground
        const floorTexture = new THREE.TextureLoader().load(pathFloorTexture);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1000, 1000);
        floorTexture.anisotrophy = 16;
        floorTexture.encoding = THREE.sRGBEncoding;
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture })
        const floorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), floorMaterial);
        floorMesh.rotation.x = - Math.PI / 2;
        floorMesh.receiveShadow = true;
        this.visualObjectsContainer.add(floorMesh);

        this.glftLoader = new GLTFLoader();
    }

    update() {

    }

    destroy() {

        for (let i = 0; i < this.currentElements.length; i++) {

            this.obstaclesContainer.remove(this.currentElements[i]);
            // this.currentElements[i].material.dispose();
            // this.currentElements[i].geometry.dispose();
        }

    }

    addPath() {
        // Add two wall on left and right and back
        this.addBasicGeometries([
            {
                type: 'obstacle',
                geometry: new THREE.BoxGeometry(1, 0.5, sceneConfiguration.courseLength),
                color: 0xbf2121,
                position: new THREE.Vector3(4, 0, sceneConfiguration.courseLength / 2 - 4)
            },
            {
                type: 'obstacle',
                geometry: new THREE.BoxGeometry(1, 0.5, sceneConfiguration.courseLength),
                color: 0xbf2121,
                position: new THREE.Vector3(-4, 0, sceneConfiguration.courseLength / 2 - 4)
            },
            {
                type: 'obstacle',
                geometry: new THREE.BoxGeometry(9, 0.5, 1),
                color: 0xbf2121,
                position: new THREE.Vector3(0, 0, -4)
            }
        ]);

        // Add oil image and wall on the path
        const nbLineObstacle = parseInt(sceneConfiguration.courseLength / sceneConfiguration.lengthBetweenObstacle);
        for (let indexLine = 0; indexLine < nbLineObstacle; indexLine++) {
            // Create a dictionary for each line of the identity of each object
            var dictOfObjectsInRow = {
                0: 'wall',
                1: 'wall',
                2: 'wall',
                3: 'wall',
            }

            for (let index = 0; index < sceneConfiguration.maximumOilInLine; index++) {
                var indexOfOil = this.randomNum(0, 3);
                dictOfObjectsInRow[indexOfOil] = 'oil';
            }

            // console.log(dictOfObjectsInRow);

            // According to the dictionary add the object to the line
            for (let index = 0; index < 4; index++) {
                if (dictOfObjectsInRow[index] == 'wall') {
                    // Create a wall
                    this.addBasicGeometries([
                        {
                            type: 'obstacle',
                            geometry: new THREE.BoxGeometry(0.5, 0.5, 0.3),
                            color: 0xbf2121,
                            position: new THREE.Vector3((2.5 - 5 / 3 * index), 0.25, (indexLine * sceneConfiguration.lengthBetweenObstacle) + 5)
                        }])
                }
                else if (dictOfObjectsInRow[index] == 'oil') {
                    // Create a oil
                    this.addBasicSprites([
                        {
                            type: 'award',
                            size: new THREE.Vector2(0.5, 0.5),
                            position: new THREE.Vector3((2.5 - 5 / 3 * index), 0.1, (indexLine * sceneConfiguration.lengthBetweenObstacle) + 5)
                        }])
                }
            }
        }
    }

    addBasicGeometries(elements) {

        for (let i = 0; i < elements.length; i++) {

            const element = elements[i];

            const material = new THREE.MeshStandardMaterial({ color: element.color });
            material.metalness = 0.5;

            const mesh = new THREE.Mesh(element.geometry, material);
            mesh.position.copy(element.position);
            mesh.castShadow = true;
            if (element.type == 'obstacle') {
                this.obstaclesContainer.add(mesh);
            }
            else if (element.type == 'award') {
                this.awardsContainer.add(mesh);
            }
        }

    }

    addBasicSprites(elements) {

        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];

            const texture = new THREE.TextureLoader().load(pathOilTexture);
            texture.anisotrophy = 16;
            texture.encoding = THREE.sRGBEncoding;
            const material = new THREE.MeshStandardMaterial({ map: texture });

            const spriteMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(element.size.x, element.size.y), material);
            spriteMesh.position.copy(element.position);
            spriteMesh.rotation.copy(new THREE.Euler( - Math.PI / 2, 0, Math.PI));
            spriteMesh.castShadow = true;
            if (element.type == 'obstacle') {
                this.obstaclesContainer.add(spriteMesh);
            }
            else if (element.type == 'award') {
                this.awardsContainer.add(spriteMesh);
            }
        }
    }

    // Returns the random number in [minNum,maxNum]
    randomNum(minNum, maxNum) {
        switch (arguments.length) {
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    }
}
