# Kako radi aplikacija sa kvizovima i uputstvo za dodavanje novog kviza

Ovaj dokument opisuje kako aplikacija funkcioniše kada su u pitanju kvizovi i koji su koraci potrebni za dodavanje novog kviza.

## Kako aplikacija radi

Aplikacija učitava podatke o kvizovima iz statičkih JSON fajlova koji se nalaze u `public/data/` direktorijumu.

1.  **Učitavanje podataka**: Servis `src/services/quizService.ts` je odgovoran za komunikaciju sa podacima. On sadrži mapu (`SUBJECT_FILES`) koja povezuje nazive predmeta (npr. 'marketing', 'linux') sa putanjama do odgovarajućih JSON fajlova.
2.  **Prikaz kvizova**: Na početnoj strani (`Home.tsx`), aplikacija poziva `getAvailableSubjects()` iz `quizService.ts` da bi dobila listu dostupnih kvizova i prikazala ih korisniku.
3.  **Pokretanje kviza**: Kada korisnik izabere kviz, aplikacija učitava pitanja iz odgovarajućeg JSON fajla putem funkcije `loadQuestions()`. Pitanja se (opciono) mešaju (shuffle) kako bi redosled bio nasumičan.

## Struktura podataka (JSON)

Svaki kviz je jedan JSON fajl koji sadrži niz objekata, gde svaki objekat predstavlja jedno pitanje.

Primer strukture jednog pitanja:

```json
[
  {
    "id": 1,
    "question": "Tekst pitanja ide ovde?",
    "answers": [
      "Prvi ponuđeni odgovor",
      "Drugi ponuđeni odgovor",
      "Treći ponuđeni odgovor"
    ],
    "correctAnswer": "Tačan odgovor (mora biti identičan jednom od ponuđenih)"
  },
  {
    "id": 2,
    "question": "Pitanje otvorenog tipa (bez ponuđenih odgovora)?",
    "answers": [],
    "correctAnswer": "Očekivani odgovor"
  }
]
```

### Objašnjenje polja:
- **id** (broj): Jedinstveni identifikator pitanja u okviru fajla.
- **question** (tekst): Tekst samog pitanja.
- **answers** (niz tekstova): Lista ponuđenih odgovora. Ako je lista prazna `[]`, pitanje se tretira kao pitanje otvorenog tipa gde korisnik unosi odgovor.
- **correctAnswer** (tekst ili niz tekstova): Tačan odgovor. Kod pitanja sa ponuđenim odgovorima, ovaj tekst mora biti **identičan** (slovo po slovo) onom u `answers` nizu.

---

## Kako napraviti i dodati novi kviz

Da biste dodali novi kviz u aplikaciju, potrebno je ispratiti sledeća 3 koraka:

### 1. Kreiranje JSON fajla sa podacima
Napravite novi `.json` fajl u folderu `public/data/` (npr. `public/data/novi_kviz.json`).
Popunite ga pitanjima prateći gore opisanu strukturu.

Primer sadržaja fajla `public/data/moj_novi_kviz.json`:
```json
[
  {
    "id": 1,
    "question": "Koja je glavna boja semafora za 'stop'?",
    "answers": ["Zelena", "Crvena", "Žuta"],
    "correctAnswer": "Crvena"
  },
  {
    "id": 2,
    "question": "Koliko dana ima nedelja?",
    "answers": ["5", "6", "7"],
    "correctAnswer": "7"
  }
]
```

### 2. Registracija fajla u servisu
Otvorite fajl `src/services/quizService.ts`.
Pronađite promenljivu `SUBJECT_FILES` i dodajte novi par ključ-vrednost za vaš kviz.

```typescript
const SUBJECT_FILES: Record<string, string> = {
  // ... postojeći kvizovi ...
  'moj_novi_kviz': '/data/moj_novi_kviz.json', // <-- DODATO
};
```
*Napomena: Ključ (ovde `'moj_novi_kviz'`) je interni naziv koji će aplikacija koristiti.*

### 3. Dodavanje u listu dostupnih predmeta
U istom fajlu (`src/services/quizService.ts`), pronađite funkciju `getAvailableSubjects`.
Dodajte ključ vašeg novog kviza u niz `subjects`.

```typescript
export const getAvailableSubjects = async (): Promise<string[]> => {
  try {
    const subjects = [
      // ... postojeći predmeti ...
      'moj_novi_kviz', // <-- DODATO
    ];
    return Promise.resolve(subjects);
  } 
  // ...
};
```

Nakon ova tri koraka, novi kviz će se automatski pojaviti na početnoj strani aplikacije pod nazivom koji ste definisali (u ovom slučaju "moj_novi_kviz").
