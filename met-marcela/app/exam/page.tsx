'use client';

import { useState, useEffect } from 'react';

// You would import these from your data source
import { questions } from '@/lib/data'; 

export default function ExamRunner() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQuestion = questions[currentIdx];
  const isFirstQuestion = currentIdx === 0;
  const isLastQuestion = currentIdx === questions.length - 1;
  const isTimeUp = timeLeft <= 0;

  useEffect(() => {
    // Timer logic: simple interval, but consider performance if scaling
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSelect = (option: string) => {
    if (isTimeUp) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
  };

  if (isSubmitted) {
    const score = questions.reduce((acc, q) => {
      // This assumes your question objects in @/lib/data have a 'correctAnswer' field
      return acc + (answers[q.id] === q.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="max-w-2xl mx-auto p-6">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold">Exam Results</h1>
        </header>

        <section className="bg-blue-50 border border-blue-100 rounded-xl p-8 mb-8 text-center">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Final Score</h2>
          <div className="text-5xl font-black text-blue-900 mb-2">
            {score} <span className="text-2xl font-normal text-blue-700">/ {questions.length}</span>
          </div>
          <p className="text-blue-700 font-medium">
            Accuracy: {Math.round((score / questions.length) * 100)}%
          </p>
        </section>

        <section className="space-y-8">
          {questions.map((q, i) => (
            <div key={q.id} className="border-b pb-6 last:border-0">
              <p className="text-lg font-medium mb-4">{i + 1}. {q.questionText}</p>
              <div className="grid gap-2 text-sm">
                <div className={`p-3 rounded-md border ${answers[q.id] === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  <span className="font-semibold">Your Answer:</span> {answers[q.id] || "No answer provided"}
                </div>
                {answers[q.id] !== q.correctAnswer && (
                  <div className="p-3 rounded-md border bg-green-50 border-green-200 text-green-700">
                    <span className="font-semibold">Correct Answer:</span> {q.correctAnswer}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        <button 
          onClick={() => window.location.reload()}
          className="mt-10 w-full py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <h1 className="text-xl font-bold">MET Simulation</h1>
        <div className="text-red-600 font-mono text-xl">
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </div>
      </header>

      <section className="space-y-6">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-full transition-all duration-300" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-lg font-medium">{currentQuestion.questionText}</p>
        
        <div className="grid gap-3">
          {currentQuestion.options.map((opt) => (
            <button
              key={opt}
              disabled={isTimeUp}
              onClick={() => handleSelect(opt)}
              className={`p-4 border rounded-lg transition ${
                answers[currentQuestion.id] === opt 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </section>

      <footer className="mt-10 flex justify-between">
        <button 
          disabled={isFirstQuestion}
          onClick={() => setCurrentIdx(prev => prev - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 transition"
        >
          Previous
        </button>
        {isLastQuestion ? (
          <button 
            onClick={() => setIsSubmitted(true)}
            className="px-6 py-2 bg-green-600 text-white rounded font-bold hover:bg-green-700 transition"
          >
            Submit Exam
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Next
          </button>
        )}
      </footer>
    </div>
  );
}