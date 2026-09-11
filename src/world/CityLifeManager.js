import * as THREE from 'three';

/**
 * CityLifeManager: Adds dynamic vehicles (traffic across central and ring roads),
 * circling flocks of birds, animated fountain particles, and drifting sky clouds
 * across the expanded 420x420 city.
 */
export class CityLifeManager {
  constructor(scene) {
    this.scene = scene;
    this.vehicles = [];
    this.birds = [];
    this.clouds = [];
    this.waterParticles = null;

    this.createVehicles();
    this.createFountainParticles();
    this.createFlyingBirds();
    this.createSkyClouds();
  }

  // ==================== 1. VEHICLES (TRAFFIC) ====================
  createVehicles() {
    const vehicleConfigs = [
      // Central Avenue X (Eastbound & Westbound)
      { type: 'taxi', x: -140, z: -3, dir: 1, axis: 'x', speed: 13, min: -180, max: 180 },
      { type: 'car_red', x: 120, z: 3, dir: -1, axis: 'x', speed: 16, min: -180, max: 180 },
      { type: 'car_blue', x: 40, z: -3, dir: 1, axis: 'x', speed: 14, min: -180, max: 180 },
      { type: 'police', x: -60, z: 3, dir: -1, axis: 'x', speed: 18, min: -180, max: 180 },

      // Central Avenue Z (Northbound & Southbound)
      { type: 'bus', x: 3, z: -140, dir: 1, axis: 'z', speed: 11, min: -180, max: 180 },
      { type: 'car_blue', x: -3, z: 120, dir: -1, axis: 'z', speed: 15, min: -180, max: 180 },
      { type: 'taxi', x: 3, z: 20, dir: 1, axis: 'z', speed: 13, min: -180, max: 180 },
      { type: 'van', x: -3, z: -50, dir: -1, axis: 'z', speed: 12, min: -180, max: 180 },

      // Outer Boulevard North & South (Z = ±120)
      { type: 'van', x: -120, z: -120, dir: 1, axis: 'x', speed: 14, min: -170, max: 170 },
      { type: 'car_red', x: 80, z: -120, dir: -1, axis: 'x', speed: 17, min: -170, max: 170 },
      { type: 'taxi', x: 120, z: 120, dir: -1, axis: 'x', speed: 13, min: -170, max: 170 },
      { type: 'bus', x: -60, z: 120, dir: 1, axis: 'x', speed: 10, min: -170, max: 170 },

      // Outer Boulevard West & East (X = ±120)
      { type: 'bus', x: -120, z: -100, dir: 1, axis: 'z', speed: 11, min: -170, max: 170 },
      { type: 'taxi', x: 120, z: 100, dir: -1, axis: 'z', speed: 14, min: -170, max: 170 }
    ];

    vehicleConfigs.forEach(cfg => {
      const mesh = this.buildVoxelVehicle(cfg.type);
      mesh.position.set(cfg.x, 0.4, cfg.z);

      // Rotate towards driving direction
      if (cfg.axis === 'x') {
        mesh.rotation.y = cfg.dir === 1 ? Math.PI / 2 : -Math.PI / 2;
      } else {
        mesh.rotation.y = cfg.dir === 1 ? 0 : Math.PI;
      }

      this.scene.add(mesh);

      this.vehicles.push({
        group: mesh,
        axis: cfg.axis,
        dir: cfg.dir,
        speed: cfg.speed,
        min: cfg.min,
        max: cfg.max,
        wheels: mesh.userData.wheels || []
      });
    });
  }

  buildVoxelVehicle(type) {
    const group = new THREE.Group();
    const wheels = [];

    let bodyColor = 0xf59e0b; // Taxi Yellow
    let bodyLength = 3.6;
    let bodyHeight = 1.0;
    let bodyWidth = 1.8;

    if (type === 'bus') {
      bodyColor = 0x0284c7; // Trans City Blue
      bodyLength = 6.2;
      bodyHeight = 1.6;
      bodyWidth = 2.0;
    } else if (type === 'car_red') {
      bodyColor = 0xef4444; // Sports Red
      bodyLength = 3.4;
      bodyHeight = 0.9;
    } else if (type === 'car_blue') {
      bodyColor = 0x3b82f6; // Blue Sedan
    } else if (type === 'van') {
      bodyColor = 0x10b981; // Green Delivery
      bodyLength = 4.2;
      bodyHeight = 1.4;
    } else if (type === 'police') {
      bodyColor = 0x0f172a; // Police Cruiser Navy
      bodyLength = 3.8;
      bodyHeight = 1.0;
    }

    // Lower Chassis / Body
    const bodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyLength);
    const bodyMat = new THREE.MeshLambertMaterial({ color: bodyColor });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = bodyHeight / 2 + 0.3;
    body.castShadow = true;
    group.add(body);

