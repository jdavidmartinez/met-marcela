'use client';

import { useState } from 'react';

const MOCK_QUESTIONS = [
  { id: 1, question: "Choose the correct word to complete the sentence: 'She ___ to the park every morning.'", options: ["go", "goes", "going", "gone"], correctAnswer: "goes" },
  { id: 2, question: "Identify the synonym for 'Happy':", options: ["Sad", "Joyful", "Angry", "Tired"], correctAnswer: "Joyful" },
  { id: 3, question: "Which of these is a noun?", options: ["Quickly", "Run", "Apple", "Beautiful"], correctAnswer: "Apple" },
  { id: 4, question: "Select the correctly spelled word:", options: ["Accomodate", "Acomodate", "Accommodate", "Acommodate"], correctAnswer: "Accommodate" },
  { id: 5, question: "What is the past tense of 'Eat'?", options: ["Eaten", "Ate", "Eats", "Eating"], correctAnswer: "Ate" },
  { id: 6, question: "Choose the antonym for 'Large':", options: ["Huge", "Big", "Small", "Giant"], correctAnswer: "Small" },
  { id: 7, question: "Complete the phrase: 'An apple a day keeps the ___ away.'", options: ["Teacher", "Lawyer", "Doctor", "Baker"], correctAnswer: "Doctor" },
  { id: 8, question: "Which sentence is grammatically correct?", options: ["They is playing.", "They are playing.", "They am playing.", "They be playing."], correctAnswer: "They are playing." },
  { id: 9, question: "What is the plural of 'Child'?", options: ["Childs", "Childrens", "Children", "Childes"], correctAnswer: "Children" },
  { id: 10, question: "Identify the conjunction:", options: ["And", "House", "Blue", "Run"], correctAnswer: "And" },
];

export default function Home() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: number, option: string) => {
    if (!submitted) {
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const score = MOCK_QUESTIONS.reduce((acc, q) => {
    const selected = answers[q.id];
    return selected === q.correctAnswer ? acc + 1 : acc;
  }, 0);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header Section */}
        <div className="rounded-t-lg border-t-8 border-blue-600 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">MET Practice Examination</h1>
          <p className="mt-4 text-gray-600">
            This is a simulated MET examination. Please answer all 10 multiple-choice questions below.
            Your progress is not being recorded in this mock version.
          </p>
        </div>

        {/* Results Banner */}
        {submitted && (
          <div className="rounded-lg border-l-4 border-green-500 bg-white p-6 shadow-sm transition-all animate-in fade-in slide-in-from-top-4">
            <h2 className="text-xl font-bold text-gray-900">Practice Completed</h2>
            <p className="mt-1 text-3xl font-extrabold text-blue-600">
              Score: {score} / {MOCK_QUESTIONS.length}
            </p>
            <p className="mt-2 text-sm text-gray-500">Check the answers below for feedback.</p>
            <button 
              onClick={() => { setAnswers({}); setSubmitted(false); }}
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-500 underline decoration-2 underline-offset-4"
            >
              Restart Practice
            </button>
          </div>
        )}

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pb-12">
          {MOCK_QUESTIONS.map((q, idx) => (
            <div key={q.id} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <fieldset>
                <legend className="mb-4 text-lg font-medium text-gray-900">
                  <span className="mr-2">{idx + 1}.</span>
                  {q.question}
                </legend>

                <div className="space-y-3">
                  {q.options.map((option, optIdx) => {
                    const isSelected = answers[q.id] === option;
                    const isCorrect = option === q.correctAnswer;
                    
                    // Dynamic styling based on selection and submission state
                    let feedbackStyles = "border-gray-200";
                    if (isSelected) {
                      feedbackStyles = isCorrect 
                        ? "bg-green-50 border-green-500 text-green-700" 
                        : "bg-red-50 border-red-500 text-red-700";
                    } else if (submitted && isCorrect) {
                      // Highlight correct answer if user got it wrong
                      feedbackStyles = "bg-green-50 border-green-200 text-green-700 opacity-80";
                    }

                    return (
                      <label
                        key={optIdx}
                        className={`flex items-center space-x-3 rounded-md border p-3 transition-colors ${
                          submitted ? 'cursor-default' : 'cursor-pointer'
                        } ${feedbackStyles}`}
                      >
                        <input
                          type="radio"
                          name={`question-${q.id}`}
                          value={option}
                          checked={isSelected}
                          disabled={submitted}
                          onChange={() => handleSelect(q.id, option)}
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium">{option}</span>
                        {isSelected && (
                          <span className="ml-auto text-sm font-bold uppercase">
                            {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                          </span>
                        )}
                        {!isSelected && submitted && isCorrect && (
                          <span className="ml-auto text-xs font-bold uppercase text-green-600">
                            Correct Answer
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            {!submitted && (
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-8 py-3 text-white font-bold hover:bg-blue-700 transition-colors shadow-lg active:scale-95"
              >
                Complete and Score
              </button>
            )}
          </div>
        </form>
      </div>
    </main>
  )
}
