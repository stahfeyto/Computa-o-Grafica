import * as THREE from "three";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

export class Palete extends THREE.Object3D {
    static TextureLoader = new THREE.TextureLoader();
    static FontLoader = new FontLoader();
    static CardboardTexture = Palete.TextureLoader.load("img/papelao.jpg");
    static AlternatorTexture = Palete.TextureLoader.load("img/Alternador.jpg");
    static Font;

    // Load the font asynchronously
    static async load() {
        try {
            Palete.Font = await new Promise((resolve, reject) => {
                Palete.FontLoader.load(
                    "https://threejs.org/examples/fonts/helvetiker_regular.typeface.json",
                    resolve,
                    undefined,
                    reject
                );
            });
        } catch (error) {
            console.error("Error loading font:", error);
        }
    }

    // Define constants
    static Angle = 0.5; // azul
    static Text = { blue: "ALTERNATORS XPTO", black: " MY COMPANY INC :)" };

    constructor(width, height, boxHeight) {
        super();

        // Scale down dimensions
        width /= 55;
        height /= 55;
        boxHeight /= 55;

        // Create materials
        const cardboardMaterial = new THREE.MeshBasicMaterial({ map: Palete.CardboardTexture });
        const alternatorMaterial = new THREE.MeshBasicMaterial({ map: this.createAlternatorTexture(width, height) });

        // Assign materials to the sides of the box
        const materials = [
            cardboardMaterial, // right side
            cardboardMaterial, // left side
            alternatorMaterial, // top side
            cardboardMaterial, // bottom side
            cardboardMaterial, // front side
            cardboardMaterial  // back side
        ];

        // Create geometry and mesh
        const geometry = new THREE.BoxGeometry(width, boxHeight, height);
        const pallet = new THREE.Mesh(geometry, materials);
        pallet.translateY(boxHeight / 2);
        pallet.rotation.y = -Palete.Angle;

        // Add text to the sides
        this.addTextToPallet(pallet, width, height);

        // Add pallet to the scene
        this.add(pallet);
    }

    // Create text mesh
    createText(size, color, text) {
        const textGeometry = new TextGeometry(text, {
            font: Palete.Font,
            size,
            height: 0.01,
            bevelEnabled: false
        });
        textGeometry.center();
        return new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color }));
    }

    // Add text to the pallet
    addTextToPallet(pallet, width, height) {
        const textWidth = width * 0.03;
        const textHeight = height * 0.03;

        const frontText = this.createText(textWidth, 0x0000ff, Palete.Text.blue + Palete.Text.black);
        frontText.translateZ(height / 2);
        pallet.add(frontText);

        const backText = this.createText(textWidth, 0x0000ff, Palete.Text.blue + Palete.Text.black);
        backText.translateZ(-height / 2);
        backText.rotation.y = Math.PI;
        pallet.add(backText);

        const rightText = this.createText(textHeight, 0x0000ff, Palete.Text.blue + Palete.Text.black);
        rightText.translateX(width / 2);
        rightText.rotation.y = Math.PI / 2;
        pallet.add(rightText);

        const leftText = this.createText(textHeight, 0x0000ff, Palete.Text.blue + Palete.Text.black);
        leftText.translateX(-width / 2);
        leftText.rotation.y = -Math.PI / 2;
        pallet.add(leftText);
    }

    // Create repeated texture
    createAlternatorTexture(width, height) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const tileWidth = Palete.AlternatorTexture.image.width;
        const tileHeight = Palete.AlternatorTexture.image.height;

        canvas.width = tileWidth * Math.ceil((width * 30) / tileWidth);
        canvas.height = tileHeight * Math.ceil((height * 30) / tileHeight);

        for (let y = 0; y < canvas.height; y += tileHeight) {
            for (let x = 0; x < canvas.width; x += tileWidth) {
                context.drawImage(Palete.AlternatorTexture.image, x, y, tileWidth, tileHeight);
            }
        }

        const repeatedTexture = new THREE.CanvasTexture(canvas);
        repeatedTexture.wrapS = THREE.RepeatWrapping;
        repeatedTexture.wrapT = THREE.RepeatWrapping;
        repeatedTexture.needsUpdate = true;

        return repeatedTexture;
    }
}
