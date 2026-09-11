import { sounds } from '../audio/SoundEffects.js';

export class MinigameController {
  constructor(onCompleteCallback) {
    this.onCompleteCallback = onCompleteCallback;

    this.overlay = document.getElementById('minigame-overlay');
    this.content = document.getElementById('minigame-content');

    this.currentQuest = null;
    this.questionIndex = 0;
    this.score = 0;
  }

  start(quest) {
    this.currentQuest = quest;
    this.questionIndex = 0;
    this.score = 0;
    this.overlay.classList.remove('hidden');

    if (quest.minigameType === 'VOCAB_CHOICE') {
      this.renderVocabQuestion();
    } else if (quest.minigameType === 'HOAX_DETECTOR') {
      this.renderHoaxQuestion();
    } else if (quest.minigameType === 'SENTENCE_BUILDER') {
      this.renderSentencePuzzle();
    }
  }

  close() {
    this.overlay.classList.add('hidden');
    this.content.innerHTML = '';
  }

  // ==================== KATEGORI 1: KATA BAKU (VOCAB_CHOICE) ====================
  renderVocabQuestion() {
    const q = this.currentQuest.questions[this.questionIndex];
    const total = this.currentQuest.questions.length;

    this.content.innerHTML = `
      <div class="minigame-card">
        <div class="minigame-header">
          <span class="category-tag">${this.currentQuest.categoryBadge}</span>
          <span class="step-tracker">Soal ${this.questionIndex + 1} / ${total}</span>
        </div>

        <h3 class="minigame-prompt">${q.prompt}</h3>

        <div class="vocab-grid">
          ${q.options.map((opt, idx) => `
            <button class="vocab-btn" data-index="${idx}">${opt}</button>
          `).join('')}
        </div>

        <div id="feedback-area" class="hidden"></div>
      </div>
    `;

    const buttons = this.content.querySelectorAll('.vocab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const selectedIdx = parseInt(e.target.dataset.index);
        this.evaluateVocabAnswer(selectedIdx, q.correctIndex, q.explanation, buttons);
      });
    });
  }

  evaluateVocabAnswer(selectedIdx, correctIdx, explanation, buttons) {
    const isCorrect = selectedIdx === correctIdx;
    if (isCorrect) {
      this.score++;
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) {
        btn.style.borderColor = '#10b981';
        btn.style.background = 'rgba(16, 185, 129, 0.25)';
      } else if (idx === selectedIdx) {
        btn.style.borderColor = '#ef4444';
        btn.style.background = 'rgba(239, 68, 68, 0.25)';
      }
    });

    const feedbackArea = document.getElementById('feedback-area');
    feedbackArea.className = `feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackArea.innerHTML = `
      <div class="feedback-title">${isCorrect ? '✨ Jawaban Tepat!' : '⚠️ Kurang Tepat!'}</div>
      <p>${explanation}</p>
      <div style="margin-top: 14px; text-align: right;">
        <button id="btn-next-vocab" class="btn btn-primary">
          ${this.questionIndex < this.currentQuest.questions.length - 1 ? 'Soal Berikutnya ➔' : 'Selesaikan Misi 🏆'}
        </button>
      </div>
    `;

    document.getElementById('btn-next-vocab').addEventListener('click', () => {
      sounds.playClick();
      this.questionIndex++;
      if (this.questionIndex < this.currentQuest.questions.length) {
        this.renderVocabQuestion();
      } else {
        this.showFinalResult();
      }
    });
  }

  // ==================== KATEGORI 2: DETEKSI HOAKS ====================
  renderHoaxQuestion() {
    const q = this.currentQuest.questions[this.questionIndex];
    const total = this.currentQuest.questions.length;

    this.content.innerHTML = `
      <div class="minigame-card">
        <div class="minigame-header">
          <span class="category-tag">${this.currentQuest.categoryBadge}</span>
          <span class="step-tracker">Analisis Kasus ${this.questionIndex + 1} / ${total}</span>
        </div>

        <div class="hoax-box">
          <div class="headline-text">"${q.headline}"</div>
          <div class="source-line"><strong>📡 Saluran / Sumber:</strong> ${q.source}</div>
          <div class="clues-list">
            <p>🔍 Indikator Analisis Berita:</p>
            <ul>
              ${q.clues.map(c => `<li>${c}</li>`).join('')}
            </ul>
          </div>
        </div>

        <div id="choice-actions" class="hoax-choice-buttons">
          <button id="btn-choose-hoax" class="btn btn-hoax">⚠️ INI HOAKS</button>
          <button id="btn-choose-fact" class="btn btn-fact">✅ INI FAKTA</button>
        </div>

        <div id="hoax-feedback-area" class="hidden"></div>
      </div>
    `;

    document.getElementById('btn-choose-hoax').addEventListener('click', () => {
      this.evaluateHoaxAnswer(true, q);
    });

    document.getElementById('btn-choose-fact').addEventListener('click', () => {
      this.evaluateHoaxAnswer(false, q);
    });
  }

  evaluateHoaxAnswer(userGuessHoax, q) {
    const isCorrect = userGuessHoax === q.isHoax;
    if (isCorrect) {
      this.score++;
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    // Hide choice buttons
    document.getElementById('choice-actions').classList.add('hidden');

    const feedbackArea = document.getElementById('hoax-feedback-area');
    feedbackArea.className = `feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackArea.innerHTML = `
      <div class="feedback-title">${isCorrect ? '🎉 Analisis Tepat!' : '❌ Terkecoh!'}</div>
      <p>${q.explanation}</p>
      <div style="margin-top: 14px; text-align: right;">
        <button id="btn-next-hoax" class="btn btn-primary">
          ${this.questionIndex < this.currentQuest.questions.length - 1 ? 'Kasus Selanjutnya ➔' : 'Selesaikan Analisis 🏆'}
        </button>
      </div>
    `;

    document.getElementById('btn-next-hoax').addEventListener('click', () => {
      sounds.playClick();
      this.questionIndex++;
      if (this.questionIndex < this.currentQuest.questions.length) {
        this.renderHoaxQuestion();
      } else {
        this.showFinalResult();
      }
    });
  }

  // ==================== KATEGORI 3: KALIMAT EFEKTIF (SENTENCE_BUILDER) ====================
  renderSentencePuzzle() {
    const puzzle = this.currentQuest.puzzles[this.questionIndex];
    const total = this.currentQuest.puzzles.length;

    // Shuffle words for puzzle
    const shuffledWords = [...puzzle.words].sort(() => Math.random() - 0.5);
    const selectedWords = [];

    this.content.innerHTML = `
      <div class="minigame-card">
        <div class="minigame-header">
          <span class="category-tag">${this.currentQuest.categoryBadge}</span>
          <span class="step-tracker">Kalimat ${this.questionIndex + 1} / ${total}</span>
        </div>

        <h3 class="minigame-prompt">${puzzle.instruction}</h3>

        <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 6px;">
          ⬇️ Kalimat yang sedang disusun (Klik kata untuk menghapus):
        </div>
        <div id="sentence-dropzone" class="sentence-builder-dropzone"></div>

        <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 6px;">
          🧩 Kotak Kata Tersedia (Klik kata untuk menambahkan):
        </div>
        <div id="sentence-pool" class="sentence-builder-pool"></div>

        <div style="display: flex; gap: 12px; margin-top: 14px;">
          <button id="btn-check-sentence" class="btn btn-primary" style="flex: 1;">Periksa Kalimat 📝</button>
        </div>

        <div id="sentence-feedback" class="hidden"></div>
      </div>
    `;

    const poolElem = document.getElementById('sentence-pool');
    const dropElem = document.getElementById('sentence-dropzone');
    const checkBtn = document.getElementById('btn-check-sentence');

    const renderChips = () => {
      poolElem.innerHTML = '';
      shuffledWords.forEach((word, index) => {
        const chip = document.createElement('span');
        chip.className = 'word-chip';
        chip.textContent = word;
        chip.onclick = () => {
          sounds.playClick();
          shuffledWords.splice(index, 1);
          selectedWords.push(word);
          renderChips();
        };
        poolElem.appendChild(chip);
      });

      dropElem.innerHTML = '';
      if (selectedWords.length === 0) {
        dropElem.innerHTML = '<span style="color: #64748b; font-size: 0.9rem; margin: auto;">Klik kata di bawah untuk menyusun kalimat</span>';
      } else {
        selectedWords.forEach((word, index) => {
          const chip = document.createElement('span');
          chip.className = 'word-chip';
          chip.style.background = '#4338ca';
          chip.textContent = word;
          chip.onclick = () => {
            sounds.playClick();
            selectedWords.splice(index, 1);
            shuffledWords.push(word);
            renderChips();
          };
          dropElem.appendChild(chip);
        });
      }
    };

    renderChips();

    checkBtn.addEventListener('click', () => {
      const userSentence = selectedWords.join(' ');
      const isCorrect = userSentence.trim().toLowerCase() === puzzle.targetSentence.trim().toLowerCase();

      if (isCorrect) {
        this.score++;
        sounds.playCorrect();
      } else {
        sounds.playWrong();
      }

      checkBtn.disabled = true;

      const feedback = document.getElementById('sentence-feedback');
      feedback.className = `feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;
      feedback.innerHTML = `
        <div class="feedback-title">${isCorrect ? '🎉 Kalimat Efektif dan Tepat!' : '❌ Susunan Belum Tepat!'}</div>
        <p><strong>Susunan yang tepat:</strong> "${puzzle.targetSentence}"</p>
        <p style="font-size: 0.85rem; margin-top: 4px;">${puzzle.explanation}</p>
        <div style="margin-top: 14px; text-align: right;">
          <button id="btn-next-puzzle" class="btn btn-primary">
            ${this.questionIndex < this.currentQuest.puzzles.length - 1 ? 'Kalimat Berikutnya ➔' : 'Selesaikan Misi 🏆'}
          </button>
        </div>
      `;

      document.getElementById('btn-next-puzzle').addEventListener('click', () => {
        sounds.playClick();
        this.questionIndex++;
        if (this.questionIndex < this.currentQuest.puzzles.length) {
          this.renderSentencePuzzle();
        } else {
          this.showFinalResult();
        }
      });
    });
  }

  // ==================== HASIL AKHIR MINIGAME ====================
  showFinalResult() {
    sounds.playFanfare();

    this.content.innerHTML = `
      <div class="minigame-card" style="text-align: center;">
        <div style="font-size: 3rem; margin-bottom: 12px;">🌟</div>
        <h2 style="font-family: var(--font-heading); font-size: 1.6rem; color: #38bdf8; margin-bottom: 10px;">
          Misi Berhasil Diselesaikan!
        </h2>
        <p style="color: #cbd5e1; margin-bottom: 20px;">
          Hebat! Anda telah menyelesaikan seluruh tantangan dari <strong>${this.currentQuest.npc.name}</strong>.
        </p>
        <div style="background: rgba(15, 23, 42, 0.7); padding: 16px; border-radius: 14px; margin-bottom: 24px;">
          <span style="color: #94a3b8; font-size: 0.9rem;">Skor Penguasaan Literasi:</span><br>
          <strong style="font-size: 1.4rem; color: #34d399;">${this.score} Poin Sempurna</strong>
        </div>
        <button id="btn-finish-minigame" class="btn btn-primary" style="width: 100%; padding: 16px;">
          Kembali Menjelajah Kota 🏙️
        </button>
      </div>
    `;

    document.getElementById('btn-finish-minigame').addEventListener('click', () => {
      sounds.playClick();
      this.close();
      this.onCompleteCallback(this.currentQuest);
    });
  }
}
