import * as THREE from 'three';

/**
 * CityWorld: Builds a massive (420x420), bustling, vibrant 3D Cityscape.
 * Features:
 * - Grand Central Avenue Crossway + Inner Ring Boulevard + Outer Perimeter Expressway
 * - 4 Themed Districts: Education/Library, Business/Skyscrapers, Science/Campus, Creative/Media & Food
 * - Over 40+ modular voxel buildings with illuminated windows, rooftops, and storefronts
 * - Public amenities: Halte Bus, outdoor cafes with umbrellas, street food carts, kiosks
 * - Lush urban landscaping: 60+ varied trees (green oaks, autumn gold, cherry blossom), flowerbeds
 * - Street infrastructure: Streetlamps, traffic lights, park benches, fire hydrants, trash cans
 * - LED neon billboards with educational literacy slogans
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

    // Hemisphere Light for rich natural ambient contrast between blue sky & greenery
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x166534, 0.5);
    this.scene.add(hemiLight);
  }

  createGroundAndRoads() {
    // 1. Base Ground / Lush Grass (Expanded to 420 x 420)
    const groundGeo = new THREE.PlaneGeometry(420, 420);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0x16a34a }); // Vibrant garden green
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const asphaltMat = new THREE.MeshLambertMaterial({ color: 0x1e293b }); // Sleek slate asphalt
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
    const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0x94a3b8 }); // Clean stone grey

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
    // Grand Central Plaza (24 x 24)
    const plazaGeo = new THREE.BoxGeometry(26, 0.28, 26);
    const plazaMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.set(0, 0.14, 0);
    plaza.receiveShadow = true;
    this.scene.add(plaza);

    // Decorative Center Fountain (Spacious with open perimeter)
    const fountainBaseGeo = new THREE.CylinderGeometry(2.6, 2.9, 0.7, 16);
    const stoneMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const fBase = new THREE.Mesh(fountainBaseGeo, stoneMat);
    fBase.position.set(0, 0.49, 0);
    fBase.castShadow = true;
    fBase.receiveShadow = true;
    this.scene.add(fBase);

    // Animated water surface
    const waterGeo = new THREE.CylinderGeometry(2.4, 2.4, 0.1, 16);
    const waterMat = new THREE.MeshLambertMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.85
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.position.set(0, 0.8, 0);
    this.scene.add(water);

    // Tiered Fountain Spout
    const spoutGeo = new THREE.CylinderGeometry(0.35, 0.45, 1.6, 10);
    const spout = new THREE.Mesh(spoutGeo, stoneMat);
    spout.position.set(0, 1.3, 0);
    spout.castShadow = true;
    this.scene.add(spout);

    // Fountain Collider (compact so players can walk freely around it)
    this.colliders.push(new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(0, 0.8, 0),
      new THREE.Vector3(5.4, 1.8, 5.4)
    ));

    // North Stage / Alun-Alun Pavilion (Where Maya / Quest 9 stands)
    const stageGeo = new THREE.BoxGeometry(8.0, 0.4, 6.0);
    const stageMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
    const stage = new THREE.Mesh(stageGeo, stageMat);
    stage.position.set(0, 0.35, -14);
    stage.receiveShadow = true;
    this.scene.add(stage);

    // Stage Backdrop Banner
    const bannerGeo = new THREE.BoxGeometry(7.2, 3.2, 0.25);
    const bannerMat = new THREE.MeshLambertMaterial({ color: 0x4f46e5 });
    const banner = new THREE.Mesh(bannerGeo, bannerMat);
    banner.position.set(0, 2.0, -16.8);
    this.scene.add(banner);

    // Stage Pillars
    const pillarMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
    [-3.2, 3.2].forEach(px => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.3, 3.2, 0.3), pillarMat);
      p.position.set(px, 2.0, -16.8);
      this.scene.add(p);
    });

    // Stage Roof Canopy
    const roofGeo = new THREE.BoxGeometry(8.4, 0.3, 3.5);
    const roofMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
    const sRoof = new THREE.Mesh(roofGeo, roofMat);
    sRoof.position.set(0, 3.65, -15.2);
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
      gold: 0xd97706
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
      // ===== 1. Distrik Barat Laut (NW) - Pendidikan, Perpustakaan & Budaya =====
      { x: -55, z: -55, w: 18, h: 32, d: 18, color: colors.blue, name: 'Perpustakaan Pusat' },
      { x: -35, z: -58, w: 12, h: 20, d: 12, color: colors.indigo, name: 'Balai Bahasa' },
      { x: -60, z: -35, w: 12, h: 18, d: 12, color: colors.teal, name: 'Gedung Arsip' },
      { x: -95, z: -50, w: 16, h: 24, d: 14, color: colors.blue, name: 'Fakultas Sastra' },
      { x: -95, z: -75, w: 14, h: 28, d: 14, color: colors.indigo, name: 'Asrama Pelajar' },
      { x: -45, z: -88, w: 14, h: 18, d: 12, color: colors.teal, name: 'Galeri Seni' },
      { x: -75, z: -90, w: 16, h: 22, d: 14, color: colors.purple, name: 'Museum Kota' },

      // ===== 2. Distrik Timur Laut (NE) - Pusat Bisnis, Menara Arsitektur & Bank =====
      { x: 55, z: -55, w: 18, h: 46, d: 18, color: colors.amber, name: 'Menara Arsitektur Sky' },
      { x: 35, z: -58, w: 12, h: 24, d: 12, color: colors.purple, name: 'Kantor Investasi' },
      { x: 60, z: -35, w: 12, h: 28, d: 12, color: colors.cyan, name: 'Bank Sentral' },
      { x: 95, z: -50, w: 18, h: 52, d: 16, color: colors.gold, name: 'Menara Finansial Raya' },
      { x: 95, z: -78, w: 16, h: 36, d: 14, color: colors.slate, name: 'Bursa Efek Kota' },
      { x: 50, z: -90, w: 14, h: 22, d: 14, color: colors.blue, name: 'Hotel Grand Metro' },
      { x: 75, z: -92, w: 14, h: 26, d: 12, color: colors.amber, name: 'Pusat Konvensi' },

      // ===== 3. Distrik Barat Daya (SW) - Kampus, Laboratorium Riset & Sains =====
      { x: -55, z: 55, w: 18, h: 28, d: 18, color: colors.emerald, name: 'Laboratorium Sains' },
      { x: -35, z: 58, w: 12, h: 18, d: 12, color: colors.amber, name: 'Institut Robotika' },
      { x: -60, z: 35, w: 12, h: 22, d: 12, color: colors.indigo, name: 'Pusat Riset AI' },
      { x: -95, z: 52, w: 16, h: 26, d: 14, color: colors.teal, name: 'Politeknik Negeri' },
      { x: -95, z: 78, w: 14, h: 20, d: 14, color: colors.emerald, name: 'Pusat Lingkungan Hidup' },
      { x: -50, z: 90, w: 14, h: 18, d: 12, color: colors.cyan, name: 'Klinik Kesehatan' },
      { x: -75, z: 92, w: 16, h: 24, d: 14, color: colors.blue, name: 'Observatorium Bintang' },

      // ===== 4. Distrik Tenggara (SE) - Media Digital, Penyiaran & Kuliner Kreatif =====
      { x: 55, z: 55, w: 18, h: 34, d: 18, color: colors.cyan, name: 'Stasiun Televisi Berita' },
      { x: 35, z: 58, w: 12, h: 22, d: 12, color: colors.pink, name: 'Studio Podcast & Kreator' },
      { x: 60, z: 35, w: 12, h: 18, d: 12, color: colors.purple, name: 'Bioskop Nusantara' },
      { x: 95, z: 52, w: 16, h: 30, d: 14, color: colors.rose, name: 'Kantor Berita Siber' },
      { x: 95, z: 78, w: 14, h: 24, d: 14, color: colors.orange, name: 'Creative Hub Center' },
      { x: 50, z: 90, w: 14, h: 20, d: 12, color: colors.pink, name: 'Pusat Mode & Desain' },
      { x: 75, z: 92, w: 16, h: 26, d: 14, color: colors.cyan, name: 'Kominfo Corner' },

      // ===== 5. Deretan Gedung & Ruko di Jalur Utama (Shops & Shophouses) =====
      { x: -78, z: -18, w: 12, h: 16, d: 10, color: colors.rose, name: 'Toko Buku Cerdas' },
      { x: -96, z: -18, w: 12, h: 18, d: 10, color: colors.emerald, name: 'Apotek Sehat Keluarga' },
      { x: 78, z: -18, w: 12, h: 18, d: 10, color: colors.emerald, name: 'Restoran Rasa Nusantara' },
      { x: 96, z: -18, w: 12, h: 20, d: 10, color: colors.gold, name: 'Toko Perangkat Pintar' },
      { x: -78, z: 18, w: 12, h: 16, d: 10, color: colors.amber, name: 'Kafe Kopi Literasi' },
      { x: -96, z: 18, w: 12, h: 18, d: 10, color: colors.teal, name: 'Percetakan & Desain' },
      { x: 78, z: 18, w: 12, h: 18, d: 10, color: colors.blue, name: 'Kantor Pos & Kurir' },
      { x: 96, z: 18, w: 12, h: 20, d: 10, color: colors.purple, name: 'Pusat Edukasi Musik' },

      // ===== 6. Gedung Sepanjang Outer Boulevard (Ring Road Skyline) =====
      { x: -140, z: -110, w: 16, h: 38, d: 16, color: colors.indigo, name: 'Pencakar Langit Barat' },
      { x: 140, z: -110, w: 16, h: 42, d: 16, color: colors.gold, name: 'Menara Korporat Timur' },
      { x: -140, z: 110, w: 16, h: 32, d: 16, color: colors.emerald, name: 'Riset Bioteknologi' },
      { x: 140, z: 110, w: 16, h: 36, d: 16, color: colors.rose, name: 'Menara Media Tower' },
      { x: 0, z: -145, w: 22, h: 26, d: 16, color: colors.slate, name: 'Stasiun Kereta Pusat' },
      { x: 0, z: 145, w: 22, h: 28, d: 16, color: colors.blue, name: 'Balai Pertemuan Warga' }
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
    // 1. Bus Stops / Halte Bus (4 modern shelters)
    const busStops = [
      { x: -25, z: -8, rot: 0, title: 'Halte Perpustakaan Kota' },
      { x: 25, z: 8, rot: Math.PI, title: 'Halte Menara Bisnis' },
      { x: -8, z: 25, rot: Math.PI / 2, title: 'Halte Kampus Sains' },
      { x: 8, z: -25, rot: -Math.PI / 2, title: 'Halte Stasiun Media' }
    ];

    busStops.forEach(bs => {
      this.createBusStop(bs.x, bs.z, bs.rot, bs.title);
    });

    // 2. Street Food Vendors & Kiosks
    const stalls = [
      { x: -10, z: -10, rot: Math.PI / 4, color: 0xef4444, title: 'KEDAI ES KRIM' },
      { x: 10, z: 10, rot: -3 * Math.PI / 4, color: 0x3b82f6, title: 'WARUNG KOPI LITERASI' },
      { x: -38, z: -22, rot: Math.PI / 2, color: 0xf59e0b, title: 'KIOS BUKU BEKAS' },
      { x: 38, z: 22, rot: -Math.PI / 2, color: 0x10b981, title: 'BAKSO NUSANTARA' }
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

    // Trunk
    const trunkGeo = new THREE.BoxGeometry(1.0, 3.2, 1.0);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5c3d2e });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.6;
    trunk.castShadow = true;
    group.add(trunk);

    // Leaves color based on tree type
    let leavesColor = 0x15803d; // Green oak
    if (type === 'cherry') leavesColor = 0xf472b6; // Sakura pink
    if (type === 'autumn') leavesColor = 0xd97706; // Golden autumn

    const leavesMat = new THREE.MeshLambertMaterial({ color: leavesColor });
    
    const layer1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.6, 3.6), leavesMat);
    layer1.position.y = 3.6;
    layer1.castShadow = true;
    group.add(layer1);

    const layer2 = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 2.6), leavesMat);
    layer2.position.y = 4.8;
    layer2.castShadow = true;
    group.add(layer2);

    const layer3 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.6), leavesMat);
    layer3.position.y = 5.9;
    layer3.castShadow = true;
    group.add(layer3);

    this.scene.add(group);

    // Collider
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

    // Wooden cart body
    const cartGeo = new THREE.BoxGeometry(2.2, 1.1, 1.4);
    const cartMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
    const cart = new THREE.Mesh(cartGeo, cartMat);
    cart.position.y = 0.75;
    cart.castShadow = true;
    group.add(cart);

    // Wheels
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1f2937 });
    const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.15, 12);
    wheelGeo.rotateZ(Math.PI / 2);

    const w1 = new THREE.Mesh(wheelGeo, wheelMat);
    w1.position.set(-1.15, 0.4, 0);
    group.add(w1);

    const w2 = new THREE.Mesh(wheelGeo, wheelMat);
    w2.position.set(1.15, 0.4, 0);
    group.add(w2);

    // Canopy posts
    const postMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
    const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.4, 6);
    [-0.9, 0.9].forEach(px => {
      [-0.5, 0.5].forEach(pz => {
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(px, 1.8, pz);
        group.add(post);
      });
    });

    // Striped Canopy
    const canopyGeo = new THREE.BoxGeometry(2.6, 0.25, 1.8);
    const canopyMat = new THREE.MeshLambertMaterial({ color: color });
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.y = 2.45;
    group.add(canopy);

    this.scene.add(group);

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
      { x: -55, y: 18, z: -45, text: '📖 BUDAYAKAN KATA BAKU KBBI', color: '#38bdf8', bg: '#0369a1' },
      { x: 55, y: 22, z: -45, text: '🛡️ CEK FAKTA SEBELUM SEBAR', color: '#34d399', bg: '#065f46' },
      { x: 55, y: 18, z: 45, text: '🏛️ KOTA CERDAS LITERASI 2026', color: '#fbbf24', bg: '#78350f' },
      { x: -55, y: 18, z: 45, text: '✍️ GUNAKAN KALIMAT EFEKTIF', color: '#f472b6', bg: '#831843' },
      { x: 0, y: 24, z: -135, text: '🚀 LITERASI DIGITAL: MASA DEPAN KITA', color: '#a78bfa', bg: '#3b0764' }
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
      ctx.font = 'bold 30px sans-serif';
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
}
