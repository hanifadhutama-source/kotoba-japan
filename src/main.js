import * as THREE from 'three';
import { CityWorld } from './world/CityWorld.js';
import { CityLifeManager } from './world/CityLifeManager.js';
import { VoxelCharacter } from './entities/VoxelCharacter.js';
import { PlayerController } from './entities/PlayerController.js';
import { WanderingNPCManager } from './ai/WanderingNPCManager.js';
import { QUEST_DATA } from './quest/QuestData.js';
import { DialogueManager } from './quest/DialogueManager.js';
import { MinigameController } from './minigames/MinigameController.js';
import { sounds } from './audio/SoundEffects.js';

class GameApp {
  constructor() {
    this.canvas = document.getElementById('bg-canvas');
    this.container = document.getElementById('game-container');

    // HUD Elements
    this.promptEl = document.getElementById('interaction-prompt');
    this.promptNameEl = document.getElementById('prompt-npc-name');
    this.questCounterEl = document.getElementById('quest-counter');
    this.questBookModal = document.getElementById('quest-book-modal');
    this.questListItems = document.getElementById('quest-list-items');
    this.victoryModal = document.getElementById('victory-modal');

    this.clock = new THREE.Clock();
    this.quests = QUEST_DATA;
    this.questNPCs = [];
    this.nearbyNPC = null;
    this.nearbyCitizen = null;
    this.mobileInteractBtn = null;

    // Settings & Pause Modal Elements
    this.settingsModal = document.getElementById('settings-modal');
    this.btnToggleSettings = document.getElementById('btn-toggle-settings');
    this.btnCloseSettings = document.getElementById('btn-close-settings');
    this.btnResumeGame = document.getElementById('btn-resume-game');
    this.sliderSensitivity = document.getElementById('slider-sensitivity');
    this.labelSensitivityVal = document.getElementById('label-sensitivity-val');
    this.sliderSpeed = document.getElementById('slider-speed');
    this.labelSpeedVal = document.getElementById('label-speed-val');
    this.sliderVolume = document.getElementById('slider-volume');
    this.labelVolumeVal = document.getElementById('label-volume-val');
    this.chkInvertPitch = document.getElementById('chk-invert-pitch');
    this.chkInvertYaw = document.getElementById('chk-invert-yaw');
    this.btnRespawn = document.getElementById('btn-respawn');
    this.btnResetQuests = document.getElementById('btn-reset-quests');

    this.initScene();
    this.initSystems();
    this.initUI();
    this.animate();
  }

  initScene() {
    // 1. Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xd4e9f7); // Soft Tokyo morning sky
    this.scene.fog = new THREE.FogExp2(0xd4e9f7, 0.008);

    // 2. Camera setup
    this.camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      350
    );

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Build 3D Cityscape
    this.city = new CityWorld(this.scene);

    // Window resize
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  initSystems() {
    // 1. Player Voxel Avatar
    this.playerCharacter = new VoxelCharacter({
      name: 'Player',
      isPlayer: true,
      shirtColor: 0x4f46e5, // Blue-Indigo
      pantsColor: 0x1e293b
    });
    this.playerCharacter.root.position.set(0, 0, 8); // Start near central plaza
    this.scene.add(this.playerCharacter.root);

    // 2. Player Controller
    this.playerController = new PlayerController(
      this.playerCharacter,
      this.camera,
      this.renderer.domElement,
      this.city.colliders
    );

    // 3. Wandering NPCs (AI Warga Kota)
    this.wanderingManager = new WanderingNPCManager(this.scene);

    // 4. Quest NPCs (9 Unique Characters)
    this.quests.forEach(quest => {
      const npcChar = new VoxelCharacter({
        name: quest.npc.name,
        isPlayer: false,
        shirtColor: quest.npc.shirtColor,
        pantsColor: quest.npc.pantsColor,
        questStatus: quest.isCompleted ? 'COMPLETED' : 'AVAILABLE'
      });

      npcChar.root.position.set(quest.npc.pos.x, 0, quest.npc.pos.z);
      // Face towards center plaza
      npcChar.root.lookAt(0, 0, 0);

      this.scene.add(npcChar.root);

      this.questNPCs.push({
        quest: quest,
        character: npcChar
      });
    });

    // 5. Minigame Controller
    this.minigames = new MinigameController((completedQuest) => {
      this.onQuestCompleted(completedQuest);
    });

    // 6. Dialogue Manager
    this.dialogue = new DialogueManager((quest) => {
      this.minigames.start(quest);
    });

    // 7. City Life Manager (Traffic, Birds, Fountain Particles, Clouds)
    this.cityLife = new CityLifeManager(this.scene);
  }

