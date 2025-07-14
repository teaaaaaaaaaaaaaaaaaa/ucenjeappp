import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuiz } from '../../contexts/QuizContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { useNavigate } from 'react-router-dom';

const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/stats/${payload.value.toLowerCase()}`);
    }

    return (
        <g transform={`translate(${x},${y})`}>
            <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)" cursor="pointer" onClick={handleClick}>
                {payload.value}
            </text>
        </g>
    );
};

const UnknownStats: React.FC = () => {
  const { unknownQuestionStats, resetUnknownStats } = useQuiz();
  const navigate = useNavigate();

  if (unknownQuestionStats.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Ovo ne znaš</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Još uvek nema statistike. Igrajte kviz da biste videli svoje slabe tačke!</p>
        </CardContent>
      </Card>
    );
  }

  // Aggregate stats by subject
  const subjectStats = unknownQuestionStats.reduce((acc, stat) => {
    if (!acc[stat.subject]) {
      acc[stat.subject] = { incorrect: 0, dontKnow: 0, total: 0 };
    }
    acc[stat.subject].incorrect += stat.incorrectCount;
    acc[stat.subject].dontKnow += stat.dontKnowCount;
    acc[stat.subject].total += stat.incorrectCount + stat.dontKnowCount;
    return acc;
  }, {} as Record<string, { incorrect: number; dontKnow: number; total: number }>);

  const chartData = Object.keys(subjectStats).map(subject => ({
    name: subject.charAt(0).toUpperCase() + subject.slice(1),
    Netačno: subjectStats[subject].incorrect,
    "Ne znam": subjectStats[subject].dontKnow,
  }));

  // Top 5 most difficult questions
  const topQuestions = [...unknownQuestionStats]
    .sort((a, b) => (b.incorrectCount + b.dontKnowCount) - (a.incorrectCount + a.dontKnowCount))
    .slice(0, 5);

  const totalIncorrect = unknownQuestionStats.reduce((sum, stat) => sum + stat.incorrectCount, 0);
  const totalDontKnow = unknownQuestionStats.reduce((sum, stat) => sum + stat.dontKnowCount, 0);

  const handleReset = () => {
    if (window.confirm('Da li ste sigurni da želite da obrišete celu istoriju pogrešnih odgovora?')) {
      resetUnknownStats();
    }
  };
  
  return (
    <Card className="mt-8 w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Ovo ne znaš</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">Statistika po predmetima</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" height={60} tick={<CustomizedAxisTick />} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Netačno" stackId="a" fill="#EF4444" />
              <Bar dataKey="Ne znam" stackId="a" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div>
            <h3 className="text-lg font-semibold mb-4">Ukupna statistika</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-red-500/10 rounded-lg">
                    <p className="text-sm text-red-500">Ukupno netačnih</p>
                    <p className="text-2xl font-bold text-red-500">{totalIncorrect}</p>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg">
                    <p className="text-sm text-yellow-500">Ukupno "Ne znam"</p>
                    <p className="text-2xl font-bold text-yellow-500">{totalDontKnow}</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg">
                    <p className="text-sm text-blue-500">Ukupno pitanja za vežbu</p>
                    <p className="text-2xl font-bold text-blue-500">{unknownQuestionStats.length}</p>
                </div>
            </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Top 5 najtežih pitanja</h3>
          <ul className="space-y-3">
            {topQuestions.map((q, index) => (
              <li key={q.questionId} className="p-4 border rounded-lg bg-secondary/50 flex items-start cursor-pointer" onClick={() => navigate(`/stats/${q.subject}`)}>
                <span className="font-bold text-primary mr-4">{index + 1}.</span>
                <div className="flex-1">
                    <p className="font-medium">{q.questionText}</p>
                    <div className="text-sm text-muted-foreground mt-1">
                        <span className="text-red-500 mr-4">Netačno: {q.incorrectCount}</span>
                        <span className="text-yellow-500">Ne znam: {q.dontKnowCount}</span>
                    </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="danger" onClick={handleReset}>
          Resetuj istoriju
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UnknownStats; 