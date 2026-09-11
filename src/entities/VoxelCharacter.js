import * as THREE from 'three';

/**
 * Creates a Roblox-style blocky voxel character
 */
export class VoxelCharacter {
  constructor(options = {}) {
    this.name = options.name || 'Citizen';
    this.isPlayer = options.isPlayer || false;
    this.skinColor = options.skinColor || 0xffdfba; // Natural peach skin
    this.shirtColor = options.shirtColor || 0x4f46e5; // Indigo default
    this.pantsColor = options.pantsColor || 0x1e293b; // Slate dark
    this.questStatus = options.questStatus || null; // 'AVAILABLE' | 'COMPLETED' | null

    this.root = new THREE.Group();
    this.root.name = this.name;

    this.createModel();
    if (!this.isPlayer && (this.questStatus === 'AVAILABLE' || this.questStatus === 'COMPLETED')) {
      this.createQuestBadge();
    }
  }

  createModel() {
    const skinMat = new THREE.MeshLambertMaterial({ color: this.skinColor });
    const shirtMat = new THREE.MeshLambertMaterial({ color: this.shirtColor });
    const pantsMat = new THREE.MeshLambertMaterial({ color: this.pantsColor });

    // 1. Torso / Badan (Lebar 1.0, Tinggi 1.2, Tebal 0.5)
    const torsoGeo = new THREE.BoxGeometry(1.0, 1.2, 0.5);
    this.torso = new THREE.Mesh(torsoGeo, shirtMat);
    this.torso.position.y = 1.6; // Dari tanah
    this.torso.castShadow = true;
    this.torso.receiveShadow = true;
    this.root.add(this.torso);

    // 2. Head / Kepala (0.8 x 0.8 x 0.8)
    const headGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const headMaterials = [
      skinMat, skinMat, skinMat, skinMat,
      this.createFaceMaterial(skinMat.color), // Face front
      skinMat
    ];
    this.head = new THREE.Mesh(headGeo, headMaterials);
    this.head.position.y = 1.0; // Di atas torso
    this.head.castShadow = true;
    this.torso.add(this.head);

    // Optional Hair / Topi Voxel (Blocky Hair)
    const hairGeo = new THREE.BoxGeometry(0.84, 0.28, 0.84);
    const hairMat = new THREE.MeshLambertMaterial({ color: 0x3e2723 });
    const hair = new THREE.Mesh(hairGeo, hairMat);
    hair.position.y = 0.35;
    this.head.add(hair);

    // 3. Arms / Lengan (Pivot at shoulder)
    const armGeo = new THREE.BoxGeometry(0.4, 1.1, 0.4);
    armGeo.translate(0, -0.45, 0); // Translate origin to top for natural swing

    // Left Arm
    this.leftArm = new THREE.Mesh(armGeo, shirtMat);
    this.leftArm.position.set(-0.72, 0.45, 0);
    this.leftArm.castShadow = true;
    this.torso.add(this.leftArm);

    // Right Arm
    this.rightArm = new THREE.Mesh(armGeo, shirtMat);
    this.rightArm.position.set(0.72, 0.45, 0);
    this.rightArm.castShadow = true;
    this.torso.add(this.rightArm);

    // 4. Legs / Kaki (Pivot at hip)
    const legGeo = new THREE.BoxGeometry(0.46, 1.0, 0.46);
    legGeo.translate(0, -0.5, 0); // Translate origin to top

    // Left Leg
    this.leftLeg = new THREE.Mesh(legGeo, pantsMat);
    this.leftLeg.position.set(-0.25, -0.6, 0);
    this.leftLeg.castShadow = true;
    this.torso.add(this.leftLeg);

    // Right Leg
    this.rightLeg = new THREE.Mesh(legGeo, pantsMat);
    this.rightLeg.position.set(0.25, -0.6, 0);
    this.rightLeg.castShadow = true;
    this.torso.add(this.rightLeg);
  }

