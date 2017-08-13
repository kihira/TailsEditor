import * as THREE from 'three';
(window as any).THREE = THREE;
import 'three/examples/js/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

let playerObject: THREE.Object3D;
let selectedObject: THREE.Object3D;
let selectedAxisHelper = new THREE.AxisHelper();

/** Functions **/

function init() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor('#dddddd');
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.domElement.addEventListener('mousemove', onMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onMouseClick, false);

    document.body.appendChild(renderer.domElement);

    window.addEventListener('keypress', onKeyPress, false);
    window.addEventListener('resize', onWindowResize, false);

    controls.addEventListener('change', render);

    // Load default models
    // todo loadPlayerModel();

    // Create base grid
    let dimensions = 20;
    let geometry = new THREE.BufferGeometry();
    let vertices = new Float32Array((dimensions*2*2*3)*2);
    let index = 0;
    for (let x = -dimensions; x <= dimensions; x++) {
        vertices[index] = x;
        vertices[index+1] = 0;
        vertices[index+2] = -dimensions;
        vertices[index+3] = x;
        vertices[index+4] = 0;
        vertices[index+5] = dimensions;
        index += 6;
    }
    for (let z = -dimensions; z <= dimensions; z++) {
        vertices[index] = -dimensions;
        vertices[index+1] = 0;
        vertices[index+2] = z;
        vertices[index+3] = dimensions;
        vertices[index+4] = 0;
        vertices[index+5] = z;
        index += 6;
    }
    geometry.addAttribute( 'position', new THREE.BufferAttribute(vertices, 3));
    let grid = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
        color: 0xAAAAAA,
        linewidth: 0.5,
    }));
    scene.add(grid);

    // Set up camera
    camera.position.set(25, 25, 25);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function moveCamera(x: number, y: number, z: number) {
    camera.position.set(x, y, z);
    camera.updateProjectionMatrix();
}

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

function onMouseMove(event: MouseEvent) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function onMouseClick(event: MouseEvent) {
    raycaster.setFromCamera(mouse, camera);

    let intersects = raycaster.intersectObjects(scene.children, true); // todo ignore player model
    if (intersects.length == 0) {
        setSelectedObject(null);
        return;
    }

    selectedObject = intersects[0].object;
}

function onKeyPress(event: KeyboardEvent) {
}

function onWindowResize(event: UIEvent) {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

/** Run code **/
console.log("Hello!");
init();
render();