"use strict";

import * as THREE from "three";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { LogiAr } from "./models/index.js";

export class WebGL {
    constructor(canvas) {
        this.clock = new THREE.Clock();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x363636);

        this.createCamera();
        this.createTrackballControls();
        this.createScene();

        window.addEventListener("resize", this.resize.bind(this));
    }

    createCamera() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
        this.camera.position.set(500, 200, -1000);
        this.camera.lookAt(this.scene.position);
    }

    createTrackballControls() {
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 10.0;
        this.controls.zoomSpeed = 1.0;
        this.controls.panSpeed = 1.0;
        this.controls.staticMoving = true;
    }

    createScene() {
        const axes = new THREE.AxesHelper(500);
        this.scene.add(axes);

        this.scene.add(new LogiAr(1126, 1076));
    }

    clearScene() {
        while (this.scene.children.length > 0) {
            const object = this.scene.children[0];
            object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            this.scene.remove(object);
        }
        this.createScene();
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        const delta = this.clock.getDelta();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
