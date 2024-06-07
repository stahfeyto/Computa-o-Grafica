import * as THREE from "three";
import { Palete } from "./palete.js";

export class LogiAr extends THREE.Object3D {
    static AreaTexture = Palete.TextureLoader.load("img/mapa_area.png");

    constructor(width, height) {
        super();

        // Create the logistic area plane
        this.createLogisticArea(width, height);

        // Add pallets to the logistic area
        this.addPallet(1410, 1400, 1000, 370, -549);
        this.addPallet(1210, 1400, 1000, 510, -457);
    }

    // Function to create and add the logistic area plane
    createLogisticArea(width, height) {
        const areaMaterial = new THREE.MeshBasicMaterial({ map: LogiAr.AreaTexture });
        areaMaterial.side = THREE.DoubleSide;

        const areaGeometry = new THREE.PlaneGeometry(width, height);
        const area = new THREE.Mesh(areaGeometry, areaMaterial);

        area.translateX(width / 2);
        area.translateZ(-height / 2);
        area.rotateX(-Math.PI / 2);

        this.add(area);
    }

    // Utility function to create and position pallets
    addPallet(width, height, boxHeight, posX, posZ) {
        const pallet = new Palete(width, height, boxHeight);
        pallet.position.set(posX, 0, posZ);
        this.add(pallet);
    }
}
