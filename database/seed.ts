import { connectToDatabase } from "./db";
import { Monk, Comment, User } from "./types";

// Combine Monk and User interfaces for seeding
type MonkUser = Monk & User;

const MONKS: MonkUser[] = [
   {
    clerkId: "seed_monk_1",
    email: "dorje@nirvana.mn",
    role: "monk",
    karma: 1000,
    meditationDays: 3650,
    totalMerits: 5000,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: { mn: "Лам Дорж", en: "Mahasiddha Dorje" },
    title: { mn: "Наран мандлаас заларсан", en: "Descended from the Sun Realm" },
    image: "https://images.unsplash.com/photo-1524230659092-07f99a75c013?q=80&w=2070&auto=format&fit=crop",
    video: "/num1.mp4",
    specialties: ["Astrology", "Sun Meditation"],
    bio: { 
      mn: "Тэрээр мянган нарны илчийг тээж явдаг. Түүнтэй уулзах нь амин хувиа хичээх үзлийн бохирдлыг шатааж арилгахтай адил юм.", 
      en: "He carries the warmth of a thousand suns. To meet him is to burn away the impurities of the ego." 
    },
    isAvailable: true,
    quote: {
      mn: "Нарны гэрэл таны оюун ухаанд гэрэлтэн, таны замыг тодруулна.",
      en: "May the light of the sun illuminate your mind and brighten your path."
    },
    yearsOfExperience: 30,
    education: {
      mn: "Сэра хийдэд Калачакра тарнийн ёсонд мэргэшсэн.",
      en: "Master of Kalachakra Tantra studies at Sera Monastery."
    },
    philosophy: {
      mn: "Гадаад ертөнцийн нар бол дотоод сэтгэлийн гэрлийн тусгал юм.",
      en: "The outer sun is merely a reflection of the inner clear light of the mind."
    },
    services: [
      { id: "natal_astrology", name: { mn: "Зурхайн зөвлөгөө", en: "Astrology Reading" }, price: 50000, duration: "45 min" },
      { id: "9star_ki", name: { mn: "Мэнгэ Голлох", en: "9-Star Ki" }, price: 25000, duration: "20 min" }
    ]
  },
  {
    clerkId: "seed_monk_2",
    email: "saruul@nirvana.mn",
    role: "monk",
    karma: 800,
    meditationDays: 2000,
    totalMerits: 3000,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: { mn: "Удган Саруул", en: "Oracle Saruul" },
    title: { mn: "Оддын нууцыг тайлагч", en: "The Weaver of Starlight" },
    image: "https://images.unsplash.com/photo-1594751543129-6701ad444259?q=80&w=2574&auto=format&fit=crop", 
    video: "/num2.mp4",
    specialties: ["Tarot", "Mirror Divination", "Ancestral Healing"],
    bio: { 
      mn: "Тэрээр харагдахгүй ертөнцтэй ярилцаж, ирээдүйн бүрхэг мананг нэвт хардаг. Түүний мэлмий оддын хэлээр уншдаг.", 
      en: "She converses with the unseen realms and pierces the veil of the future. Her eyes read the language of the stars." 
    },
    isAvailable: true,
    quote: {
      mn: "Хувь заяа бол сийлсэн чулуу биш, харин урсах мөрөн юм.",
      en: "Destiny is not carved in stone, but flowing like a river."
    },
    yearsOfExperience: 18,
    education: {
      mn: "Өвөг дээдсээс уламжлагдсан үзмэрчийн эрдэм болон Төвөдийн Мо ухаан.",
      en: "Inherited shamanic lineage and studied Tibetan Mo divination techniques."
    },
    philosophy: {
      mn: "Картууд бол далд ертөнцийн толь юм.",
      en: "The cards are but a mirror for the unseen world."
    },
    services: [
      {
        id: "tarot_reading",
        name: { mn: "Таро Мэргэ", en: "Tarot Reading" },
        price: 45000,
        duration: "40 min"
      },
      {
        id: "mirror_scrying", 
        name: { mn: "Тольдох Мэргэ", en: "Mirror Scrying" },
        price: 60000,
        duration: "50 min"
      }
    ]
  },
  {
    clerkId: "seed_monk_3",
    email: "bat@nirvana.mn",
    role: "monk",
    karma: 1200,
    meditationDays: 5000,
    totalMerits: 8000,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: { mn: "Зурхайч Бат", en: "Astrologer Bat" },
    title: { mn: "Цаг хугацааны эзэн", en: "Keeper of Time" },
    image: "https://images.unsplash.com/photo-1597175960098-b6360c7f0b99?q=80&w=2670&auto=format&fit=crop",
    video: "/num3.mp4",
    specialties: ["I Ching", "Lunar Calendar"],
    bio: { 
      mn: "Тэрээр гараг эрхсийн хөдөлгөөнийг алган дээрээ тавьсан мэт хардаг. Түүний тооцоолол алдаа мадаггүй.", 
      en: "He sees the movement of planets as clearly as lines on his palm. His calculations are flawless." 
    },
    isAvailable: false, 
    quote: {
      mn: "Зөв цагт хийсэн үйл бүтэх тавилантай.",
      en: "Action taken at the right time is destined to succeed."
    },
    yearsOfExperience: 40,
    education: {
      mn: "Гандангийн зурхайн дацанд 20 жил шавилсан.",
      en: "Studied for 20 years at the Gandan Astrology Faculty."
    },
    philosophy: {
      mn: "Хүн байгалийн цаг хугацаатай зөрөхөд зовлон ирдэг.",
      en: "Suffering arises when man opposes the timing of nature."
    },
    services: [
      {
        id: "natal_astrology",
        name: { mn: "Төрөлх Зурхай", en: "Natal Astrology" },
        price: 50000,
        duration: "45 min"
      },
      {
        id: "date_selection", 
        name: { mn: "Ивээл Өдөр Сонгох", en: "Ausipicious Date Selection" },
        price: 20000,
        duration: "15 min"
      }
    ]
  },
  {
    clerkId: "seed_monk_4",
    email: "tenzin@nirvana.mn",
    role: "monk",
    karma: 900,
    meditationDays: 2500,
    totalMerits: 4500,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: { mn: "Мастер Тэнзин", en: "Dakini Tenzin" },
    title: { mn: "Огторгуйн үүлэн дээгүүр явагч", en: "Walker of the Sky Clouds" },
    image: "https://images.unsplash.com/photo-1606733276632-0c653063f256?q=80&w=2574&auto=format&fit=crop",
    video: "/num4.mp4",
    specialties: ["Sky Healing", "Silence"],
    bio: { 
      mn: "Тэрээр өндөр оргилуудын дундуур нам гүм мэт хөдөлдөг. Түүний мэргэн ухаан дэлхийг тэтгэгч мөрөн мэт урсдаг.", 
      en: "She moves like silence through the high peaks. Her wisdom flows like the river that feeds the world." 
    },
    isAvailable: true,
    quote: {
      mn: "Өндөрт нисэх шувууны адил таны сүнс чөлөөтэй байх болтугай.",
      en: "May your spirit be as free as the bird that soars high."
    },
    yearsOfExperience: 22,
    education: {
      mn: "Хамрын хийдэд Чод болон Хоосон чанарын бясалгалд суралцсан.",
      en: "Studied Chöd practice and Emptiness meditation in Kham region."
    },
    philosophy: {
      mn: "Чимээгүй байдалд бүх асуултын хариулт оршдог.",
      en: "In absolute silence, the answers to all questions arise effortlessly."
    },
    services: [
      {
        id: "tarot_reading",
        name: { mn: "Таро Мэргэ", en: "Tarot Reading" },
        price: 45000,
        duration: "40 min"
      }
    ]
  }
];

