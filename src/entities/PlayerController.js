import * as THREE from 'three';
import { sounds } from '../audio/SoundEffects.js';

export class PlayerController {
  constructor(character, camera, domElement, colliders = []) {
    this.character = character;
    this.camera = camera;
    this.domElement = domElement;
    this.colliders = colliders;

    // Movement parameters
    this.moveSpeed = 8.5; // units / sec
    this.baseRotationSpeed = 0.003;
    this.sensitivity = 1.0;
    this.invertPitch = false;
    this.invertYaw = false;
    this.isPaused = false;

    this.velocity = new THREE.Vector3();
    this.isGrounded = true;
    this.jumpForce = 8.5;
    this.gravity = -22.0;

    // Camera follow parameters
    this.cameraDistance = 8.0;
    this.cameraHeight = 4.2;
    this.cameraYaw = 0; // Horizontal angle
    this.cameraPitch = 0.25; // Vertical tilt
    this.minPitch = -0.1;
    this.maxPitch = 0.75;

    // Input state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false
    };

    // Arrow keys for camera rotation / perspective
    this.arrowKeys = {
      up: false,
      down: false,
      left: false,
      right: false
    };

    this.isPointerDown = false;
    this.lastPointerX = 0;
    this.lastPointerY = 0;
    this.footstepTimer = 0;

    // Mobile Virtual Joystick & Touch Camera State
    this.joystickVector = { x: 0, y: 0 };
    this.joystickTouchId = null;
    this.cameraTouchId = null;
    this.lastTouchX = 0;
    this.lastTouchY = 0;

