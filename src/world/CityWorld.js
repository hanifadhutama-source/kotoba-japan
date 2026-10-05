import * as THREE from 'three';

/**
 * CityWorld — KOTOBA Tokyo Hub (Phase 3A)
 * Compact stylized Tokyo-inspired environment for KOTOBA Japanese learning game.
 *
 * District Layout:
 *   NORTH  (z < 0): 東京駅 Tokyo Station + 学校 School
 *   CENTER (z = 0): 中央広場 Central Hub (fountain plaza, yatai, bus stops)
 *   EAST   (x > 0): 商店街 Commercial / 東京タワー Tokyo Tower landmark
 *   WEST   (x < 0): 図書館 Library / 住宅街 Residential
 *   SOUTH  (z > 0): 住宅街 Residential district
 *
 * Preserves: PlayerController, VoxelCharacter, NPC system,
 *            MinigameController, QuestData, collision architecture.
 */
export class CityWorld {
  constructor(scene) {
    this.scene = scene;
    this.colliders = []; // Bounding boxes for player collision

    this.initLighting();
    this.createGroundAndRoads();
    this.createCentralPlaza();
    this.createDistrictsAndBuildings();
    this.createStreetFurniture();
    this.createCivicAmenities();
    this.createTokyoHubIdentity(); // Phase 3A: Hub identity props
    this.createTokyoStationArea(); // Phase 3B: Tokyo Station area
    this.createCommercialDistrict(); // Phase 3C: Commercial / Konbini District
    this.createEducationDistrict(); // Phase 3D: Education / School District
  }

  initLighting() {
    // Ambient Light - Warm sky/city glow
    const ambient = new THREE.AmbientLight(0xe2e8f0, 0.85);
    this.scene.add(ambient);

    // Directional Sun Light with high-res soft shadows
    const sun = new THREE.DirectionalLight(0xfffae8, 1.25);
    sun.position.set(120, 150, 90);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 1.0;
    sun.shadow.camera.far = 450;

    const d = 190;
    sun.shadow.camera.left = -d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = -d;
    sun.shadow.bias = -0.0004;

    this.scene.add(sun);

    // Hemisphere Light for rich natural ambient contrast between blue sky & urban ground
    const hemiLight = new THREE.HemisphereLight(0xd4e9f7, 0x7c6e58, 0.5);
    this.scene.add(hemiLight);
  }

