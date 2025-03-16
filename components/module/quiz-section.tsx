"use client"

import type { QuizQuestion } from "@/types/course"; // Importation du type externe
import type React from "react";
import { Dispatch, SetStateAction, useState } from "react";


interface QuizSectionProps {

  questions: QuizQuestion[];

  setCurrentStep: Dispatch<SetStateAction<"content" | "quiz">>;

  onCompleteModule: () => Promise<void>;

}

const QuizSection: React.FC<QuizSectionProps> = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [quizSets, setQuizSets] = useState<QuizQuestion[][]>([])

  const handleAnswerOptionClick = (answer: string) => {
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1)
    }

    const nextQuestion = currentQuestionIndex + 1
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion)
    } else {
      setShowScore(true)
    }
  }

  return (
    <div className="quiz-section">
      {showScore ? (
        <div className="score-section">
          You scored {score} out of {questions.length}
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Question {currentQuestionIndex + 1}</span>/{questions.length}
            </div>
            {questions[currentQuestionIndex] && (
              <div className="question-text">{questions[currentQuestionIndex].question}</div>
            )}
          </div>
          <div className="answer-section">
            {questions[currentQuestionIndex]?.options?.map((answerOption, index) => (
              <button key={index} onClick={() => handleAnswerOptionClick(answerOption)}>
                {answerOption}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default QuizSection