const ALL_SERVICES = [
  {
    id: "sutra_chanting",
    type: "teaching",
    title: { mn: "Гандангийн Ном", en: "Sutra Chanting" },
    subtitle: { mn: "Ариусал", en: "Purification" },
    desc: { mn: "Гэр бүл, үр хүүхдийн заяа буяныг даатгаж ном хурах.", en: "Chanting sacred sutras for the well-being and purification of your family." },
    duration: "30 min",
    price: 30000,
    image: "https://images.unsplash.com/photo-1601138262483-1768a481d11f?q=80&w=2670&auto=format&fit=crop",
    quote: { mn: "Ном бол ертөнцийг гийгүүлэгч гэрэл мөн.", en: "Dharma is the light that illuminates the world." }
  },
  {
    id: "natal_astrology",
    type: "divination",
    title: { mn: "Төрөлх Зурхай", en: "Natal Astrology" },
    subtitle: { mn: "Хувь Заяа", en: "Destiny Chart" },
    desc: { mn: "Таны төрсөн цаг, гараг эрхсийн байрлалаар хувь заяаг тольдох.", en: "Mapping your destiny through the alignment of stars at your birth." },
    duration: "45 min",
    price: 50000,
    image: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?q=80&w=2671&auto=format&fit=crop",
    quote: { mn: "Оддын хөдөлгөөн таны замыг заана.", en: "The stars align to show you the way." }
  },
  {
    id: "dharma_counseling",
    type: "teaching",
    title: { mn: "Сэтгэл Зүйн Зөвлөгөө", en: "Dharma Counseling" },
    subtitle: { mn: "Амар Амгалан", en: "Inner Peace" },
    desc: { mn: "Буддын гүн ухаанд суурилсан сэтгэл зүйн ганцаарчилсан ярилцлага.", en: "One-on-one counseling grounded in Buddhist philosophy to find mental clarity." },
    duration: "60 min",
    price: 80000,
    image: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=2670&auto=format&fit=crop",
    quote: { mn: "Сэтгэл амар амгалан бол хамгийн дээд жаргал.", en: "Inner peace is the highest happiness." }
  },
  {
    id: "tarot_reading",
    type: "divination",
    title: { mn: "Таро Мэргэ", en: "Tarot Reading" },
    subtitle: { mn: "Зөн Совин", en: "Intuition" },
    desc: { mn: "Таро картын нууцлаг бэлгэдлээр ирээдүйн чиг хандлагыг харах.", en: "Unveiling the path ahead through the mystical archetypes of Tarot." },
    duration: "40 min",
    price: 45000,
    image: "https://images.unsplash.com/photo-1630325406730-8041922c23dc?q=80&w=2574&auto=format&fit=crop",
    quote: { mn: "Картууд нууцыг дэлгэх болно.", en: "The cards will reveal the hidden truths." }
  },
  {
    id: "9star_ki",
    type: "divination",
    title: { mn: "Мэнгэ Голлох", en: "9-Star Ki" },
    subtitle: { mn: "Эрчим Хүч", en: "Energy Balance" },
    desc: { mn: "Жилийн мэнгэ, суудал өнцөгдөх засал болон зурхай.", en: "Calculations based on the 9 Star Ki system to balance annual energies." },
    duration: "20 min",
    price: 25000,
    image: "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0?q=80&w=2670&auto=format&fit=crop",
    quote: { mn: "Байгалийн хэмнэлтэй нэгдэх нь эрүүл мэндийн үндэс.", en: "Aligning with nature's rhythm is the root of health." }
  },
  {
    id: "meditation_guide",
    type: "teaching",
    title: { mn: "Бясалгал", en: "Meditation Guide" },
    subtitle: { mn: "Төвлөрөл", en: "Mindfulness" },
    desc: { mn: "Амьсгал болон анхаарлаа төвлөрүүлэх анхан шатны бясалгал.", en: "Guided meditation techniques to master focus and breath." },
    duration: "60 min",
    price: 35000,
    image: "https://images.unsplash.com/photo-1528319725582-ddc096101511?q=80&w=2669&auto=format&fit=crop",
    quote: { mn: "Амьсгал бол одоо цагт орших түлхүүр.", en: "Breath is the key to the present moment." }
  },
   {
    id: "mirror_scrying",
    type: "divination", 
    title: { mn: "Тольдох Мэргэ", en: "Mirror Scrying" },
    subtitle: { mn: "Далд Ертөнц", en: "Spirit Vision" },
    desc: { mn: "Эртний тольдох аргаар далд ертөнцийн мэдээллийг авах.", en: "Gazing into the sacred mirror to receive messages from the spirit realm." },
    duration: "50 min",
    price: 60000,
    image: "https://images.unsplash.com/photo-1596468138722-19e9929737ae?q=80&w=2670&auto=format&fit=crop", 
    quote: { mn: "Үнэн толинд тусдаг.", en: "Truth is reflected in the silence." }
  },
  {
    id: "date_selection",
    type: "divination", 
    title: { mn: "Ивээл Өдөр", en: "Auspicious Dates" },
    subtitle: { mn: "Цаг Хугацаа", en: "Time Mastery" },
    desc: { mn: "Хурим, нүүдэл, шинэ ажил эхлэхэд ээлтэй сайн өдрийг сонгох.", en: "Selecting the perfect cosmic alignment for weddings, moving, or new ventures." },
    duration: "15 min",
    price: 20000,
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2668&auto=format&fit=crop", 
    quote: { mn: "Цаг нь ирэхэд бүх зүйл бүтнэ.", en: "When the time is right, all things align." }
  }
];

