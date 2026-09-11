import { sounds } from '../audio/SoundEffects.js';

export class DialogueManager {
  constructor(onStartMinigame) {
    this.onStartMinigame = onStartMinigame;

    // DOM Elements
    this.overlay = document.getElementById('dialogue-overlay');
    this.avatarIcon = document.getElementById('npc-avatar-icon');
    this.npcName = document.getElementById('npc-dialogue-name');
    this.npcRole = document.getElementById('npc-dialogue-role');
    this.questBadge = document.getElementById('dialogue-quest-badge');
    this.speechText = document.getElementById('dialogue-speech-text');
    this.actionBtn = document.getElementById('dialogue-action-btn');
    this.cancelBtn = document.getElementById('dialogue-cancel-btn');

    this.activeQuest = null;
    this.typewriterInterval = null;
    this.isTyping = false;

    this.initEvents();
  }

  initEvents() {
    this.cancelBtn.addEventListener('click', () => {
      sounds.playClick();
      this.close();
    });

    this.actionBtn.addEventListener('click', () => {
      sounds.playClick();
      if (this.activeQuest) {
        const quest = this.activeQuest;
        this.close();
        if (!quest.isCompleted) {
          this.onStartMinigame(quest);
        }
      } else {
        this.close();
      }
    });
  }

  open(quest) {
    this.activeQuest = quest;
    this.avatarIcon.textContent = quest.npc.emoji;
    this.npcName.textContent = quest.npc.name;
    this.npcRole.textContent = quest.npc.role;
    this.questBadge.textContent = `Misi #${quest.id}`;

    if (quest.isCompleted) {
      this.actionBtn.textContent = 'Tutup';
      this.cancelBtn.classList.add('hidden');
      this.typeText(quest.completedDialogue);
    } else {
      this.actionBtn.textContent = 'Mulai Tantangan! 🚀';
      this.cancelBtn.classList.remove('hidden');
      this.typeText(quest.introDialogue);
    }

    this.overlay.classList.remove('hidden');
  }

  openCitizenChat(citizenData) {
    this.activeQuest = null;
    this.avatarIcon.textContent = citizenData.emoji || '🚶';
    this.npcName.textContent = citizenData.name || 'Warga Ramah';
    this.npcRole.textContent = citizenData.role || 'Warga Kota Cerdas';
    this.questBadge.textContent = '💬 Warga Kota';

    this.actionBtn.textContent = 'Sampai Jumpa! 👋';
    this.cancelBtn.classList.add('hidden');
    this.typeText(citizenData.text || 'Halo! Senang bertemu denganmu di kota yang cerdas dan asri ini.');

    this.overlay.classList.remove('hidden');
  }

  typeText(fullText) {
    clearInterval(this.typewriterInterval);
    this.speechText.textContent = '';
    this.isTyping = true;
    let charIndex = 0;

    this.typewriterInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        this.speechText.textContent += fullText.charAt(charIndex);
        if (charIndex % 2 === 0) {
          sounds.playTypewriter();
        }
        charIndex++;
      } else {
        clearInterval(this.typewriterInterval);
        this.isTyping = false;
      }
    }, 24);
  }

  close() {
    clearInterval(this.typewriterInterval);
    this.overlay.classList.add('hidden');
    this.activeQuest = null;
  }

  isOpen() {
    return !this.overlay.classList.contains('hidden');
  }
}
