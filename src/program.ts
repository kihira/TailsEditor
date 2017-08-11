import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.Camera();
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let selectedObject: THREE.Object3D;
let selectedAxisHelper = new THREE.AxisHelper();

/** Functions **/

function loadPlayerModel() {
    let modelLoader = new THREE.JSONLoader();
    modelLoader.load('models/player.png',
        function (geometry, materials) {
            let material = materials[0];
            let object = new THREE.Mesh(geometry, material);

            scene.add(object);
        }, function (progress) {
            console.log((progress.loaded / progress.total * 100) + '% loaded');
        }, function (err) {
            console.error(err.message);
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

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.requestAnimationFrame(render);
renderer.domElement.addEventListener('mousemove', onMouseMove, false);
renderer.domElement.addEventListener('mousedown', onMouseClick, false);
