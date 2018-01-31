if (!Detector.webgl) Detector.addGetWebGLMessage();
var scene, camera, renderer;
var raycaster = new THREE.Raycaster();//射线
var mouse = new THREE.Vector2();// 鼠标位置
var is_click; //点击
var go_scene2;
var isUserInteracting = false,
    onMouseDownMouseX = 0, onMouseDownMouseY = 0,
    lon = 0, onMouseDownLon = 0,
    lat = 0, onMouseDownLat = 0,
    phi = 0, theta = 0;

var geometry;//球体网格
var scene1; // 场景1材质
var scene2, scene2_flag = false; //场景2材质
var mesh; // 球体对象
var target = new THREE.Vector3(); //相机目标点
var time = 0;	//加载计数
var camera_time = 0;	//摄像机移动参数
var exchange_img = false;	//切换图片标志位

function init() {
    var container = document.getElementById('container');

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.target = new THREE.Vector3(0, 0, 0);

    scene = new THREE.Scene();

    //箭头
    go_scene2 = makeTextSprite( "路标哦☝","去scene2看看");
    go_scene2.position.set(-3,-1.5,-0.5);
    scene.add(go_scene2);

    geometry = new THREE.SphereGeometry(500, 60, 40); // 半径 宽细分线 高细分线
    geometry.scale(1, 1, 1); //沿x轴进行-1的scale，让球体的面朝内（因为我们将从球内进行观看）,这里设置为1 是因为 material 中设置了 side:THREE.DoubleSide

    // new THREE.TextureLoader().load('./images/sc1.jpg', function (texture) {
    //     scene1 = new THREE.MeshBasicMaterial({
    //         map: texture
    //     });
    // });//场景1材质

    // scene1 = new THREE.MeshBasicMaterial({
    //     map: new THREE.TextureLoader().load('./images/sc1.jpg',function () {
    //         time++;//time ==1 添加了第一个场景
    //     })
    // });


    //异步加载
    new THREE.TextureLoader().load('./images/sc1.jpg', function (texture) {
        scene1 = new THREE.MeshBasicMaterial({
            map: texture,
            side:THREE.DoubleSide
        });
       mesh = new THREE.Mesh(geometry, scene1);
       scene.add(mesh);//添加到场景
        time +=2;//time ==1 添加了第一个场景
    });// 场景1材质




    renderer = new THREE.WebGLRenderer({
        antialias: true //抗锯齿
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('mouseup', onDocumentMouseUp, false);
    //		document.addEventListener( 'wheel', onDocumentMouseWheel, false );
    document.addEventListener('touchstart', onDocumentTouchDown, false);
    document.addEventListener('touchmove', onDocumentTouchMove, false);
    document.addEventListener('touchend', onDocumentMouseUp, false);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    //捕捉鼠标
    // lon = Math.max(-180, Math.min(180, lon));//限制固定角度内旋转 -- 绕Y轴的角度

    lat = Math.max(-85, Math.min(85, lat)); // 绕X轴  lon lat 最初都为0

    phi = THREE.Math.degToRad(90 - lat);
    theta = THREE.Math.degToRad(lon);
    target.x = Math.sin(phi) * Math.cos(theta);
    target.y = Math.cos(phi);
    target.z = Math.sin(phi) * Math.sin(theta);
    camera.lookAt(target);

    if(camera_time > 0 && camera_time < 50){
        camera.target.x = -493;
        camera.target.y = -28;
        camera.target.z = -72;
        camera.lookAt( camera.target );
        camera.fov -= 1;
        camera.updateProjectionMatrix();	//需要更新，不自动更新
        camera_time++;
        go_scene2.visible = false;
    }else if(camera_time == 50){
        lat = -2;
        lon = 182;
        camera_time = 0;
        camera.fov = 75;
        camera.updateProjectionMatrix();
        new THREE.TextureLoader().load('./images/sc2.jpg', function (texture) {
            scene2 = new THREE.MeshBasicMaterial( {
                map: texture,
                side:THREE.DoubleSide
            } );
            mesh.material = scene2;
        });
    }
    renderer.render(scene, camera);

}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}

init();
animate();

//切换场景动作
function changeScene() {
    camera_time = 1;
}
