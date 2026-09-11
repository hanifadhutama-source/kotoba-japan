import * as THREE from 'three';
import { VoxelCharacter } from '../entities/VoxelCharacter.js';

export class WanderingNPCManager {
  constructor(scene) {
    this.scene = scene;
    this.npcs = [];

    // Define pedestrian patrol areas across the expanded 420x420 city
    this.zones = [
      // Central Plaza & Fountain Promenade
      { minX: -18, maxX: 18, minZ: -18, maxZ: 18, name: 'Alun-Alun Pusat' },
      // Distrik Barat Laut (NW) - Pendidikan & Perpustakaan
      { minX: -150, maxX: -25, minZ: -150, maxZ: -25, name: 'Distrik Perpustakaan' },
      // Distrik Timur Laut (NE) - Menara Arsitektur & Perkantoran
      { minX: 25, maxX: 150, minZ: -150, maxZ: -25, name: 'Distrik Bisnis' },
      // Distrik Barat Daya (SW) - Kampus & Lab Riset
      { minX: -150, maxX: -25, minZ: 25, maxZ: 150, name: 'Distrik Sains' },
      // Distrik Tenggara (SE) - Kreatif & Studio Media
      { minX: 25, maxX: 150, minZ: 25, maxZ: 150, name: 'Distrik Media' },
      // Boulevard Utara
      { minX: -160, maxX: 160, minZ: -128, maxZ: -112, name: 'Boulevard Utara' },
      // Boulevard Selatan
      { minX: -160, maxX: 160, minZ: 112, maxZ: 128, name: 'Boulevard Selatan' },
      // Avenue Barat
      { minX: -128, maxX: -112, minZ: -160, maxZ: 160, name: 'Avenue Barat' },
      // Avenue Timur
      { minX: 112, maxX: 128, minZ: -160, maxZ: 160, name: 'Avenue Timur' }
    ];

    this.citizenProfiles = [
      { name: 'Mas Dimas', role: 'Mahasiswa Sastra', emoji: '🧑‍🎓', text: 'Halo! Membaca buku adalah jendela dunia. Jangan lupa pelajari kata baku ya!' },
      { name: 'Mbak Ayu', role: 'Desainer Grafis', emoji: '👩‍🎨', text: 'Hai! Kota ini penuh warna dan inspirasi. Selalu jaga kesantunan berbahasa!' },
      { name: 'Pak Tono', role: 'Pedagang Kopi', emoji: '☕', text: 'Selamat pagi! Sedang keliling kota? Jangan lupa mampir ke alun-alun pusat!' },
      { name: 'Bu Sari', role: 'Pecinta Tanaman', emoji: '🌱', text: 'Taman kota ini sangat rindang. Udara segar membuat pikiran jernih saat belajar.' },
      { name: 'Kang Asep', role: 'Pemerhati Kota', emoji: '🚶‍♂️', text: 'Tertib menyeberang di zebra cross ya! Jadilah warga yang sadar aturan.' },
      { name: 'Kak Rian', role: 'Penyiar Musik', emoji: '🎧', text: 'Halo kawan! Saring sebelum sharing informasi di media sosial ya!' },
      { name: 'Mbak Tiara', role: 'Relawan Literasi', emoji: '📚', text: 'Sudah selesaikan misi Bu Rahma di perpustakaan? Kuisnya sangat seru!' },
      { name: 'Pak Bambang', role: 'Warga Senior', emoji: '👴', text: 'Bahasa Indonesia menyatukan ribuan pulau di nusantara kita. Banggalah berbahasa Indonesia!' },
      { name: 'Adit', role: 'Pelajar Cerdas', emoji: '🎒', text: 'Aku sedang menghafal kata-kata baku di KBBI untuk ujian sekolah nanti!' },
      { name: 'Nadia', role: 'Fotografer Jalanan', emoji: '📷', text: 'Gedung-gedung tinggi di distrik timur laut keren sekali untuk difoto!' },
      { name: 'Fajar', role: 'Pengendara Sepeda', emoji: '🚴', text: 'Kota ini luas sekali sekarang! Jalan-jalan sampai ke ring road luar yuk.' },
      { name: 'Lestari', role: 'Guru Muda', emoji: '👩‍🏫', text: 'Struktur kalimat SPOK membuat tulisan kita rapi dan mudah dipahami pembaca.' }
    ];

    this.chatBubbles = [
      'Halo kawan! 👋',
      'Ayo membaca 📖',
      'Cek faktanya ya! 🛡️',
      'Indahnya kota ini ✨',
      'Santai sejenak ☕',
      'Apotek atau apotik? 🤔',
      'Tertib di trotoar 👍',
      'Semangat belajarnya! 🌟',
      'Saring sebelum sharing! 📱',
      'Kota Cerdas 2026 🏛️'
    ];

    this.spawnWanderingCitizens(36);
  }