    this.initInputListeners();
    this.initMobileControls();
  }

  jump() {
    if (this.isPaused) return;
    if (this.isGrounded) {
      this.velocity.y = this.jumpForce;
      this.isGrounded = false;
      sounds.playClick();
    }
  }

  setSensitivity(val) {
    this.sensitivity = Math.max(0.2, Math.min(3.0, val));
  }

  setInvertPitch(val) {
    this.invertPitch = !!val;
  }

  setInvertYaw(val) {
    this.invertYaw = !!val;
  }

  setMoveSpeed(val) {
    this.moveSpeed = Math.max(4.0, Math.min(16.0, val));
  }

  setPaused(val) {
    this.isPaused = !!val;
    if (this.isPaused) {
      this.keys.forward = false;
      this.keys.backward = false;
      this.keys.left = false;
      this.keys.right = false;
      this.arrowKeys.up = false;
      this.arrowKeys.down = false;
      this.arrowKeys.left = false;
      this.arrowKeys.right = false;
      this.isPointerDown = false;
      this.joystickVector = { x: 0, y: 0 };
      this.joystickTouchId = null;
      this.cameraTouchId = null;
      const thumb = document.getElementById('joystick-thumb');
      if (thumb) thumb.style.transform = 'translate(0px, 0px)';
    }
  }

  respawn(pos = { x: 0, y: 0, z: 8 }) {
    this.character.root.position.set(pos.x, pos.y, pos.z);
    this.velocity.set(0, 0, 0);
    this.character.root.rotation.set(0, 0, 0);
    this.cameraYaw = 0;
    this.cameraPitch = 0.25;
    this.updateCamera();
  }

  updateKeyCap(keyId, isActive) {
    const el = document.getElementById(keyId);
    if (el) {
      if (isActive) el.classList.add('active');
      else el.classList.remove('active');
    }
  }

  initInputListeners() {
    window.addEventListener('keydown', (e) => {
      if (this.isPaused) return;
      if (e.target.tagName === 'INPUT') return;

      switch (e.code) {
        // WASD: Movement only
        case 'KeyW':
          this.keys.forward = true;
          this.updateKeyCap('keycap-w', true);
          break;
        case 'KeyS':
          this.keys.backward = true;
          this.updateKeyCap('keycap-s', true);
          break;
        case 'KeyA':
          this.keys.left = true;
          this.updateKeyCap('keycap-a', true);
          break;
        case 'KeyD':
          this.keys.right = true;
          this.updateKeyCap('keycap-d', true);
          break;

        // Arrow Keys: Camera rotation (Sudut Pandang)
        case 'ArrowUp':
          this.arrowKeys.up = true;
          this.updateKeyCap('keycap-arrowup', true);
          e.preventDefault();
          break;
        case 'ArrowDown':
          this.arrowKeys.down = true;
          this.updateKeyCap('keycap-arrowdown', true);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          this.arrowKeys.left = true;
          this.updateKeyCap('keycap-arrowleft', true);
          e.preventDefault();
          break;
        case 'ArrowRight':
          this.arrowKeys.right = true;
          this.updateKeyCap('keycap-arrowright', true);
          e.preventDefault();
          break;

        case 'Space':
          if (this.isGrounded) {
            this.velocity.y = this.jumpForce;
            this.isGrounded = false;
            sounds.playClick();
          }
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
          this.keys.forward = false;
          this.updateKeyCap('keycap-w', false);
          break;
        case 'KeyS':
          this.keys.backward = false;
          this.updateKeyCap('keycap-s', false);
          break;
        case 'KeyA':
          this.keys.left = false;
          this.updateKeyCap('keycap-a', false);
          break;
        case 'KeyD':
          this.keys.right = false;
          this.updateKeyCap('keycap-d', false);
          break;

        case 'ArrowUp':
          this.arrowKeys.up = false;
          this.updateKeyCap('keycap-arrowup', false);
          break;
        case 'ArrowDown':
          this.arrowKeys.down = false;
          this.updateKeyCap('keycap-arrowdown', false);
          break;
        case 'ArrowLeft':
          this.arrowKeys.left = false;
          this.updateKeyCap('keycap-arrowleft', false);
          break;
        case 'ArrowRight':
          this.arrowKeys.right = false;
          this.updateKeyCap('keycap-arrowright', false);
          break;
      }
    });

    // Mouse drag to rotate camera
    this.domElement.addEventListener('mousedown', (e) => {
      if (this.isPaused) return;
      this.isPointerDown = true;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;
      sounds.init();
    });

    window.addEventListener('mouseup', () => {
      this.isPointerDown = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPaused || !this.isPointerDown) return;
      const deltaX = e.clientX - this.lastPointerX;
      const deltaY = e.clientY - this.lastPointerY;
      this.lastPointerX = e.clientX;
      this.lastPointerY = e.clientY;

      const rotSpeed = this.baseRotationSpeed * this.sensitivity;
      const yawMultiplier = this.invertYaw ? 1 : -1;
      const pitchMultiplier = this.invertPitch ? -1 : 1;

      this.cameraYaw += deltaX * rotSpeed * yawMultiplier;
      this.cameraPitch += deltaY * rotSpeed * pitchMultiplier;
      this.cameraPitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.cameraPitch));
    });
  }

  initMobileControls() {
    const joystickZone = document.getElementById('mobile-joystick-zone');
    const joystickBase = document.getElementById('joystick-base');
    const joystickThumb = document.getElementById('joystick-thumb');
    const btnJump = document.getElementById('btn-mobile-jump');

    // Mobile Jump Button
    if (btnJump) {
      const handleJump = (e) => {
        e.preventDefault();
        e.stopPropagation();
        sounds.init();
        this.jump();
      };
      btnJump.addEventListener('touchstart', handleJump, { passive: false });
      btnJump.addEventListener('mousedown', handleJump);
    }

    // Virtual Joystick on Left
    if (joystickZone && joystickBase && joystickThumb) {
      const maxRadius = 40; // Max thumb travel radius

      const updateJoystick = (touch) => {
        const rect = joystickBase.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = touch.clientX - centerX;
        const dy = touch.clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let clampedX = dx;
        let clampedY = dy;
        if (dist > maxRadius) {
          clampedX = (dx / dist) * maxRadius;
          clampedY = (dy / dist) * maxRadius;
        }

        joystickThumb.style.transform = `translate(${clampedX}px, ${clampedY}px)`;

        // Normalized vector: X from -1 to 1 (left/right), Y from -1 to 1 (up is forward +1)
        this.joystickVector.x = clampedX / maxRadius;
        this.joystickVector.y = -clampedY / maxRadius;
      };

      const handleJoystickStart = (e) => {
        if (this.isPaused) return;
        sounds.init();
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (this.joystickTouchId === null) {
            this.joystickTouchId = touch.identifier;
            updateJoystick(touch);
            break;
          }
        }
      };

      const handleJoystickMove = (e) => {
        if (this.isPaused || this.joystickTouchId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === this.joystickTouchId) {
            updateJoystick(touch);
            break;
          }
        }
      };

      const handleJoystickEnd = (e) => {
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === this.joystickTouchId) {
            this.joystickTouchId = null;
            this.joystickVector.x = 0;
            this.joystickVector.y = 0;
            joystickThumb.style.transform = 'translate(0px, 0px)';
            break;
          }
        }
      };

      joystickZone.addEventListener('touchstart', handleJoystickStart, { passive: false });
      window.addEventListener('touchmove', handleJoystickMove, { passive: false });
      window.addEventListener('touchend', handleJoystickEnd);
      window.addEventListener('touchcancel', handleJoystickEnd);
    }

    // Touch-to-Look on Right side of screen
    window.addEventListener('touchstart', (e) => {
      if (this.isPaused) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const target = touch.target;
        // Ignore touches on HUD, modals, and mobile buttons
        if (target && (target.closest('.mobile-controls') || target.closest('.hud-top') || target.closest('.modal-overlay') || target.closest('.dialogue-card') || target.closest('.minigame-container'))) {
          continue;
        }

        if (touch.clientX > window.innerWidth * 0.32 && this.cameraTouchId === null) {
          this.cameraTouchId = touch.identifier;
          this.lastTouchX = touch.clientX;
          this.lastTouchY = touch.clientY;
          sounds.init();
          break;
        }
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isPaused || this.cameraTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.cameraTouchId) {
          const deltaX = touch.clientX - this.lastTouchX;
          const deltaY = touch.clientY - this.lastTouchY;
          this.lastTouchX = touch.clientX;
          this.lastTouchY = touch.clientY;

          const rotSpeed = this.baseRotationSpeed * this.sensitivity * 1.5;
          const yawMultiplier = this.invertYaw ? 1 : -1;
          const pitchMultiplier = this.invertPitch ? -1 : 1;

          this.cameraYaw += deltaX * rotSpeed * yawMultiplier;
          this.cameraPitch += deltaY * rotSpeed * pitchMultiplier;
          this.cameraPitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.cameraPitch));
          break;
        }
      }
    }, { passive: true });

    const handleCameraTouchEnd = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.cameraTouchId) {
          this.cameraTouchId = null;
          break;
        }
      }
    };
    window.addEventListener('touchend', handleCameraTouchEnd);
    window.addEventListener('touchcancel', handleCameraTouchEnd);
  }

  update(delta, totalTime) {
    if (this.isPaused) {
      this.character.animate(totalTime, false, false);
      this.updateCamera();
      return;
    }

    // 0. Process Arrow Keys Camera Rotation
    const arrowYawSpeed = 2.4 * this.sensitivity;
    const arrowPitchSpeed = 1.6 * this.sensitivity;
    const yawSign = this.invertYaw ? -1 : 1;
    const pitchSign = this.invertPitch ? -1 : 1;

    if (this.arrowKeys.left) {
      this.cameraYaw += yawSign * arrowYawSpeed * delta;
    }
    if (this.arrowKeys.right) {
      this.cameraYaw -= yawSign * arrowYawSpeed * delta;
    }
    if (this.arrowKeys.up) {
      this.cameraPitch += pitchSign * arrowPitchSpeed * delta;
    }
    if (this.arrowKeys.down) {
      this.cameraPitch -= pitchSign * arrowPitchSpeed * delta;
    }
    this.cameraPitch = Math.max(this.minPitch, Math.min(this.maxPitch, this.cameraPitch));

    // 1. Calculate movement relative to Camera Orientation
    // Camera forward on horizontal XZ plane: (sin(yaw), 0, cos(yaw))
    const camForward = new THREE.Vector3(
      Math.sin(this.cameraYaw),
      0,
      Math.cos(this.cameraYaw)
    ).normalize();

    // Camera right on horizontal XZ plane: perpendicular to forward
    // Inverted sign: (-camForward.z, 0, camForward.x) so A=Kiri, D=Kanan
    const camRight = new THREE.Vector3(
      -camForward.z,
      0,
      camForward.x
    ).normalize();

    // Input values: Keyboard + Virtual Joystick
    const keyForward = (this.keys.forward ? 1 : 0) - (this.keys.backward ? 1 : 0);
    const keyRight = (this.keys.right ? 1 : 0) - (this.keys.left ? 1 : 0);

    let inputForward = keyForward + this.joystickVector.y;
    let inputRight = keyRight + this.joystickVector.x;

    const inputMag = Math.sqrt(inputForward * inputForward + inputRight * inputRight);
    if (inputMag > 1.0) {
      inputForward /= inputMag;
      inputRight /= inputMag;
    }

    const moveDir = new THREE.Vector3()
      .addScaledVector(camForward, inputForward)
      .addScaledVector(camRight, inputRight);

    const isMoving = moveDir.lengthSq() > 0.001;

    if (isMoving) {
      moveDir.normalize();

      // Smoothly rotate character toward movement heading
      const targetRotation = Math.atan2(moveDir.x, moveDir.z);
      let diff = targetRotation - this.character.root.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      this.character.root.rotation.y += diff * 0.2;

      // Calculate step displacement
      const nextPos = this.character.root.position.clone();
      nextPos.x += moveDir.x * this.moveSpeed * delta;
      nextPos.z += moveDir.z * this.moveSpeed * delta;

      // Boundary clamp (-195 to 195) for expanded 420x420 city
      nextPos.x = Math.max(-195, Math.min(195, nextPos.x));
      nextPos.z = Math.max(-195, Math.min(195, nextPos.z));

      // Collision check with city buildings & fountain
      if (!this.checkCollision(nextPos)) {
        this.character.root.position.x = nextPos.x;
        this.character.root.position.z = nextPos.z;
      }

      // Footstep sound
      if (this.isGrounded) {
        this.footstepTimer += delta;
        if (this.footstepTimer > 0.32) {
          sounds.playFootstep();
          this.footstepTimer = 0;
        }
      }
    }

    // 2. Vertical Jump / Gravity
    if (!this.isGrounded) {
      this.velocity.y += this.gravity * delta;
      this.character.root.position.y += this.velocity.y * delta;

      if (this.character.root.position.y <= 0) {
        this.character.root.position.y = 0;
        this.velocity.y = 0;
        this.isGrounded = true;
      }
    }

    // 3. Animate character limbs & bobbing
    this.character.animate(totalTime, isMoving, !this.isGrounded);

    // 4. Update 3rd person camera position
    this.updateCamera();
  }

  checkCollision(targetPos) {
    const playerBox = new THREE.Box3().setFromCenterAndSize(
      new THREE.Vector3(targetPos.x, 1.0, targetPos.z),
      new THREE.Vector3(1.2, 2.0, 1.2)
    );

    for (let i = 0; i < this.colliders.length; i++) {
      if (this.colliders[i].intersectsBox(playerBox)) {
        return true; // Collided
      }
    }
    return false;
  }

  updateCamera() {
    const target = this.character.root.position;

    // Calculate camera position based on spherical coordinates
    const horizontalDistance = this.cameraDistance * Math.cos(this.cameraPitch);
    const cameraY = target.y + this.cameraHeight + this.cameraDistance * Math.sin(this.cameraPitch);

    const cameraX = target.x - horizontalDistance * Math.sin(this.cameraYaw);
    const cameraZ = target.z - horizontalDistance * Math.cos(this.cameraYaw);

    this.camera.position.set(cameraX, cameraY, cameraZ);
    this.camera.lookAt(target.x, target.y + 1.8, target.z);
  }
}
