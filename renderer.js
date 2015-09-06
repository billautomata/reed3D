function render(opts) {

  var raw_object;
  var model_object;
  var container, stats;

  var camera, scene, renderer;

  var mouseX = 0
  var mouseY = 0

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

    if (opts.use_directional === true) {

      var directionalLight = new THREE.DirectionalLight(parseInt(opts.directional_light_color));
      directionalLight.position.set(0, 0, 1).normalize();
      scene.add(directionalLight);

    }

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

      window.scene = scene
      window.raw_object = object
      window.model_object = model_object

      window.model_object = window.raw_object.clone()
      window.model_object.rotateY(Math.PI * opts.rotate_y_multi)
      window.model_object.rotateX(Math.PI * opts.rotate_x_multi)
      window.model_object.rotateZ(Math.PI * opts.rotate_z_multi)
      window.model_object.scale.set(opts.scale, opts.scale, opts.scale);

      scene.add(window.model_object);

      if (opts.wireframe_mode) {
        set_wireframe(window.model_object)
      }

      var k = d3.select('body').append('div')
        .attr('class','back_button').html('back')

      k.on('click', function(){
        window.location.hash = ''
        window.location.reload(true)
      })

    }, onProgress, onError);

    //

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('touchmove', onDocumentMouseMove, false);
    document.addEventListener('dblclick', function(){ console.log('dbl')}, false)
    document.addEventListener('click', function(){ console.log('sngl')}, false)

    window.addEventListener('resize', onWindowResize, false);


  }

  function set_wireframe(o) {
    o.traverse(function (element) {

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

      }
    })
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
