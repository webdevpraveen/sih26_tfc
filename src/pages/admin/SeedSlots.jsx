import { useState } from 'react';
import { useFirestore } from '../../hooks/useFirestore';

const SEED_DATA = [
  // Track 1 — B1-007 — 12:00 PM TO 02:00 PM
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Civic Nexus', leaderName: 'Parth Mishra', status: 'pending', order: 1 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Maroon 6', leaderName: 'Anmol Srivastava', status: 'pending', order: 2 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'TEAM NOVA', leaderName: 'ansh vaish', status: 'pending', order: 3 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Prism Point', leaderName: 'Chiranjeevi  Laxman Achari', status: 'pending', order: 4 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'The Nexora', leaderName: 'Kushagra Tiwari', status: 'pending', order: 5 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Llama_1.0', leaderName: 'Shrijaya Gupta', status: 'pending', order: 6 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Code Hustlers', leaderName: 'Aryan Singh', status: 'pending', order: 7 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Infinity Coders 2.O', leaderName: 'Siddhima Saxena', status: 'pending', order: 8 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Techminds', leaderName: 'Shubham Kumar barnwal', status: 'pending', order: 9 },
  { day: 1, track: 'Track 1', venue: 'B1-007', time: '12:00 PM TO 02:00 PM', teamName: 'Hectech', leaderName: 'Harshit singh', status: 'pending', order: 10 },

  // Track 2 — B1-207 — 12:00 PM TO 02:00 PM
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Scintillator', leaderName: 'Shreyash Swarnkar', status: 'pending', order: 1 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Tech Titans 2k26', leaderName: 'Ritesh Kumar Srivastava', status: 'pending', order: 2 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'OreVision', leaderName: 'Aman Ojha', status: 'pending', order: 3 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'ARC03C', leaderName: 'Achintya Rai', status: 'pending', order: 4 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Wannabe Hackers', leaderName: 'Ananya Gupta', status: 'pending', order: 5 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'The Algorithm', leaderName: 'Aditya kumar', status: 'pending', order: 6 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'NexByte', leaderName: 'Satyam Gupta', status: 'pending', order: 7 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Forensiq', leaderName: 'Aayush Ajay Pathak', status: 'pending', order: 8 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'Critical Catalysts  ⚡', leaderName: 'Shubham Vishwakarma', status: 'pending', order: 9 },
  { day: 1, track: 'Track 2', venue: 'B1-207', time: '12:00 PM TO 02:00 PM', teamName: 'CRADAR', leaderName: 'Ashish Kumar Jha', status: 'pending', order: 10 },

  // Track 3 — B2-305 — 12:00 PM TO 02:00 PM
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'THE 6BUGS', leaderName: 'Harsh Raj', status: 'pending', order: 1 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'HACKNAUTS', leaderName: 'Nitin Yadav', status: 'pending', order: 2 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'Skills@404', leaderName: 'Akash Trivedi', status: 'pending', order: 3 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'Verstappen velocity', leaderName: 'Surbhi Joshi', status: 'pending', order: 4 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'SRMUBotX', leaderName: 'Shreya Yadav', status: 'pending', order: 5 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'Sentinels', leaderName: 'Arnabh Kushwaha', status: 'pending', order: 6 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'Naadan Coders', leaderName: 'Arun Kumar', status: 'pending', order: 7 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: '404 Coders', leaderName: 'Biswajit Dhar', status: 'pending', order: 8 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'The Resolute', leaderName: 'Samarth Pandey', status: 'pending', order: 9 },
  { day: 1, track: 'Track 3', venue: 'B2-305', time: '12:00 PM TO 02:00 PM', teamName: 'The Innovators', leaderName: 'Shivansh Trivedi', status: 'pending', order: 10 },

  // Track 4 — B1-007 — 02:00 PM TO 04:00 PM
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'TitanX', leaderName: 'Shubham Kumar', status: 'pending', order: 1 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'CleanCoders', leaderName: 'Aman kumar yadav', status: 'pending', order: 2 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'Hack-A-thelete', leaderName: 'Aditya Shukla', status: 'pending', order: 3 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'The debuggers', leaderName: 'Shubham Raj', status: 'pending', order: 4 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'Byte Busters', leaderName: 'Adarsh Chaudhary', status: 'pending', order: 5 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'HydraVision', leaderName: 'Javeria Quraishi', status: 'pending', order: 6 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'Quantum Forge', leaderName: 'Mahit Saxena', status: 'pending', order: 7 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'Niyanta', leaderName: 'Mani Kumar', status: 'pending', order: 8 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'AGNIEYE', leaderName: 'Ayush Kumar Singh', status: 'pending', order: 9 },
  { day: 1, track: 'Track 4', venue: 'B1-007', time: '02:00 PM TO 04:00 PM', teamName: 'CodeBlooded', leaderName: 'Yuvraj kumar', status: 'pending', order: 10 },

  // Track 5 — B1-207 — 02:00 PM TO 04:00 PM
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Immutable Innovators', leaderName: 'Ansh Kumar Singh', status: 'pending', order: 1 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'CodeSphere', leaderName: 'Swati Kumari', status: 'pending', order: 2 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Maverick', leaderName: 'Aman Singh', status: 'pending', order: 3 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'ThermoSafe', leaderName: 'Prince Mishra', status: 'pending', order: 4 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'SPYKAR', leaderName: 'Prabhaditya Parth', status: 'pending', order: 5 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'NANCY CHAN', leaderName: 'kritika tripathi', status: 'pending', order: 6 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Code Debuggers', leaderName: 'Pranjali Gupta', status: 'pending', order: 7 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'AirCrack', leaderName: 'Mohd Arsad Ali', status: 'pending', order: 8 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Pragyan', leaderName: 'Abhishek Jaiswal', status: 'pending', order: 9 },
  { day: 1, track: 'Track 5', venue: 'B1-207', time: '02:00 PM TO 04:00 PM', teamName: 'Odysseus', leaderName: 'Shivang Dubey', status: 'pending', order: 10 },

  // Track 6 — B2-305 — 02:00 PM TO 04:00 PM
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'Code Blooded', leaderName: 'Ansh Shukla', status: 'pending', order: 1 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'Loader Logic', leaderName: 'Satyam Upadhyay', status: 'pending', order: 2 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'Qrious', leaderName: 'Himani Dagar', status: 'pending', order: 3 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'PROMT X', leaderName: 'Ayush kumar', status: 'pending', order: 4 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'Hexcode', leaderName: 'Shivam Shrivastava', status: 'pending', order: 5 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'She-devs', leaderName: 'Divyata Maurya', status: 'pending', order: 6 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'INOVIX', leaderName: 'Suryansh Singh', status: 'pending', order: 7 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'The Paragon Loop', leaderName: 'Saachi Khanna', status: 'pending', order: 8 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'NexGen Mavericks', leaderName: 'Saiyam Srivastava', status: 'pending', order: 9 },
  { day: 1, track: 'Track 6', venue: 'B2-305', time: '02:00 PM TO 04:00 PM', teamName: 'The innovators', leaderName: 'Asmit kumar Ray', status: 'pending', order: 10 },

  // ═══════════════════════════════════════
  // DAY 2 — 8th September
  // ═══════════════════════════════════════

  // Track 7 — B1-007 — 10:30 AM TO 12:30 PM
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'AlgoXQuery', leaderName: 'Vedant Sahu', status: 'pending', order: 1 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'Falcon_Tech', leaderName: 'Rishav Prakash Gupta', status: 'pending', order: 2 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'AGRIVISION', leaderName: 'Paravada Mahathi Gowri', status: 'pending', order: 3 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'Smashers', leaderName: 'Sudhir Singh', status: 'pending', order: 4 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'TECH TITAN', leaderName: 'Shubham Kumar Mishra', status: 'pending', order: 5 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'NULL POINTERS', leaderName: 'PARTH GUPTA', status: 'pending', order: 6 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'TechZen', leaderName: 'Adhyansh Nishad', status: 'pending', order: 7 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'InnovateX', leaderName: 'Suyash Pandey', status: 'pending', order: 8 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'PRISM', leaderName: 'Amit Vikram Singh', status: 'pending', order: 9 },
  { day: 2, track: 'Track 7', venue: 'B1-007', time: '10:30 AM TO 12:30 PM', teamName: 'Aarambh Coders', leaderName: 'Praveen Kumar Singh', status: 'pending', order: 10 },

  // Track 8 — B1-207 — 10:30 AM TO 12:30 PM
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'Nexora', leaderName: 'Rishabh Singh Chauhan', status: 'pending', order: 1 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'Namzin', leaderName: 'Akshat Dua', status: 'pending', order: 2 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'HyveCode', leaderName: 'Sakshi Prajapati', status: 'pending', order: 3 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'Landslide guard AI', leaderName: 'Swati Tiwari', status: 'pending', order: 4 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'QUANTUM VANGUARDS', leaderName: 'Anmol Shukla', status: 'pending', order: 5 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'Nexora', leaderName: 'Aman singh', status: 'pending', order: 6 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'Desi Kalakar', leaderName: 'Divyansh Kumar Singh', status: 'pending', order: 7 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'VisionGuard', leaderName: 'Harsh Pandey', status: 'pending', order: 8 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'AVISHKAAR', leaderName: 'Amresh Upadhyay', status: 'pending', order: 9 },
  { day: 2, track: 'Track 8', venue: 'B1-207', time: '10:30 AM TO 12:30 PM', teamName: 'NexusCare', leaderName: 'Richa kumari', status: 'pending', order: 10 },

  // Track 9 — B2-305 — 10:30 AM TO 12:30 PM
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'Impact X', leaderName: 'Ansh Kumar', status: 'pending', order: 1 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'The Mavericks', leaderName: 'Shashank Singh', status: 'pending', order: 2 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'Syntax Squad', leaderName: 'Saniya Khatoon', status: 'pending', order: 3 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'Garuda X', leaderName: 'Shivam singh', status: 'pending', order: 4 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'BharatBytes', leaderName: 'Shivani Chaudhary', status: 'pending', order: 5 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'Flyvora', leaderName: 'Vansh Modanwal', status: 'pending', order: 6 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'CODING CRUSADERS', leaderName: 'Ananya singh', status: 'pending', order: 7 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'NeZha', leaderName: 'Priyash', status: 'pending', order: 8 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'The Vikings', leaderName: 'Chandan Giri', status: 'pending', order: 9 },
  { day: 2, track: 'Track 9', venue: 'B2-305', time: '10:30 AM TO 12:30 PM', teamName: 'Technospark', leaderName: 'Yashi Awasthi', status: 'pending', order: 10 },

  // Track 10 — B1-007 — 12:30 PM TO 02:30 PM
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'LATENT', leaderName: 'SATYAM PATEL', status: 'pending', order: 1 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'Tech4bharat', leaderName: 'Aditya Verma', status: 'pending', order: 2 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'MindMesh', leaderName: 'Lokesh Tripathi', status: 'pending', order: 3 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'VERTEX', leaderName: 'Ankur Tiwari', status: 'pending', order: 4 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'AlgoRhythm', leaderName: 'Krishna Kumar', status: 'pending', order: 5 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'LOG-bit', leaderName: 'Praveen Yadav', status: 'pending', order: 6 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'Lost2found', leaderName: 'Alisha Jafri', status: 'pending', order: 7 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'DeepStack', leaderName: 'Sameer Kumar', status: 'pending', order: 8 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'VISIONEERS', leaderName: 'Pranjal Mishra', status: 'pending', order: 9 },
  { day: 2, track: 'Track 10', venue: 'B1-007', time: '12:30 PM TO 02:30 PM', teamName: 'POLARX', leaderName: 'Prem Kumar', status: 'pending', order: 10 },

  // Track 11 — B1-207 — 12:30 PM TO 02:30 PM
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'SERVER DOWN ⚙', leaderName: 'Shraddha Verma', status: 'pending', order: 1 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'AGRI INNOVATORS', leaderName: 'Suryansh Katiyar', status: 'pending', order: 2 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'Team Echelon', leaderName: 'Adarsh Kumar', status: 'pending', order: 3 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'DeepThink', leaderName: 'MRITUNJAI MISHRA', status: 'pending', order: 4 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'The Alpha Circle', leaderName: 'Aditya Verma', status: 'pending', order: 5 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'Tech Rangers', leaderName: 'Ansh Pratap Singh', status: 'pending', order: 6 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'Nexus Nomads', leaderName: 'Ujjwal Mishra', status: 'pending', order: 7 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'CATALYST', leaderName: 'PRIYANSHU KUMAR', status: 'pending', order: 8 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'surver mong', leaderName: 'Divya Singh', status: 'pending', order: 9 },
  { day: 2, track: 'Track 11', venue: 'B1-207', time: '12:30 PM TO 02:30 PM', teamName: 'Tech-Gradient', leaderName: 'Adarsh Tiwari', status: 'pending', order: 10 },

  // Track 12 — B2-305 — 12:30 PM TO 02:30 PM
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'New Leaf', leaderName: 'Rishi Singh', status: 'pending', order: 1 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'VadeX', leaderName: 'Abhiraj Kumar Singh', status: 'pending', order: 2 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'SYNTAX SQUAD', leaderName: 'AYUSH DUBEY', status: 'pending', order: 3 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'Firestorm Innovators', leaderName: 'Samarth Kumar', status: 'pending', order: 4 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'Code & Co.', leaderName: 'Ayush Bajpai', status: 'pending', order: 5 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'ByteBrain', leaderName: 'Akanksha', status: 'pending', order: 6 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'SeaSphere', leaderName: 'Anushka Rawat', status: 'pending', order: 7 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'Dravion', leaderName: 'Dakshita Sharma', status: 'pending', order: 8 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'Code Horizon', leaderName: 'Vishwakarma Anjani Subodh', status: 'pending', order: 9 },
  { day: 2, track: 'Track 12', venue: 'B2-305', time: '12:30 PM TO 02:30 PM', teamName: 'TOTAL CODERS', leaderName: 'Shiv Kumar Bhardwaj', status: 'pending', order: 10 },

  // Track 13 — B1-007 — 02:30 PM TO 04:30 PM
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'AlogSphere', leaderName: 'Sunny Mall', status: 'pending', order: 1 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'TechZen', leaderName: 'Rakshita K Biradar', status: 'pending', order: 2 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'PointPilot', leaderName: 'Rashi Gupta', status: 'pending', order: 3 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'DHRUV', leaderName: 'Ujala gupta', status: 'pending', order: 4 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'Synergetics', leaderName: 'Mohd Rayyan', status: 'pending', order: 5 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'OnePercent', leaderName: 'Rudraksh Shukla', status: 'pending', order: 6 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'Idea2Impact', leaderName: 'Chattla Sri Varshini', status: 'pending', order: 7 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'Byte Force', leaderName: 'Laraib Ali', status: 'pending', order: 8 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'Orbital Minds', leaderName: 'Ayush Dubey', status: 'pending', order: 9 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'InnoVateX', leaderName: 'Manas Tiwari', status: 'pending', order: 10 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'Future Forge', leaderName: 'Aashwin Tripathi', status: 'pending', order: 11 },
  { day: 2, track: 'Track 13', venue: 'B1-007', time: '02:30 PM TO 04:30 PM', teamName: 'NO PLAN B', leaderName: 'SHOURY GADIA', status: 'pending', order: 12 },
];

