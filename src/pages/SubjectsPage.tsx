import React from 'react';
import { useNavigate } from 'react-router-dom';

const subjects = [
  {
    id: 'NJT',
    name: 'Napredne Java Tehnologije',
    abbr: 'NJT',
    description: 'Spring Boot, projekat, kolokvijumi — nova akreditacija 2025/26',
    icon: '☕',
    color: 'from-orange-500 to-red-500',
    bgLight: 'bg-orange-50',
    border: 'border-orange-200',
  },
  {
    id: 'OI2',
    name: 'Operaciona Istraživanja 2',
    abbr: 'OI2',
    description: 'Dinamičko programiranje, teorija, projektni zadatak u Excelu',
    icon: '📊',
    color: 'from-blue-500 to-indigo-600',
    bgLight: 'bg-blue-50',
    border: 'border-blue-200',
  },
  {
    id: 'PJ',
    name: 'Programski Jezici',
    abbr: 'PJ',
    description: 'C# — tipovi, kolekcije, proceduralne apstrakcije, kolokvijumi na papiru',
    icon: '💻',
    color: 'from-purple-500 to-violet-600',
    bgLight: 'bg-purple-50',
    border: 'border-purple-200',
  },
  {
    id: 'NA',
    name: 'Numerička Analiza',
    abbr: 'NA',
    description: 'Matlab, nelinearne jednačine, sistemi linearnih jednačina',
    icon: '📐',
    color: 'from-green-500 to-teal-600',
    bgLight: 'bg-green-50',
    border: 'border-green-200',
  },
];

const SubjectsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Predmeti</h1>
        <p className="text-muted-foreground text-base">
          Survival guide za svaki predmet — sve fore i saveti iz grupe na jednom mestu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {subjects.map((subject) => (
          <button
            key={subject.id}
            onClick={() => navigate(`/predmeti/${subject.id}`)}
            className="group text-left rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl flex-shrink-0 shadow`}>
                {subject.icon}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {subject.abbr}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
                  {subject.name}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {subject.description}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
              Otvori vodič
              <svg className="ml-1 w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
