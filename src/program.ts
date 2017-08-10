import * as THREE from 'three'

let scene = new THREE.Scene();
let camera = new THREE.Camera();
let renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let axis = new THREE.AxisHelper(10);

function createPlayer() {
/*    var loader = new THREE.TextureLoader();
    loader.load('textures/player.png',
        function (texture) {
            var material = new THREE.MeshBasicMaterial({
                map: texture
            });
        }, function (progress) {
            console.log((progress.loaded / progress.total * 100) + '% loaded');
        }, function (err) {
            console.error(err.message);
        });*/
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