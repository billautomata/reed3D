function render(opts) {

  var container, stats;

  var camera, scene, renderer;

  var mouseX = 0,
    mouseY = 0;

  var windowHalfX = window.innerWidth / 2;
  var windowHalfY = window.innerHeight / 2;

  init();
  animate();

  function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 250;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0x333);
    // scene.add( ambient );

    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 1).normalize();
    scene.add(directionalLight);

    // model

    var onProgress = function (xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    };

    var onError = function (xhr) {};


    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var loader = new THREE.OBJMTLLoader();
    loader.load('models/' + opts.name + '/' + opts.obj, 'models/' + opts.name + '/' + opts.mtl, function (object) {

      var scale = 25
      obj = object


      // object.position.setY(0)
      object.rotateY(Math.PI * 1.1)
      // object.rotateX(Math.PI * -0.33)

      object.scale.set(scale, scale, scale);
      scene.add(object);

    }, onProgress, onError);

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchmove', onDocumentMouseMove, false);

    window.addEventListener('resize', onWindowResize, false);

  }

  function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

  }

  function onDocumentMouseMove(event) {

    event.preventDefault()

    if (event.changedTouches !== undefined) {

      event.clientX = event.changedTouches[0].clientX
      event.clientY = event.changedTouches[0].clientY

      if (window.innerWidth < 500) {
        // mobile
        event.clientX = event.changedTouches[0].clientX *= 3.0
        event.clientY = event.changedTouches[0].clientY *= 3.0
      }

    }

    mouseX = (event.clientX - windowHalfX) / 2;
    mouseY = (event.clientY - windowHalfY) / 2;

  }

  //

  function animate() {

    requestAnimationFrame(animate);
    render();

  }

  function render() {

    camera.position.x += (mouseX - camera.position.x - 100) * .05;
    camera.position.y += (mouseY - camera.position.y - 250) * .05;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);

  }
}