  initUI() {
    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      // Proximity interaction [E]
      if (e.code === 'KeyE') {
        if (!this.dialogue.isOpen() && document.getElementById('minigame-overlay').classList.contains('hidden') && this.settingsModal.classList.contains('hidden')) {
          if (this.nearbyNPC) {
            sounds.playClick();
            this.dialogue.open(this.nearbyNPC.quest);
          } else if (this.nearbyCitizen) {
            sounds.playClick();
            const citizenChat = this.wanderingManager.talkTo(this.nearbyCitizen, this.playerCharacter.root.position);
            if (citizenChat) {
              this.dialogue.openCitizenChat(citizenChat);
            }
          }
        }
      }

      // Pause / Settings toggle with [Escape] or [KeyP]
      if (e.code === 'Escape' || e.code === 'KeyP') {
        if (!this.questBookModal.classList.contains('hidden')) {
          this.questBookModal.classList.add('hidden');
          return;
        }
        if (!this.dialogue.isOpen() && document.getElementById('minigame-overlay').classList.contains('hidden')) {
          this.toggleSettings();
        }
      }
    });

    // Settings Modal controls
    this.btnToggleSettings.addEventListener('click', () => this.toggleSettings());
    this.btnCloseSettings.addEventListener('click', () => this.closeSettings());
    this.btnResumeGame.addEventListener('click', () => this.closeSettings());

    // Sensitivity Slider
    this.sliderSensitivity.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.playerController.setSensitivity(val);
      this.labelSensitivityVal.textContent = `${val.toFixed(1)}x`;
    });

    // Speed Slider
    this.sliderSpeed.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      this.playerController.setMoveSpeed(val);
      this.labelSpeedVal.textContent = `${val.toFixed(1)} m/s`;
    });

    // Volume Slider
    this.sliderVolume.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      sounds.setVolume(val / 100);
      this.labelVolumeVal.textContent = `${val}%`;
    });

    // Invert Pitch & Yaw Checkboxes
    this.chkInvertPitch.addEventListener('change', (e) => {
      this.playerController.setInvertPitch(e.target.checked);
    });

    this.chkInvertYaw.addEventListener('change', (e) => {
      this.playerController.setInvertYaw(e.target.checked);
    });

    // Respawn button
    this.btnRespawn.addEventListener('click', () => {
      sounds.playClick();
      this.playerController.respawn({ x: 0, y: 0, z: 8 });
      this.closeSettings();
    });

    // Reset All Quests button
    this.btnResetQuests.addEventListener('click', () => {
      if (confirm('Yakin ingin mereset progres 9 misi ke awal?')) {
        sounds.playClick();
        this.quests.forEach(q => {
          q.isCompleted = false;
        });
        this.questNPCs.forEach(npc => {
          npc.character.updateBadge('AVAILABLE');
        });
        this.updateHUDStats();
        this.closeSettings();
      }
    });

    // Mobile Interact Button
    this.mobileInteractBtn = document.getElementById('btn-mobile-interact');
    if (this.mobileInteractBtn) {
      const handleMobileInteract = (e) => {
        e.preventDefault();
        e.stopPropagation();
        sounds.init();
        if (!this.dialogue.isOpen() && document.getElementById('minigame-overlay').classList.contains('hidden') && this.settingsModal.classList.contains('hidden')) {
          if (this.nearbyNPC) {
            sounds.playClick();
            this.dialogue.open(this.nearbyNPC.quest);
          } else if (this.nearbyCitizen) {
            sounds.playClick();
            const citizenChat = this.wanderingManager.talkTo(this.nearbyCitizen, this.playerCharacter.root.position);
            if (citizenChat) {
              this.dialogue.openCitizenChat(citizenChat);
            }
          }
        }
      };
      this.mobileInteractBtn.addEventListener('touchstart', handleMobileInteract, { passive: false });
      this.mobileInteractBtn.addEventListener('mousedown', handleMobileInteract);
    }

    // Audio Toggle Button
    const audioBtn = document.getElementById('btn-audio-toggle');
    audioBtn.addEventListener('click', () => {
      const isEnabled = sounds.toggle();
      audioBtn.textContent = isEnabled ? '🔊 Suara: Nyala' : '🔇 Suara: Mati';
      sounds.playClick();
    });

    // Fullscreen Button
    const fsBtn = document.getElementById('btn-fullscreen');
    const updateFsIcon = () => {
      const isFs = !!document.fullscreenElement;
      fsBtn.innerHTML = isFs
        ? '⊠ <span class="btn-text">Keluar Layar Penuh</span>'
        : '⛶ <span class="btn-text">Layar Penuh</span>';
    };
    const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    };
    fsBtn.addEventListener('click', () => {
      sounds.playClick();
      toggleFullscreen();
    });
    document.addEventListener('fullscreenchange', updateFsIcon);

    // F key shortcut for fullscreen
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyF' && e.target.tagName !== 'INPUT') {
        toggleFullscreen();
      }
    });

    // Quest Book Modal Toggle
    const btnToggleQuestBook = document.getElementById('btn-toggle-questlist');
    const btnCloseQuestBook = document.getElementById('btn-close-questbook');

    btnToggleQuestBook.addEventListener('click', () => {
      sounds.playClick();
      this.renderQuestBook();
      this.questBookModal.classList.remove('hidden');
    });

    btnCloseQuestBook.addEventListener('click', () => {
      sounds.playClick();
      this.questBookModal.classList.add('hidden');
    });

    // Continue Explore after victory
    document.getElementById('btn-continue-explore').addEventListener('click', () => {
      sounds.playClick();
      this.victoryModal.classList.add('hidden');
    });

    this.updateHUDStats();
  }

  toggleSettings() {
    if (this.settingsModal.classList.contains('hidden')) {
      this.openSettings();
    } else {
      this.closeSettings();
    }
  }

  openSettings() {
    sounds.playClick();
    this.settingsModal.classList.remove('hidden');
    this.playerController.setPaused(true);
  }

  closeSettings() {
    sounds.playClick();
    this.settingsModal.classList.add('hidden');
    this.playerController.setPaused(false);
  }

  onQuestCompleted(quest) {
    quest.isCompleted = true;

    // Update the NPC's badge to green checkmark [ ✓ ]
    const npcItem = this.questNPCs.find(n => n.quest.id === quest.id);
    if (npcItem) {
      npcItem.character.updateBadge('COMPLETED');
    }

    this.updateHUDStats();

    // Check all 9 quests
    const completedCount = this.quests.filter(q => q.isCompleted).length;
    if (completedCount === 9) {
      setTimeout(() => {
        sounds.playFanfare();
        this.victoryModal.classList.remove('hidden');
      }, 800);
    }
  }

  updateHUDStats() {
    const completedCount = this.quests.filter(q => q.isCompleted).length;
    this.questCounterEl.textContent = `${completedCount} / 9`;
  }

  renderQuestBook() {
    this.questListItems.innerHTML = '';
    this.quests.forEach(q => {
      const card = document.createElement('div');
      card.className = `quest-item-card ${q.isCompleted ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="q-badge">${q.categoryBadge}</div>
        <div class="q-title">Misi #${q.id}: ${q.title}</div>
        <div class="q-npc">${q.npc.emoji} ${q.npc.name} (${q.npc.role})</div>
        <div class="q-status ${q.isCompleted ? 'done' : 'pending'}">
          ${q.isCompleted ? '✅ Selesai' : '⏳ Belum Diselesaikan'}
        </div>
      `;
      this.questListItems.appendChild(card);
    });
  }

  checkProximity() {
    const playerPos = this.playerCharacter.root.position;
    let closestQuestNPC = null;
    let closestQuestDist = Infinity;

    for (let i = 0; i < this.questNPCs.length; i++) {
      const npc = this.questNPCs[i];
      const dist = playerPos.distanceTo(npc.character.root.position);
      if (dist < closestQuestDist) {
        closestQuestDist = dist;
        closestQuestNPC = npc;
      }
    }

    // Interaction threshold 4.5 units for Quest NPCs
    if (closestQuestDist <= 4.5) {
      this.nearbyNPC = closestQuestNPC;
      this.nearbyCitizen = null;
      this.promptNameEl.textContent = `${closestQuestNPC.quest.npc.name} (${closestQuestNPC.quest.npc.role})`;
      this.promptEl.classList.remove('hidden');
      if (this.mobileInteractBtn) this.mobileInteractBtn.classList.remove('hidden');
      return;
    }

    // Check wandering citizens if no Quest NPC is nearby
    const nearbyCitizen = this.wanderingManager.findNearbyCitizen(playerPos, 4.0);
    if (nearbyCitizen) {
      this.nearbyNPC = null;
      this.nearbyCitizen = nearbyCitizen;
      this.promptNameEl.textContent = `${nearbyCitizen.profile.name} (${nearbyCitizen.profile.role})`;
      this.promptEl.classList.remove('hidden');
      if (this.mobileInteractBtn) this.mobileInteractBtn.classList.remove('hidden');
      return;
    }

    this.nearbyNPC = null;
    this.nearbyCitizen = null;
    this.promptEl.classList.add('hidden');
    if (this.mobileInteractBtn) this.mobileInteractBtn.classList.add('hidden');
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = Math.min(this.clock.getDelta(), 0.1);
    const totalTime = this.clock.getElapsedTime();

    // 1. Update Player
    this.playerController.update(delta, totalTime);

    // 2. Update Wandering Citizens AI
    this.wanderingManager.update(delta, totalTime);

    // 3. Animate Quest NPCs (Idle breathing & badge floating)
    this.questNPCs.forEach((npc, index) => {
      npc.character.animate(totalTime + index * 0.5, false, false);
    });

    // 4. Update City Life (Vehicles, Birds, Fountain Particles, Clouds)
    if (this.cityLife) {
      this.cityLife.update(delta, totalTime);
    }

    // 5. Proximity Check with Quest NPCs
    this.checkProximity();

    // 6. Render Three.js Scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Start game when page loads or immediately if already loaded
if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => new GameApp());
} else {
  new GameApp();
}
