import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'
import { Object3D } from 'three'



/**
 * GET DATA FROM GSHEETS FIRST
 */
const gs_data2threejs = {
    totalMember: '1',

    get getTotalMember() {
        return this.totalMember;
    },
     set update_total_member(value) {
        this.totalMember = value;
    }
}

var mixer_total;
var loader2 = new GLTFLoader();
let meow=[];
let abc=[];
// let mixer;
const mixers = [];
function onComplete(result){ // When the code completes, do this
   gs_data2threejs.update_total_member = result
   mixer_total= result;
    var meowurl = [];
    
//    meowurl[1] ='/assets/glb/mew_-_flying.glb';
   var i;
  

  
            for(i=1;i<2;i++){
                meowurl[i]= '/assets/glb/low-size/low_model ('+i+').glb';
                    loader2.load(meowurl[i],function(glb){
                    meow [i]= glb.scene;
                    meow[i].position.set(1,1,50); 
                    meow[i].rotateY(90);   
                    TweenMax.from( meow[i].position, 9, {
                        y: -8,
                        z: 500,
                        yoyo: true,
                        repeat: 0,
                        ease: 'Power2.easeInOut'
                      });  
                      TweenMax.from( meow[i].position, 6, {
                        y: -8,
                        x: -2,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Power2.easeInOut'
                      });
                    scene.add(meow[i]);
                    abc[i] = meow[i].children[0];
                    const mixer = new THREE.AnimationMixer(abc[i]);
                    mixer.clipAction(glb.animations[0]).play();
                    mixers.push(mixer);
                    console.log(i)
                });  console.log(i)
            }

        //   var  str = JSON.stringify(meow[2]);
        //     str = JSON.stringify(meow[2], null, 4); // (Optional) beautiful indented output.
        //     console.log(str);
    console.log(result)

}







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

// scene.background = textureLoader.load('/textures/stars.jpg')

/**
 * AND HERE COMES THE GALAXY GLB
 */

//FOR floating stars
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

        // if(planet.name === 'saturn') {
        //     saturnRing.position.x = planet.position
        //     orbitGroup.add(saturnRing)
        // }
        orbitGroup.add(orbit, planetObject)

        orbit.rotateZ(Math.PI /2)
        orbit.rotateY(Math.PI/2)
        orbitsObject3D.push(orbitGroup)
        planetsObject3D.push(planetObject)
        scene.add(orbitGroup)
    })
}
const clock = new THREE.Clock();
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


/**
 * Animate
 */

const tick = () =>
{
   
    const delta = clock.getDelta();
    mixers.forEach(function(mixer) {
        mixer.update(delta);
    });
    // if ( mixer[1] ) mixer[1].update( delta );
    // if ( mixer[2] ) mixer[2].update( delta );
    // if ( mixer[0] ) mixer[0].update( delta );
    // if ( mixer[3] ) mixer[3].update( delta );

    var timer = 0.00001 * Date.now();
    for (var i = 0, il = sphereTab.length; i < il; i++) {
        var sfere = sphereTab[i];
        sfere.position.x = 400 * Math.sin(timer + i);
        sfere.position.z = 400 * Math.sin(timer + i * 1.1);
    }

    // var axis = new THREE.Vector3(0, 1, 0).normalize();
    // if (galaxy) sun.rotateOnAxis(axis,0.01)


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

loadData()
function loadData (){
    let result;
    // ========================================================================================================================================================================================
    let url ="https://docs.google.com/spreadsheets/d/e/2PACX-1vRe-NuXNEolTwg4iBlJtM4Lc7v8N-K8Be90s5mF0a0R6RUJP8NskA8PvxWMyAtOm_gjmaOoG_yA1w14/pub?gid=0&single=true&output=csv&range=a2"          
    // let  url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR45xjRksAnj4s3bWcLyARSjUWp7hY7rYcATEPty0MHEPdMT6-2WH2In9bjldlgTHSkR2SQn5Jl8tCm/pub?gid=1203789969&single=true&output=csv&range=i2";     
                  fetch(url) 
                  .then(response => response.text())
                  .then(text => { //what to do with result?
              
                   result = text; 
                   onComplete(result);
                //    setter(result);
                // student.change_n_Member = result;
                } 
               
                      //pass url value to variable
                    ); 
                    // return result;
                    }
                 

                   
                    