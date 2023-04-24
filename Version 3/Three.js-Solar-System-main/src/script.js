import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { Object3D } from 'three'

/**
 * Base 
 */

const planets = [
    {name: 'mercury', sizeRatio: 100/277, position: 15, rotation: 0.002},
    {name: 'venus', sizeRatio: 100/133, position: 20, rotation: 0.0075},
    {name: 'earth', sizeRatio: 100/103, position: 25, rotation: 0.0065},
    {name: 'mars', sizeRatio: 100/208, position: 30, rotation: 0.0025},
    {name: 'jupiter', sizeRatio: 30/9.68, position: 40, rotation: 0.0055},
    {name: 'saturn', sizeRatio: 30/11.4, position: 50, rotation: 0.004},
    {name: 'uranus', sizeRatio: 30/26.8, position: 60, rotation: 0.006},
    {name: 'neptune', sizeRatio: 30/27.7, position: 70, rotation: 0.003},
    // {name: 'galaxy', sizeRatio: 100/277, position: 75, rotation: 0.002},
]

const orbitRadius = [15, 20, 25, 30, 40, 50, 60, 70]

const orbitsObject3D = []
const planetsObject3D = []

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */

 const loader = new THREE.FontLoader(); 
 let geometry;
 loader.load( 'fonts/helvetiker_regular.typeface.json', function ( font ) {
 
    geometry =  new THREE.TextGeometry( 'Three.js Solar System', {
        font: font,
        size: 80,
        height: 20,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 10,
        bevelSize: 8,
        bevelOffset: 0,
        bevelSegments: 5
    } );
} )

 const textMesh = new THREE.Mesh(
    geometry,
    new THREE.MeshNormalMaterial()
)
scene.add(textMesh)
textMesh.position.y = 20
const textureLoader = new THREE.TextureLoader()

const sun = new THREE.Mesh( 
    new THREE.SphereGeometry( 10, 32, 32 ), 
    new THREE.MeshStandardMaterial(
        {
            map: textureLoader.load('/textures/sun.jpg')
        }
    ));

// scene.background = textureLoader.load('/textures/stars.jpg')

/**
 * AND HERE COMES THE GALAXY GLB
 */

//FOR MY CUSTOM SCENES
var sphereTab = [];

    for (var i = 0; i < 500; i++) {
        // randRadius = Math.random()*30+10;
       var lumiereS = new THREE.MeshPhongMaterial({
            emissive: '#C278F4'
        });
        sphereTab.push(new THREE.Mesh(new THREE.SphereGeometry(Math.random() * 1, 20, 20), lumiereS));
    }
    
    for (var i = 0; i < sphereTab.length; i++) {
        sphereTab[i].position.set(Math.random() * 1200 - 500, Math.random() * 1200 - 500, Math.random() * 1200 - 500);
        scene.add(sphereTab[i]);
    }
    
    
const loader2 = new GLTFLoader();
var galaxy,cinder_castle;
// loader2.load('/assets/glb/galaxy.glb',function(glb){
    
//     glb.scene.scale.set(100,100,100);
//     glb.scene.position.set(-140,-150,130);
//     galaxy= glb.scene;
//    scene.add(galaxy);
// },function(error){
//     console.log("error occ");
// });

let mixer= THREE.AnimationMixer;
let modelReady = false
const animationActions= THREE.AnimationAction 
let activeAction= THREE.AnimationAction
let lastAction= THREE.AnimationAction

loader2.load('/assets/glb/mew_-_flying.glb',function(glb){
    
    mixer = new THREE.AnimationMixer(glb.scene);

        const animationAction = mixer.clipAction(animations[0])
        animationActions.push(animationAction)
        animationsFolder.add(animations, 'default')
        activeAction = animationActions[0]
    
    cinder_castle= glb.scene;
    // galaxy2.position.set(-140,-150,130);
    cinder_castle.scale.set(0.1,0.1,0.1);
    // galaxy2.scale.
   scene.add(cinder_castle);
},function(error){
    console.log("error occ");
});


const orbitMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );

const saturnRing =  new THREE.Mesh(  new THREE.TorusGeometry( 5, 0.05, 16, 100), orbitMaterial );
saturnRing.rotateX( Math.PI/2.5)

const createPlanets = () => {
    
    planets.forEach((planet, index) => {
        const orbitGroup = new THREE.Group()
        const orbit = new THREE.Mesh(
            new THREE.TorusGeometry(orbitRadius[index], 0.05, 16, 100),
            orbitMaterial
        )
        
        const texture = textureLoader.load(`/textures/${planet.name}.jpg`)
        const planetObject = new THREE.Mesh( 
            new THREE.SphereGeometry( planet.sizeRatio, 32, 32 ),
            new THREE.MeshStandardMaterial({ map: texture}))

        planetObject.position.x = planet.position

        if(planet.name === 'saturn') {
            saturnRing.position.x = planet.position
            orbitGroup.add(saturnRing)
        }
        orbitGroup.add(orbit, planetObject)

        orbit.rotateZ(Math.PI /2)
        orbit.rotateY(Math.PI/2)
        orbitsObject3D.push(orbitGroup)
        planetsObject3D.push(planetObject)
        scene.add(orbitGroup)
    })
}

createPlanets();


const ambientLight = new THREE.AmbientLight( '#fffefa' ); // soft white light

const hemisphereLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );

scene.add( ambientLight, hemisphereLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(90, sizes.width / sizes.height, 1, 2000)
scene.add(camera)
// camera.position.y = 15
// camera.position.z = 100
camera.position.set(0, 15, 100)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.zoomSpeed = 1.5
// controls.minZoom = 200
controls.maxDistance =1000

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x131A3D, 1);
// const axesHelper = new THREE.AxesHelper(20);
// scene.add(axesHelper)

/**
 * Debug
 */
const gui = new dat.GUI({
    closed: true,
    width: 400
})
// gui.hide()
// gui.add(sun.position, 'y').min(- 3).max(3).step(0.01).name('elevation')
gui.add(camera.position, 'z', -100, 150, 1)
gui.add(camera.position, 'y', -100, 150, 1)
gui.add(camera.position, 'x', -100, 150, 1)

// gui
//     .addColor(parameters, 'color')
//     .onChange(() =>
//     {
//         material.color.set(parameters.color)
//     })

// gui.add(parameters, 'spin')

/**
 * Animate
 */

const tick = () =>
{
    var timer = 0.00001 * Date.now();
    for (var i = 0, il = sphereTab.length; i < il; i++) {
        var sfere = sphereTab[i];
        sfere.position.x = 400 * Math.sin(timer + i);
        // sfere.position.z= 500 * Math.sin( timer + i * 1.1 );
        sfere.position.z = 400 * Math.sin(timer + i * 1.1);
    }

    // var axis = new THREE.Vector3(0, 1, 0).normalize();
    // if (galaxy) sun.rotateOnAxis(axis,0.01)
    if (cinder_castle)cinder_castle.rotation.y +=0.0001
    // sun.rotation.y += 0.001

    orbitsObject3D.forEach((group, index) => {
        group.rotation.y += planets[index].rotation
    })

    planetsObject3D.forEach((planet, index) => {
        planet.rotation.y += planets[index].rotation
    })
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()