  createFaceMaterial(baseColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    // Base skin fill
    ctx.fillStyle = `#${baseColor.getHexString()}`;
    ctx.fillRect(0, 0, 128, 128);

    // Eyes (Blocky Roblox eyes)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(28, 44, 20, 24); // Left eye
    ctx.fillRect(80, 44, 20, 24); // Right eye

    // Eye catchlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(32, 48, 8, 8);
    ctx.fillRect(84, 48, 8, 8);

    // Smile / Senyum ramah
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.arc(64, 88, 16, 0, Math.PI);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    return new THREE.MeshLambertMaterial({ map: texture });
  }

  createQuestBadge() {
    this.badgeGroup = new THREE.Group();
    this.badgeGroup.position.y = 3.2; // Floating above head

    // Canvas sprite for sharp emoji / icon
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    this.badgeContext = canvas.getContext('2d');
    this.badgeTexture = new THREE.CanvasTexture(canvas);

    const spriteMat = new THREE.SpriteMaterial({
      map: this.badgeTexture,
      transparent: true,
      depthTest: false
    });
    this.badgeSprite = new THREE.Sprite(spriteMat);
    this.badgeSprite.scale.set(1.4, 1.4, 1.4);
    this.badgeGroup.add(this.badgeSprite);

    this.root.add(this.badgeGroup);
    this.updateBadge(this.questStatus || 'AVAILABLE');
  }

  updateBadge(status) {
    this.questStatus = status;
    if (!this.badgeGroup && (status === 'AVAILABLE' || status === 'COMPLETED')) {
      this.createQuestBadge();
      return;
    }
    if (!this.badgeContext) return;

    if (!status || status === 'NONE') {
      this.badgeGroup.visible = false;
      return;
    }

    this.badgeGroup.visible = true;
    const ctx = this.badgeContext;
    ctx.clearRect(0, 0, 128, 128);

    if (status === 'AVAILABLE') {
      // Sparkling Golden [ ! ]
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(64, 64, 46, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', 64, 64);
    } else if (status === 'COMPLETED') {
      // Emerald Green [ ✓ ]
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(64, 64, 46, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('✓', 64, 64);
    }

    this.badgeTexture.needsUpdate = true;
  }

  animate(time, isMoving = false, isJumping = false) {
    if (this.badgeGroup) {
      // Floating bobbing effect for quest badge
      this.badgeGroup.position.y = 3.2 + Math.sin(time * 3.5) * 0.15;
    }

    if (isJumping) {
      this.leftArm.rotation.x = -Math.PI * 0.4;
      this.rightArm.rotation.x = -Math.PI * 0.4;
      this.leftLeg.rotation.x = Math.PI * 0.2;
      this.rightLeg.rotation.x = -Math.PI * 0.2;
      return;
    }

    if (isMoving) {
      const walkSpeed = 10;
      const angle = Math.sin(time * walkSpeed) * 0.65;

      // Limb swing opposite
      this.leftArm.rotation.x = angle;
      this.rightArm.rotation.x = -angle;
      this.leftLeg.rotation.x = -angle;
      this.rightLeg.rotation.x = angle;

      // Waddle bobbing up and down
      this.torso.position.y = 1.6 + Math.abs(Math.sin(time * walkSpeed)) * 0.12;
      this.torso.rotation.z = Math.sin(time * walkSpeed * 0.5) * 0.05;
    } else {
      // Idle breathing
      const idleSpeed = 2;
      this.leftArm.rotation.x = Math.sin(time * idleSpeed) * 0.05;
      this.rightArm.rotation.x = -Math.sin(time * idleSpeed) * 0.05;
      this.leftLeg.rotation.x = 0;
      this.rightLeg.rotation.x = 0;
      this.torso.position.y = 1.6 + Math.sin(time * idleSpeed) * 0.04;
      this.torso.rotation.z = 0;
    }
  }
}
