import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Game from "../game";

const pathAstroGlbFile = process.env.PUBLIC_URL + "/models/astro.glb";
const pathBarrelFbxFile = process.env.PUBLIC_URL + "/models/Baril.FBX";
const pathAstroColorMap = process.env.PUBLIC_URL + "/img/astroColorMap.png";

export default class Player extends THREE.Object3D {
    constructor() {
        super();

        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        this.destroy = this.destroy.bind(this);


        this.addPlayer = this.addPlayer.bind(this);
        this.gltfLoaded = this.gltfLoaded.bind(this);
    }

    init() {
        this.clock = new THREE.Clock();
        this.glftLoader = new GLTFLoader();
        this.fbxLoader = new FBXLoader();
        this.astro = new THREE.Object3D();

        this.mixer = null;
        this.runClip = null;
        this.idleClip = null;
    }

    update() {
        //console.log("hahahaha", this.clock.getDelta());
        if (this.mixer != null) {
            this.mixer.update(this.clock.getDelta());
        }
    }

    destroy() {

    }

    addPlayer() {
        // Load a glTF player resource
        this.glftLoader.load(
            // resource URL
            pathAstroGlbFile,
            this.gltfLoaded,
            // called while loading is progressing
            function (xhr) {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
            }
        );

        // Load a fbx barrel resource
        this.fbxLoader.load(
            // resource URL
            pathBarrelFbxFile,
            this.gltfLoaded,
            // called while loading is progressing
            function (xhr) {
                //console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            // called when loading has errors
            function (error) {
                console.log('An error happened');
            }
        );
    }

    gltfLoaded(gltf) {
        let astroMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });
        let astroTexture = new THREE.TextureLoader().load(pathAstroColorMap);
        astroMaterial.map = astroTexture;
        astroMaterial.skinning = true;

        // called when the resource is loaded
        let model = gltf.scene;
        // model.children[3].material = astroMaterial;
        // model.children[3].castShadow = true;
        model.children.map((object) => {
            if (object.type == "SkinnedMesh") {
                object.material = astroMaterial;
                object.castShadow = true;
            }

            if (object.type == "Mesh") {
                object.visible = false;
            }
        })

        this.model3D = model;
        this.add(this.model3D);

        this.mixer = new THREE.AnimationMixer(model);

        this.runClip = this.mixer.clipAction(gltf.animations[0]);

        this.idleClip = this.mixer.clipAction(gltf.animations[1]);

        this.idleClip.play();
    }

    fbxLoaded(fbx) {
        // called when the resource is loaded
        let model = fbx.scene;

        this.model3D = model;
        this.add(this.model3D);

        this.mixer = new THREE.AnimationMixer(model);

        this.runClip = this.mixer.clipAction(gltf.animations[0]);

        this.idleClip = this.mixer.clipAction(gltf.animations[1]);

        this.idleClip.play();
    }
}