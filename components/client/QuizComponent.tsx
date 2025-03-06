import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, Check, Lock, Shield } from "lucide-react"
import { useEffect, useState } from "react"

interface Choice {
  id: string
  text: string
}

interface Question {
  id: string
  text: string
  choices: Choice[]
  correctAnswer: string
  timeLimit: number
}

interface Quiz {
  id: string
  title: string
  theme: string
  questions: Question[]
}

interface QuizComponentProps {
  quizData: Quiz
}

export function QuizComponent({ quizData }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizCompleted, setQuizCompleted] = useState(false)

  const currentQuestion = quizData.questions[currentQuestionIndex]

  useEffect(() => {
    if (currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit)
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            handleNextQuestion()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [currentQuestion])

  const handleAnswerSelection = (answerId: string) => {
    setSelectedAnswer(answerId)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
    } else {
      setQuizCompleted(true)
    }
  }

  if (quizCompleted) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-black/60 border border-purple-500 shadow-lg shadow-purple-500/50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-purple-400">Quiz Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-purple-500" />
            <p className="text-3xl font-bold mb-4 text-green-400">
              Your score: {score} / {quizData.questions.length}
            </p>
            <Progress value={(score / quizData.questions.length) * 100} className="w-full h-2 bg-purple-900">
              <div
                className="h-full bg-gradient-to-r from-purple-400 to-blue-500"
                style={{ width: `${(score / quizData.questions.length) * 100}%` }}
              />
            </Progress>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/60 border border-purple-500 shadow-lg shadow-purple-500/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-purple-400">{quizData.title}</CardTitle>
        <p className="text-sm text-center text-blue-400">Theme: {quizData.theme}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-lg font-semibold text-purple-300">
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </p>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2 text-yellow-500" />
              <p className="text-sm text-yellow-500">Time left: {timeLeft}s</p>
            </div>
          </div>
          <Progress value={(timeLeft / currentQuestion.timeLimit) * 100} className="w-full h-2 bg-purple-900">
            <div
              className="h-full bg-gradient-to-r from-yellow-400 to-red-500"
              style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
            />
          </Progress>
        </div>
        <p className="text-xl mb-6 text-white font-medium">{currentQuestion.text}</p>
        <RadioGroup value={selectedAnswer || ""} onValueChange={handleAnswerSelection} className="space-y-4">
          {currentQuestion.choices.map((choice) => (
            <div
              key={choice.id}
              className="flex items-center space-x-3 p-3 rounded-lg border border-purple-700 hover:bg-purple-900/30 transition-colors"
            >
              <RadioGroupItem value={choice.id} id={choice.id} className="border-purple-500 text-purple-500" />
              <Label htmlFor={choice.id} className="text-white cursor-pointer flex-grow">
                {choice.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentQuestionIndex === quizData.questions.length - 1 ? (
            <>
              <Check className="w-5 h-5 mr-2" /> Finish
            </>
          ) : (
            <>
              <AlertTriangle className="w-5 h-5 mr-2" /> Next Question
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

