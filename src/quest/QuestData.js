// QuestData.js - Data lengkap 9 Misi Edukasi Bahasa Indonesia & Literasi Digital
export const QUEST_DATA = [
  // ==================== KATEGORI 1: KATA BAKU VS TIDAK BAKU (KBBI) ====================
  {
    id: 1,
    category: 'Kata Baku (KBBI)',
    categoryBadge: '📚 Kategori 1: Kata Baku',
    title: 'Apotek atau Apotik?',
    npc: {
      name: 'Bu Rahma',
      role: 'Pustakawan Kota',
      emoji: '🧑‍🏫',
      shirtColor: 0xec4899, // Pink
      pantsColor: 0x312e81,
      pos: { x: -44, z: -38 }
    },
    introDialogue: 'Halo anak muda! Di perpustakaan kota ini kita selalu menjunjung tinggi penggunaan ejaan baku sesuai KBBI. Bisakah kamu membantuku memilah kata baku yang tepat?',
    completedDialogue: 'Terima kasih banyak! Pengetahuan kata bakumu sangat tajam. Terus lestarikan bahasa Indonesia yang baik dan benar ya!',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: 'Mana bentuk penulisan tempat penjualan obat yang baku menurut KBBI?',
        options: ['Apotek', 'Apotik'],
        correctIndex: 0,
        explanation: 'Bentuk baku adalah APOTEK (serapan dari bahasa Belanda "apotheek"). Ahlinya disebut "Apoteker".'
      },
      {
        prompt: 'Pilihlah bentuk kata kerja baku di bawah ini:',
        options: ['Praktek', 'Praktik'],
        correctIndex: 1,
        explanation: 'Bentuk baku menurut KBBI adalah PRAKTIK, turunannya menjadi "Praktikum" dan "Praktisi".'
      },
      {
        prompt: 'Saat menunggu giliran loket perpustakaan, kita harus tertib...',
        options: ['Antre', 'Antri'],
        correctIndex: 0,
        explanation: 'Kata baku yang tepat adalah ANTRE (kata turunan: "mengantre", bukan "mengantri").'
      }
    ]
  },
  {
    id: 2,
    category: 'Kata Baku (KBBI)',
    categoryBadge: '📚 Kategori 1: Kata Baku',
    title: 'Koreksi Spanduk Kota',
    npc: {
      name: 'Pak Budi',
      role: 'Arsitek Tata Kota',
      emoji: '👷‍♂️',
      shirtColor: 0xf59e0b, // Amber
      pantsColor: 0x1f2937,
      pos: { x: 44, z: -38 }
    },
    introDialogue: 'Wah kebetulan sekali! Saya sedang mengecek papan reklame dan pengumuman di sudut kota. Banyak yang salah eja nih. Mau bantu cek?',
    completedDialogue: 'Luar biasa! Sekarang plang nama dan reklame di kota kita sudah menggunakan tata kata baku yang terpercaya.',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: 'Papan nama kantor: "Pusat Penelitian dan ... Lingkungan Hidup"',
        options: ['Analisa', 'Analisis'],
        correctIndex: 1,
        explanation: 'Bentuk baku dalam KBBI adalah ANALISIS (diserap dari bahasa Inggris "analysis").'
      },
      {
        prompt: 'Spanduk imbauan: "Menjaga kebersihan taman adalah ... kita bersama."',
        options: ['Tanggung Jawab', 'Tanggungjawab'],
        correctIndex: 0,
        explanation: 'Penulisan gabungan kata dasar dipisah: TANGGUNG JAWAB (kecuali mendapat imbuhan gabung sekaligus: "pertanggungjawaban").'
      },
      {
        prompt: 'Tanda pengenal: "Surat bukti kelulusan / ... resmi sekolah"',
        options: ['Ijazah', 'Ijasah'],
        correctIndex: 0,
        explanation: 'Ejaan yang sesuai dengan KBBI adalah IJAZAH menggunakan huruf "z".'
      }
    ]
  },
  {
    id: 3,
    category: 'Kata Baku (KBBI)',
    categoryBadge: '📚 Kategori 1: Kata Baku',
    title: 'Serapan Kata Modern',
    npc: {
      name: 'Dedi',
      role: 'Siswa Peneliti Muda',
      emoji: '🎒',
      shirtColor: 0x3b82f6, // Blue
      pantsColor: 0x1e293b,
      pos: { x: -44, z: 38 }
    },
    introDialogue: 'Hai teman! Aku sedang merapikan makalah ilmiah. Banyak kata serapan yang ragu-ragu nih ejaannya. Bisakah kita diskusikan bersama?',
    completedDialogue: 'Keren banget! Makalah ilmiahku sekarang siap dikumpulkan tanpa salah eja kata serapan.',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: 'Mana penulisan kata turunan serapan yang benar?',
        options: ['Aktivitas', 'Aktifitas'],
        correctIndex: 0,
        explanation: 'Kata dasarnya "aktif", tetapi jika mendapat sufiks "-itas", huruf "f" berubah menjadi "v": AKTIVITAS.'
      },
      {
        prompt: 'Kata serapan untuk jadwal kegiatan acara:',
        options: ['Jadual', 'Jadwal'],
        correctIndex: 1,
        explanation: 'Bentuk baku menurut KBBI adalah JADWAL (bukan jadual).'
      },
      {
        prompt: 'Penulisan kata untuk menggambarkan hal yang sungguh-sungguh:',
        options: ['Sekadar', 'Sekedar'],
        correctIndex: 0,
        explanation: 'Bentuk bakunya adalah SEKADAR (karena kata dasarnya "kadar", bukan "kedar").'
      }
    ]
  },

  // ==================== KATEGORI 2: DETEKSI HOAKS & LITERASI DIGITAL ====================
  {
    id: 4,
    category: 'Deteksi Hoaks',
    categoryBadge: '🛡️ Kategori 2: Deteksi Hoaks',
    title: 'Analisis Headline Viral',
    npc: {
      name: 'Citra',
      role: 'Jurnalis Investigasi',
      emoji: '👩‍💻',
      shirtColor: 0x06b6d4, // Cyan
      pantsColor: 0x0f172a,
      pos: { x: 44, z: 42 }
    },
    introDialogue: 'Halo! Era media sosial dipenuhi arus berita cepat, tapi banyak yang hoaks atau clickbait provokatif. Sebagai calon netizen cerdas, ayo uji kepekaanmu!',
    completedDialogue: 'Tajam sekali analisismu! Kamu tidak mudah termakan judul heboh atau kabar burung di lini masa!',
    isCompleted: false,
    minigameType: 'HOAX_DETECTOR',
    questions: [
      {
        headline: 'VIRAL & MENGHEBOHKAN! Makan Buah Ini Langsung Menyembuhkan Semua Penyakit Jantung dalam 1 Jam!',
        source: 'Pesan Teruskan Grup Media Sosial Tanpa Nama Penulis',
        clues: [
          'Judul provokatif & menggunakan huruf kapital berlebih',
          'Klaim medis instan tanpa rujukan jurnal kesehatan atau Kemenkes',
          'Tidak mencantumkan narasumber dokter spesialis yang jelas'
        ],
        isHoax: true,
        explanation: 'Klaim ini adalah HOAKS. Informasi medis tidak pernah menjanjikan kesembuhan instan tanpa uji klinis dan verifikasi ilmiah.'
      },
      {
        headline: 'Kementerian Pendidikan Merilis Jadwal Resmi Libur Sekolah Semester Ganjil 2026',
        source: 'Portal Resmi Kemendikbudristek (kemdikbud.go.id)',
        clues: [
          'Domain terdaftar resmi (.go.id)',
          'Bahasa lugas, objektif, dan terdapat tanggal surat edaran',
          'Dikonfirmasi oleh kanal komunikasi pemerintah terverifikasi'
        ],
        isHoax: false,
        explanation: 'Ini adalah FAKTA. Sumber terpercaya dari domain resmi pemerintah (.go.id).'
      },
      {
        headline: 'Segera Bagikan Pesan Ini ke 10 Teman Anda untuk Mencegah Akun WhatsApp Ditutup Nanti Malam!',
        source: 'Pesan Berantai Tidak Jelas Asal-usulnya',
        clues: [
          'Taktik menebar rasa takut (fear-mongering)',
          'Meminta penerima menyebarkan ulang (chain message)',
          'Tidak ada pengumuman di blog resmi WhatsApp / Meta'
        ],
        isHoax: true,
        explanation: 'Pemberitahuan ini adalah HOAKS klasik tipe pesan berantai berulang untuk menakut-nakuti pengguna.'
      }
    ]
  },
  {
    id: 5,
    category: 'Deteksi Hoaks',
    categoryBadge: '🛡️ Kategori 2: Deteksi Hoaks',
    title: 'Waspada Phishing & Tautan Palsu',
    npc: {
      name: 'Pak RT Joko',
      role: 'Ketua RW Peduli Keamanan',
      emoji: '👮‍♂️',
      shirtColor: 0x10b981, // Emerald
      pantsColor: 0x1e293b,
      pos: { x: -14, z: -55 }
    },
    introDialogue: 'Selamat siang anak muda! Akhir-akhir ini banyak warga melapor menerima pesan hadiah undian jutaan rupiah lewat SMS/WA. Bisakah kamu memilah mana yang resmi dan mana jebakan?',
    completedDialogue: 'Mantap! Sekarang warga kita makin aman dari jeratan modus phishing dan pencurian data pribadi!',
    isCompleted: false,
    minigameType: 'HOAX_DETECTOR',
    questions: [
      {
        headline: 'Selamat! Nomor Anda terpilih memenangkan saldo 100 Juta. Klik link: bit.ly/dana-kaget-gratis-klaim sekarang juga!',
        source: 'SMS dari nomor pribadi tak dikenal (+628xxxx)',
        clues: [
          'Menggunakan shortlink yang menyembunyikan alamat asli',
          'Meminta klik tautan mencurigakan untuk mencuri kredensial (phishing)',
          'Nomor pengirim bukan nomor resmi (masking id) institusi'
        ],
        isHoax: true,
        explanation: 'Ini adalah HOAKS / PHISHING. Jangan pernah klik tautan undian dari nomor tak dikenal yang meminta data login.'
      },
      {
        headline: 'Bank Sentral Mengingatkan Warga untuk Menjaga Kerahasiaan Kode OTP dan PIN Rekening',
        source: 'Kanal Edukasi Publik Bank Indonesia (bi.go.id)',
        clues: [
          'Edukasi literasi keuangan tanpa meminta data nasabah',
          'Sesuai dengan standar keamanan perbankan resmi',
          'Tidak ada iming-iming hadiah atau ancaman pemblokiran'
        ],
        isHoax: false,
        explanation: 'Ini FAKTA. Bank resmi tidak pernah meminta kode OTP atau PIN pribadi kepada nasabah.'
      }
    ]
  },
  {
    id: 6,
    category: 'Deteksi Hoaks',
    categoryBadge: '🛡️ Kategori 2: Deteksi Hoaks',
    title: 'Konteks Foto & Deepfake',
    npc: {
      name: 'Nina',
      role: 'Kreator Konten Digital',
      emoji: '🎨',
      shirtColor: 0x8b5cf6, // Violet
      pantsColor: 0x334155,
      pos: { x: 14, z: 55 }
    },
    introDialogue: 'Hai! Sebagai pembuat konten visual, aku sering mendapati gambar yang dipotong konteksnya (*misleading context*) hingga foto buatan AI. Ayo latih ketelitianmu!',
    completedDialogue: 'Kemampuan verifikasi visualmu top banget! Selalu lakukan reverse image search ya sebelum menyebarkan foto viral!',
    isCompleted: false,
    minigameType: 'HOAX_DETECTOR',
    questions: [
      {
        headline: 'Geger! Ditemukan Kota Emas Kuno di Dasar Laut Indonesia dengan Gedung Utuh Berkilau!',
        source: 'Unggahan TikTok dengan Foto Hasil Generator AI (Tampak Sangat Halus & Simetris Ganjil)',
        clues: [
          'Tekstur gambar terlihat tidak natural, pencahayaan terlalu fantastis',
          'Tidak ada catatan dari arkeolog atau ekspedisi riset bawah air BRIN',
          'Gambar identik dengan hasil prompt software AI Art'
        ],
        isHoax: true,
        explanation: 'Ini HOAKS visual (manipulasi AI). Penemuan situs purbakala wajib melalui verifikasi arkeolog resmi.'
      },
      {
        headline: 'Ilmuwan Mengembangkan Robot Penyelam untuk Memetakan Terumbu Karang Nusantara',
        source: 'Portal Berita Iptek Nasional & Akun Riset Kampus',
        clues: [
          'Foto memperlihatkan purwarupa dengan logo universitas/BRIN',
          'Mencantumkan nama ketua tim riset dan publikasi jurnal',
          'Memiliki rekam jejak riset yang dapat diverifikasi'
        ],
        isHoax: false,
        explanation: 'Ini adalah FAKTA berbasis liputan perkembangan sains dan teknologi.'
      }
    ]
  },

  // ==================== KATEGORI 3: KALIMAT EFEKTIF & PEMAHAMAN ====================
  {
    id: 7,
    category: 'Kalimat Efektif',
    categoryBadge: '✍️ Kategori 3: Kalimat Efektif',
    title: 'Susun Struktur SPOK',
    npc: {
      name: 'Bu Ratna',
      role: 'Guru Bahasa Indonesia',
      emoji: '👩‍🏫',
      shirtColor: 0x14b8a6, // Teal
      pantsColor: 0x111827,
      pos: { x: -55, z: -14 }
    },
    introDialogue: 'Selamat datang di area sekolah! Kalimat yang baik memiliki struktur yang jelas (Subjek, Predikat, Objek, Keterangan). Mari bantu murid-murid menyusun kalimat efektif!',
    completedDialogue: 'Hebat! Kalimat yang kamu susun mengalir dengan sangat rapi, jelas, dan mudah dipahami.',
    isCompleted: false,
    minigameType: 'SENTENCE_BUILDER',
    puzzles: [
      {
        instruction: 'Susun kata-kata berikut menjadi kalimat efektif yang benar:',
        words: ['Siswa', 'membaca', 'buku', 'di', 'perpustakaan'],
        targetSentence: 'Siswa membaca buku di perpustakaan',
        explanation: 'Subjek: Siswa, Predikat: membaca, Objek: buku, Keterangan tempat: di perpustakaan.'
      },
      {
        instruction: 'Susun kalimat imbauan tata tertib kota:',
        words: ['Warga', 'membuang', 'sampah', 'pada', 'tempatnya'],
        targetSentence: 'Warga membuang sampah pada tempatnya',
        explanation: 'Kalimat berstruktur lugas tanpa ada kata yang bertele-tele.'
      }
    ]
  },
  {
    id: 8,
    category: 'Kalimat Efektif',
    categoryBadge: '✍️ Kategori 3: Kalimat Efektif',
    title: 'Pangkas Kata Mubazir',
    npc: {
      name: 'Andi',
      role: 'Penulis Novel',
      emoji: '🖋️',
      shirtColor: 0xe11d48, // Rose
      pantsColor: 0x1e1b4b,
      pos: { x: 55, z: 14 }
    },
    introDialogue: 'Halo kawan! Sering kali kita tanpa sadar menggunakan kata-kata boros seperti "sangat amat indah sekali". Di draf naskahku, bantu aku memilih kalimat yang paling hemat dan efektif!',
    completedDialogue: 'Karya tulis yang efektif terasa jauh lebih hidup dan bertenaga! Terima kasih banyak atas bantuanmu!',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: 'Pilihlah kalimat yang TIDAK mengandung pemborosan kata (mubazir):',
        options: [
          'Pemandangan matahari terbenam itu sangat indah sekali.',
          'Pemandangan matahari terbenam itu sangat indah.'
        ],
        correctIndex: 1,
        explanation: 'Penggunaan kata "sangat" dan "sekali" secara bersamaan merupakan bentuk redundansi (pemborosan kata).'
      },
      {
        prompt: 'Mana kalimat yang paling efektif saat mengumumkan pertemuan?',
        options: [
          'Bapak-bapak dan ibu-ibu sekalian diharapkan hadir tepat waktu.',
          'Para hadirin diharapkan hadir tepat waktu.'
        ],
        correctIndex: 1,
        explanation: '"Hadirin" sudah bermakna jamak (semua orang yang hadir), sehingga tidak perlu ditambahi "para bapak-bapak sekalian".'
      },
      {
        prompt: 'Pilihlah kalimat yang logis dan efisien:',
        options: [
          'Demi untuk menjaga kesehatan, kita harus rajin berolahraga.',
          'Demi menjaga kesehatan, kita harus rajin berolahraga.'
        ],
        correctIndex: 1,
        explanation: 'Kata "demi" dan "untuk" mempunyai arti yang sama. Cukup gunakan salah satu saja.'
      }
    ]
  },
  {
    id: 9,
    category: 'Kalimat Efektif',
    categoryBadge: '✍️ Kategori 3: Kalimat Efektif',
    title: 'Konjungsi Paragraf Logis',
    npc: {
      name: 'Maya',
      role: 'Podcaster & Penyiar Radio',
      emoji: '🎙️',
      shirtColor: 0x6366f1, // Indigo
      pantsColor: 0x0f172a,
      pos: { x: 0, z: -14 } // Panggung Alun-Alun Pusat
    },
    introDialogue: 'Hai petualang kota! Di siaran radio sore ini, aku ingin menyampaikan pesan edukasi untuk para pendengar. Bantu aku memilih kata sambung (konjungsi) yang tepat agar alurnya runtut ya!',
    completedDialogue: 'Wah, luar biasa! 9 Misi Kota Cerdas telah kamu tuntaskan dengan sempurna! Kamu resmi dinobatkan sebagai Duta Literasi Kota Cerdas!',
    isCompleted: false,
    minigameType: 'VOCAB_CHOICE',
    questions: [
      {
        prompt: '"Hujan lebat mengguyur kota sejak pagi, [...] acara festival literasi tetap berlangsung meriah."',
        options: ['namun', 'sehingga'],
        correctIndex: 0,
        explanation: 'Konjungsi "namun" menyatakan hubungan pertentangan yang tepat antarkalimat.'
      },
      {
        prompt: '"Kita harus memverifikasi setiap informasi digital [...] terhindar dari bahaya hoaks."',
        options: ['agar', 'padahal'],
        correctIndex: 0,
        explanation: 'Konjungsi "agar" (atau "supaya") menyatakan hubungan tujuan/maksud.'
      },
      {
        prompt: '"Rudi rajin membaca buku setiap hari, [...] wawasannya semakin luas."',
        options: ['sehingga', 'melainkan'],
        correctIndex: 0,
        explanation: 'Konjungsi "sehingga" menyatakan hubungan akibat/konsekuensi logis dari rajin membaca.'
      }
    ]
  }
];