export default function SeedSlots() {
  const { data: existingSlots, addItem, deleteItem } = useFirestore('slots');
  const [seeding, setSeeding] = useState(false);
  const [progress, setProgress] = useState('');
  const [done, setDone] = useState(false);

  const handleSeed = async () => {
    if (!window.confirm(`This will DELETE all ${existingSlots.length} existing slots and add ${SEED_DATA.length} new ones. Continue?`)) return;

    setSeeding(true);
    setProgress('Deleting existing slots...');

    // Delete existing
    for (let i = 0; i < existingSlots.length; i++) {
      await deleteItem(existingSlots[i].id);
      setProgress(`Deleting ${i + 1}/${existingSlots.length}...`);
    }

    // Add new
    for (let i = 0; i < SEED_DATA.length; i++) {
      await addItem(SEED_DATA[i]);
      setProgress(`Adding slot ${i + 1}/${SEED_DATA.length}...`);
    }

    setProgress(`✅ Done! Added ${SEED_DATA.length} slots.`);
    setSeeding(false);
    setDone(true);
  };

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <h1 className="admin-page-title">🌱 Seed Slot Data</h1>
      </div>

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '24px', maxWidth: '600px' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
          This will populate the <strong>slots</strong> collection with <strong>{SEED_DATA.length} teams</strong> across 13 tracks (Day 1 & Day 2).
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
          Existing data: <strong>{existingSlots.length} slots</strong>
        </p>

        {progress && (
          <div style={{ padding: '12px', background: done ? '#d1fae5' : '#fef3c7', borderRadius: '8px', marginBottom: '16px', fontWeight: 600, fontSize: '0.9rem' }}>
            {progress}
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="admin-add-btn"
          style={{ opacity: seeding ? 0.6 : 1 }}
        >
          {seeding ? '⏳ Seeding...' : '🚀 Seed All Slots'}
        </button>
      </div>
    </div>
  );
}
