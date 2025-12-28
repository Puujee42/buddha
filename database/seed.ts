import { connectToDatabase } from "./db";
import { Monk, Comment } from "./types";

const MONKS: Monk[] = [
  {
    name: { mn: "Лам Дорж", en: "Mahasiddha Dorje" },
    title: { mn: "Наран мандлаас заларсан", en: "Descended from the Sun Realm" },
    image: "https://images.unsplash.com/photo-1524230659092-07f99a75c013?q=80&w=2070&auto=format&fit=crop",
    specialties: ["Astrology", "Sun Meditation"],
    bio: { 
      mn: "Тэрээр мянган нарны илчийг тээж явдаг. Түүнтэй уулзах нь амин хувиа хичээх үзлийн бохирдлыг шатааж арилгахтай адил юм.", 
      en: "He carries the warmth of a thousand suns. To meet him is to burn away the impurities of the ego." 
    },
    isAvailable: true,
    quote: {
      mn: "Нарны гэрэл таны оюун ухаанд гэрэлтэн, таны замыг тодруулна.",
      en: "May the light of the sun illuminate your mind and brighten your path."
    }
  },
  {
    name: { mn: "Мастер Тэнзин", en: "Dakini Tenzin" },
    title: { mn: "Огторгуйн үүлэн дээгүүр явагч", en: "Walker of the Sky Clouds" },
    image: "https://images.unsplash.com/photo-1606733276632-0c653063f256?q=80&w=2574&auto=format&fit=crop",
    specialties: ["Sky Healing", "Silence"],
    bio: { 
      mn: "Тэрээр өндөр оргилуудын дундуур нам гүм мэт хөдөлдөг. Түүний мэргэн ухаан дэлхийг тэтгэгч мөрөн мэт урсдаг.", 
      en: "She moves like silence through the high peaks. Her wisdom flows like the river that feeds the world." 
    },
    isAvailable: true,
    quote: {
      mn: "Өндөрт нисэх шувууны адил таны сүнс чөлөөтэй байх болтугай.",
      en: "May your spirit be as free as the bird that soars high."
    }
  },
  {
    name: { mn: "Эрдэмтэн Алтансүх", en: "Arhat Altansukh" },
    title: { mn: "Алтан уул", en: "The Golden Mountain" },
    image: "https://images.unsplash.com/photo-1542385958-89c02111d08e?q=80&w=2574&auto=format&fit=crop",
    specialties: ["Earth Stability", "Ancient Texts"],
    bio: { 
      mn: "Тууштай, үл хөдлөх, мөнхийн. Тэрээр тэнүүчлэх сүнсийг газардуулж, тогтвортой байдлын адислалыг хайрладаг.", 
      en: "Solid, unmoving, eternal. He grounds the wandering spirit and grants the blessing of stability." 
    },
    isAvailable: true,
    quote: {
      mn: "Таны үндэс газар шиг бат бөх байг.",
      en: "May your roots be as firm as the earth."
    }
  },
  {
    name: { mn: "Лам Нима", en: "Lama Nyima" },
    title: { mn: "Ариун цагаан бадамлянхуа", en: "The Pure White Lotus" },
    image: "https://images.unsplash.com/photo-1623946221523-286a110a12c8?q=80&w=2670&auto=format&fit=crop",
    specialties: ["Compassion", "Heart Sutra"],
    bio: { 
      mn: "Шавраас төрсөн ч буртаглагдаагүй. Түүний энэрэл нигүүлсэл арван зүгт хүчин чармайлтгүйгээр түгдэг.", 
      en: "Born from the mud but unstained. His compassion radiates in all ten directions effortlessly." 
    },
    isAvailable: true,
    quote: {
      mn: "Таны зүрх бадмаар дүүрэн байг.",
      en: "May your heart bloom like the lotus."
    }
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
  },
  {
    authorName: "Sarnai",
    authorRole: "Temple Keeper",
    avatar: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=2635&auto=format&fit=crop",
    text: "The bells ringing this morning brought such peace.",
    karma: 42,
    element: "saffron",
    createdAt: new Date()
  }
];

export async function seedDatabase() {
  console.log("🌱 Starting spiritual seeding...");
  const { db } = await connectToDatabase();

  // 1. Seed Monks
  console.log("🕉️ Seeding monks...");
  await db.collection("monks").deleteMany({}); 
  await db.collection("monks").insertMany(MONKS);

  // 2. Seed Comments
  console.log("🌊 Seeding initial comments...");
  await db.collection("comments").deleteMany({}); 
  await db.collection("comments").insertMany(INITIAL_COMMENTS);

  return { monksCount: MONKS.length, commentsCount: INITIAL_COMMENTS.length };
}

// Allow running via CLI
if (require.main === module) {
  seedDatabase()
    .then((res) => {
      console.log(`✨ Seeding complete. Monks: ${res.monksCount}, Comments: ${res.commentsCount}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Seeding failed:", err);
      process.exit(1);
    });
}