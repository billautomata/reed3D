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
    camera.position.z = opts.camera_z;

    // scene

    scene = new THREE.Scene();

    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);


    var directionalLight = new THREE.DirectionalLight(parseInt(opts.directional_light_color));
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


      if (!opts.wireframe_mode) {
        object.rotateY(Math.PI * opts.rotate_y_multi)
        object.rotateX(Math.PI * opts.rotate_x_multi)
        object.rotateZ(Math.PI * opts.rotate_z_multi)
        object.scale.set(opts.scale, opts.scale, opts.scale);
        scene.add(object);
      } else {
        // wireframe mode
        object.traverse(function (element) {

          if (element instanceof THREE.Mesh) {
            var geo = element.geometry
            var mat = element.material
            var mesh = new THREE.Mesh(geo, mat)

            mesh.traverse(function (e) {
              if (e instanceof THREE.Mesh) {
                e.material.wireframe = true
                e.material.wireframe = new THREE.Color(0xffffff)
              }
            })

            mesh.rotateY(Math.PI * opts.rotate_y_multi)
            mesh.rotateX(Math.PI * opts.rotate_x_multi)
            mesh.rotateZ(Math.PI * opts.rotate_z_multi)

            mesh.scale.set(opts.scale, opts.scale, opts.scale);

            scene.add(mesh)

          }

        })

      }



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
        event.clientX = event.changedTouches[0].clientX *= 2.0
        event.clientY = event.changedTouches[0].clientY *= 2.0
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

    camera.position.x += (mouseX - camera.position.x + opts.camera_offset_x) * opts.camera_x_multi;
    camera.position.y += (mouseY - camera.position.y + opts.camera_offset_y) * opts.camera_y_multi;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);

  }
}
