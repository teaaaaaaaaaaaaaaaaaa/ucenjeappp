import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuiz } from '@/contexts/QuizContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PageSkeleton from '@/components/shared/PageSkeleton';

const SubjectStatsPage: React.FC = () => {
  const { subject } = useParams<{ subject: string }>();
  const navigate = useNavigate();
  const { unknownQuestionStats, resetUnknownStatsForSubject } = useQuiz();

  const subjectStats = useMemo(() => {
    return unknownQuestionStats.filter(stat => stat.subject === subject);
  }, [unknownQuestionStats, subject]);

  if (!subject) {
    return <PageSkeleton title="Greška">Predmet nije naveden.</PageSkeleton>;
  }
  
  const handleResetAll = () => {
      if(window.confirm(`Da li ste sigurni da želite da obrišete statistiku za predmet: ${subject}?`)) {
          resetUnknownStatsForSubject(subject);
          navigate('/');
      }
  }

  const chartData = subjectStats.map(stat => ({
    name: `Pitanje ${stat.questionId}`,
    Netačno: stat.incorrectCount,
    'Ne znam': stat.dontKnowCount,
    fullQuestion: stat.questionText
  }));

  return (
    <PageSkeleton title={`Statistika za: ${subject.charAt(0).toUpperCase() + subject.slice(1)}`}>
        <Card>
            <CardHeader>
                <CardTitle>Pitanja koja ne znate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Grafik grešaka po pitanju</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" width={80} />
                            <Tooltip formatter={(value, name, props) => [value, name, props.payload.fullQuestion]} />
                            <Legend />
                            <Bar dataKey="Netačno" stackId="a" fill="#EF4444" />
                            <Bar dataKey="Ne znam" stackId="a" fill="#F59E0B" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Detaljna tabela</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pitanje</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Netačno</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ne znam</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {subjectStats.map(stat => (
                                    <tr key={stat.questionId}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.questionText}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.incorrectCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.dontKnowCount}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <Button variant="outline" size="sm">Vežbaj</Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={() => navigate('/')}>Nazad na početnu</Button>
                <Button variant="danger" onClick={handleResetAll}>Resetuj statistiku za ovaj predmet</Button>
            </CardFooter>
        </Card>
    </PageSkeleton>
  );
};

export default SubjectStatsPage; 