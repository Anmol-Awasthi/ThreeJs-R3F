import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import colorTexture from '/textures/color.jpg'
// import colorTexture from '/textures/checkerboard-1024x1024.png'
// import colorTexture from '/textures/checkerboard-8x8.png'
import colorTexture from '/textures/minecraft.png'


const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/*  TEXTURES

Textures are basically images that will cover the surface of the geometries.

* All textures described below are in /textures folder.

Textures are of many types:

-Color: It is the most basic type of texture. It is used to color the surface of the geometry and is applied on the geometry.

-Alpha: It is used to control the transparency of the surface of the geometry. It is applied on the geometry. It is a grayscale image. The white part is visible and the black part is not visible.

-Height: It is a grayscale image that is used to control the height of the surface of the geometry. The surface needs enough subdivision to show the height.

-Normal: It adds details to the surface of the geometry. It doesn't need subdivision to show the details. It is applied on the geometry. Lure the light about the face orientation. It is preferred over the height texture as it needs less subdivision.

-Ambient Occlusion: It is used to control the amount of light that is reflected from the surface of the geometry. It is not physically accurate. It is a grayscale image. The white part is more reflective and the black part is less reflective.

-Metalness: It is a grayscale image that is used to control the metalness of the surface of the geometry. The white part is more metallic and the black part is less metallic.

-Roughness: It is a grayscale image and works in duo with the metalness texture. The white  part is more rough and the black part is less rough. It's about light dissipation.

* PBR (Physically Based Rendering)

Most of the textures follow PBR principles.
Many techniques that tend to follow real-life directions to get realistic results, becoming the standard for realistic rendering.

*/

/*  HOW TO LOAD TEXTURES -->

Instantiate a variable using the THREE.TextureLoader() and then use the .load() method to load the texture.

The parameters of the .load() method are:

- The path to the texture.
- A callback function that is called when the texture is loaded.
- A callback function when the loading is progressing.
- A callback function when something goes wrong.

* The callback functions are optional and can be globally handled using the LoadingManager.

* One TextureLoader can load multiple textures.

*/

/*  LOADING MANAGER

We can use the THREE.LoadingManager to load multiple textures at the same time and to know the mutualize the events. 
It is useful when we have a lot of textures to load and to know the global loading progress or to get informed when the loading is finished.

*/
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log("Loading started");
}
loadingManager.onProgress = () => {
    console.log("Loading in progress");
}
loadingManager.onLoad = () => {
    console.log("Loading finished");
}
loadingManager.onError = () => {
    console.log("Loading failed");
}

// If using the LoadingManager, we need to pass it to the TextureLoader
const textureLoader = new THREE.TextureLoader(loadingManager);

// const texture = textureLoader.load(
//     colorTexture,
//     () => {
//         console.log('Texture loaded');
//     },
//     () => {
//         console.log("Texture is loading");
//     }, 
//     () => {
//         console.log("Texture loading failed");
//     }
// );

const texture = textureLoader.load(colorTexture);


/*  UV UNWRAPPING

The texture is being stretched or squeezed in different ways to cover the surface of the geometry. This is called UV unwrapping. Each vertex will have a 2D coordinate that will be used to map the texture to the surface of the geometry.

These 2D coordinates are generated internally by THREE.js abd if you create your own geometry, you need to specify these 2D coordinates.

*/


/*  TRANSFORMING TEXTURES

- Repeat: It is used to repeat the texture. It's a Vector2 with x and y values.

- Offset: We can offset the texture. It's a Vector2 with x and y values.

- Rotation: It is used to rotate the texture. It's a number in radians.
The pivot point is at the corner of the texture. We can change the pivot point by using the .center property.

*/

// texture.repeat.x = 2
// texture.repeat.y = 3;
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;

// texture.offset.x = 0.5;
// texture.offset.y = 0.5;

// texture.rotation = Math.PI * 0.25;
// texture.center.x = 0.5;
// texture.center.y = 0.5;


const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/*  FILTERING and MIPMAPPING

-Mipmapping is a technique that is used to reduce the amount of texture detail when the camera is far away from the object. It is used to improve the performance of the application.
It consist of creating multiple versions of the texture with different resolutions. The texture with the highest resolution is used when the camera is close to the object. The texture with the lowest resolution is used when the camera is far away from the object, until we get a 1x1 pixel texture.
All of this is handled internally by THREE.js and the GPU but we can choose the different filtering algorithms.

1. Minification Filter: It happens when the pixel of the texture is smaller than the pixel of the screen. In other words, the texture is too big for the screen.

We can change the minification filter by using the .minFilter property.

When using the minFilter with the nearest filter, we don't need mipmapping, we can use the nearest filter. We can deactivate the mipmapping by using the .generateMipmaps property to false.

* Use the checkerboard-1024x1024.png texture to see the difference.

*/

// texture.minFilter = THREE.NearestFilter;

/*

2. Magnification Filter: It happens when the pixel of the texture is bigger than the pixel of the screen. In other words, the texture is too small for the screen.

* Use the checkerboard-8x8.png or minecraft.png texture to see the difference.

*/

texture.magFilter = THREE.NearestFilter;


/*  TEXTURE FORMAT and OPTIMIZATION

When preparing the texture, we need to keep these 3 things - 

- The weight
- The size
- The data

The users will have to download the texture and the data. We need to optimize the texture to reduce the weight and the size of the texture by using compression.

Because we are using Mipmapping, we need the texture width and height to be a power of 2.

Texture support transparency, so we can use the alpha channel to store the transparency of the texture using the .png format.
*/

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.01, 100);
camera.position.set(0, 0, 3); 

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true;

camera.lookAt(mesh.position);

const renderer = new THREE.WebGLRenderer({canvas})
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const tick = () => {
    controls.update();
    window.requestAnimationFrame(tick);
    renderer.render(scene, camera);
}

tick();
