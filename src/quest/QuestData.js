// QuestData.js - Data lengkap 9 Misi Edukasi Bahasa Indonesia & Literasi Digital
export const QUEST_DATA = [
  // ==================== KATEGORI 1: KATA BAKU VS TIDAK BAKU (KBBI) ====================
  {
    id: 1,
    category: 'Japanese Greetings',
    categoryBadge: '🌸 Kategori 1: Greetings',
    title: 'Basic Greetings',
    npc: {
      name: 'Sensei',
      role: 'Guru Bahasa',
      emoji: '🧑‍🏫',
      shirtColor: 0x1e3a5f, // Navy
      pantsColor: 0x0f172a,
      pos: { x: -42, z: -55 } // Outside east face
    },
    introDialogue: 'こんにちは！ (Konnichiwa!) Let\'s learn some basic Japanese greetings. Can you recognize these words?',
    completedDialogue: 'Subarashii! (Luar biasa!) You have mastered the basic greetings. Keep exploring and learning!',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: '「こんにちは」 (Konnichiwa) means...',
        options: ['Good evening', 'Thank you', 'Hello', 'Good night'],
        correctIndex: 2,
        explanation: 'こんにちは (Konnichiwa) adalah salam umum yang berarti "Halo" atau "Selamat siang".'
      },
      {
        prompt: '「ありがとう」 (Arigatou) means...',
        options: ['Good morning', 'Thank you', 'Sorry', 'Goodbye'],
        correctIndex: 1,
        explanation: 'ありがとう (Arigatou) berarti "Terima kasih".'
      },
      {
        prompt: '「おはよう」 (Ohayou) means...',
        options: ['Good morning', 'Good night', 'Hello', 'Excuse me'],
        correctIndex: 0,
        explanation: 'おはよう (Ohayou) berarti "Selamat pagi".'
      }
    ]
  },
  {
    id: 2,
    category: 'Japanese Numbers',
    categoryBadge: '🏪 Kategori 2: Numbers',
    title: 'Numbers & Shopping',
    npc: {
      name: 'Kenji',
      role: 'Konbini Clerk',
      emoji: '💁',
      shirtColor: 0x16a34a, // Green (Konbini theme)
      pantsColor: 0x1f2937,
      pos: { x: 82, z: -10 } // Safe on Konbini pedestrian frontage
    },
    introDialogue: 'いらっしゃいませ！ (Irasshaimase!) Welcome! Knowing numbers is essential for shopping. Can you help me review these basic numbers?',
    completedDialogue: 'Perfect! You are now ready to shop in Japan. Let me know if you need anything else!',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: '「いち」 (Ichi) means...',
        options: ['1', '2', '3', '4'],
        correctIndex: 0,
        explanation: 'いち (Ichi) berarti angka "1".'
      },
      {
        prompt: '「さん」 (San) means...',
        options: ['2', '3', '4', '5'],
        correctIndex: 1,
        explanation: 'さん (San) berarti angka "3".'
      },
      {
        prompt: '「ご」 (Go) means...',
        options: ['4', '5', '6', '7'],
        correctIndex: 1,
        explanation: 'ご (Go) berarti angka "5".'
      }
    ]
  },
  {
    id: 3,
    category: 'Japanese Characters',
    categoryBadge: '✏️ Kategori 3: Hiragana',
    title: 'Hiragana Basics',
    npc: {
      name: 'Senpai',
      role: 'Tutor Senior',
      emoji: '🎒',
      shirtColor: 0x3b82f6, // Blue
      pantsColor: 0x1e293b,
      pos: { x: -36, z: -48 } // Education district approach
    },
    introDialogue: 'こんにちは！ To read Japanese, you must know Hiragana. Let\'s start with some basic characters (a, i, u, ka, ko). Can you read them?',
    completedDialogue: 'Yatta! You read them perfectly. Keep practicing Hiragana every day!',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: '「あ」 dibaca...',
        options: ['a', 'i', 'u', 'e'],
        correctIndex: 0,
        explanation: '「あ」 dibaca "a".'
      },
      {
        prompt: '「い」 dibaca...',
        options: ['a', 'i', 'u', 'e'],
        correctIndex: 1,
        explanation: '「い」 dibaca "i".'
      },
      {
        prompt: '「う」 dibaca...',
        options: ['o', 'e', 'u', 'a'],
        correctIndex: 2,
        explanation: '「う」 dibaca "u".'
      },
      {
        prompt: '「か」 dibaca...',
        options: ['ki', 'ku', 'ko', 'ka'],
        correctIndex: 3,
        explanation: '「か」 dibaca "ka".'
      },
      {
        prompt: '「こ」 dibaca...',
        options: ['ko', 'ke', 'ka', 'ku'],
        correctIndex: 0,
        explanation: '「こ」 dibaca "ko".'
      }
    ]
  },

  {
    id: 4,
    category: 'Japanese Vocabulary',
    categoryBadge: '📖 Kategori 4: Vocab',
    title: 'Everyday Vocabulary',
    npc: {
      name: 'Haruka',
      role: 'Tour Guide',
      emoji: '👩‍💼',
      shirtColor: 0x06b6d4, // Cyan
      pantsColor: 0x0f172a,
      pos: { x: 10, z: -130 } // Tokyo Station Plaza
    },
    introDialogue: 'ようこそ！ (Welcome!) As you explore the city, you\'ll need to know everyday words. Let\'s practice some essential vocabulary!',
    completedDialogue: 'Subarashii! Now you can easily find water, food, and important places in the city.',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: '「みず」 (Mizu) means...',
        options: ['Food', 'Water', 'Tea', 'Coffee'],
        correctIndex: 1,
        explanation: 'みず (Mizu) berarti "Air".'
      },
      {
        prompt: '「たべもの」 (Tabemono) means...',
        options: ['Drink', 'Food', 'Snack', 'Bento'],
        correctIndex: 1,
        explanation: 'たべもの (Tabemono) berarti "Makanan".'
      },
      {
        prompt: '「ほん」 (Hon) means...',
        options: ['Magazine', 'Newspaper', 'Book', 'Comic'],
        correctIndex: 2,
        explanation: 'ほん (Hon) berarti "Buku".'
      },
      {
        prompt: '「がっこう」 (Gakkou) means...',
        options: ['School', 'Station', 'Hospital', 'Park'],
        correctIndex: 0,
        explanation: 'がっこう (Gakkou) berarti "Sekolah".'
      },
      {
        prompt: '「えき」 (Eki) means...',
        options: ['Airport', 'Bus Stop', 'Station', 'Port'],
        correctIndex: 2,
        explanation: 'えき (Eki) berarti "Stasiun".'
      }
    ]
  },
  {
    id: 5,
    category: 'Sentence Building',
    categoryBadge: '🧩 Kategori 5: Sentence',
    title: 'Build Your First Japanese Sentences',
    npc: {
      name: 'Akira',
      role: 'Local Guide',
      emoji: '🗣️',
      shirtColor: 0x10b981, // Emerald
      pantsColor: 0x1e293b,
      pos: { x: -16, z: -16 } // Safe on NW sidewalk, away from props
    },
    introDialogue: 'こんにちは！ To communicate effectively, we must construct sentences. Let\'s practice some basic Japanese sentence structures (Subject-Object-Verb).',
    completedDialogue: 'Yatta! You successfully built Japanese sentences. You are getting really good at this!',
    isCompleted: false,
    minigameType: 'SENTENCE_BUILDER',
    puzzles: [
      {
        instruction: 'Meaning: "I am a student."',
        words: ['わたしは', 'がくせいです。'],
        targetSentence: 'わたしは がくせいです。',
        explanation: 'Dalam bahasa Jepang, pola kalimat sederhana adalah Topik + は (wa) + Keterangan/Predikat + です (desu).'
      },
      {
        instruction: 'Meaning: "I drink water."',
        words: ['わたしは', 'みずを', 'のみます。'],
        targetSentence: 'わたしは みずを のみます。',
        explanation: 'Pola kalimat dasar dengan kata kerja: Topik + は + Objek + を (o) + Kata Kerja (Verb).'
      },
      {
        instruction: 'Meaning: "I go to school."',
        words: ['わたしは', 'がっこうへ', 'いきます。'],
        targetSentence: 'わたしは がっこうへ いきます。',
        explanation: 'Pola kalimat arah: Topik + は + Tempat + へ (e) + Kata Kerja Pindah (Pergi/Datang/Pulang).'
      }
    ]
  },
  {
    id: 6,
    category: 'Culture & Etiquette',
    categoryBadge: '🎎 Kategori 6: Budaya',
    title: 'Japanese Culture & Etiquette',
    npc: {
      name: 'Yuki',
      role: 'Duta Budaya',
      emoji: '👘',
      shirtColor: 0x8b5cf6, // Violet
      pantsColor: 0x334155,
      pos: { x: 18, z: -14 } // Safe on NE sidewalk, outside QFRONT building
    },
    introDialogue: 'Konnichiwa! Memahami bahasa juga berarti memahami budayanya. Mari kita uji pengetahuanmu tentang kebiasaan dan etika sederhana di Jepang!',
    completedDialogue: 'Luar biasa! Pengetahuan budayamu sangat baik. Teruslah belajar untuk menghargai keindahan etika Jepang!',
    isCompleted: false,
    minigameType: 'HOAX_DETECTOR',
    questions: [
      {
        headline: 'Di Jepang, membungkuk (ojigi) dapat digunakan sebagai bentuk salam, terima kasih, atau permohonan maaf.',
        source: 'Pengamatan Etika Sehari-hari',
        clues: [
          'Merupakan bentuk penghormatan',
          'Sering terlihat di berbagai situasi sosial',
          'Memiliki beberapa tingkat kedalaman sesuai tingkat hormat'
        ],
        isHoax: false,
        explanation: 'Ini adalah FAKTA. Membungkuk adalah bagian fundamental dari etika Jepang.'
      },
      {
        headline: 'Membuang sampah sembarangan di jalan merupakan kebiasaan yang dianjurkan di Jepang.',
        source: 'Mitos atau Gosip Turis',
        clues: [
          'Jalanan di Jepang terkenal sangat bersih',
          'Warga terbiasa membawa kembali sampah mereka ke rumah',
          'Terdapat aturan pemilahan sampah yang ketat'
        ],
        isHoax: true,
        explanation: 'Ini adalah MISKONSEPSI (HOAKS). Membuang sampah sembarangan sangat dilarang dan tidak sesuai dengan budaya kedisiplinan di Jepang.'
      },
      {
        headline: 'Melepas sepatu sebelum memasuki rumah atau tempat-tempat tradisional tertentu adalah kebiasaan wajib di Jepang.',
        source: 'Etika Masuk Rumah (Genkan)',
        clues: [
          'Terdapat area khusus (genkan) untuk melepas sepatu',
          'Membantu menjaga kebersihan bagian dalam ruangan',
          'Sering dijumpai di kuil, ryokan, atau rumah pribadi'
        ],
        isHoax: false,
        explanation: 'Ini adalah FAKTA. Melepas sepatu sebelum masuk ke dalam rumah adalah etika yang sangat dijaga di Jepang.'
      },
      {
        headline: 'Berbicara sangat keras dan mengangkat telepon di dalam kereta merupakan perilaku yang dianjurkan.',
        source: 'Perilaku yang Sering Dilarang',
        clues: [
          'Terdapat papan pengumuman untuk me-mode heningkan ponsel',
          'Penumpang umumnya membaca atau tidur dengan tenang',
          'Mengganggu kenyamanan penumpang lain'
        ],
        isHoax: true,
        explanation: 'Ini adalah MISKONSEPSI (HOAKS). Berbicara keras atau menelepon di kereta dianggap sangat tidak sopan.'
      },
      {
        headline: 'Mengantre dengan tertib untuk masuk ke dalam kereta atau saat berbelanja merupakan hal yang umum.',
        source: 'Budaya Disiplin Publik',
        clues: [
          'Terdapat garis panduan antrean di stasiun',
          'Warga menunggu giliran dengan sabar',
          'Sangat dihormati sebagai bentuk keteraturan'
        ],
        isHoax: false,
        explanation: 'Ini adalah FAKTA. Budaya antre (disiplin) adalah salah satu ciri khas yang sangat dipegang teguh oleh masyarakat Jepang.'
      }
    ]
  },

  {
    id: 7,
    category: 'Daily Conversation',
    categoryBadge: '💬 Kategori 7: Conversation',
    title: 'Daily Conversation',
    npc: {
      name: 'Aiko',
      role: 'Shop Regular',
      emoji: '🙋',
      shirtColor: 0xf43f5e, // Rose
      pantsColor: 0x0f172a,
      pos: { x: 96, z: -10 } // Commercial district, near Bakery
    },
    introDialogue: 'Konnichiwa! Ready to chat? Let\'s practice some simple daily conversation phrases that you\'ll hear everywhere in Japan.',
    completedDialogue: 'Subarashii! Now you can easily respond in basic daily conversations. Keep up the good work!',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: '「お元気ですか？」 (Ogenki desu ka?) berarti...',
        options: ['How are you?', 'Thank you', 'Excuse me', 'Good morning'],
        correctIndex: 0,
        explanation: '「お元気ですか？」 (Ogenki desu ka?) adalah ungkapan untuk menanyakan "Apa kabar?".'
      },
      {
        prompt: '「はい」 (Hai) berarti...',
        options: ['No', 'Maybe', 'Yes', 'Wait'],
        correctIndex: 2,
        explanation: '「はい」 (Hai) berarti "Ya / Yes".'
      },
      {
        prompt: '「いいえ」 (Iie) berarti...',
        options: ['Yes', 'No', 'Thank you', 'Sorry'],
        correctIndex: 1,
        explanation: '「いいえ」 (Iie) berarti "Tidak / No".'
      },
      {
        prompt: '「すみません」 (Sumimasen) berarti...',
        options: ['Good night', 'Goodbye', 'Excuse me / Sorry', 'Hello'],
        correctIndex: 2,
        explanation: '「すみません」 (Sumimasen) dapat berarti "Permisi" atau "Maaf" tergantung konteks.'
      },
      {
        prompt: '「またね」 (Mata ne) berarti...',
        options: ['Hello', 'See you', 'Thank you', 'Yes'],
        correctIndex: 1,
        explanation: '「またね」 (Mata ne) adalah ungkapan kasual yang berarti "Sampai jumpa / See you".'
      }
    ]
  },
  {
    id: 8,
    category: 'Situational Japanese',
    categoryBadge: '🗣️ Kategori 8: Situations',
    title: 'Situational Japanese',
    npc: {
      name: 'Takeshi',
      role: 'Commuter',
      emoji: '💼',
      shirtColor: 0xe11d48, // Rose
      pantsColor: 0x1e1b4b,
      pos: { x: -10, z: -130 } // Tokyo Station Plaza
    },
    introDialogue: 'Konnichiwa! When you are out and about in Japan, being able to express yourself is very useful. Let\'s practice constructing sentences for real-life situations!',
    completedDialogue: 'Yatta! You can now express your needs and ask questions clearly. Have a safe trip!',
    isCompleted: false,
    minigameType: 'SENTENCE_BUILDER',
    puzzles: [
      {
        instruction: 'Meaning: "Hello, I am Hanif."',
        words: ['こんにちは、', 'わたしは', 'ハニフです。'],
        targetSentence: 'こんにちは、 わたしは ハニフです。',
        explanation: 'Untuk memperkenalkan diri, gunakan sapaan lalu ikuti dengan pola: わたしは [Nama] です。'
      },
      {
        instruction: 'Meaning: "I want water."',
        words: ['みずが', 'ほしいです。'],
        targetSentence: 'みずが ほしいです。',
        explanation: 'Untuk menyatakan keinginan (benda), gunakan pola: [Benda] が ほしいです (ga hoshii desu).'
      },
      {
        instruction: 'Meaning: "Where is the station?"',
        words: ['えきは', 'どこですか？'],
        targetSentence: 'えきは どこですか？',
        explanation: 'Untuk menanyakan lokasi, gunakan pola: [Tempat] は どこですか (wa doko desu ka?).'
      }
    ]
  },
  {
    id: 9,
    category: 'Culture & Communication',
    categoryBadge: '🗣️ Kategori 9: Communication',
    title: 'Culture & Communication',
    npc: {
      name: 'Miyuki',
      role: 'Local Student',
      emoji: '⛩️',
      shirtColor: 0x6366f1, // Indigo
      pantsColor: 0x0f172a,
      pos: { x: 45, z: -45 } // Tokyo Tower / NE area approach
    },
    introDialogue: 'Konnichiwa! Sebelum tantangan komunikasi terakhirmu, mari kita pastikan kamu memahami bagaimana bahasa dan budaya saling terhubung. Ayo uji pemahamanmu!',
    completedDialogue: 'Sempurna! Kamu telah menyelesaikan semua tahap persiapan bahasa dan budaya. Kamu kini siap berkomunikasi di Jepang!',
    isCompleted: false,
    minigameType: 'HOAX_DETECTOR',
    questions: [
      {
        headline: 'Mengucapkan terima kasih dapat dilakukan dengan mengatakan 「ありがとう」 (Arigatou).',
        source: 'Kosakata Dasar',
        clues: [
          'Merupakan ungkapan sehari-hari',
          'Berlaku untuk situasi umum'
        ],
        isHoax: false,
        explanation: 'FAKTA. 「ありがとう」 adalah cara paling umum untuk mengucapkan terima kasih.'
      },
      {
        headline: '「こんにちは」 (Konnichiwa) digunakan untuk mengatakan selamat pagi.',
        source: 'Sapaan Waktu',
        clues: [
          'Diucapkan pada siang hari',
          'Bukan sapaan pertama di pagi hari'
        ],
        isHoax: true,
        explanation: 'HOAKS. 「こんにちは」 berarti Halo atau Selamat Siang. Untuk pagi hari, gunakan 「おはよう」 (Ohayou).'
      },
      {
        headline: '「すみません」 (Sumimasen) dapat digunakan untuk meminta maaf atau menarik perhatian seseorang.',
        source: 'Situasi Komunikasi',
        clues: [
          'Sangat serbaguna di Jepang',
          'Dipakai di restoran atau saat berpapasan'
        ],
        isHoax: false,
        explanation: 'FAKTA. 「すみません」 dapat berarti "Permisi" saat memanggil pelayan, atau "Maaf" secara ringan.'
      },
      {
        headline: 'Berbicara keras di kereta merupakan cara yang dianjurkan untuk berkomunikasi dengan teman.',
        source: 'Etika Publik',
        clues: [
          'Kereta sangat sepi',
          'Mengganggu penumpang lain'
        ],
        isHoax: true,
        explanation: 'HOAKS. Berbicara keras di dalam transportasi umum sangat tidak dianjurkan di Jepang.'
      },
      {
        headline: 'Memahami budaya membantu kita berkomunikasi dengan lebih baik menggunakan bahasa asing.',
        source: 'Pemahaman Lintas Budaya',
        clues: [
          'Bahasa dipengaruhi oleh kebiasaan',
          'Mencegah kesalahpahaman'
        ],
        isHoax: false,
        explanation: 'FAKTA. Bahasa adalah bagian dari budaya. Memahami konteks budaya membuat komunikasi menjadi natural dan sopan.'
      }
    ]
  }
];