  spawnWanderingCitizens(count) {
    const shirtColors = [
      0x0284c7, // Sky
      0x16a34a, // Green
      0xd97706, // Amber
      0x9333ea, // Purple
      0x0d9488, // Teal
      0xe11d48, // Rose
      0x475569, // Slate
      0xf59e0b, // Yellow
      0xec4899, // Pink
      0x2563eb  // Blue
    ];

    const skinTones = [0xffdfba, 0xfcd34d, 0xfbb6ce, 0xef4444, 0xd97706];

    for (let i = 0; i < count; i++) {
      const zone = this.zones[i % this.zones.length];
      const startX = THREE.MathUtils.randFloat(zone.minX, zone.maxX);
      const startZ = THREE.MathUtils.randFloat(zone.minZ, zone.maxZ);
      const profile = this.citizenProfiles[i % this.citizenProfiles.length];

      const citizen = new VoxelCharacter({
        name: profile.name,
        isPlayer: false,
        shirtColor: shirtColors[i % shirtColors.length],
        pantsColor: 0x1e293b,
        skinColor: skinTones[i % skinTones.length],
        questStatus: null // No quest badge for ordinary wandering citizens
      });

      citizen.root.position.set(startX, 0, startZ);
      this.scene.add(citizen.root);

      // Create speech bubble sprite for occasional casual thoughts
      const bubble = this.createBubbleSprite();
      bubble.visible = false;
      bubble.position.y = 3.2;
      citizen.root.add(bubble);

      this.npcs.push({
        id: i + 1,
        character: citizen,
        profile: profile,
        zone: zone,
        state: 'IDLE', // 'IDLE' | 'WALK' | 'TALKING'
        timer: THREE.MathUtils.randFloat(1.5, 4.0),
        target: new THREE.Vector3(startX, 0, startZ),
        walkSpeed: THREE.MathUtils.randFloat(1.8, 3.2),
        animOffset: Math.random() * 10,
        bubble: bubble,
        bubbleTimer: 0,
        talkTimer: 0
      });
    }
  }

  createBubbleSprite() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 80;
    const texture = new THREE.CanvasTexture(canvas);

    const mat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(3.2, 1.0, 1.0);
    sprite.userData = { canvas, texture };
    return sprite;
  }

  updateBubbleText(bubble, text) {
    const { canvas, texture } = bubble.userData;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 256, 80);

    // Bubble background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(6, 6, 244, 68, 14);
    ctx.fill();
    ctx.stroke();

    // Bubble text
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 40);

    texture.needsUpdate = true;
  }

  findNearbyCitizen(playerPos, maxDist = 4.5) {
    let closest = null;
    let closestDist = Infinity;

    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      const dist = playerPos.distanceTo(npc.character.root.position);
      if (dist <= maxDist && dist < closestDist) {
        closestDist = dist;
        closest = npc;
      }
    }

    return closest;
  }

  talkTo(npc, playerPos) {
    if (!npc) return null;

    // Stop walking and face player
    npc.state = 'TALKING';
    npc.talkTimer = 10.0; // Stay talking for a bit until dialog is closed
    const dir = new THREE.Vector3().subVectors(playerPos, npc.character.root.position);
    dir.y = 0;
    if (dir.lengthSq() > 0.001) {
      npc.character.root.rotation.y = Math.atan2(dir.x, dir.z);
    }

    return {
      name: npc.profile.name,
      role: npc.profile.role,
      emoji: npc.profile.emoji,
      text: npc.profile.text
    };
  }

  update(delta, totalTime) {
    this.npcs.forEach(npc => {
      // Randomly trigger speech bubble occasionally when not talking
      if (npc.bubbleTimer > 0) {
        npc.bubbleTimer -= delta;
        if (npc.bubbleTimer <= 0) {
          npc.bubble.visible = false;
        }
      } else if (npc.state !== 'TALKING' && Math.random() < 0.002) {
        const msg = this.chatBubbles[Math.floor(Math.random() * this.chatBubbles.length)];
        this.updateBubbleText(npc.bubble, msg);
        npc.bubble.visible = true;
        npc.bubbleTimer = THREE.MathUtils.randFloat(3.0, 5.0);
      }

      if (npc.state === 'TALKING') {
        npc.talkTimer -= delta;
        npc.character.animate(totalTime + npc.animOffset, false, false);
        if (npc.talkTimer <= 0) {
          npc.state = 'IDLE';
          npc.timer = THREE.MathUtils.randFloat(2.0, 4.0);
        }
        return;
      }

      npc.timer -= delta;

      if (npc.state === 'WALK') {
        const currentPos = npc.character.root.position;
        const dir = new THREE.Vector3().subVectors(npc.target, currentPos);
        dir.y = 0;
        const dist = dir.length();

        if (dist < 0.5 || npc.timer <= 0) {
          npc.state = 'IDLE';
          npc.timer = THREE.MathUtils.randFloat(2.0, 5.0);
        } else {
          dir.normalize();

          // Smooth rotation to face walking direction
          const targetAngle = Math.atan2(dir.x, dir.z);
          let diff = targetAngle - npc.character.root.rotation.y;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;
          npc.character.root.rotation.y += diff * 0.12;

          // Move forward
          npc.character.root.position.addScaledVector(dir, npc.walkSpeed * delta);
          
          // Animate walk
          npc.character.animate(totalTime + npc.animOffset, true, false);
        }
      } else {
        // IDLE state
        npc.character.animate(totalTime + npc.animOffset, false, false);

        if (npc.timer <= 0) {
          // Pick a new random target within sidewalk zone
          const newX = THREE.MathUtils.randFloat(npc.zone.minX, npc.zone.maxX);
          const newZ = THREE.MathUtils.randFloat(npc.zone.minZ, npc.zone.maxZ);
          npc.target.set(newX, 0, newZ);

          npc.state = 'WALK';
          npc.timer = THREE.MathUtils.randFloat(3.5, 9.0);
        }
      }
    });
  }
}