  createGroundAndRoads() {
    // 1. Base Ground / Lush Grass (Expanded to 420 x 420)
    const groundGeo = new THREE.PlaneGeometry(420, 420);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x6b7280 }); // Neutral urban gray-green
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const asphaltMat = new THREE.MeshLambertMaterial({ color: 0x1f2937 }); // Urban slate asphalt
    const roadWidth = 12;
    const avenueLength = 380;

    // Main Central Avenue Horizontal (X axis)
    const roadXGeo = new THREE.PlaneGeometry(avenueLength, roadWidth);
    const roadX = new THREE.Mesh(roadXGeo, asphaltMat);
    roadX.rotation.x = -Math.PI / 2;
    roadX.position.set(0, 0.02, 0);
    roadX.receiveShadow = true;
    this.scene.add(roadX);

    // Main Central Avenue Vertical (Z axis)
    const roadZGeo = new THREE.PlaneGeometry(roadWidth, avenueLength);
    const roadZ = new THREE.Mesh(roadZGeo, asphaltMat);
    roadZ.rotation.x = -Math.PI / 2;
    roadZ.position.set(0, 0.02, 0);
    roadZ.receiveShadow = true;
    this.scene.add(roadZ);

    // Outer Boulevard Ring Roads (North, South, East, West at distance ±120)
    const outerRingLength = 360;
    const outerRoadWidth = 9;

    // Boulevard North (Z = -120)
    const roadBN = new THREE.Mesh(new THREE.PlaneGeometry(outerRingLength, outerRoadWidth), asphaltMat);
    roadBN.rotation.x = -Math.PI / 2;
    roadBN.position.set(0, 0.02, -120);
    roadBN.receiveShadow = true;
    this.scene.add(roadBN);

    // Boulevard South (Z = 120)
    const roadBS = new THREE.Mesh(new THREE.PlaneGeometry(outerRingLength, outerRoadWidth), asphaltMat);
    roadBS.rotation.x = -Math.PI / 2;
    roadBS.position.set(0, 0.02, 120);
    roadBS.receiveShadow = true;
    this.scene.add(roadBS);

    // Boulevard West (X = -120)
    const roadBW = new THREE.Mesh(new THREE.PlaneGeometry(outerRoadWidth, outerRingLength), asphaltMat);
    roadBW.rotation.x = -Math.PI / 2;
    roadBW.position.set(-120, 0.02, 0);
    roadBW.receiveShadow = true;
    this.scene.add(roadBW);

    // Boulevard East (X = 120)
    const roadBE = new THREE.Mesh(new THREE.PlaneGeometry(outerRoadWidth, outerRingLength), asphaltMat);
    roadBE.rotation.x = -Math.PI / 2;
    roadBE.position.set(120, 0.02, 0);
    roadBE.receiveShadow = true;
    this.scene.add(roadBE);

    // Inner Promenade Connectors (Connecting districts at Z = ±60)
    const innerRoadNorth = new THREE.Mesh(new THREE.PlaneGeometry(220, 7), asphaltMat);
    innerRoadNorth.rotation.x = -Math.PI / 2;
    innerRoadNorth.position.set(0, 0.02, -60);
    innerRoadNorth.receiveShadow = true;
    this.scene.add(innerRoadNorth);

    const innerRoadSouth = new THREE.Mesh(new THREE.PlaneGeometry(220, 7), asphaltMat);
    innerRoadSouth.rotation.x = -Math.PI / 2;
    innerRoadSouth.position.set(0, 0.02, 60);
    innerRoadSouth.receiveShadow = true;
    this.scene.add(innerRoadSouth);

    // 3. Sidewalks (Trotoar Luas & Plaza Blocks)
    const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0xd1d5db }); // Clean Tokyo light gray concrete

    const makeSidewalk = (x, z, w, h) => {
      const boxGeo = new THREE.BoxGeometry(w, 0.22, h);
      const walk = new THREE.Mesh(boxGeo, sidewalkMat);
      walk.position.set(x, 0.11, z);
      walk.receiveShadow = true;
      this.scene.add(walk);
    };

    // 4 Inner District Sidewalk Quarters
    makeSidewalk(-48, -48, 70, 70); // Northwest
    makeSidewalk(48, -48, 70, 70);  // Northeast
    makeSidewalk(-48, 48, 70, 70);  // Southwest
    makeSidewalk(48, 48, 70, 70);   // Southeast

    // 4 Outer District Sidewalk Quarters
    makeSidewalk(-110, -90, 50, 48);
    makeSidewalk(110, -90, 50, 48);
    makeSidewalk(-110, 90, 50, 48);
    makeSidewalk(110, 90, 50, 48);

    // Center Plaza Sidewalk Connectors
    makeSidewalk(0, -22, 16, 20);
    makeSidewalk(0, 22, 16, 20);
    makeSidewalk(-22, 0, 20, 16);
    makeSidewalk(22, 0, 20, 16);

    // Avenue Sidewalk Border Strips
    makeSidewalk(0, -90, 14, 46);
    makeSidewalk(0, 90, 14, 46);
    makeSidewalk(-90, 0, 46, 14);
    makeSidewalk(90, 0, 46, 14);

    this.createRoadMarkings();
  }

  createRoadMarkings() {
    const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const yellowMat = new THREE.MeshLambertMaterial({ color: 0xfbbf24 });

    // Center divider stripes (Avenue lines)
    const stripeGeo = new THREE.PlaneGeometry(3, 0.4);
    for (let x = -170; x <= 170; x += 8) {
      if (Math.abs(x) > 16 && Math.abs(x - 120) > 8 && Math.abs(x + 120) > 8) {
        const stripe = new THREE.Mesh(stripeGeo, yellowMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(x, 0.04, 0);
        stripe.receiveShadow = true;
        this.scene.add(stripe);
      }
    }

    const vStripeGeo = new THREE.PlaneGeometry(0.4, 3);
    for (let z = -170; z <= 170; z += 8) {
      if (Math.abs(z) > 16 && Math.abs(z - 120) > 8 && Math.abs(z + 120) > 8) {
        const stripe = new THREE.Mesh(vStripeGeo, yellowMat);
        stripe.rotation.x = -Math.PI / 2;
        stripe.position.set(0, 0.04, z);
        stripe.receiveShadow = true;
        this.scene.add(stripe);
      }
    }

    // Zebra Crossings at Crossroad Intersections
    const zebraStripeGeo = new THREE.PlaneGeometry(1.0, 7.0);
    const makeZebra = (startX, startZ, isVertical) => {
      for (let i = 0; i < 7; i++) {
        const stripe = new THREE.Mesh(zebraStripeGeo, whiteMat);
        stripe.rotation.x = -Math.PI / 2;
        if (isVertical) {
          stripe.rotation.z = Math.PI / 2;
          stripe.position.set(startX, 0.05, startZ + (i - 3) * 1.5);
        } else {
          stripe.position.set(startX + (i - 3) * 1.5, 0.05, startZ);
        }
        stripe.receiveShadow = true;
        this.scene.add(stripe);
      }
    };

    // Central intersections
    makeZebra(0, -18, true);
    makeZebra(0, 18, true);
    makeZebra(-18, 0, false);
    makeZebra(18, 0, false);

    // Inner boulevard intersections
    makeZebra(0, -68, true);
    makeZebra(0, 68, true);

    // Outer boulevard intersections
    makeZebra(0, -114, true);
    makeZebra(0, 126, true);
    makeZebra(-114, 0, false);
    makeZebra(126, 0, false);
  }

  createCentralPlaza() {
    // Shibuya Scramble Crossing (26 x 26 intersection base)
    const crossingGeo = new THREE.BoxGeometry(26, 0.04, 26);
    const asphaltMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const crossing = new THREE.Mesh(crossingGeo, asphaltMat);
    crossing.position.set(0, 0.02, 0);
    crossing.receiveShadow = true;
    this.scene.add(crossing);

    // Zebra Crossings (White strips)
    const stripeMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const createStripe = (w, d, x, z, rot) => {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(w, 0.02, d), stripeMat);
      stripe.position.set(x, 0.05, z);
      stripe.rotation.y = rot;
      this.scene.add(stripe);
    };

    // North & South Crossing
    [-11, 11].forEach(zPos => {
      for (let x = -10; x <= 10; x += 2) {
        createStripe(1.0, 4.0, x, zPos, 0);
      }
    });
    // East & West Crossing
    [-11, 11].forEach(xPos => {
      for (let z = -10; z <= 10; z += 2) {
        createStripe(4.0, 1.0, xPos, z, 0);
      }
    });

    // Diagonal Scramble Crossings
    for (let d = -8; d <= 8; d += 2) {
      createStripe(1.0, 4.0, d, d, Math.PI / 4); // NW to SE
      createStripe(1.0, 4.0, d, -d, -Math.PI / 4); // NE to SW
    }

    // Shibuya Commercial Buildings & Signage (Corners)
    const buildBuilding = (x, z, w, d, h, color, signText) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(x, h/2, z);
      
      const bGeo = new THREE.BoxGeometry(w, h, d);
      const bMat = new THREE.MeshLambertMaterial({ color: color });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bGroup.add(bMesh);

      // Glass facade
      const gGeo = new THREE.BoxGeometry(w+0.1, h*0.8, d+0.1);
      const gMat = new THREE.MeshLambertMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
      const gMesh = new THREE.Mesh(gGeo, gMat);
      bGroup.add(gMesh);

      // Billboard
      if (signText) {
        const signCanvas = document.createElement('canvas');
        signCanvas.width = 512; signCanvas.height = 256;
        const sc = signCanvas.getContext('2d');
        sc.fillStyle = '#ef4444';
        sc.fillRect(0, 0, 512, 256);
        sc.fillStyle = '#ffffff';
        sc.font = 'bold 70px sans-serif';
        sc.textAlign = 'center';
        sc.textBaseline = 'middle';
        sc.fillText(signText[0], 256, 80);
        sc.font = '40px sans-serif';
        sc.fillText(signText[1], 256, 170);
        const sTex = new THREE.CanvasTexture(signCanvas);
        const sMat = new THREE.MeshBasicMaterial({ map: sTex });
        // Place billboard on the side facing the crossing
        const sGeo = new THREE.PlaneGeometry(w*0.9, h*0.4);
        const sMesh = new THREE.Mesh(sGeo, sMat);
        
        if (z < 0) {
          sMesh.position.set(0, h*0.25, d/2 + 0.06); // facing South
        } else {
          sMesh.position.set(0, h*0.25, -d/2 - 0.06); // facing North
          sMesh.rotation.y = Math.PI;
        }
        bGroup.add(sMesh);
      }

      this.scene.add(bGroup);
      this.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(x, h/2, z),
        new THREE.Vector3(w, h, d)
      ));
    };

    // Shibuya 109-style building at SW corner
    buildBuilding(-22, 22, 14, 14, 28, 0x1e293b, ['渋谷', 'SHIBUYA']);
    // QFRONT-style building at NE corner
    buildBuilding(22, -22, 16, 12, 24, 0xf1f5f9, ['スクランブル交差点', 'SCRAMBLE CROSSING']);

    // Hachiko Landmark (NW Corner, x: -11, z: -11)
    const hachikoGroup = new THREE.Group();
    hachikoGroup.position.set(-11, 0, -11); 

    const pedGeo = new THREE.BoxGeometry(1.2, 0.6, 1.2);
    const pedMat = new THREE.MeshLambertMaterial({ color: 0x9ca3af });
    const pedestal = new THREE.Mesh(pedGeo, pedMat);
    pedestal.position.set(0, 0.3, 0);
    hachikoGroup.add(pedestal);

    const dogGeo = new THREE.BoxGeometry(0.5, 0.8, 0.7);
    const dogMat = new THREE.MeshLambertMaterial({ color: 0xb45309 }); // Bronze/Brown
    const dog = new THREE.Mesh(dogGeo, dogMat);
    dog.position.set(0, 1.0, 0);
    hachikoGroup.add(dog);

    // Hachiko Sign
    const hSignCanvas = document.createElement('canvas');
    hSignCanvas.width = 256; hSignCanvas.height = 128;
    const hc = hSignCanvas.getContext('2d');
    hc.fillStyle = '#475569';
    hc.fillRect(0, 0, 256, 128);
    hc.fillStyle = '#ffffff';
    hc.font = 'bold 40px sans-serif';
    hc.textAlign = 'center';
    hc.textBaseline = 'middle';
    hc.fillText('ハチ公', 128, 40);
    hc.font = '24px sans-serif';
    hc.fillText('HACHIKO', 128, 90);
    const hTex = new THREE.CanvasTexture(hSignCanvas);
    const hSignMat = new THREE.MeshBasicMaterial({ map: hTex });
    const hSign = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), hSignMat);
    hSign.position.set(0, 0.3, 0.61);
    hachikoGroup.add(hSign);
    
    // Add small collision box for Hachiko
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(-11, 0.5, -11),
      new THREE.Vector3(1.5, 2.0, 1.5)
    ));
    this.scene.add(hachikoGroup);

    // Traffic Lights
    const poleMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const addTrafficPole = (x, z, rot) => {
      const p = new THREE.Group();
      p.position.set(x, 0, z);
      p.rotation.y = rot;

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 6), poleMat);
      pole.position.y = 3;
      p.add(pole);

      const arm = new THREE.Mesh(new THREE.BoxGeometry(4, 0.2, 0.2), poleMat);
      arm.position.set(2, 5.5, 0);
      p.add(arm);

      const lightBox = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 0.4), new THREE.MeshLambertMaterial({color: 0x111827}));
      lightBox.position.set(3, 5.5, 0);
      p.add(lightBox);

      const colors = [0x22c55e, 0xeab308, 0xef4444];
      colors.forEach((c, i) => {
        const l = new THREE.Mesh(new THREE.CircleGeometry(0.15, 16), new THREE.MeshBasicMaterial({color: c}));
        l.position.set(3 - 0.4 + (i * 0.4), 5.5, 0.21);
        p.add(l);
      });

      this.scene.add(p);
      this.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(x, 3, z), new THREE.Vector3(0.5, 6, 0.5)));
    };

    // Traffic poles at corners
    addTrafficPole(-13, -13, 0);
    addTrafficPole(13, -13, -Math.PI/2);
    addTrafficPole(13, 13, Math.PI);
    addTrafficPole(-13, 13, Math.PI/2);

    // Decorative Ambience: Vending Machine & Trash Bin near NW
    const vm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.5, 1), new THREE.MeshLambertMaterial({color: 0xdc2626}));
    vm.position.set(-15, 1.25, -13);
    this.scene.add(vm);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(-15, 1.25, -13), new THREE.Vector3(1.5, 2.5, 1)));

    const trash = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.2, 0.8), new THREE.MeshLambertMaterial({color: 0x3b82f6}));
    trash.position.set(-13.5, 0.6, -13);
    this.scene.add(trash);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(new THREE.Vector3(-13.5, 0.6, -13), new THREE.Vector3(0.8, 1.2, 0.8)));

    // North Plaza Stage / NPC Quest Area (Shifted North to z: -20 to avoid Scramble)
    const stageGeo = new THREE.BoxGeometry(8.0, 0.4, 6.0);
    const stageMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.set(0, 0.35, -20);
    stage.receiveShadow = true;
    this.scene.add(stage);

    // Stage Backdrop Banner — KOTOBA Tokyo branding
    const bannerGeo = new THREE.BoxGeometry(7.2, 3.2, 0.25);
    const bannerMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 }); // Japanese red
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 2.0, -22.8);
    this.scene.add(banner);

    // Banner canvas text: 中央広場 (Chuo Hiroba)
    const bannerCanvas = document.createElement('canvas');
    bannerCanvas.width = 512; bannerCanvas.height = 256;
    const bCtx = bannerCanvas.getContext('2d');
    bCtx.fillStyle = '#dc2626';
    bCtx.fillRect(0, 0, 512, 256);
    bCtx.fillStyle = '#ffffff';
    bCtx.font = 'bold 54px "Noto Sans JP", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText('中央広場', 256, 100);
    bCtx.font = '28px "Noto Sans JP", sans-serif';
    bCtx.fillText('KOTOBA Tokyo Hub', 256, 175);
    const bannerTex = new THREE.CanvasTexture(bannerCanvas);
    const bannerFaceMat = new THREE.MeshBasicMaterial({ map: bannerTex, side: THREE.DoubleSide });
    const bannerFace = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 3.2), bannerFaceMat);
    bannerFace.position.set(0, 2.0, -22.6);
    this.scene.add(bannerFace);

    // Stage Pillars — white/red Japanese style
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const pillarAccentMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
    [-3.2, 3.2].forEach(px => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), pillarMat);
      p.position.set(px, 2.0, -22.8);
      this.scene.add(p);
      // Red accent band at mid-pillar
      const band = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, 0.35), pillarAccentMat);
      band.position.set(px, 2.2, -22.8);
      this.scene.add(band);
    });

    // Stage Roof Canopy — dark slate
    const roofGeo = new THREE.BoxGeometry(8.4, 0.3, 3.5);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const sRoof = new THREE.Mesh(roofGeo, roofMat);
    sRoof.position.set(0, 3.65, -21.2);
    this.scene.add(sRoof);
  }

  createDistrictsAndBuildings() {
    const colors = {
      blue: 0x2563eb,
      amber: 0xf59e0b,
      pink: 0xec4899,
      emerald: 0x10b981,
      purple: 0x8b5cf6,
      cyan: 0x06b6d4,
      indigo: 0x4338ca,
      slate: 0x334155,
      rose: 0xe11d48,
      teal: 0x0d9488,
      orange: 0xea580c,
      gold: 0xd97706,
      white: 0xf1f5f9,
      beige: 0xe2e8f0,
      charcoal: 0x1e293b,
      red: 0xdc2626,
      konbiniGreen: 0x16a34a
    };

    const windowMat = new THREE.MeshLambertMaterial({
      color: 0xfffbeb,
      emissive: 0xfef08a,
      emissiveIntensity: 0.35
    });

    const glassMat = new THREE.MeshLambertMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.9
    });

    // Over 40+ unique voxel buildings spread across the 420x420 city
    const buildings = [
      // ===== NORTH-WEST: 学校エリア SCHOOL AREA =====
      // Main school building — white/institutional
      { x: -55, z: -55, w: 18, h: 32, d: 18, color: colors.white, name: '学校 (Gakkou)' },
      { x: -35, z: -58, w: 12, h: 20, d: 12, color: colors.beige, name: '図書館 (Toshokan)' },
      { x: -60, z: -35, w: 12, h: 18, d: 12, color: colors.slate, name: '体育館 (Taiikukan)' },
      { x: -95, z: -50, w: 16, h: 24, d: 14, color: colors.beige, name: '寮 (Ryou)' },
      { x: -95, z: -75, w: 14, h: 28, d: 14, color: colors.white, name: '宿舎 (Shukusha)' },
      { x: -45, z: -88, w: 14, h: 18, d: 12, color: colors.slate, name: 'ギャラリー (Gallery)' },
      { x: -75, z: -90, w: 16, h: 22, d: 14, color: colors.amber, name: '文化センター (Bunka Center)' },

      // ===== NORTH-EAST: 東京タワーエリア TOKYO TOWER AREA =====
      // Tallest red building = Tokyo Tower stand-in landmark
      { x: 55, z: -55, w: 18, h: 46, d: 18, color: colors.red, name: '東京タワー (Tokyo Tower)' },
      { x: 35, z: -58, w: 12, h: 24, d: 12, color: colors.charcoal, name: 'オフィス (Office)' },
      { x: 60, z: -35, w: 12, h: 28, d: 12, color: colors.charcoal, name: 'ビジネス (Business)' },
      { x: 95, z: -50, w: 18, h: 52, d: 16, color: colors.slate, name: '高層ビル (Skyscraper)' },
      { x: 95, z: -78, w: 16, h: 36, d: 14, color: colors.slate, name: '証券会社 (Securities)' },
      { x: 50, z: -90, w: 14, h: 22, d: 14, color: colors.charcoal, name: 'ホテル (Hotel)' },
      { x: 75, z: -92, w: 14, h: 26, d: 12, color: colors.beige, name: '展示会場 (Venue)' },

      // ===== SOUTH-WEST: 住宅街 RESIDENTIAL DISTRICT =====
      { x: -55, z: 55, w: 18, h: 28, d: 18, color: colors.white, name: 'アパート (Apartment)' },
      { x: -35, z: 58, w: 12, h: 18, d: 12, color: colors.slate, name: '住宅 (Juutaku)' },
      { x: -60, z: 35, w: 12, h: 22, d: 12, color: colors.charcoal, name: 'マンション (Mansion)' },
      { x: -95, z: 52, w: 16, h: 26, d: 14, color: colors.beige, name: '集合住宅 (Shuugou)' },
      { x: -95, z: 78, w: 14, h: 20, d: 14, color: colors.amber, name: '公園側住宅 (Park Side)' },
      { x: -50, z: 90, w: 14, h: 18, d: 12, color: colors.white, name: 'クリニック (Clinic)' },
      { x: -75, z: 92, w: 16, h: 24, d: 14, color: colors.slate, name: '区民センター (Community)' },

      // ===== SOUTH-EAST: 商店街 SHOPPING/COMMERCIAL DISTRICT =====
      { x: 55, z: 55, w: 18, h: 34, d: 18, color: colors.pink, name: 'ショッピング (Shopping)' },
      { x: 35, z: 58, w: 12, h: 22, d: 12, color: colors.cyan, name: 'カフェ (Café)' },
      { x: 60, z: 35, w: 12, h: 18, d: 12, color: colors.purple, name: '映画館 (Cinema)' },
      { x: 95, z: 52, w: 16, h: 30, d: 14, color: colors.rose, name: 'デパート (Department)' },
      { x: 95, z: 78, w: 14, h: 24, d: 14, color: colors.orange, name: 'クリエイティブ (Creative)' },
      { x: 50, z: 90, w: 14, h: 20, d: 12, color: colors.gold, name: 'ファッション (Fashion)' },
      { x: 75, z: 92, w: 16, h: 26, d: 14, color: colors.teal, name: 'ゲームセンター (Arcade)' },

      // ===== MAIN AVENUE SHOPS (along X-axis) =====
      // West side: コンビニ + shops
      { x: -78, z: -18, w: 12, h: 16, d: 10, color: colors.konbiniGreen, name: 'コンビニ (Konbini)' },
      { x: -96, z: -18, w: 12, h: 18, d: 10, color: colors.beige, name: '薬局 (Yakkyoku)' },
      // East side: ラーメン + shops
      { x: 78, z: -18, w: 12, h: 18, d: 10, color: colors.red, name: 'ラーメン屋 (Ramen)' },
      { x: 96, z: -18, w: 12, h: 20, d: 10, color: colors.charcoal, name: '電器屋 (Electronics)' },
      { x: -78, z: 18, w: 12, h: 16, d: 10, color: colors.amber, name: 'カフェ (Café)' },
      { x: -96, z: 18, w: 12, h: 18, d: 10, color: colors.white, name: '文房具屋 (Stationery)' },
      { x: 78, z: 18, w: 12, h: 18, d: 10, color: colors.red, name: '郵便局 (Post Office)' },
      { x: 96, z: 18, w: 12, h: 20, d: 10, color: colors.slate, name: '音楽教室 (Music School)' },

      // ===== OUTER RING SKYLINE =====
      { x: -140, z: -110, w: 16, h: 38, d: 16, color: colors.slate, name: '西側タワー (West Tower)' },
      { x: 140, z: -110, w: 16, h: 42, d: 16, color: colors.charcoal, name: '東側タワー (East Tower)' },
      { x: -140, z: 110, w: 16, h: 32, d: 16, color: colors.white, name: '研究棟 (Research)' },
      { x: 140, z: 110, w: 16, h: 36, d: 16, color: colors.charcoal, name: 'メディアタワー (Media Tower)' },
      // Tokyo Station at north end
      { x: 0, z: -145, w: 22, h: 26, d: 16, color: colors.charcoal, name: '東京駅 (Tokyo Station)' },
      // South anchor — community hall
      { x: 0, z: 145, w: 22, h: 28, d: 16, color: colors.slate, name: '市民会館 (Civic Hall)' }
    ];

    buildings.forEach(b => {
      const group = new THREE.Group();
      group.position.set(b.x, b.h / 2, b.z);

      // Main structure
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mat = new THREE.MeshLambertMaterial({ color: b.color });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Roof rim / Cornice
      const roofGeo = new THREE.BoxGeometry(b.w + 0.6, 0.8, b.d + 0.6);
      const roofMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = b.h / 2 + 0.4;
      group.add(roof);

      // Rooftop antenna for high buildings
      if (b.h > 30) {
        const antGeo = new THREE.CylinderGeometry(0.1, 0.2, 6.0, 6);
        const antMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
        const ant = new THREE.Mesh(antGeo, antMat);
        ant.position.y = b.h / 2 + 3.4;
        group.add(ant);
      }

      // Windows Grid (Multi-storey)
      const rows = Math.floor(b.h / 3.8);
      for (let r = 1; r < rows; r++) {
        const winGeo = new THREE.BoxGeometry(1.5, 1.8, 0.1);
        const currentWinMat = (r % 3 === 0) ? glassMat : windowMat;

        // Front Windows
        const win1 = new THREE.Mesh(winGeo, currentWinMat);
        win1.position.set(-b.w * 0.25, -b.h / 2 + r * 3.8, b.d / 2 + 0.06);
        group.add(win1);

        const win2 = new THREE.Mesh(winGeo, currentWinMat);
        win2.position.set(b.w * 0.25, -b.h / 2 + r * 3.8, b.d / 2 + 0.06);
        group.add(win2);

        // Rear Windows
        const win3 = new THREE.Mesh(winGeo, currentWinMat);
        win3.position.set(-b.w * 0.25, -b.h / 2 + r * 3.8, -b.d / 2 - 0.06);
        group.add(win3);

        const win4 = new THREE.Mesh(winGeo, currentWinMat);
        win4.position.set(b.w * 0.25, -b.h / 2 + r * 3.8, -b.d / 2 - 0.06);
        group.add(win4);
      }

      this.scene.add(group);

      // Collider for player collision
      this.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(b.x, b.h / 2, b.z),
        new THREE.Vector3(b.w + 1.2, b.h, b.d + 1.2)
      ));
    });
  }

  createStreetFurniture() {
    // Extensive low-poly voxel trees spread across avenues & parks
    const treePositions = [
      // Central Plaza Ring
      { x: -15, z: -15, type: 'oak' }, { x: 15, z: -15, type: 'oak' },
      { x: -15, z: 15, type: 'oak' }, { x: 15, z: 15, type: 'oak' },
      // Avenue Borders
      { x: -30, z: -8, type: 'cherry' }, { x: 30, z: -8, type: 'cherry' },
      { x: -30, z: 8, type: 'autumn' }, { x: 30, z: 8, type: 'autumn' },
      { x: -8, z: -30, type: 'oak' }, { x: 8, z: -30, type: 'oak' },
      { x: -8, z: 30, type: 'oak' }, { x: 8, z: 30, type: 'oak' },
      // District Parks (NW, NE, SW, SE)
      { x: -45, z: -20, type: 'oak' }, { x: 45, z: -20, type: 'cherry' },
      { x: -45, z: 20, type: 'autumn' }, { x: 45, z: 20, type: 'oak' },
      { x: -20, z: -45, type: 'cherry' }, { x: 20, z: -45, type: 'oak' },
      { x: -20, z: 45, type: 'autumn' }, { x: 20, z: 45, type: 'cherry' },
      // Outer Avenues (Expanded reach)
      { x: -65, z: -8, type: 'oak' }, { x: 65, z: -8, type: 'autumn' },
      { x: -65, z: 8, type: 'cherry' }, { x: 65, z: 8, type: 'oak' },
      { x: -8, z: -65, type: 'oak' }, { x: 8, z: -65, type: 'cherry' },
      { x: -8, z: 65, type: 'autumn' }, { x: 8, z: 65, type: 'oak' },
      // Outer Boulevard Ring
      { x: -110, z: -110, type: 'oak' }, { x: 110, z: -110, type: 'autumn' },
      { x: -110, z: 110, type: 'cherry' }, { x: 110, z: 110, type: 'oak' },
      { x: -130, z: -50, type: 'oak' }, { x: 130, z: -50, type: 'autumn' },
      { x: -130, z: 50, type: 'cherry' }, { x: 130, z: 50, type: 'oak' },
      { x: -50, z: -130, type: 'autumn' }, { x: 50, z: -130, type: 'oak' },
      { x: -50, z: 130, type: 'cherry' }, { x: 50, z: 130, type: 'autumn' }
    ];

    treePositions.forEach(p => {
      this.createVoxelTree(p.x, p.z, p.type);
    });

    // Street Lamps along roads and walkways
    const lampPositions = [
      { x: -8, z: -18 }, { x: 8, z: -18 }, { x: -8, z: 18 }, { x: 8, z: 18 },
      { x: -18, z: -8 }, { x: 18, z: -8 }, { x: -18, z: 8 }, { x: 18, z: 8 },
      { x: -45, z: -8 }, { x: 45, z: -8 }, { x: -45, z: 8 }, { x: 45, z: 8 },
      { x: -8, z: -45 }, { x: 8, z: -45 }, { x: -8, z: 45 }, { x: 8, z: 45 },
      { x: -75, z: -8 }, { x: 75, z: -8 }, { x: -75, z: 8 }, { x: 75, z: 8 },
      { x: -8, z: -75 }, { x: 8, z: -75 }, { x: -8, z: 75 }, { x: 8, z: 75 },
      { x: -114, z: -8 }, { x: 114, z: -8 }, { x: -114, z: 8 }, { x: 114, z: 8 },
      { x: -8, z: -114 }, { x: 8, z: -114 }, { x: -8, z: 114 }, { x: 8, z: 114 }
    ];

    lampPositions.forEach(l => {
      this.createStreetLamp(l.x, l.z);
    });

    // Park Benches in plaza and sidewalks
    const benchPositions = [
      { x: -8, y: 0.15, z: -6 }, { x: 8, y: 0.15, z: -6 },
      { x: -8, y: 0.15, z: 6 }, { x: 8, y: 0.15, z: 6 },
      { x: -28, y: 0.15, z: -12 }, { x: 28, y: 0.15, z: 12 },
      { x: -50, y: 0.15, z: -25 }, { x: 50, y: 0.15, z: 25 },
      { x: -70, y: 0.15, z: -12 }, { x: 70, y: 0.15, z: 12 }
    ];

    benchPositions.forEach(b => {
      this.createParkBench(b.x, b.y, b.z);
    });

    // Traffic Lights
    this.createTrafficLights();
    // Fire Hydrants
    this.createFireHydrants();
    // LED Billboards
    this.createLEDNeonBillboards();
  }

  createCivicAmenities() {
    // 1. Bus Stops — Japanese area labels
    const busStops = [
      { x: -25, z: -8, rot: 0, title: '図書館前 (Toshokansaki)' },
      { x: 25, z: 8, rot: Math.PI, title: 'ビジネス街 (Bijinesugai)' },
      { x: -8, z: 25, rot: Math.PI / 2, title: '学校前 (Gakkomae)' },
      { x: 8, z: -25, rot: -Math.PI / 2, title: '中央広場 (Chuo Hiroba)' }
    ];

    busStops.forEach(bs => {
      this.createBusStop(bs.x, bs.z, bs.rot, bs.title);
    });

    // 2. Street Food Vendors — Japanese yatai names & toned-down accent colors
    const stalls = [
      { x: -10, z: -10, rot: Math.PI / 4,       color: 0xdc2626, title: 'たこ焼き' },
      { x: 10,  z: 10,  rot: -3 * Math.PI / 4,  color: 0x1e3a5f, title: 'ラーメン屋台' },
      { x: -38, z: -22, rot: Math.PI / 2,        color: 0x78350f, title: 'やきとり' },
      { x: 38,  z: 22,  rot: -Math.PI / 2,       color: 0x14532d, title: 'おでん' }
    ];

    stalls.forEach(s => {
      this.createStreetVendorCart(s.x, s.z, s.rot, s.color, s.title);
    });

    // 3. Cafe Alfresco Umbrellas & Tables (Plaza Seating)
    this.createCafeTable(-10, 8, 0xef4444);
    this.createCafeTable(-10, 12, 0x3b82f6);
    this.createCafeTable(10, -8, 0x10b981);
    this.createCafeTable(10, -12, 0xf59e0b);

    // 4. Planter Flower Boxes along sidewalks
    const planters = [
      { x: -12, z: -4 }, { x: 12, z: -4 }, { x: -12, z: 4 }, { x: 12, z: 4 },
      { x: -4, z: -12 }, { x: 4, z: -12 }, { x: -4, z: 12 }, { x: 4, z: 12 }
    ];
    planters.forEach(p => {
      this.createFlowerPlanter(p.x, p.z);
    });
  }

  createVoxelTree(x, z, type = 'oak') {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Height variation — seeded from position so it's deterministic
    const seed = Math.abs((x * 7 + z * 13) % 5);
    const heightScale = 0.80 + seed * 0.10; // 0.80 – 1.20 range

    const trunkH  = 3.6 * heightScale;
    const trunkY  = trunkH / 2;
    const canopyBase = trunkH;

    // Trunk — visible, slightly narrower at top for tapered feel
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x3b2f24 });
    const trunkGeo = new THREE.BoxGeometry(0.7, trunkH, 0.7);
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = trunkY;
    trunk.castShadow = true;
    group.add(trunk);

    // Leaf color by tree type
    let leavesColor;
    let accentColor = null;
    if (type === 'cherry') {
      leavesColor = 0xf9a8d4; // Soft sakura pink
      accentColor  = 0xfce7f3; // Light bloom highlight
    } else if (type === 'autumn') {
      leavesColor = 0xb45309; // Deep amber-brown
      accentColor  = 0xd97706; // Bright amber accent
    } else {
      leavesColor = 0x166534; // Deep Tokyo street green
      accentColor  = 0x15803d; // Brighter mid-green accent
    }

    const leavesMat = new THREE.MeshLambertMaterial({ color: leavesColor });
    const accentMat = accentColor
      ? new THREE.MeshLambertMaterial({ color: accentColor })
      : leavesMat;

    // Asymmetric multi-layer canopy for a more natural silhouette
    const cb = canopyBase;
    const addLeaf = (mat, w, h, d, px, py, pz) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(px, py, pz);
      mesh.castShadow = true;
      group.add(mesh);
    };

    // Layer 1 — wide base skirt
    addLeaf(leavesMat, 3.2, 1.2, 3.2,  0,        cb + 0.6,  0);
    // Layer 2 — mid canopy, slightly offset for organic feel
    addLeaf(leavesMat, 2.6, 1.4, 2.6, -0.3,      cb + 1.7,  0.3);
    addLeaf(accentMat,  2.2, 1.2, 2.4,  0.4,      cb + 1.6, -0.4);
    // Layer 3 — upper cluster
    addLeaf(leavesMat, 2.0, 1.2, 2.0,  0,        cb + 2.7,  0);
    addLeaf(accentMat,  1.6, 1.0, 1.8, -0.5,      cb + 2.8,  0.5);
    // Crown peak
    addLeaf(accentMat,  1.2, 0.9, 1.2,  0,        cb + 3.6,  0);

    this.scene.add(group);

    // Collider — unchanged dimensions (trunk only, keeps gameplay intact)
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 2.0, z),
      new THREE.Vector3(1.2, 4.0, 1.2)
    ));
  }

  createStreetLamp(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const metalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const postGeo = new THREE.CylinderGeometry(0.1, 0.14, 4.5, 8);
    const post = new THREE.Mesh(postGeo, metalMat);
    post.position.y = 2.25;
    post.castShadow = true;
    group.add(post);

    // Lamp Head
    const headGeo = new THREE.BoxGeometry(0.6, 0.35, 0.6);
    const headMat = new THREE.MeshLambertMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.8
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 4.5;
    group.add(head);

    this.scene.add(group);
  }

  createParkBench(x, y, z) {
    const benchGroup = new THREE.Group();
    benchGroup.position.set(x, y, z);

    const woodMat = new THREE.MeshLambertMaterial({ color: 0xb45309 });
    const seat = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.12, 0.6), woodMat);
    seat.position.y = 0.4;
    benchGroup.add(seat);

    const backrest = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.4, 0.1), woodMat);
    backrest.position.set(0, 0.65, -0.25);
    benchGroup.add(backrest);

    const legMat = new THREE.MeshLambertMaterial({ color: 0x1f2937 });
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.5), legMat);
    leg1.position.set(-0.8, 0.2, 0);
    benchGroup.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.5), legMat);
    leg2.position.set(0.8, 0.2, 0);
    benchGroup.add(leg2);

    this.scene.add(benchGroup);
  }

  createBusStop(x, z, rot, title) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);
    group.rotation.y = rot;

    const frameMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const glassMat = new THREE.MeshLambertMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.5
    });

    // Posts
    [-1.8, 1.8].forEach(px => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 0.2), frameMat);
      p.position.set(px, 1.4, -0.8);
      group.add(p);
    });

    // Roof Canopy
    const roof = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 2.0), frameMat);
    roof.position.set(0, 2.8, 0);
    group.add(roof);

    // Glass Back Panel
    const backGlass = new THREE.Mesh(new THREE.BoxGeometry(3.6, 2.2, 0.08), glassMat);
    backGlass.position.set(0, 1.5, -0.8);
    group.add(backGlass);

    // Bench inside
    const bench = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.15, 0.5), frameMat);
    bench.position.set(0, 0.5, -0.4);
    group.add(bench);

    this.scene.add(group);

    // Collider
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 1.4, z),
      new THREE.Vector3(3.8, 2.8, 1.6)
    ));
  }

  createStreetVendorCart(x, z, rot, color, title) {
    const group = new THREE.Group();
    group.position.set(x, 0.2, z);
    group.rotation.y = rot;

    // Yatai base (Dark wood)
    const cartGeo = new THREE.BoxGeometry(2.4, 1.2, 1.6);
    const cartMat = new THREE.MeshLambertMaterial({ color: 0x3e2723 });
    const cart = new THREE.Mesh(cartGeo, cartMat);
    cart.position.y = 0.6;
    cart.castShadow = true;
    group.add(cart);

    // Counter top (Warm beige)
    const counter = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.8), new THREE.MeshLambertMaterial({ color: 0xd7ccc8 }));
    counter.position.y = 1.25;
    group.add(counter);

    // Wheels (Dark grey)
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1c1917 });
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 12);
    wheelGeo.rotateZ(Math.PI / 2);

    const w1 = new THREE.Mesh(wheelGeo, wheelMat);
    w1.position.set(-1.0, 0.3, 0);
    group.add(w1);

    const w2 = new THREE.Mesh(wheelGeo, wheelMat);
    w2.position.set(1.0, 0.3, 0);
    group.add(w2);

    // Wooden roof posts
    const postMat = new THREE.MeshLambertMaterial({ color: 0x3e2723 });
    const postGeo = new THREE.BoxGeometry(0.1, 1.8, 0.1);
    [-1.1, 1.1].forEach(px => {
      [-0.6, 0.6].forEach(pz => {
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(px, 2.0, pz);
        group.add(post);
      });
    });

    // Yatai Roof (Slate/dark grey roof)
    const roofGeo = new THREE.BoxGeometry(2.8, 0.2, 2.0);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x27272a });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.9;
    group.add(roof);

    // Colored Lantern (Replacing the bright canopy)
    const lanternGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const lanternMat = new THREE.MeshLambertMaterial({ color: color, emissive: color, emissiveIntensity: 0.5 });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(1.2, 2.3, 0.8);
    group.add(lantern);

    // Noren (Fabric curtain accent)
    const norenGeo = new THREE.BoxGeometry(2.4, 0.4, 0.05);
    const norenMat = new THREE.MeshLambertMaterial({ color: 0xf5f5f4 });
    const noren = new THREE.Mesh(norenGeo, norenMat);
    noren.position.set(0, 2.6, 0.95);
    group.add(noren);

    this.scene.add(group);

    // Collider (Preserved exactly as original)
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 1.2, z),
      new THREE.Vector3(2.4, 2.4, 1.8)
    ));
  }

  createCafeTable(x, z, umbrellaColor) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Table leg & top
    const tableMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.8, 8), tableMat);
    leg.position.y = 0.4;
    group.add(leg);

    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.08, 12), tableMat);
    top.position.y = 0.8;
    group.add(top);

    // Umbrella Pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.4, 6), tableMat);
    pole.position.y = 1.6;
    group.add(pole);

    // Umbrella Cone
    const umbMat = new THREE.MeshLambertMaterial({ color: umbrellaColor });
    const umb = new THREE.Mesh(new THREE.ConeGeometry(1.6, 0.8, 8), umbMat);
    umb.position.y = 2.6;
    group.add(umb);

    // 2 Chairs
    const chairMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    [-1.0, 1.0].forEach(cx => {
      const chair = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.45, 0.4), chairMat);
      chair.position.set(cx, 0.22, 0);
      group.add(chair);
    });

    this.scene.add(group);
  }

  createFlowerPlanter(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Stone box
    const boxMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const box = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 0.6), boxMat);
    box.position.y = 0.25;
    group.add(box);

    // Green hedge & flowers
    const hedgeMat = new THREE.MeshLambertMaterial({ color: 0x16a34a });
    const hedge = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.35, 0.5), hedgeMat);
    hedge.position.y = 0.55;
    group.add(hedge);

    this.scene.add(group);
  }

  createTrafficLights() {
    const corners = [
      { x: -9, z: -9, rot: 0 },
      { x: 9, z: -9, rot: Math.PI / 2 },
      { x: 9, z: 9, rot: Math.PI },
      { x: -9, z: 9, rot: -Math.PI / 2 }
    ];

    corners.forEach(c => {
      const group = new THREE.Group();
      group.position.set(c.x, 0, c.z);
      group.rotation.y = c.rot;

      // Metal pole
      const poleGeo = new THREE.CylinderGeometry(0.12, 0.14, 5.2, 8);
      const poleMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.y = 2.6;
      group.add(pole);

      // Light housing
      const boxGeo = new THREE.BoxGeometry(0.6, 1.4, 0.5);
      const boxMat = new THREE.MeshLambertMaterial({ color: 0x111827 });
      const box = new THREE.Mesh(boxGeo, boxMat);
      box.position.set(0, 4.6, 0.3);
      group.add(box);

      // Red light
      const redMat = new THREE.MeshLambertMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.9 });
      const redLight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8), redMat);
      redLight.rotateX(Math.PI / 2);
      redLight.position.set(0, 5.0, 0.55);
      group.add(redLight);

      // Yellow light
      const yellowMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.8 });
      const yellowLight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8), yellowMat);
      yellowLight.rotateX(Math.PI / 2);
      yellowLight.position.set(0, 4.6, 0.55);
      group.add(yellowLight);

      // Green light
      const greenMat = new THREE.MeshLambertMaterial({ color: 0x10b981, emissive: 0x10b981, emissiveIntensity: 0.9 });
      const greenLight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 8), greenMat);
      greenLight.rotateX(Math.PI / 2);
      greenLight.position.set(0, 4.2, 0.55);
      group.add(greenLight);

      this.scene.add(group);
    });
  }

  createFireHydrants() {
    const hydrantLocations = [
      { x: -14, z: -8 }, { x: 14, z: -8 }, { x: -14, z: 8 }, { x: 14, z: 8 },
      { x: -8, z: -25 }, { x: 8, z: 25 }, { x: -35, z: -8 }, { x: 35, z: 8 }
    ];

    hydrantLocations.forEach(loc => {
      const group = new THREE.Group();
      group.position.set(loc.x, 0, loc.z);

      const redMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
      const bodyGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.7, 8);
      const body = new THREE.Mesh(bodyGeo, redMat);
      body.position.y = 0.35;
      group.add(body);

      // Cap
      const capGeo = new THREE.CylinderGeometry(0.15, 0.22, 0.2, 8);
      const cap = new THREE.Mesh(capGeo, redMat);
      cap.position.y = 0.75;
      group.add(cap);

      this.scene.add(group);
    });
  }

  createLEDNeonBillboards() {
    const billboardData = [
      // NW: School district billboard
      { x: -55, y: 20, z: -45, text: '🏫 学校エリア — School District', color: '#ffffff', bg: '#1e3a5f' },
      // NE: Tokyo Tower / landmark billboard
      { x: 55, y: 26, z: -45, text: '🗼 東京タワー — Final Quest Landmark', color: '#ffffff', bg: '#dc2626' },
      // SE: Shopping district billboard
      { x: 55, y: 20, z: 45, text: '🛍️ 商店街 — Shopping District', color: '#fef08a', bg: '#1e3a8a' },
      // SW: Residential district billboard
      { x: -55, y: 20, z: 45, text: '🏠 住宅街 — Residential District', color: '#ffffff', bg: '#3b2f24' },
      // North: Tokyo Station billboard (existing anchor)
      { x: 0, y: 26, z: -135, text: '🚉 東京駅 — Tokyo Station', color: '#ffffff', bg: '#172554' },
      // South: Community area billboard
      { x: 0, y: 22, z: 135, text: '🏘️ 住民エリア — Community Area', color: '#ffffff', bg: '#374151' }
    ];

    billboardData.forEach(b => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = b.bg;
      ctx.fillRect(0, 0, 512, 128);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, 500, 116);

      ctx.fillStyle = b.color;
      ctx.font = 'bold 30px "Noto Sans JP", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(b.text, 256, 64);

      const texture = new THREE.CanvasTexture(canvas);
      const boardGeo = new THREE.PlaneGeometry(14, 3.5);
      const boardMat = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
      const board = new THREE.Mesh(boardGeo, boardMat);
      board.position.set(b.x, b.y, b.z);
      this.scene.add(board);
    });
  }

  // ─────────────────────────────────────────────────
  // PHASE 3A: TOKYO HUB IDENTITY PROPS
  // ─────────────────────────────────────────────────

  createTokyoHubIdentity() {
    // 1. Directional signpost — placed at NW corner of plaza, on sidewalk connector
    //    x=-20 z=-20 is safely on the NW sidewalk connector tile (center -22,-22, size 20×16)
    this.createDirectionalSignpost(-20, -20);

    // 2. Vending machines — placed on sidewalk tiles, away from road lanes
    //    Main X-avenue spans z: -6 to +6. Main Z-avenue spans x: -6 to +6.
    //    Sidewalk connector tiles: z=±22 (center), x=±22 (center), width/depth 16–20.
    //    Safe sidewalk positions: |z| >= 16 or |x| >= 16, and NOT on road.
    this.createVendingMachine(-20, -27, 0xdc2626, '飲み物');    // NW sidewalk connector
    this.createVendingMachine(20, 27, 0x1e3a8a, 'コーヒー');    // SE sidewalk connector
    this.createVendingMachine(-20, 27, 0x16a34a, 'お茶');       // SW sidewalk connector
    this.createVendingMachine(20, -27, 0xdc2626, '缶ジュース'); // NE sidewalk connector

    // 3. Utility poles — placed on avenue sidewalk strips (z=±17), wires run along X-axis
    //    Sidewalk border strips at x=0, z=±90 (w=14, h=46) and x=±90 (w=46, h=14).
    //    Poles along X-avenue at z=±17 (outside road lane z=±6, outside sidewalk connector).
    //    Pairs are symmetric so wires span between them across X.
    this.createUtilityPole(-42, -17);
    this.createUtilityPole(-42,  17);
    this.createUtilityPole( 42, -17);
    this.createUtilityPole( 42,  17);
    this.createUtilityPole(-70, -17);
    this.createUtilityPole(-70,  17);

    // 4. District entrance marker signs — on district sidewalk blocks at safe corner positions
    this.createDistrictMarker(-32, -32, '学校', '\u2196');       // NW → School
    this.createDistrictMarker(32, -32, '東京タワー', '\u2197');  // NE → Tokyo Tower
    this.createDistrictMarker(-32, 32, '住宅街', '\u2199');      // SW → Residential
    this.createDistrictMarker(32, 32, '商店街', '\u2198');       // SE → Commercial
  }

  createDirectionalSignpost(x, z) {
    // A 4-sided signpost at the hub entrance showing district directions
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const metalMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const postGeo = new THREE.CylinderGeometry(0.12, 0.15, 4.0, 8);
    const post = new THREE.Mesh(postGeo, metalMat);
    post.position.y = 2.0;
    post.castShadow = true;
    group.add(post);

    // 4 directional sign panels, each facing a district direction
    const directions = [
      { rot: 0,              text: '← 学校',           bg: '#1e3a5f', fg: '#ffffff' },  // West/NW
      { rot: Math.PI / 2,   text: '↑ 東京駅',         bg: '#172554', fg: '#ffffff' },  // North
      { rot: Math.PI,       text: '東京タワー →',      bg: '#dc2626', fg: '#ffffff' },  // East/NE
      { rot: -Math.PI / 2,  text: '↓ 住宅街',         bg: '#3b2f24', fg: '#ffffff' },  // South
    ];

    directions.forEach((dir, i) => {
      const signCanvas = document.createElement('canvas');
      signCanvas.width = 256; signCanvas.height = 80;
      const ctx = signCanvas.getContext('2d');
      ctx.fillStyle = dir.bg;
      ctx.fillRect(0, 0, 256, 80);
      ctx.fillStyle = dir.fg;
      ctx.font = 'bold 28px "Noto Sans JP", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(dir.text, 128, 40);

      const signTex = new THREE.CanvasTexture(signCanvas);
      const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
      const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.75), signMat);
      signMesh.position.set(0, 3.4 - i * 0.78, 0);
      signMesh.rotation.y = dir.rot;
      group.add(signMesh);

      // Sign backing
      const backMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 0.06), backMat);
      back.position.set(0, 3.4 - i * 0.78, 0);
      back.rotation.y = dir.rot;
      group.add(back);
    });

    this.scene.add(group);
    // Thin collider — players can pass by but not through the pole
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 2.0, z),
      new THREE.Vector3(0.5, 4.0, 0.5)
    ));
  }

  createVendingMachine(x, z, color, label) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    // Machine body
    const bodyMat = new THREE.MeshLambertMaterial({ color });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.85, 0.6), bodyMat);
    body.position.y = 0.925;
    body.castShadow = true;
    group.add(body);

    // Front display panel (lighter)
    const displayMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const display = new THREE.Mesh(new THREE.BoxGeometry(0.7, 1.0, 0.05), displayMat);
    display.position.set(0, 1.2, 0.32);
    group.add(display);

    // Label canvas
    const lCanvas = document.createElement('canvas');
    lCanvas.width = 128; lCanvas.height = 200;
    const lCtx = lCanvas.getContext('2d');
    lCtx.fillStyle = '#ffffff';
    lCtx.fillRect(0, 0, 128, 200);
    lCtx.fillStyle = '#1e293b';
    lCtx.font = 'bold 36px "Noto Sans JP", sans-serif';
    lCtx.textAlign = 'center';
    lCtx.textBaseline = 'middle';
    lCtx.fillText(label, 64, 100);
    const lTex = new THREE.CanvasTexture(lCanvas);
    const labelMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.68, 0.98),
      new THREE.MeshBasicMaterial({ map: lTex, side: THREE.DoubleSide })
    );
    labelMesh.position.set(0, 1.2, 0.335);
    group.add(labelMesh);

    // Coin slot / button strip (dark)
    const slotMat = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const slot = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.12, 0.05), slotMat);
    slot.position.set(0, 0.55, 0.32);
    group.add(slot);

    // Dispense tray
    const tray = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.08, 0.15), slotMat);
    tray.position.set(0, 0.2, 0.27);
    group.add(tray);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 0.925, z),
      new THREE.Vector3(1.1, 1.85, 0.8)
    ));
  }

  createUtilityPole(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const woodMat = new THREE.MeshLambertMaterial({ color: 0x4a3728 });

    // Main pole
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 7.0, 8), woodMat);
    pole.position.y = 3.5;
    pole.castShadow = true;
    group.add(pole);

    // Cross arm (横木) — spans Z-axis to support the 3 wire rows
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 2.8), woodMat);
    arm.position.y = 6.8;
    group.add(arm);

    // Insulators (small white cylinders)
    // Insulators — offset along Z to match wire spacing
    const insMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });
    [-1.2, 0, 1.2].forEach(oz => {
      const ins = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 6), insMat);
      ins.position.set(0, 6.74, oz);
      group.add(ins);
    });

    // Electrical wires — rotated 90° on Y so they run along X-axis (parallel to avenue)
    // BoxGeometry length=28 is in local Z; rotating 90° on Y makes it extend along X.
    const wireMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    [-1.2, 0, 1.2].forEach(ox => {
      const wire = new THREE.Mesh(new THREE.BoxGeometry(28, 0.03, 0.03), wireMat);
      wire.position.set(0, 6.6, ox);  // Offset in Z for insulator spacing
      group.add(wire);
    });

    this.scene.add(group);
    // Slim collider — only the pole base
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 3.5, z),
      new THREE.Vector3(0.4, 7.0, 0.4)
    ));
  }

  createDistrictMarker(x, z, label, arrow) {
    // Simple low marker post with a district label — placed at district approach
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const metalMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.5, 0.18), metalMat);
    post.position.y = 1.25;
    post.castShadow = true;
    group.add(post);

    // Sign panel
    const mCanvas = document.createElement('canvas');
    mCanvas.width = 256; mCanvas.height = 128;
    const mCtx = mCanvas.getContext('2d');
    mCtx.fillStyle = '#0f172a';
    mCtx.fillRect(0, 0, 256, 128);
    mCtx.strokeStyle = '#dc2626';
    mCtx.lineWidth = 4;
    mCtx.strokeRect(4, 4, 248, 120);
    mCtx.fillStyle = '#ffffff';
    mCtx.font = 'bold 38px "Noto Sans JP", sans-serif';
    mCtx.textAlign = 'center';
    mCtx.textBaseline = 'middle';
    mCtx.fillText(label, 128, 56);
    mCtx.font = '28px sans-serif';
    mCtx.fillStyle = '#fbbf24';
    mCtx.fillText(arrow, 128, 100);

    const mTex = new THREE.CanvasTexture(mCanvas);
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(2.0, 1.0),
      new THREE.MeshBasicMaterial({ map: mTex, side: THREE.DoubleSide })
    );
    panel.position.set(0, 2.7, 0);
    group.add(panel);

    const panelBack = new THREE.Mesh(
      new THREE.BoxGeometry(2.1, 1.1, 0.08),
      metalMat
    );
    panelBack.position.set(0, 2.7, 0);
    group.add(panelBack);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 1.25, z),
      new THREE.Vector3(0.4, 2.5, 0.4)
    ));
  }

  // ─────────────────────────────────────────────────
  // PHASE 3B: TOKYO STATION AREA
  //
  // Station building: x=0, z=-145, w=22, h=26, d=16
  //   South face (toward hub): z = -145 + 8 = -137
  //   Existing collider: x=-12.1..+12.1, z=-154.1..-135.9
  //
  // Road geometry:
  //   Z-avenue vehicle lane: x=-6 to x=+6  → NO objects placed here
  //   Boulevard North (z=-120), lane: z=-124.5 to z=-115.5
  //
  // Safe pedestrian zone: z=-126 to z=-137, x=-20 to x=+20
  //   (outside boulevard lane and outside Z-avenue lane)
  // ─────────────────────────────────────────────────

  createTokyoStationArea() {
    const FACE_Z  = -137; // Station south face (toward hub): z = -145 + 8
    const PLAZA_Z = -131; // Plaza tile center
    const CURB_Z  = -126; // Near boulevard edge — pedestrian curb

    // ── 1. STATION PLAZA PAVEMENT ───────────────────
    // Light stone tile in front of entrance — 40 wide, 10 deep
    // Spans z: -126 to -136, x: -20 to +20
    const plazaGeo = new THREE.BoxGeometry(40, 0.25, 10);
    const plazaMat = new THREE.MeshLambertMaterial({ color: 0xd1d5db });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(0, 0.125, PLAZA_Z);
    plaza.receiveShadow = true;
    this.scene.add(plaza);

    // Raised curb edge — dark strip at boulevard side
    const curbMat = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(40, 0.18, 0.6), curbMat);
    curb.position.set(0, 0.09, CURB_Z + 0.3);
    this.scene.add(curb);

    // Center approach accent (slightly lighter paving strip, N-S axis)
    const accentMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const accent = new THREE.Mesh(new THREE.BoxGeometry(5, 0.26, 10), accentMat);
    accent.position.set(0, 0.13, PLAZA_Z);
    this.scene.add(accent);

    // ── 2. ENTRANCE CANOPY ───────────────────────────
    // Slim flat canopy flush to station south face — 22 wide, 4.5 deep
    const CANOPY_Y = 6.5;
    const CANOPY_Z = FACE_Z - 2.0; // Center of canopy depth

    // Canopy roof: Japanese red thin slab
    const roofMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
    const roof = new THREE.Mesh(new THREE.BoxGeometry(22, 0.3, 4.5), roofMat);
    roof.position.set(0, CANOPY_Y, CANOPY_Z);
    roof.castShadow = true;
    this.scene.add(roof);

    // Canopy soffit (white underside)
    const soffitMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const soffit = new THREE.Mesh(new THREE.BoxGeometry(21.6, 0.1, 4.2), soffitMat);
    soffit.position.set(0, CANOPY_Y - 0.15, CANOPY_Z);
    this.scene.add(soffit);

    // 4 slim white support pillars — outside Z-avenue lane (|x| > 6)
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const pillarBaseMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
    [-9, -3, 3, 9].forEach(px => {
      // Pillar shaft
      const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.35, CANOPY_Y, 0.35), pillarMat);
      pillar.position.set(px, CANOPY_Y / 2, FACE_Z - 0.18);
      pillar.castShadow = true;
      this.scene.add(pillar);
      // Red base block
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.6), pillarBaseMat);
      base.position.set(px, 0.15, FACE_Z - 0.18);
      this.scene.add(base);
      // Collider per pillar (slim — players walk between them)
      this.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(px, CANOPY_Y / 2, FACE_Z - 0.18),
        new THREE.Vector3(0.6, CANOPY_Y, 0.6)
      ));
    });

    // ── 3. STATION FACADE SIGNAGE ────────────────────
    // Mounted on building south face (z = FACE_Z), facing south

    // Primary: 東京駅 — large white text on charcoal panel
    const mainC = document.createElement('canvas');
    mainC.width = 512; mainC.height = 156;
    const mCtx = mainC.getContext('2d');
    mCtx.fillStyle = '#1e293b';
    mCtx.fillRect(0, 0, 512, 156);
    mCtx.fillStyle = '#dc2626';
    mCtx.fillRect(0, 0, 12, 156);
    mCtx.fillRect(500, 0, 12, 156);
    mCtx.fillStyle = '#ffffff';
    mCtx.font = 'bold 88px "Noto Sans JP", sans-serif';
    mCtx.textAlign = 'center';
    mCtx.textBaseline = 'middle';
    mCtx.fillText('東京駅', 256, 78);
    const mainTex = new THREE.CanvasTexture(mainC);
    const mainSign = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 5.5),
      new THREE.MeshBasicMaterial({ map: mainTex, side: THREE.DoubleSide })
    );
    mainSign.position.set(0, 19.5, FACE_Z + 0.12);
    this.scene.add(mainSign);

    // Secondary: TOKYO STATION in English
    const subC = document.createElement('canvas');
    subC.width = 512; subC.height = 80;
    const sCtx = subC.getContext('2d');
    sCtx.fillStyle = '#0f172a';
    sCtx.fillRect(0, 0, 512, 80);
    sCtx.fillStyle = '#94a3b8';
    sCtx.font = 'bold 38px "Noto Sans JP", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('TOKYO  STATION', 256, 40);
    const subTex = new THREE.CanvasTexture(subC);
    const subSign = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 2.2),
      new THREE.MeshBasicMaterial({ map: subTex, side: THREE.DoubleSide })
    );
    subSign.position.set(0, 15.8, FACE_Z + 0.12);
    this.scene.add(subSign);

    // Exit / entry signs — small green panels above canopy level
    [
      { x: -8.5, text: '← 出口', bg: '#166534' },
      { x:  8.5, text: '中央口 →', bg: '#166534' }
    ].forEach(ed => {
      const ec = document.createElement('canvas');
      ec.width = 256; ec.height = 80;
      const eCtx = ec.getContext('2d');
      eCtx.fillStyle = ed.bg;
      eCtx.fillRect(0, 0, 256, 80);
      eCtx.fillStyle = '#ffffff';
      eCtx.font = 'bold 36px "Noto Sans JP", sans-serif';
      eCtx.textAlign = 'center';
      eCtx.textBaseline = 'middle';
      eCtx.fillText(ed.text, 128, 40);
      const eTex = new THREE.CanvasTexture(ec);
      const eSign = new THREE.Mesh(
        new THREE.PlaneGeometry(3.8, 1.2),
        new THREE.MeshBasicMaterial({ map: eTex, side: THREE.DoubleSide })
      );
      eSign.position.set(ed.x, CANOPY_Y + 1.0, FACE_Z + 0.1);
      this.scene.add(eSign);
    });

    // ── 4. INFO BOARD ───────────────────────────────
    // x=+16 z=-131 — east side of plaza, outside Z-avenue lane
    this._createStationInfoBoard(16, -131);

    // ── 5. PLATFORM BENCHES ─────────────────────────
    // Flanking the approach path, outside Z-avenue lane
    this._createStationBench(-14, -130);
    this._createStationBench(14, -130);

    // ── 6. VENDING MACHINES ─────────────────────────
    // East side of plaza — x=+18, clear of Z-avenue
    this.createVendingMachine(18, -128, 0xdc2626, '飲み物');
    this.createVendingMachine(18, -133, 0x1e3a8a, 'コーヒー');

    // ── 7. BICYCLE RACK ─────────────────────────────
    // West side — x=-16, z=-130
    this._createBicycleRack(-16, -130);
  }

  _createStationInfoBoard(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const poleMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.10, 3.5, 8), poleMat);
    pole.position.y = 1.75;
    group.add(pole);

    const boardBacking = new THREE.Mesh(
      new THREE.BoxGeometry(4.6, 2.6, 0.12),
      new THREE.MeshLambertMaterial({ color: 0x0f172a })
    );
    boardBacking.position.y = 3.5;
    group.add(boardBacking);

    const bc = document.createElement('canvas');
    bc.width = 512; bc.height = 288;
    const bCtx = bc.getContext('2d');
    bCtx.fillStyle = '#0f172a';
    bCtx.fillRect(0, 0, 512, 288);
    bCtx.fillStyle = '#dc2626';
    bCtx.fillRect(0, 0, 512, 54);
    bCtx.fillStyle = '#ffffff';
    bCtx.font = 'bold 32px "Noto Sans JP", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText('案内図 — INFO', 256, 27);
    bCtx.fillStyle = '#e2e8f0';
    bCtx.font = '26px "Noto Sans JP", sans-serif';
    bCtx.textAlign = 'left';
    bCtx.fillText('🚉  東京駅  Tokyo Station', 20, 92);
    bCtx.fillText('🏫  学校     School Area', 20, 140);
    bCtx.fillText('🗼  東京タワー  Tower', 20, 188);
    bCtx.fillText('🛍️  商店街   Shopping', 20, 236);
    const bTex = new THREE.CanvasTexture(bc);
    const boardFace = new THREE.Mesh(
      new THREE.PlaneGeometry(4.5, 2.5),
      new THREE.MeshBasicMaterial({ map: bTex, side: THREE.DoubleSide })
    );
    boardFace.position.set(0, 3.5, 0.07);
    group.add(boardFace);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 1.75, z),
      new THREE.Vector3(0.4, 3.5, 0.4)
    ));
  }

  _createStationBench(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const woodMat  = new THREE.MeshLambertMaterial({ color: 0x78350f });
    const frameMat = new THREE.MeshLambertMaterial({ color: 0x334155 });

    // Seat slats (3 strips)
    for (let i = -1; i <= 1; i++) {
      const slat = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.08, 0.18), woodMat);
      slat.position.set(0, 0.45, i * 0.22);
      group.add(slat);
    }
    // Backrest
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.5, 0.08), woodMat);
    back.position.set(0, 0.72, -0.35);
    group.add(back);
    // Metal legs
    [-1.1, 1.1].forEach(lx => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.55), frameMat);
      leg.position.set(lx, 0.22, 0);
      group.add(leg);
    });

    this.scene.add(group);
    // No collider — bench is small, players can navigate around it naturally
  }

  _createBicycleRack(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const metalMat = new THREE.MeshLambertMaterial({ color: 0x475569 });

    // Top horizontal bar
    const bar = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.08, 0.08), metalMat);
    bar.position.y = 0.7;
    group.add(bar);

    // 3 U-shaped stands
    [-1.2, 0, 1.2].forEach(lx => {
      ['z', 'z'].forEach((_, i) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.06), metalMat);
        leg.position.set(lx, 0.35, i === 0 ? -0.3 : 0.3);
        group.add(leg);
      });
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.6), metalMat);
      base.position.set(lx, 0.03, 0);
      group.add(base);
    });

    // Label sign: 駐輪場
    const lc = document.createElement('canvas');
    lc.width = 256; lc.height = 64;
    const lCtx = lc.getContext('2d');
    lCtx.fillStyle = '#475569';
    lCtx.fillRect(0, 0, 256, 64);
    lCtx.fillStyle = '#f1f5f9';
    lCtx.font = 'bold 30px "Noto Sans JP", sans-serif';
    lCtx.textAlign = 'center';
    lCtx.textBaseline = 'middle';
    lCtx.fillText('駐輪場', 128, 32);
    const lTex = new THREE.CanvasTexture(lc);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(1.5, 0.38),
      new THREE.MeshBasicMaterial({ map: lTex, side: THREE.DoubleSide })
    );
    label.position.set(0, 1.05, 0);
    group.add(label);

    this.scene.add(group);
    // No solid collider — open rack structure
  }

  // ═══════════════════════════════════════════════════
  // PHASE 3C: COMMERCIAL / KONBINI DISTRICT
  //
  // Target: East Main-Avenue shop strip (x ≈ 63–113)
  //   Buildings at x=78 z=-18 (south face z=-13 → Konbini)
  //              x=96 z=-18 (south face z=-13 → パン屋)
  //              x=78 z=+18 (north face z=+13 → 本屋)
  //
  // Road constraints:
  //   Main X-avenue vehicle lane: z = -6 to +6  → NO props here
  //   Sidewalk strip (90,0,46,14): x=67–113, z=-7 to +7
  //
  // Safe pedestrian frontage:
  //   South-side props: z = -8 to -22, x = 63–112
  //   North-side props: z = +8 to +22, x = 63–112
  // ═══════════════════════════════════════════════════

  createCommercialDistrict() {
    // ── 1. KONBINI STOREFRONT ─────────────────────────
    this._createKonbiniStorefront(78, -18);

    // ── 2. SHOP SIGNS ─────────────────────────────────
    this._createShopSign(96, -18, '🍞 パン屋', '#78350f', '#fef3c7');
    this._createShopSign(78,  18, '📚 本屋',  '#1e3a5f', '#e0f2fe');

    // ── 3. PEDESTRIAN FRONTAGE PAVEMENT ──────────────
    const frontMat = new THREE.MeshLambertMaterial({ color: 0xc8cdd4 });
    const frontS = new THREE.Mesh(new THREE.BoxGeometry(48, 0.24, 5), frontMat);
    frontS.position.set(90, 0.12, -10.5);
    frontS.receiveShadow = true;
    this.scene.add(frontS);

    const frontN = new THREE.Mesh(new THREE.BoxGeometry(48, 0.24, 5), frontMat);
    frontN.position.set(90, 0.12, 10.5);
    frontN.receiveShadow = true;
    this.scene.add(frontN);

    // Curb edge strips at road boundary
    const curbMat = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const curbS = new THREE.Mesh(new THREE.BoxGeometry(48, 0.14, 0.4), curbMat);
    curbS.position.set(90, 0.07, -7.8);
    this.scene.add(curbS);
    const curbN = new THREE.Mesh(new THREE.BoxGeometry(48, 0.14, 0.4), curbMat);
    curbN.position.set(90, 0.07, 7.8);
    this.scene.add(curbN);

    // ── 4. SHOP AWNINGS ───────────────────────────────
    this._createShopAwning(78, -13, 11, 0x16a34a, false); // Konbini green
    this._createShopAwning(96, -13, 10, 0x78350f, false); // Bakery brown
    this._createShopAwning(78,  13, 10, 0x1e3a5f, true);  // Bookstore blue

    // ── 5. VENDING MACHINES ───────────────────────────
    this.createVendingMachine(68, -12,   0xdc2626, '飲み物');
    this.createVendingMachine(68, -15.5, 0xf59e0b, 'ジュース');
    this.createVendingMachine(68,  12,   0x16a34a, 'お茶');

    // ── 6. STREET LAMPS ───────────────────────────────
    this.createStreetLamp(67, -10);
    this.createStreetLamp(67,  10);
    this.createStreetLamp(110, -10);
    this.createStreetLamp(110,  10);

    // ── 7. RECYCLE BINS ───────────────────────────────
    this._createRecycleBin(72, -11);
    this._createRecycleBin(72,  11);

    // ── 8. BICYCLE PARKING ────────────────────────────
    this._createBicycleRack(105, -12);

    // ── 9. SMALL PLANTERS ─────────────────────────────
    this.createFlowerPlanter(65, -11);
    this.createFlowerPlanter(65,  11);

    // ── 10. DISTRICT ENTRANCE SIGN ────────────────────
    this._createCommercialDistrictSign(63, 0);
  }

  _createKonbiniStorefront(bx, bz) {
    const faceZ = bz + 5; // South face of building (bz=-18 → faceZ=-13)

    // Green fascia panel
    const fasciaMat = new THREE.MeshLambertMaterial({ color: 0x16a34a });
    const fascia = new THREE.Mesh(new THREE.BoxGeometry(12, 3.2, 0.28), fasciaMat);
    fascia.position.set(bx, 1.6, faceZ + 0.14);
    fascia.castShadow = true;
    this.scene.add(fascia);

    // コンビニ + 24H sign
    const kc = document.createElement('canvas');
    kc.width = 512; kc.height = 128;
    const kCtx = kc.getContext('2d');
    kCtx.fillStyle = '#16a34a';
    kCtx.fillRect(0, 0, 512, 128);
    kCtx.fillStyle = '#ffffff';
    kCtx.font = 'bold 56px "Noto Sans JP", sans-serif';
    kCtx.textAlign = 'left';
    kCtx.textBaseline = 'middle';
    kCtx.fillText('コンビニ', 16, 64);
    kCtx.fillStyle = '#fef08a';
    kCtx.font = 'bold 48px monospace';
    kCtx.textAlign = 'right';
    kCtx.fillText('24H', 500, 64);
    const kSign = new THREE.Mesh(
      new THREE.PlaneGeometry(11.5, 2.9),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(kc), side: THREE.DoubleSide })
    );
    kSign.position.set(bx, 1.6, faceZ + 0.3);
    this.scene.add(kSign);

    // いらっしゃいませ
    const wc = document.createElement('canvas');
    wc.width = 512; wc.height = 72;
    const wCtx = wc.getContext('2d');
    wCtx.fillStyle = '#ffffff';
    wCtx.fillRect(0, 0, 512, 72);
    wCtx.fillStyle = '#16a34a';
    wCtx.font = 'bold 38px "Noto Sans JP", sans-serif';
    wCtx.textAlign = 'center';
    wCtx.textBaseline = 'middle';
    wCtx.fillText('いらっしゃいませ', 256, 36);
    const wSign = new THREE.Mesh(
      new THREE.PlaneGeometry(8.5, 1.2),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(wc), side: THREE.DoubleSide })
    );
    wSign.position.set(bx, 3.5, faceZ + 0.3);
    this.scene.add(wSign);

    // Glass display windows (flanking door)
    const glassMat = new THREE.MeshLambertMaterial({
      color: 0x7dd3fc, transparent: true, opacity: 0.5
    });
    [-3.5, 3.5].forEach(ox => {
      const win = new THREE.Mesh(new THREE.BoxGeometry(4.0, 3.5, 0.1), glassMat);
      win.position.set(bx + ox, 5.5, faceZ + 0.05);
      this.scene.add(win);
    });

    // Door frame (dark)
    const doorFrame = new THREE.Mesh(
      new THREE.BoxGeometry(2.0, 3.6, 0.18),
      new THREE.MeshLambertMaterial({ color: 0x0f172a })
    );
    doorFrame.position.set(bx, 5.5, faceZ + 0.09);
    this.scene.add(doorFrame);

    // 入口 sign
    const ec = document.createElement('canvas');
    ec.width = 128; ec.height = 60;
    const eCtx = ec.getContext('2d');
    eCtx.fillStyle = '#166534';
    eCtx.fillRect(0, 0, 128, 60);
    eCtx.fillStyle = '#ffffff';
    eCtx.font = 'bold 34px "Noto Sans JP", sans-serif';
    eCtx.textAlign = 'center';
    eCtx.textBaseline = 'middle';
    eCtx.fillText('入口', 64, 30);
    const eSign = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.84),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(ec), side: THREE.DoubleSide })
    );
    eSign.position.set(bx, 7.8, faceZ + 0.28);
    this.scene.add(eSign);
  }

  _createShopSign(bx, bz, displayText, bgColor, textColor) {
    const isSouth = bz < 0;
    const faceZ = bz + (isSouth ? 5 : -5);
    const zOff = isSouth ? 0.12 : -0.12;

    // Fascia
    const bgInt = parseInt('0x' + bgColor.replace('#', ''));
    const facMat = new THREE.MeshLambertMaterial({ color: bgInt });
    const fac = new THREE.Mesh(new THREE.BoxGeometry(10.5, 2.8, 0.22), facMat);
    fac.position.set(bx, 3.2, faceZ + zOff * 0.5);
    this.scene.add(fac);

    // Sign canvas
    const sc = document.createElement('canvas');
    sc.width = 512; sc.height = 136;
    const sCtx = sc.getContext('2d');
    sCtx.fillStyle = bgColor;
    sCtx.fillRect(0, 0, 512, 136);
    sCtx.fillStyle = textColor;
    sCtx.font = 'bold 60px "Noto Sans JP", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText(displayText, 256, 68);
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 2.6),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), side: THREE.DoubleSide })
    );
    sign.position.set(bx, 3.2, faceZ + zOff);
    if (!isSouth) sign.rotation.y = Math.PI;
    this.scene.add(sign);
  }

  _createShopAwning(bx, faceZ, width, color, facingNorth = false) {
    const mat = new THREE.MeshLambertMaterial({ color });
    const dir = facingNorth ? 1 : -1;
    const depth = 1.8;
    const awning = new THREE.Mesh(new THREE.BoxGeometry(width, 0.18, depth), mat);
    awning.position.set(bx, 5.8, faceZ + dir * (depth / 2));
    awning.castShadow = true;
    this.scene.add(awning);
    const valance = new THREE.Mesh(new THREE.BoxGeometry(width, 0.55, 0.07), mat);
    valance.position.set(bx, 5.5, faceZ + dir * depth);
    this.scene.add(valance);
  }

  _createRecycleBin(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.9, 0.5),
      new THREE.MeshLambertMaterial({ color: 0x374151 })
    );
    body.position.y = 0.45;
    group.add(body);

    const lid = new THREE.Mesh(
      new THREE.BoxGeometry(0.54, 0.1, 0.54),
      new THREE.MeshLambertMaterial({ color: 0x16a34a })
    );
    lid.position.y = 0.95;
    group.add(lid);

    const rc = document.createElement('canvas');
    rc.width = 128; rc.height = 128;
    const rCtx = rc.getContext('2d');
    rCtx.fillStyle = '#374151';
    rCtx.fillRect(0, 0, 128, 128);
    rCtx.fillStyle = '#ffffff';
    rCtx.font = 'bold 24px "Noto Sans JP", sans-serif';
    rCtx.textAlign = 'center';
    rCtx.textBaseline = 'middle';
    rCtx.fillText('ゴミ', 64, 64);
    const label = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.42),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(rc), side: THREE.DoubleSide })
    );
    label.position.set(0, 0.45, 0.26);
    group.add(label);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 0.45, z),
      new THREE.Vector3(0.7, 0.9, 0.7)
    ));
  }

  _createCommercialDistrictSign(x, z) {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.10, 3.8, 8),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    post.position.y = 1.9;
    group.add(post);

    const sc = document.createElement('canvas');
    sc.width = 320; sc.height = 128;
    const sCtx = sc.getContext('2d');
    sCtx.fillStyle = '#0f172a';
    sCtx.fillRect(0, 0, 320, 128);
    sCtx.strokeStyle = '#16a34a';
    sCtx.lineWidth = 5;
    sCtx.strokeRect(4, 4, 312, 120);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 46px "Noto Sans JP", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('商店街', 160, 50);
    sCtx.fillStyle = '#94a3b8';
    sCtx.font = '22px sans-serif';
    sCtx.fillText('Shopping Street', 160, 98);

    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 1.12),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), side: THREE.DoubleSide })
    );
    panel.position.set(0, 3.9, 0);
    group.add(panel);

    const back = new THREE.Mesh(
      new THREE.BoxGeometry(2.9, 1.2, 0.08),
      new THREE.MeshLambertMaterial({ color: 0x0f172a })
    );
    back.position.set(0, 3.9, 0);
    group.add(back);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 1.9, z),
      new THREE.Vector3(0.4, 3.8, 0.4)
    ));
  }


  // ═══════════════════════════════════════════════════
  // PHASE 3D: EDUCATION / SCHOOL DISTRICT (NW)
  //
  // Main school building: x=-55, z=-55, w=18, h=32, d=18
  //   South face (toward inner road): z = -55 + 9 = -46
  //   East face (toward Z-avenue):    x = -55 + 9 = -46
  //
  // NW inner sidewalk quarter: x:-83 to -13, z:-83 to -13
  //
  // Road constraints:
  //   Inner road north (z=-60), lane: z=-63.5 to -56.5 → NO props here
  //   Main Z-avenue (x=0), lane: x=-6 to +6 → far away, no conflict
  //
  // Safe pedestrian frontage:
  //   South approach: z=-47 to -55, x=-70 to -40
  //   (between south face z=-46 and inner road edge z=-56.5)
  //   East approach:  x=-47 to -60, z=-42 to -68 (east sidewalk)
  // ═══════════════════════════════════════════════════

  createEducationDistrict() {
    const BX = -55; // School building center X
    const BZ = -55; // School building center Z
    const S_FACE_Z = BZ + 9;  // South face: -46 (closest to inner road)
    const E_FACE_X = BX + 9;  // East face:  -46 (players approach from here)

    // ── 1. SCHOOL FACADE SIGNAGE ─────────────────────
    // Mounted on the east face of the school (x=-46), visible from the main path
    this._createSchoolFacadeSign(E_FACE_X, BZ);

    // ── 2. ENTRANCE CANOPY ───────────────────────────
    // Simple canopy on the east face (player-facing side)
    // Protrudes from x=-46 eastward (toward x=-40)
    this._createSchoolEntranceCanopy(E_FACE_X, BZ);

    // ── 3. SCHOOL FRONTAGE PAVEMENT ──────────────────
    // Darker pavement strip on east approach: x=-47 to -58, z=-44 to -66
    // Center: x=-52.5 z=-55, size 11×22
    // Stays within NW sidewalk quarter and away from inner road
    const frontMat = new THREE.MeshLambertMaterial({ color: 0xc4c9d0 });
    const frontPave = new THREE.Mesh(new THREE.BoxGeometry(11, 0.24, 22), frontMat);
    frontPave.position.set(-52.5, 0.12, BZ);
    frontPave.receiveShadow = true;
    this.scene.add(frontPave);

    // Curb edge (dark) between frontage and inner road area
    const curbMat = new THREE.MeshLambertMaterial({ color: 0x374151 });
    const curb = new THREE.Mesh(new THREE.BoxGeometry(11, 0.14, 0.4), curbMat);
    curb.position.set(-52.5, 0.07, -55.8); // Toward inner road edge
    this.scene.add(curb);

    // ── 4. SCHOOL NOTICE BOARD ───────────────────────
    // x=-48, z=-50 — on east frontage, clear of building collider
    this._createSchoolNoticeBoard(-48, -50);

    // ── 5. BICYCLE PARKING ───────────────────────────
    // x=-48, z=-60 — south frontage, away from building, just inside road edge
    // Inner road lane edge at z=-56.5; put rack just outside at z=-54
    this._createBicycleRack(-48, -54);

    // ── 6. SMALL PLANTERS ────────────────────────────
    // Flanking the east entrance — clear of building face at x=-46
    this.createFlowerPlanter(-44, -50);
    this.createFlowerPlanter(-44, -60);

    // ── 7. STREET LAMPS ──────────────────────────────
    // Along east frontage path — outside vehicle lanes
    this.createStreetLamp(-44, -48);
    this.createStreetLamp(-44, -62);

    // ── 8. DISTRICT ENTRANCE SIGN ────────────────────
    // At the approach from the central hub — x=-32, z=-48
    // (just inside NW district, clearly on sidewalk)
    this._createEducationDistrictSign(-32, -48);
  }

  _createSchoolFacadeSign(faceX, buildingZ) {
    // Main school identity sign on the EAST face of the school building
    // faceX = -46 (east face), buildingZ = -55 (building center)
    // Sign faces EAST (toward the approaching player from central hub)

    // ── Primary school name panel: 学校 ──
    const mc = document.createElement('canvas');
    mc.width = 512; mc.height = 200;
    const mCtx = mc.getContext('2d');
    mCtx.fillStyle = '#1e3a5f'; // Deep navy — institutional
    mCtx.fillRect(0, 0, 512, 200);
    mCtx.fillStyle = '#dc2626'; // Japanese red accent bars
    mCtx.fillRect(0, 0, 14, 200);
    mCtx.fillRect(498, 0, 14, 200);
    mCtx.fillStyle = '#ffffff';
    mCtx.font = 'bold 90px "Noto Sans JP", sans-serif';
    mCtx.textAlign = 'center';
    mCtx.textBaseline = 'middle';
    mCtx.fillText('学校', 256, 100);
    const mTex = new THREE.CanvasTexture(mc);
    const mainSign = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 2.75),
      new THREE.MeshBasicMaterial({ map: mTex, side: THREE.DoubleSide })
    );
    // Mounted on east face, facing east (rotation = +90° on Y)
    mainSign.rotation.y = Math.PI / 2;
    mainSign.position.set(faceX + 0.12, 18, buildingZ);
    this.scene.add(mainSign);

    // Fascia backing
    const facMat = new THREE.MeshLambertMaterial({ color: 0x1e3a5f });
    const fac = new THREE.Mesh(new THREE.BoxGeometry(0.2, 3.0, 7.5), facMat);
    fac.position.set(faceX + 0.1, 18, buildingZ);
    this.scene.add(fac);

    // ── Secondary: GAKKOU / SCHOOL ──
    const sc = document.createElement('canvas');
    sc.width = 512; sc.height = 80;
    const sCtx = sc.getContext('2d');
    sCtx.fillStyle = '#0f172a';
    sCtx.fillRect(0, 0, 512, 80);
    sCtx.fillStyle = '#94a3b8';
    sCtx.font = 'bold 36px "Noto Sans JP", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('GAKKOU  —  SCHOOL', 256, 40);
    const sTex = new THREE.CanvasTexture(sc);
    const subSign = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 1.1),
      new THREE.MeshBasicMaterial({ map: sTex, side: THREE.DoubleSide })
    );
    subSign.rotation.y = Math.PI / 2;
    subSign.position.set(faceX + 0.12, 15.2, buildingZ);
    this.scene.add(subSign);

    // ── 入口 sign at ground level ──
    const ec = document.createElement('canvas');
    ec.width = 128; ec.height = 64;
    const eCtx = ec.getContext('2d');
    eCtx.fillStyle = '#166534';
    eCtx.fillRect(0, 0, 128, 64);
    eCtx.fillStyle = '#ffffff';
    eCtx.font = 'bold 36px "Noto Sans JP", sans-serif';
    eCtx.textAlign = 'center';
    eCtx.textBaseline = 'middle';
    eCtx.fillText('入口', 64, 32);
    const eTex = new THREE.CanvasTexture(ec);
    const eSign = new THREE.Mesh(
      new THREE.PlaneGeometry(1.8, 0.9),
      new THREE.MeshBasicMaterial({ map: eTex, side: THREE.DoubleSide })
    );
    eSign.rotation.y = Math.PI / 2;
    eSign.position.set(faceX + 0.1, 7.0, buildingZ);
    this.scene.add(eSign);
  }

  _createSchoolEntranceCanopy(faceX, buildingZ) {
    // Slim entrance canopy protruding eastward from the school east face
    // faceX = -46; canopy center x = -46 - 1.5 = -47.5, facing east

    const CANOPY_Y = 6.5;
    const CANOPY_W = 8;   // Along Z (parallel to school face)
    const CANOPY_D = 3.0; // Depth eastward

    // Canopy roof — white with red stripe
    const roofMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    const roof = new THREE.Mesh(
      new THREE.BoxGeometry(CANOPY_D, 0.22, CANOPY_W), roofMat
    );
    roof.position.set(faceX - CANOPY_D / 2, CANOPY_Y, buildingZ);
    roof.castShadow = true;
    this.scene.add(roof);

    // Red leading edge stripe
    const stripeMat = new THREE.MeshLambertMaterial({ color: 0xdc2626 });
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.24, CANOPY_W), stripeMat
    );
    stripe.position.set(faceX - CANOPY_D - 0.11, CANOPY_Y, buildingZ);
    this.scene.add(stripe);

    // 2 slim white support pillars
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0xf1f5f9 });
    [buildingZ - 3.2, buildingZ + 3.2].forEach(pz => {
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, CANOPY_Y, 0.3), pillarMat
      );
      pillar.position.set(faceX - CANOPY_D, CANOPY_Y / 2, pz);
      pillar.castShadow = true;
      this.scene.add(pillar);
      // Red base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.25, 0.5),
        new THREE.MeshLambertMaterial({ color: 0xdc2626 })
      );
      base.position.set(faceX - CANOPY_D, 0.125, pz);
      this.scene.add(base);
      // Slim collider
      this.colliders.push(new THREE.Box3().setFromCenterAndSize(
        new THREE.Vector3(faceX - CANOPY_D, CANOPY_Y / 2, pz),
        new THREE.Vector3(0.5, CANOPY_Y, 0.5)
      ));
    });
  }

  _createSchoolNoticeBoard(x, z) {
    // Pole-mounted notice board: 掲示板
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const postMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.09, 3.2, 8), postMat
    );
    post.position.y = 1.6;
    group.add(post);

    // Board backing
    const boardBack = new THREE.Mesh(
      new THREE.BoxGeometry(3.6, 2.2, 0.12),
      new THREE.MeshLambertMaterial({ color: 0x0f172a })
    );
    boardBack.position.y = 3.3;
    group.add(boardBack);

    // Board canvas
    const bc = document.createElement('canvas');
    bc.width = 512; bc.height = 320;
    const bCtx = bc.getContext('2d');
    bCtx.fillStyle = '#0f172a';
    bCtx.fillRect(0, 0, 512, 320);
    bCtx.fillStyle = '#1e3a5f';
    bCtx.fillRect(0, 0, 512, 60);
    bCtx.fillStyle = '#dc2626';
    bCtx.fillRect(0, 0, 512, 8);
    bCtx.fillStyle = '#ffffff';
    bCtx.font = 'bold 34px "Noto Sans JP", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.textBaseline = 'middle';
    bCtx.fillText('掲示板', 256, 34);
    bCtx.fillStyle = '#e2e8f0';
    bCtx.font = '24px "Noto Sans JP", sans-serif';
    bCtx.textAlign = 'left';
    bCtx.fillText('🏫  ようこそ 学校へ', 20, 100);
    bCtx.fillText('📖  日本語を学ぼう！', 20, 148);
    bCtx.fillText('✏️  授業時間: 9:00 - 15:00', 20, 196);
    bCtx.fillText('🎓  KOTOBA 語学学校', 20, 244);
    bCtx.fillText('📍  図書館は北側', 20, 292);
    const boardFace = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 2.1),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(bc), side: THREE.DoubleSide
      })
    );
    boardFace.position.set(0, 3.3, 0.07);
    group.add(boardFace);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 1.6, z),
      new THREE.Vector3(0.4, 3.2, 0.4)
    ));
  }

  _createEducationDistrictSign(x, z) {
    // District entrance sign: 教育地区 / Education District
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.10, 3.8, 8),
      new THREE.MeshLambertMaterial({ color: 0x1e293b })
    );
    post.position.y = 1.9;
    group.add(post);

    const sc = document.createElement('canvas');
    sc.width = 320; sc.height = 128;
    const sCtx = sc.getContext('2d');
    sCtx.fillStyle = '#0f172a';
    sCtx.fillRect(0, 0, 320, 128);
    sCtx.strokeStyle = '#1e3a5f';
    sCtx.lineWidth = 5;
    sCtx.strokeRect(4, 4, 312, 120);
    sCtx.fillStyle = '#dc2626';
    sCtx.fillRect(4, 4, 312, 10);
    sCtx.fillStyle = '#ffffff';
    sCtx.font = 'bold 44px "Noto Sans JP", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.textBaseline = 'middle';
    sCtx.fillText('学校エリア', 160, 52);
    sCtx.fillStyle = '#94a3b8';
    sCtx.font = '22px sans-serif';
    sCtx.fillText('Education District', 160, 98);
    const panel = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 1.12),
      new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(sc), side: THREE.DoubleSide
      })
    );
    panel.position.set(0, 3.9, 0);
    group.add(panel);

    const back = new THREE.Mesh(
      new THREE.BoxGeometry(2.9, 1.2, 0.08),
      new THREE.MeshLambertMaterial({ color: 0x0f172a })
    );
    back.position.set(0, 3.9, 0);
    group.add(back);

    this.scene.add(group);
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(x, 1.9, z),
      new THREE.Vector3(0.4, 3.8, 0.4)
    ));
  }

}
