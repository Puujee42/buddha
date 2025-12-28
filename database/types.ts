import { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  clerkId: string; // Links to Clerk Auth
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  
  // Spiritual Stats
  karma: number;
  meditationDays: number;
  totalMerits: number;
  role: "seeker" | "monk" | "admin";
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Monk {
  _id?: ObjectId;
  name: {
    mn: string;
    en: string;
  };
  title: {
    mn: string;
    en: string;
  };
  image: string;
  specialties: string[]; // e.g., ["Astrology", "Meditation"]
  bio: {
    mn: string;
    en: string;
  };
  isAvailable: boolean;
  quote: {
    mn: string;
    en: string;
  };
}

export interface Booking {
  _id?: ObjectId;
  userId: string; // Clerk ID
  monkId: ObjectId;
  date: Date;
  type: "Astrology" | "Counseling" | "Prayer" | "Ritual";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  createdAt: Date;
}

export interface Comment {
  _id?: ObjectId;
  userId?: string; // Optional if guest
  authorName: string;
  authorRole: string;
  avatar: string;
  text: string;
  karma: number; // Likes/Upvotes
  element: "gold" | "saffron" | "ochre" | "light"; // Visual theme
  createdAt: Date;
}
