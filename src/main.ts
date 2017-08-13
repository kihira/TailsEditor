import * as THREE from 'three';
import 'imports-loader?THREE=three!three-examples/controls/OrbitControls';
import {BufferAttribute, VertexColors} from "three"; // todo probably need to look into why the config version of this isn't loading

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const controls = new THREE.OrbitControls(camera, renderer.domElement);

let playerObject: THREE.Object3D;
let selectedObject: THREE.Object3D;
let selectedAxisHelper = new THREE.AxisHelper();
let grid: THREE.Object3D;

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

    let dimensions = 20;
    let index: number;

    // Create axis guides
    createGuides();

    function createGuides() {
        let vertices = new BufferAttribute(new Float32Array([
            0, 0, 0,    dimensions, 0, 0,
            0, 0, 0,    -dimensions, 0, 0,
            0, 0, 0,    0, dimensions, 0,
            0, 0, 0,    0, 0, dimensions,
            0, 0, 0,    0, 0, -dimensions
        ]), 3);
        let colors = new BufferAttribute(new Float32Array([
            1, 0, 0,        1, 0, 0,
            0.6, 0.6, 0.6,  0.6, 0.6, 0.6,
            0, 1, 0,        0, 1, 0,
            0, 0, 1,        0, 0, 1,
            0.6, 0.6, 0.6,  0.6, 0.6, 0.6,
        ]), 3);

        let geometry = new THREE.BufferGeometry();
        geometry.addAttribute('position', vertices);
        geometry.addAttribute('color', colors);

        scene.add(new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
            vertexColors: VertexColors,
            linewidth: 0.5,
        })));
    }

    // Load default models
    // todo loadPlayerModel();

    // Create base grid
    let geometry = new THREE.BufferGeometry();
    let vertices = new THREE.BufferAttribute(new Float32Array((dimensions*2*2*3)*2), 3);
    index = 0;
    for (let x = -dimensions; x <= dimensions; x++) {
        if (x == 0) continue;
        vertices.setXYZ(index, x, 0, -dimensions);
        vertices.setXYZ(index+1, x, 0, dimensions);
        index+=2;
    }
    for (let z = -dimensions; z <= dimensions; z++) {
        if (z == 0) continue;
        vertices.setXYZ(index, -dimensions, 0, z);
        vertices.setXYZ(index+1, dimensions, 0, z);
        index+=2;

    }
    geometry.addAttribute( 'position', vertices);
    grid = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({
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
init();
render();