    // Cabin / Windows
    const cabinHeight = bodyHeight * 0.75;
    const cabinLength = bodyLength * 0.55;
    const cabinGeo = new THREE.BoxGeometry(bodyWidth * 0.9, cabinHeight, cabinLength);
    const windowMat = new THREE.MeshLambertMaterial({
      color: 0x1e293b,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.25
    });
    const cabin = new THREE.Mesh(cabinGeo, windowMat);
    cabin.position.y = body.position.y + bodyHeight / 2 + cabinHeight / 2;
    cabin.castShadow = true;
    group.add(cabin);

    // Taxi Sign
    if (type === 'taxi') {
      const signGeo = new THREE.BoxGeometry(0.8, 0.2, 0.4);
      const signMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const sign = new THREE.Mesh(signGeo, signMat);
      sign.position.y = cabin.position.y + cabinHeight / 2 + 0.12;
      group.add(sign);
    }

    // Police Siren Lights
    if (type === 'police') {
      const sirenGeo = new THREE.BoxGeometry(0.8, 0.2, 0.3);
      const sirenMat = new THREE.MeshLambertMaterial({ color: 0xef4444, emissive: 0x3b82f6, emissiveIntensity: 0.8 });
      const siren = new THREE.Mesh(sirenGeo, sirenMat);
      siren.position.y = cabin.position.y + cabinHeight / 2 + 0.12;
      group.add(siren);
    }

