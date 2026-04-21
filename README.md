# 🤘 Metal Daily Quote

> One powerful metal lyric. Every day. Forever.

A mobile app for Android (iOS coming soon) that delivers one handpicked quote from metal song lyrics every single day.

---

## 📱 Download

> Coming soon to Google Play Store

---

## ✨ Features

- 🎸 One new quote every day
- 🏷️ Band, album, song and year information  
- 📤 Share your daily quote with friends
- 🌑 Pure dark UI built for metal fans
- ☁️ Quotes fetched from the cloud — always fresh

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React Native + Expo | Mobile app (Android & iOS) |
| TypeScript | Type-safe code |
| Supabase | Cloud database & API |
| EAS Build | Cloud building & deployment |
| GitHub | Version control & portfolio |

---
## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- Expo Go app on your phone

### Installation

Clone the repo and install dependencies:

    git clone https://github.com/izdev-vc/metal-daily-quote.git
    cd metal-daily-quote
    npm install

### Environment Variables

Create a `.env` file in the root directory:

    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

### Run

    npx expo start

Scan the QR code with Expo Go on your phone.

---

## 🗄️ Database Schema

    CREATE TABLE quotes (
      id bigint PRIMARY KEY,
      quote text NOT NULL,
      band varchar NOT NULL,
      album varchar NOT NULL,
      song varchar NOT NULL,
      year int4,
      active_date date UNIQUE,
      created_at timestamptz DEFAULT now()
    );

---

---

## 🔒 Security

- Row Level Security (RLS) enabled on Supabase
- Public read-only access — no user data collected
- API keys stored as environment variables

---

## 📖 Privacy Policy

[Privacy Policy](https://izdev-vc.github.io/metal-daily-quote/privacy-policy)

---

## 🎯 What I Learned

This is my first mobile app, built while learning vibe coding from scratch. Key learnings:

- Building a React Native app with Expo from zero
- Connecting a mobile app to a cloud database (Supabase)
- Row Level Security for API protection
- Publishing to Google Play Store
- Using EAS Build for cloud compilation
- Git & GitHub for version control

---

## 👤 Author

**izdev-vc**
- GitHub: [@izdev-vc](https://github.com/izdev-vc)

---
