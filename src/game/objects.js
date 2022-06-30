import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Game, { sceneConfiguration } from "../game";
import Tools from "game/tools";
import { waitFor } from "@testing-library/react";

const pathFloorTexture = process.env.PUBLIC_URL + "/img/protoWhite.png";
const pathBarrelFbxFile = process.env.PUBLIC_URL + "/models/Baril.FBX";

export default class Objects extends THREE.Object3D {
    constructor() {
        super();

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);

        this.addPath = this.addPath.bind(this);
        this.addBasicGeometries = this.addBasicGeometries.bind(this);
        this.addFbxModel = this.addFbxModel.bind(this);

        this.visualObjectsContainer = new THREE.Object3D();
        this.add(this.visualObjectsContainer);

        this.obstaclesContainer = new THREE.Object3D();
        this.add(this.obstaclesContainer);

        this.awardsContainer = new THREE.Object3D();
        this.add(this.awardsContainer);

        // True if all the loader is done loading
        this.loaderLoaded = false;

        // The mesh model of the barrel
        this.barrelModel = null;
    }

    async init() {
        console.log("objectsInit");

        this.fixedTimeStep = 1.0 / Game.FPS; // seconds
        this.maxSubSteps = 10;

        // Add ground
        const floorTexture = new THREE.TextureLoader().load(pathFloorTexture);
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set(1000, 1000);
        floorTexture.anisotrophy = 16;
        floorTexture.encoding = THREE.sRGBEncoding;
        const floorMaterial = new THREE.MeshStandardMaterial({ map: floorTexture });
        const floorMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000, 1000), floorMaterial);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.receiveShadow = true;
        this.visualObjectsContainer.add(floorMesh);

        this.glftLoader = new GLTFLoader();

        // Load the fbx barrel
        this.fbxLoader = new FBXLoader();
        this.barrelModel = (await this.fbxLoader.loadAsync(pathBarrelFbxFile)).children[0];
    }

    update() {
        //console.log(this.loaderLoaded);
    }

    destroy() {
        console.log("destroy called");

        while (this.visualObjectsContainer.children.length) {
            this.visualObjectsContainer.remove(this.visualObjectsContainer.children[0]);
        }

        while (this.obstaclesContainer.children.length) {
            this.obstaclesContainer.remove(this.obstaclesContainer.children[0]);
        }

        while (this.awardsContainer.children.length) {
            this.awardsContainer.remove(this.awardsContainer.children[0]);
        }
    }

    async addPath() {
        await 
        // Add two wall on left and right and back
        this.addBasicGeometries([
            {
                type: "obstacle",
                geometry: new THREE.BoxGeometry(1, 0.5, sceneConfiguration.courseLength),
                color: 0xbf2121,
                position: new THREE.Vector3(4, 0, sceneConfiguration.courseLength / 2 - 4),
            },
            {
                type: "obstacle",
                geometry: new THREE.BoxGeometry(1, 0.5, sceneConfiguration.courseLength),
                color: 0xbf2121,
                position: new THREE.Vector3(-4, 0, sceneConfiguration.courseLength / 2 - 4),
            },
            {
                type: "obstacle",
                geometry: new THREE.BoxGeometry(9, 0.5, 1),
                color: 0xbf2121,
                position: new THREE.Vector3(0, 0, -4),
            },
        ]);

        // Add oil image and wall on the path
        const nbLineObstacle = parseInt(sceneConfiguration.courseLength / sceneConfiguration.lengthBetweenObstacle);
        for (let indexLine = 0; indexLine < nbLineObstacle; indexLine++) {
            // Create a dictionary for each line of the identity of each object
            var dictOfObjectsInRow = {
                0: "wall",
                1: "wall",
                2: "wall",
                3: "wall",
            };

            for (let index = 0; index < sceneConfiguration.maximumOilInLine; index++) {
                var indexOfOil = Tools.randomNum(0, 3);
                dictOfObjectsInRow[indexOfOil] = "oil";
            }

            // console.log(dictOfObjectsInRow);

            // According to the dictionary add the object to the line
            for (let index = 0; index < 4; index++) {
                if (dictOfObjectsInRow[index] == "wall") {
                    // Create a wall
                    this.addBasicGeometries([
                        {
                            type: "obstacle",
                            geometry: new THREE.BoxGeometry(0.5, 1, 0.3),
                            color: 0xbf2121,
                            position: new THREE.Vector3(2.5 - (5 / 3) * index, 0.5, indexLine * sceneConfiguration.lengthBetweenObstacle + 5),
                        },
                    ]);
                } else if (dictOfObjectsInRow[index] == "oil") {
                    // Create a oil barrel
                    this.addFbxModel([
                        {
                            type: "award",
                            mesh: this.barrelModel,
                            size: new THREE.Vector3(0.001, 0.001, 0.001),
                            position: new THREE.Vector3(2.5 - (5 / 3) * index, 0, indexLine * sceneConfiguration.lengthBetweenObstacle + 5),
                        },
                    ]);
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
            if (element.type == "obstacle") {
                this.obstaclesContainer.add(mesh);
            } else if (element.type == "award") {
                this.awardsContainer.add(mesh);
            }
        }
    }

    addFbxModel(elements) {
        for (let index = 0; index < elements.length; index++) {
            const element = elements[index];

            const fbxModel = element.mesh.clone();
            const fbxMaterial = new THREE.MeshToonMaterial({ color: 0x636363 });
            fbxModel.material = fbxMaterial;
            fbxModel.castShadow = true;
            fbxModel.position.copy(element.position);
            fbxModel.scale.copy(element.size);

            if (element.type == "obstacle") {
                this.obstaclesContainer.add(fbxModel);
            } else if (element.type == "award") {
                this.awardsContainer.add(fbxModel);
            }
        }
    }
}
