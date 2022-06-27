import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Game from "../game";
// import AstroRaw from "objects/AstroRaw";

const pathFloorTexture = process.env.PUBLIC_URL + "/img/protoGrey.png";
const pathAstroGlbFile = process.env.PUBLIC_URL + "/models/astro.glb";

export default class Objects extends THREE.Object3D {

    constructor() {

        super();

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);

        this.addBasicElements = this.addBasicElements.bind(this);
        this.addPath = this.addPath.bind(this);

        this.elementsContainer = new THREE.Object3D();
        this.add(this.elementsContainer);
        this.currentElements = [];
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
        this.add(floorMesh);

        this.glftLoader = new GLTFLoader();
    }

    update() {

    }

    destroy() {

        for (let i = 0; i < this.currentElements.length; i++) {

            this.elementsContainer.remove(this.currentElements[i]);
            // this.currentElements[i].material.dispose();
            // this.currentElements[i].geometry.dispose();
        }

    }

    addBasicElements(elements) {

        for (let i = 0; i < elements.length; i++) {

            const element = elements[i];

            const material = new THREE.MeshStandardMaterial({ color: element.color });
            material.metalness = 0.5;

            const mesh = new THREE.Mesh(element.geometry, material);
            mesh.position.copy(element.position);
            mesh.castShadow = true;
            this.elementsContainer.add(mesh);
            this.currentElements.push(mesh);

        }

    }

    addPath(courseLength) {
        // Add two wall on left and right and back
        this.addBasicElements([
            {
                geometry: new THREE.BoxGeometry(1, 0.5, courseLength),
                color: 0xbf2121,
                position: new THREE.Vector3(4, 0, courseLength / 2 - 4)
            },
            {
                geometry: new THREE.BoxGeometry(1, 0.5, courseLength),
                color: 0xbf2121,
                position: new THREE.Vector3(-4, 0, courseLength / 2 - 4)
            },
            {
                geometry: new THREE.BoxGeometry(9, 0.5, 1),
                color: 0xbf2121,
                position: new THREE.Vector3(0, 0, -4)
            }
        ]);

        
    }

    get container() {
        return this.elementsContainer;
    }
}
