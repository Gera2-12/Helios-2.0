const box=$('globe');                                   // el div donde vive el planeta
const ren=new THREE.WebGLRenderer({antialias:true,alpha:true}); // "pintor" 3D con bordes suaves y fondo transparente
ren.setPixelRatio(Math.min(devicePixelRatio, ESCRITORIO.matches ? 2 : 1.5)); // nitidez en pantallas de alta resolución (máx. 2 en PC y 1.5 en celular para ahorrar batería)
box.appendChild(ren.domElement);                        // mete el canvas 3D dentro del div
const sc=new THREE.Scene();                             // la escena: aquí se colocan los objetos
const cam=new THREE.PerspectiveCamera(40,1,.1,100);     // cámara: ángulo 40°, aspecto se ajusta luego
cam.position.z=3;                                       // aleja la cámara 3 unidades
const pivot=new THREE.Group();                          // grupo que inclina el planeta (latitud)
const globe=new THREE.Mesh(                             // el planeta: una esfera...
 new THREE.SphereGeometry(1,64,48),                     // ...de radio 1 con 64x48 segmentos
 new THREE.MeshLambertMaterial({map:new THREE.CanvasTexture(tex())}) // material con la textura que dibujamos
);
pivot.add(globe); sc.add(pivot);                        // planeta dentro del pivote, pivote dentro de la escena
sc.add(new THREE.AmbientLight(0xffffff,.8));            // luz suave general
const dl=new THREE.DirectionalLight(0xffffff,.8);       // luz direccional (como el sol)
dl.position.set(-3,2,4); sc.add(dl);                    // la coloca arriba a la izquierda

sc.add(new THREE.Mesh(                                  // atmósfera: esfera un poco más grande
 new THREE.SphereGeometry(1.14,48,32),
 new THREE.ShaderMaterial({                             // material con código GLSL propio
  vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}', // calcula hacia dónde mira cada punto
  fragmentShader:'varying vec3 n;void main(){float i=pow(max(.62-dot(n,vec3(0.,0.,1.)),0.),3.);gl_FragColor=vec4(.3,.6,1.,1.)*i*.9;}', // brillo azul más fuerte en el borde
  side:THREE.BackSide,                                  // se ve la cara interior para que forme un halo
  blending:THREE.AdditiveBlending,                      // suma luz en vez de tapar
  transparent:true
 })
));

const sp=[];                                            // coordenadas de las estrellas
for(let i=0;i<700;i++){                                 // 700 estrellas
 const v=new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize().multiplyScalar(30); // punto al azar a 30 unidades
 sp.push(v.x,v.y,v.z);                                  // guarda x, y, z
}
const sg=new THREE.BufferGeometry();                    // contenedor de puntos
sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3)); // le da las posiciones
sc.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xffffff,size:.08}))); // estrellas blancas
