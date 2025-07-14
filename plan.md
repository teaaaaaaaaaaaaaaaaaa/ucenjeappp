# 🧠 Kartični Kviz - Plan Implementacije

Ovaj dokument opisuje korake za razvoj interaktivne igre-kviz aplikacije sa karticama, dinamičkim učitavanjem pitanja iz JSON fajlova i animacijama.

---

## 1. Faza: Struktura Projekta i Osnovne Komponente ✅

- [x] Definisanje strukture direktorijuma
- [x] Kreiranje JSON fajlova sa pitanjima u `public/data/`
- [x] Definisanje TypeScript tipova za pitanja i sesije

## 2. Faza: Implementacija Servisa i Konteksta ✅

- [x] Servis za kviz (`quizService.ts`) - učitavanje pitanja
- [x] Context API za globalno upravljanje stanjem (`QuizContext.tsx`) 
- [x] Custom hook za pristup kontekstu (`useQuiz.ts`)

## 3. Faza: Kreiranje Komponenti za Kartice ✅

- [x] `QuizCard.tsx` - Glavna komponenta za prikaz jednog pitanja
- [x] `McqView.tsx` - Prikaz pitanja sa ponuđenim odgovorima
- [x] `InputView.tsx` - Prikaz pitanja sa unosom teksta
- [x] `SessionSummary.tsx` - Prikaz rezultata na kraju sesije

## 4. Faza: Implementacija Stranica ✅

- [x] `Home.tsx` - Početna stranica sa izborom oblasti
- [x] `QuizSetup.tsx` - Stranica za podešavanje kviza
- [x] `Quiz.tsx` - Glavna stranica sa kvizom

## 5. Faza: Routing i Navigacija ✅

- [x] Podešavanje React Router-a
- [x] Implementacija navigacije između stranica
- [x] Zaštita ruta (npr. redirekcija na setup ako nema aktivne sesije)
- [x] Uklanjanje header-a i footer-a za čistiji UI

## 6. Faza: Upravljanje Stanjem Kviza ✅

- [x] Učitavanje i filtriranje pitanja
- [x] Praćenje odgovora i napretka
- [x] Logika za prelazak na sledeće pitanje

## 7. Faza: Perzistencija Podataka ✅

- [x] Čuvanje stanja sesije u `localStorage`
- [x] Učitavanje sačuvane sesije pri pokretanju aplikacije
- [x] Mogućnost resetovanja progresa

## 8. Faza: UI Poboljšanja i Animacije ✅

- [x] Implementacija igričkog dizajna
- [x] Dodavanje animacija za tranzicije i interakcije
- [x] Prilagođavanje mobilnim uređajima
- [x] Pojednostavljivanje UI-a (uklanjanje nepotrebnih sekcija)

## 9. Faza: Dopunska Funkcionalnost i Dorade ⏳

- [ ] Dodavanje zvučnih efekata
- [ ] Implementacija sistema bodova
- [ ] Opcija za deljenje rezultata
- [ ] Dodavanje više kategorija pitanja
- [ ] Implementacija multiplayer moda

## 10. Faza: Testiranje i Optimizacije 🔄

- [x] Testiranje funkcionalnosti
- [x] Optimizacija performansi
- [ ] Korekcije na osnovu povratnih informacija korisnika

---

## Tehnički Detalji

### Model Podataka

```typescript
// Definicija pitanja
export interface Question {
  id: number;
  question: string;
  answers: string[]; // Prazan niz ako je pitanje sa unosom
  correctAnswer: string;
}

// Definicija sesije
export interface QuizSession {
  subject: string;
  questions: Question[];
  currentQuestionIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  remainingQuestions: Question[];
}

// Tip kviza
export type QuizType = 'multiple-choice' | 'input';

// Podešavanja kviza
export interface QuizSettings {
  subject: string;
  type: QuizType;
  questionCount: number;
}
```

### Tok Rada sa Pitanjima

1. Korisnik bira oblast (predmet)
2. Korisnik podešava tip kviza i broj pitanja
3. Sistem učitava i meša pitanja
4. Pitanja se prikazuju jedno po jedno
5. Korisnik odgovara na pitanja
6. Tačno odgovorena pitanja se uklanjaju iz sesije
7. Netačno odgovorena pitanja ostaju za ponavljanje
8. Na kraju se prikazuje rezime sesije

### Tehnologije

- React 18+ sa TypeScript
- TailwindCSS za stilizaciju
- React Router 6 za navigaciju
- LocalStorage API za perzistenciju

---

## Napomene za Razvoj

- Fokus je na kvalitetnom UI/UX i glatkim animacijama
- Aplikacija treba da bude responzivna za sve veličine ekrana
- Korisnički interfejs treba da bude intuitivan i jednostavan
- Koristiti pristupačne komponente (a11y)
- Dizajn treba da bude moderan i privlačan 