const INITIAL_COMMENTS: Comment[] = [
  {
    authorName: "Lama Tenzin",
    authorRole: "Dharma Master",
    avatar: "https://images.unsplash.com/photo-1542385958-89c02111d08e?q=80&w=2574&auto=format&fit=crop",
    text: "As the sun illuminates the mountains, let wisdom illuminate your mind.",
    karma: 108,
    element: "gold",
    createdAt: new Date()
  }
];

export async function seedDatabase() {
  console.log("🌱 Starting spiritual seeding...");
  const { db } = await connectToDatabase();

  // Clear existing data (optional, but good for clean slate during dev)
  // We're moving monks to 'users' collection with role='monk'
  // Be careful if you have real users! In dev, it's fine.
  
  // NOTE: This will delete ALL users including potential 'clients'. 
  // For a safer seed, we should delete only those with role 'monk'.
  await db.collection("users").deleteMany({ role: "monk" }); 
  await db.collection("users").insertMany(MONKS as any);

  await db.collection("comments").deleteMany({}); 
  await db.collection("comments").insertMany(INITIAL_COMMENTS as any);

  await db.collection("services").deleteMany({});
  await db.collection("services").insertMany(ALL_SERVICES as any);

  console.log("🌟 Seeding complete.");
  return { monksCount: MONKS.length, commentsCount: INITIAL_COMMENTS.length , servicesCount: ALL_SERVICES.length};
}

if (require.main === module) {
  seedDatabase()
    .then((res) => {
      console.log(`✨ Seeding complete. Monks (in Users): ${res.monksCount}, Comments: ${res.commentsCount}, Services: ${res.servicesCount}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}
