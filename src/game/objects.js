import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Game from "../game";

const pathFloorTexture = process.env.PUBLIC_URL + "/img/protoGrey.png";
const pathPlayer3DModel = process.env.PUBLIC_URL + "/models/Xbot.glb";
const pathCristal3DModel = process.env.PUBLIC_URL + "/models/glowing_cristal/scene.gltf";

export default class Objects extends THREE.Object3D {

    constructor() {

        super();

        this.removeElements = this.removeElements.bind(this);

        this.world = null;
        this.elementsContainer = new THREE.Object3D();
        this.add(this.elementsContainer);
        this.currentElements = [];

        this.init();
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

    addPlayer() {
        let currentBaseAction = 'run';
        const allActions = [];
        const baseActions = {
            idle: { weight: 1 },
            walk: { weight: 0 },
            run: { weight: 0 }
        };

        this.glftLoader.load( 'models/gltf/Xbot.glb', function ( gltf ) {

            const model = gltf.scene;
            this.elementsContainer.add( model );

            model.traverse( function ( object ) {

                if ( object.isMesh ) object.castShadow = true;

            } );
            
            const skeleton = new THREE.SkeletonHelper( model );
            skeleton.visible = false;
            this.elementsContainer.add( skeleton );

            const animations = gltf.animations;
            const mixer = new THREE.AnimationMixer( model );

            var numAnimations = animations.length;

            for ( let i = 0; i !== numAnimations; ++ i ) {

                let clip = animations[ i ];
                const name = clip.name;

                if ( baseActions[ name ] ) {

                    const action = mixer.clipAction( clip );
                    action.play();
                    baseActions[ name ].action = action;
                    allActions.push( action );

                }
            }

        } );
    }

    addCristal() {
        var cristal3DModel = this.glftLoader.load(pathCristal3DModel).scene.children[0];
        this.elementsContainer.add(cristal3DModel);
    }

    removeElements() {

        for (let i = 0; i < this.currentElements.length; i++) {

            this.elementsContainer.remove(this.currentElements[i]);
            // this.currentElements[i].material.dispose();
            // this.currentElements[i].geometry.dispose();
        }

    }




    get container() {
        return this.elementsContainer;
    }


}
