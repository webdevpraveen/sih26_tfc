// Seed script to populate Firestore with slot data
// Run: node scripts/seedSlots.mjs

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, deleteDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyChvRqklLHeHnts7KNiQxdTpmwMCZl7_go',
  authDomain: 'srmu-sih-2026.firebaseapp.com',
  projectId: 'srmu-sih-2026',
  storageBucket: 'srmu-sih-2026.firebasestorage.app',
  messagingSenderId: '738683760104',
  appId: '1:738683760104:web:239084c18f0097d981085d',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// All slot data extracted from the images
const slotsData = [
  // ═══════════════════════════════════════
  // DAY 1 — 7th September
  // ═══════════════════════════════════════

  // Track 1 — B1-007 — 12:00 PM TO 02:00 PM
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Civic Nexus', leaderName: 'Parth Mishra', status: 'pending', order: 1 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Maroon 6', leaderName: 'Anmol Srivastava', status: 'pending', order: 2 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'TEAM NOVA', leaderName: 'Ansh Vaish', status: 'pending', order: 3 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Prism Point', leaderName: 'Chiranjeevi Laxman Achari', status: 'pending', order: 4 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'The Nexora', leaderName: 'Kushagra Tiwari', status: 'pending', order: 5 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Llama_1.0', leaderName: 'Shrijaya Gupta', status: 'pending', order: 6 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Code Hustlers', leaderName: 'Aryan Singh', status: 'pending', order: 7 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Infinity Coders 2.O', leaderName: 'Siddhima Saxena', status: 'pending', order: 8 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Techminds', leaderName: 'Shubham Kumar Barnwal', status: 'pending', order: 9 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Hectech', leaderName: 'Harshit Singh', status: 'pending', order: 10 },

  // Track 2 — B1-207 — 12:00 PM TO 02:00 PM
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Scintillator', leaderName: 'Shreyash Swarnkar', status: 'pending', order: 1 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Tech Titans 2k26', leaderName: 'Ritesh Kumar Srivastava', status: 'pending', order: 2 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'OreVision', leaderName: 'Aman Ojha', status: 'pending', order: 3 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'ARC03C', leaderName: 'Achintya Rai', status: 'pending', order: 4 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Wannabe Hackers', leaderName: 'Ananya Gupta', status: 'pending', order: 5 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'The Algorithm', leaderName: 'Aditya Kumar', status: 'pending', order: 6 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'NexByte', leaderName: 'Satyam Gupta', status: 'pending', order: 7 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Forensiq', leaderName: 'Aayush Ajay Pathak', status: 'pending', order: 8 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Critical Catalysts', leaderName: 'Shubham Vishwakarma', status: 'pending', order: 9 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'CRADAR', leaderName: 'Ashish Kumar Jha', status: 'pending', order: 10 },

  // Track 3 — B2-305 — 12:00 PM TO 02:00 PM
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'THE 6BUGS', leaderName: 'Harsh Raj', status: 'pending', order: 1 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'HACKNAUTS', leaderName: 'Nitin Yadav', status: 'pending', order: 2 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'Skills@404', leaderName: 'Akash Trivedi', status: 'pending', order: 3 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'Verstappen Velocity', leaderName: 'Surbhi Joshi', status: 'pending', order: 4 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'SRMUBotX', leaderName: 'Shreya Yadav', status: 'pending', order: 5 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'Sentinels', leaderName: 'Arnabh Kushwaha', status: 'pending', order: 6 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'Naadan Coders', leaderName: 'Arun Kumar', status: 'pending', order: 7 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: '404 Coders', leaderName: 'Biswajit Dhar', status: 'pending', order: 8 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'The Resolute', leaderName: 'Samarth Pandey', status: 'pending', order: 9 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'The Innovators', leaderName: 'Shivansh Trivedi', status: 'pending', order: 10 },

  // Track 4 — B1-007 — 02:00 PM TO 04:00 PM
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'TitanX', leaderName: 'Shubham Kumar', status: 'pending', order: 1 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'CleanCoders', leaderName: 'Aman Kumar Yadav', status: 'pending', order: 2 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'Hack-A-thelete', leaderName: 'Aditya Shukla', status: 'pending', order: 3 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'The Debuggers', leaderName: 'Shubham Raj', status: 'pending', order: 4 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'Byte Busters', leaderName: 'Adarsh Chaudhary', status: 'pending', order: 5 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'HydraVision', leaderName: 'Javeria Quraishi', status: 'pending', order: 6 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'Quantum Forge', leaderName: 'Mahit Saxena', status: 'pending', order: 7 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'Niyanta', leaderName: 'Mani Kumar', status: 'pending', order: 8 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'AGNIEYE', leaderName: 'Ayush Kumar Singh', status: 'pending', order: 9 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'CodeBlooded', leaderName: 'Yuvraj Kumar', status: 'pending', order: 10 },

  // Track 5 — B1-207 — 02:00 PM TO 04:00 PM
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Immutable Innovators', leaderName: 'Ansh Kumar Singh', status: 'pending', order: 1 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'CodeSphere', leaderName: 'Swati Kumari', status: 'pending', order: 2 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Maverick', leaderName: 'Aman Singh', status: 'pending', order: 3 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'ThermoSafe', leaderName: 'Prince Mishra', status: 'pending', order: 4 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'SPYKAR', leaderName: 'Prabhaditya Parth', status: 'pending', order: 5 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'NANCY CHAN', leaderName: 'Kritika Tripathi', status: 'pending', order: 6 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Code Debuggers', leaderName: 'Pranjali Gupta', status: 'pending', order: 7 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'AirCrack', leaderName: 'Mohd Arsad Ali', status: 'pending', order: 8 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Pragyan', leaderName: 'Abhishek Jaiswal', status: 'pending', order: 9 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Odysseus', leaderName: 'Shivang Dubey', status: 'pending', order: 10 },

  // Track 6 — B2-305 — 02:00 PM TO 04:00 PM
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'Code Blooded', leaderName: 'Ansh Shukla', status: 'pending', order: 1 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'Loader Logic', leaderName: 'Satyam Upadhyay', status: 'pending', order: 2 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'Qrious', leaderName: 'Himani Dagar', status: 'pending', order: 3 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'PROMT X', leaderName: 'Ayush Kumar', status: 'pending', order: 4 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'Hexcode', leaderName: 'Shivam Shrivastava', status: 'pending', order: 5 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'She-devs', leaderName: 'Divyata Maurya', status: 'pending', order: 6 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'INOVIX', leaderName: 'Suryansh Singh', status: 'pending', order: 7 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'The Paragon Loop', leaderName: 'Saachi Khanna', status: 'pending', order: 8 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'NexGen Mavericks', leaderName: 'Saiyam Srivastava', status: 'pending', order: 9 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'The Innovators', leaderName: 'Asmit Kumar Ray', status: 'pending', order: 10 },
];