    // Headlights (Front: +Z)
    const lightMat = new THREE.MeshLambertMaterial({
      color: 0xfef08a,
      emissive: 0xfef08a,
      emissiveIntensity: 0.9
    });
    const h1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), lightMat);
    h1.position.set(-bodyWidth * 0.35, body.position.y, bodyLength / 2 + 0.05);
    group.add(h1);

    const h2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.1), lightMat);
    h2.position.set(bodyWidth * 0.35, body.position.y, bodyLength / 2 + 0.05);
    group.add(h2);

    // Taillights (Rear: -Z)
    const tailMat = new THREE.MeshLambertMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 0.8
    });
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.1), tailMat);
    t1.position.set(-bodyWidth * 0.35, body.position.y, -bodyLength / 2 - 0.05);
    group.add(t1);

    const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.15, 0.1), tailMat);
    t2.position.set(bodyWidth * 0.35, body.position.y, -bodyLength / 2 - 0.05);
    group.add(t2);

    // Wheels (4 cylinders)
    const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 8);
    wheelGeo.rotateZ(Math.PI / 2);
    const wheelMat = new THREE.MeshLambertMaterial({ color: 0x111827 });

    const wheelOffsetZ = bodyLength * 0.32;
    const wheelOffsetX = bodyWidth * 0.48;

    const positions = [
      { x: -wheelOffsetX, y: 0.32, z: wheelOffsetZ },
      { x: wheelOffsetX, y: 0.32, z: wheelOffsetZ },
      { x: -wheelOffsetX, y: 0.32, z: -wheelOffsetZ },
      { x: wheelOffsetX, y: 0.32, z: -wheelOffsetZ }
    ];

    positions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeo, wheelMat);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.castShadow = true;
      group.add(wheel);
      wheels.push(wheel);
    });

    group.userData.wheels = wheels;
    return group;
  }

  // ==================== 2. FOUNTAIN WATER PARTICLES ====================
  createFountainParticles() {
    const count = 45;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 1] = 1.3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

      velocities.push({
        vx: (Math.random() - 0.5) * 1.8,
        vy: 3.5 + Math.random() * 2.5,
        vz: (Math.random() - 0.5) * 1.8,
        initY: 1.3
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.28,
      transparent: true,
      opacity: 0.85
    });

    this.waterParticles = new THREE.Points(geometry, material);
    this.waterParticles.userData.velocities = velocities;
    this.scene.add(this.waterParticles);
  }

  // ==================== 3. FLYING BIRDS ====================
  createFlyingBirds() {
    const birdMat = new THREE.MeshLambertMaterial({ color: 0xffffff });

    for (let i = 0; i < 7; i++) {
      const birdGroup = new THREE.Group();

      // Body
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.2, 0.5), birdMat);
      birdGroup.add(body);

      // Wings (Left & Right)
      const wingGeo = new THREE.BoxGeometry(0.6, 0.05, 0.25);
      const leftWing = new THREE.Mesh(wingGeo, birdMat);
      leftWing.position.set(-0.4, 0.05, 0);
      birdGroup.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, birdMat);
      rightWing.position.set(0.4, 0.05, 0);
      birdGroup.add(rightWing);

      const radius = 24 + i * 8;
      const angle = (i / 7) * Math.PI * 2;
      const height = 18 + i * 2.5;

      birdGroup.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
      this.scene.add(birdGroup);

      this.birds.push({
        group: birdGroup,
        leftWing: leftWing,
        rightWing: rightWing,
        radius: radius,
        angle: angle,
        speed: 0.45 + i * 0.06,
        height: height
      });
    }
  }

  // ==================== 4. DRIFTING CLOUDS ====================
  createSkyClouds() {
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.88
    });

    const cloudData = [
      { x: -100, y: 42, z: -80, s: 1.6 },
      { x: 60, y: 45, z: -110, s: 1.8 },
      { x: -70, y: 38, z: 90, s: 1.4 },
      { x: 90, y: 44, z: 70, s: 1.5 },
      { x: 0, y: 48, z: 0, s: 1.7 },
      { x: -120, y: 46, z: 40, s: 1.3 },
      { x: 110, y: 40, z: -40, s: 1.5 }
    ];

    cloudData.forEach(c => {
      const cloudGroup = new THREE.Group();

      const b1 = new THREE.Mesh(new THREE.BoxGeometry(12, 3.5, 7), cloudMat);
      cloudGroup.add(b1);

      const b2 = new THREE.Mesh(new THREE.BoxGeometry(8, 4.5, 6), cloudMat);
      b2.position.set(2.5, 1.2, 0);
      cloudGroup.add(b2);

      const b3 = new THREE.Mesh(new THREE.BoxGeometry(9, 3, 5), cloudMat);
      b3.position.set(-3.5, -0.6, 1);
      cloudGroup.add(b3);

      cloudGroup.scale.set(c.s, c.s, c.s);
      cloudGroup.position.set(c.x, c.y, c.z);
      this.scene.add(cloudGroup);

      this.clouds.push({
        group: cloudGroup,
        speed: 1.4 + Math.random() * 0.8
      });
    });
  }

  // ==================== ANIMATION LOOP ====================
  update(delta, totalTime) {
    // 1. Update Vehicles
    this.vehicles.forEach(v => {
      const step = v.speed * delta * v.dir;
      if (v.axis === 'x') {
        v.group.position.x += step;
        if (v.dir === 1 && v.group.position.x > v.max) v.group.position.x = v.min;
        if (v.dir === -1 && v.group.position.x < v.min) v.group.position.x = v.max;
      } else {
        v.group.position.z += step;
        if (v.dir === 1 && v.group.position.z > v.max) v.group.position.z = v.min;
        if (v.dir === -1 && v.group.position.z < v.min) v.group.position.z = v.max;
      }

      // Spin wheels
      v.wheels.forEach(w => {
        w.rotation.x += v.speed * delta * 2;
      });
    });

    // 2. Update Fountain Water Drops
    if (this.waterParticles) {
      const posAttr = this.waterParticles.geometry.attributes.position;
      const pos = posAttr.array;
      const vels = this.waterParticles.userData.velocities;
      const gravity = -9.8;

      for (let i = 0; i < vels.length; i++) {
        const v = vels[i];
        pos[i * 3] += v.vx * delta;
        pos[i * 3 + 1] += v.vy * delta;
        pos[i * 3 + 2] += v.vz * delta;

        v.vy += gravity * delta;

        // Reset if below fountain surface
        if (pos[i * 3 + 1] < 0.8) {
          pos[i * 3] = (Math.random() - 0.5) * 0.3;
          pos[i * 3 + 1] = v.initY;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
          v.vx = (Math.random() - 0.5) * 1.8;
          v.vy = 3.5 + Math.random() * 2.5;
          v.vz = (Math.random() - 0.5) * 1.8;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 3. Update Birds circling & flapping
    this.birds.forEach(b => {
      b.angle += b.speed * delta * 0.4;
      b.group.position.x = Math.cos(b.angle) * b.radius;
      b.group.position.z = Math.sin(b.angle) * b.radius;
      b.group.position.y = b.height + Math.sin(totalTime * 2 + b.angle) * 0.8;

      // Face flight direction (tangent to circle)
      b.group.rotation.y = -b.angle + Math.PI / 2;

      // Flap wings
      const flap = Math.sin(totalTime * 12 + b.angle) * 0.45;
      b.leftWing.rotation.z = flap;
      b.rightWing.rotation.z = -flap;
    });

    // 4. Update Clouds drifting across 420x420 sky
    this.clouds.forEach(c => {
      c.group.position.x += c.speed * delta;
      if (c.group.position.x > 210) {
        c.group.position.x = -210;
      }
    });
  }
}
