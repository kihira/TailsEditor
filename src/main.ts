export = 0;

import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.Camera();
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let playerObject: THREE.Object3D;
let selectedObject: THREE.Object3D;
let selectedAxisHelper = new THREE.AxisHelper();

/** Functions **/

function loadPlayerModel() {
    let modelLoader = new THREE.JSONLoader();
    modelLoader.load('models/player.json',
        function (geometry, materials) {
            let material = materials[0];
            playerObject = new THREE.Mesh(geometry, material);

            scene.add(playerObject);
        }, function (progress) {
            console.log((progress.loaded / progress.total * 100) + '% loaded');
        }, function (err) {
            console.error(err);
        });
}

function setSelectedObject(obj: THREE.Object3D) {
    if (selectedObject != null) {
        selectedAxisHelper.visible = false;
        // todo remove highlight
    }

    if (obj == null) return;

    selectedObject = obj;
    selectedAxisHelper.visible = true;
    selectedAxisHelper.setRotationFromEuler(selectedObject.getWorldRotation());
    // todo highlight selected object
}

function render() {
    renderer.render(scene, camera);
}

function onMouseMove(event: MouseEvent) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseClick(event: MouseEvent) {
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(scene.children, true); // todo ignore player model
    if (intersects.length == 0) setSelectedObject(null);

    selectedObject = intersects[0].object;
}

/** Run code **/

renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mousedown', onMouseClick, false);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.requestAnimationFrame(render);

// Load default models
loadPlayerModel();

// Create base grid
let geometry = new THREE.BufferGeometry();
let vertices = new Float32Array(20 * 2 * 3);
let index = 0;
for (let x = -10; x <= 10; x++) {
    vertices[index] = x;
    vertices[index+1] = -10;
    vertices[index+2] = 0;
    vertices[index+3] = x;
    vertices[index+4] = 10;
    vertices[index+5] = 0;
    index += 6;
}
let grid = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
    color: 0xffffff,
    linewidth: 1,
    linejoin: "round",
    linecap: "round"

}));
scene.add(grid);

render();