async function seedSlots() {
  console.log('🚀 Starting to seed slots...');

  // First, clear existing slots
  const slotsRef = collection(db, 'slots');
  const existingDocs = await getDocs(slotsRef);
  
  if (existingDocs.size > 0) {
    console.log(`🗑️  Deleting ${existingDocs.size} existing slots...`);
    for (const docSnap of existingDocs.docs) {
      await deleteDoc(doc(db, 'slots', docSnap.id));
    }
    console.log('✅ Existing slots cleared');
  }

  // Add all slots
  let count = 0;
  for (const slot of slotsData) {
    await addDoc(slotsRef, {
      ...slot,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
    if (count % 10 === 0) {
      console.log(`📝 Added ${count}/${slotsData.length} slots...`);
    }
  }

  console.log(`\n✅ Done! Added ${count} slots to Firestore.`);
  console.log(`   Track 1: 10 teams (B1-007, 12-2 PM)`);
  console.log(`   Track 2: 10 teams (B1-207, 12-2 PM)`);
  console.log(`   Track 3: 10 teams (B2-305, 12-2 PM)`);
  console.log(`   Track 4: 10 teams (B1-007, 2-4 PM)`);
  console.log(`   Track 5: 10 teams (B1-207, 2-4 PM)`);
  console.log(`   Track 6: 10 teams (B2-305, 2-4 PM)`);
  process.exit(0);
}

seedSlots().catch((err) => {
  console.error('❌ Error seeding slots:', err);
  process.exit(1);
});
