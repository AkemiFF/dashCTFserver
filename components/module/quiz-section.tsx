"use client"

import type { QuizQuestion } from "@/services/types/course"
import { AlertCircle, CheckCircle, ChevronRight, Clock, RotateCcw, XCircle } from "lucide-react"
import type React from "react"
import { type Dispatch, type SetStateAction, useEffect, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { getAuthHeader } from "@/lib/auth"
import { BASE_URL } from "@/lib/host"
import { cn } from "@/lib/utils"

interface QuizSectionProps {
  questions: QuizQuestion[]
  setCurrentStep?: Dispatch<SetStateAction<"content" | "quiz">>
  onCompleteModule?: (timeUsed: number) => Promise<void>
  moduleTitle?: string
  moduleId: string | null
}

interface OpenEndedEvaluation {
  score: number
  feedback: string
  suggestions?: string[]
}

const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  setCurrentStep,
  onCompleteModule,
  moduleTitle = "Module",
  moduleId,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [openEndedScores, setOpenEndedScores] = useState<Record<string, OpenEndedEvaluation>>({})
  const [showScore, setShowScore] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([])
  const [openEndedAnswer, setOpenEndedAnswer] = useState("")
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isSubmittingAttempt, setIsSubmittingAttempt] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const isMultipleChoice = currentQuestion?.type === "multiple-choice"
  const isMultipleAnswer = Array.isArray(currentQuestion?.correctAnswer)
  const [selectedAnswersPerQuestion, setSelectedAnswersPerQuestion] = useState<Record<string, string[]>>({});
  const [openEndedAnswers, setOpenEndedAnswers] = useState<Record<string, string>>({});
  const [enoughPoints, setEnoughPoints] = useState(false);
  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Format time for display
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return [
      hours > 0 ? String(hours).padStart(2, "0") : null,
      String(minutes).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":")
  }

  // Reset answers when question changes
  useEffect(() => {
    setSelectedAnswers([])
    setOpenEndedAnswer("")
    setIsAnswerSubmitted(false)
    setIsCorrect(null)
    setFeedback("")
  }, [currentQuestionIndex])

  // Debug validation in development
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      questions.forEach((q, index) => {
        if (q.type === "multiple-choice") {
          const answers = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer]
          answers.forEach((answerId) => {
            if (!q.options?.some((opt) => opt.id === answerId)) {
              console.warn(`Question ${index + 1}: Aucune option trouvée pour la réponse correcte "${answerId}"`)
            }
          })
        }
      })
    }
  }, [questions])

  const handleSingleAnswerSelect = (answerId: string) => {
    if (isAnswerSubmitted) return
    setSelectedAnswers([answerId])
  }

  const handleMultipleAnswerSelect = (answerId: string, checked: boolean) => {
    if (isAnswerSubmitted) return

    if (checked) {
      setSelectedAnswers((prev) => [...prev, answerId])
    } else {
      setSelectedAnswers((prev) => prev.filter((id) => id !== answerId))
    }
  }

  const handleOpenEndedAnswerChange = (value: string) => {
    setOpenEndedAnswer(value)
  }

  const evaluateOpenEndedAnswer = async (
    questionId: string,
    question: string,
    answer: string,
  ): Promise<OpenEndedEvaluation> => {
    setIsEvaluating(true)
    try {
      const response = await fetch(`${BASE_URL}/api/chat/evaluate-answer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          moduleTitle,
          question,
          answer,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de l'évaluation de la réponse")
      }

      const data = await response.json()
      return {
        score: data.score, // Score sur 20
        feedback: data.feedback,
        suggestions: data.suggestions,
      }
    } catch (error) {
      console.error("Erreur d'évaluation:", error)
      return {
        score: 0,
        feedback: "Impossible d'évaluer la réponse pour le moment.",
      }
    } finally {
      setIsEvaluating(false)
    }
  }
  const submitQuizAttempt = async () => {
    setIsSubmittingAttempt(true);

    try {
      // Récupérer toutes les réponses accumulées pendant le quiz
      const answersPayload = questions.map((question) => {
        if (question.type === "multiple-choice") {
          return {
            question_id: question.id,
            answer: selectedAnswersPerQuestion[question.id][0] || [],
          };
        } else {
          const answer = openEndedAnswers[question.id];
          if (!answer) throw new Error(`Réponse manquante pour la question ${question.id}`);

          return {
            question_id: question.id,
            answer: answer,
          };
        }
      });
      console.log(answersPayload);

      const response = await fetch(`${BASE_URL}/api/learn/modules/${moduleId}/submit_quiz/`, {
        method: "POST",
        headers: {
          ... await getAuthHeader(),
        },
        body: JSON.stringify({
          time_spent: timeSpent,
          answers: answersPayload,
        }),
      });

      if (!response.ok) throw new Error("Échec de la soumission");

      const result = await response.json();
      console.log("Résultat du quiz:", result);

    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setIsSubmittingAttempt(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (isAnswerSubmitted) return

    if (isMultipleChoice) {
      if (selectedAnswers.length === 0) return

      const correctAnswer = currentQuestion.correctAnswer
      let isAnswerCorrect = false

      if (Array.isArray(correctAnswer)) {
        // For multiple correct answers, check if selected answers match exactly
        const selectedSet = new Set(selectedAnswers)
        const correctSet = new Set(correctAnswer)

        isAnswerCorrect =
          selectedSet.size === correctSet.size && [...selectedSet].every((value) => correctSet.has(value))
      } else if (typeof correctAnswer === "string") {
        // For single correct answer
        isAnswerCorrect = selectedAnswers.length === 1 && selectedAnswers[0] === correctAnswer
      }

      setIsCorrect(isAnswerCorrect)

      if (isAnswerCorrect) {
        setScore(score + 1)
        setFeedback("Bonne réponse !")
      } else {
        setFeedback("Réponse incorrecte")
      }
      if (isMultipleChoice) {
        setSelectedAnswersPerQuestion(prev => ({
          ...prev,
          [currentQuestion.id]: selectedAnswers
        }));
      } else {
        setOpenEndedAnswers(prev => ({
          ...prev,
          [currentQuestion.id]: openEndedAnswer
        }));
      }
      setIsAnswerSubmitted(true)
      // Dans la partie 'else' (questions ouvertes)
    } else {
      setFeedback("Votre réponse a été enregistrée.");
      setIsCorrect(null);
      setIsAnswerSubmitted(true);

      // Enregistrer la réponse immédiatement
      setOpenEndedAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: openEndedAnswer,
      }));

      if (openEndedAnswer.trim()) {
        // Lancer l'évaluation et stocker le résultat
        evaluateOpenEndedAnswer(currentQuestion.id, currentQuestion.question, openEndedAnswer).then((evaluation) => {
          setOpenEndedScores((prev) => ({
            ...prev,
            [currentQuestion.id]: evaluation,
          }));
        });
      }
    }
  }

  const handleNextQuestion = async () => {
    const nextQuestion = currentQuestionIndex + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      // Attendre que toutes les évaluations soient terminées
      await Promise.all(
        questions
          .filter((q) => q.type === "open-ended")
          .map(async (q) => {
            if (openEndedAnswers[q.id] && !openEndedScores[q.id]) {
              await evaluateOpenEndedAnswer(q.id, q.question, openEndedAnswers[q.id]);
            }
          })
      );

      setShowScore(true);
      submitQuizAttempt();
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setScore(0)
    setOpenEndedScores({})
    setShowScore(false)
    setSelectedAnswers([])
    setOpenEndedAnswer("")
    setIsAnswerSubmitted(false)
    setIsCorrect(null)
    setFeedback("")
    setTimeSpent(0) // Reset timer
  }

  const handleCompleteModule = async () => {
    if (onCompleteModule) {
      await onCompleteModule(timeSpent)
    }
    if (setCurrentStep) {
      setCurrentStep("content")
    }
  }

  const progressPercentage = ((currentQuestionIndex + (isAnswerSubmitted ? 1 : 0)) / questions.length) * 100

  // Calcul du score total incluant les questions ouvertes
  const calculateTotalScore = () => {
    const mcqScore = score
    const mcqCount = questions.filter((q) => q.type === "multiple-choice").length

    // Calculer le score des questions ouvertes
    const openEndedQuestions = questions.filter((q) => q.type === "open-ended")
    let openEndedTotalScore = 0
    let evaluatedCount = 0

    openEndedQuestions.forEach((q) => {
      if (openEndedScores[q.id]) {
        openEndedTotalScore += openEndedScores[q.id].score
        evaluatedCount++
      }
    })

    // Si aucune question ouverte n'a été évaluée, on retourne juste le score MCQ
    if (evaluatedCount === 0) {
      return {
        mcqScore,
        mcqCount,
        openEndedScore: 0,
        openEndedCount: openEndedQuestions.length,
        openEndedEvaluatedCount: 0,
        totalScore: mcqScore,
        totalCount: mcqCount,
      }
    }

    // Normaliser le score des questions ouvertes (sur 20) vers un score sur 1 par question
    const normalizedOpenEndedScore = (openEndedTotalScore / 20) * evaluatedCount

    return {
      mcqScore,
      mcqCount,
      openEndedScore: normalizedOpenEndedScore,
      openEndedCount: openEndedQuestions.length,
      openEndedEvaluatedCount: evaluatedCount,
      totalScore: mcqScore + normalizedOpenEndedScore,
      totalCount: mcqCount + openEndedQuestions.length,
    }
  }

  if (!questions || questions.length === 0) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto my-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>Aucune question n'est disponible pour ce quiz.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="quiz-section max-w-3xl mx-auto my-8 space-y-6">
      {!showScore ? (
        <Card className="border border-primary/20 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center mb-2">
              <CardTitle className="text-xl font-bold">Quiz d'évaluation</CardTitle>
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeSpent)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Question {currentQuestionIndex + 1} sur {questions.length}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </CardHeader>

          <CardContent className="pt-6 pb-4">
            {currentQuestion && (
              <>
                <div className="question-text mb-6">
                  <h3 className="text-lg font-semibold mb-1">{currentQuestion.question}</h3>
                  <p className="text-sm text-muted-foreground">
                    {isMultipleChoice
                      ? isMultipleAnswer
                        ? "Sélectionnez toutes les réponses correctes."
                        : "Sélectionnez la réponse correcte."
                      : "Répondez à la question dans le champ ci-dessous."}
                  </p>
                </div>

                {isMultipleChoice ? (
                  isMultipleAnswer ? (
                    // Multiple choice with multiple correct answers (checkboxes)
                    <div className="space-y-3">
                      {currentQuestion.options?.map((option) => {
                        const isSelected = selectedAnswers.includes(option.id)

                        let optionClassName = "border-2 p-4 rounded-lg transition-all"

                        if (isAnswerSubmitted) {
                          if (isSelected && isCorrect) {
                            optionClassName = cn(optionClassName, "border-green-500 bg-green-50 dark:bg-green-950/20")
                          } else if (isSelected && !isCorrect) {
                            optionClassName = cn(optionClassName, "border-red-500 bg-red-50 dark:bg-red-950/20")
                          }
                        } else if (isSelected) {
                          optionClassName = cn(optionClassName, "border-primary bg-primary/5")
                        } else {
                          optionClassName = cn(
                            optionClassName,
                            "border-muted hover:border-primary/50 hover:bg-primary/5",
                          )
                        }

                        return (
                          <div key={option.id} className={optionClassName}>
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                id={option.id}
                                checked={isSelected}
                                onCheckedChange={(checked) => handleMultipleAnswerSelect(option.id, checked as boolean)}
                                disabled={isAnswerSubmitted}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={option.id}
                                  className="text-base font-medium cursor-pointer flex justify-between w-full"
                                >
                                  {option.text}
                                  {isAnswerSubmitted &&
                                    isSelected &&
                                    (isCorrect ? (
                                      <CheckCircle className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-red-500 ml-2 flex-shrink-0" />
                                    ))}
                                </label>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    // Multiple choice with single correct answer (radio buttons)
                    <RadioGroup value={selectedAnswers[0] || ""} className="space-y-3" disabled={isAnswerSubmitted}>
                      {currentQuestion.options?.map((option) => {
                        const isSelected = selectedAnswers[0] === option.id

                        let optionClassName = "border-2 p-4 rounded-lg transition-all"

                        if (isAnswerSubmitted) {
                          if (isSelected && isCorrect) {
                            optionClassName = cn(optionClassName, "border-green-500 bg-green-50 dark:bg-green-950/20")
                          } else if (isSelected && !isCorrect) {
                            optionClassName = cn(optionClassName, "border-red-500 bg-red-50 dark:bg-red-950/20")
                          }
                        } else if (isSelected) {
                          optionClassName = cn(optionClassName, "border-primary bg-primary/5")
                        } else {
                          optionClassName = cn(
                            optionClassName,
                            "border-muted hover:border-primary/50 hover:bg-primary/5",
                          )
                        }

                        return (
                          <div key={option.id} className={optionClassName}>
                            <div className="flex items-start space-x-3">
                              <RadioGroupItem
                                value={option.id}
                                id={option.id}
                                onClick={() => handleSingleAnswerSelect(option.id)}
                                disabled={isAnswerSubmitted}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <label
                                  htmlFor={option.id}
                                  className="text-base font-medium cursor-pointer flex justify-between w-full"
                                >
                                  {option.text}
                                  {isAnswerSubmitted &&
                                    isSelected &&
                                    (isCorrect ? (
                                      <CheckCircle className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-red-500 ml-2 flex-shrink-0" />
                                    ))}
                                </label>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </RadioGroup>
                  )
                ) : (
                  // Open-ended question
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Saisissez votre réponse ici..."
                      value={openEndedAnswer}
                      onChange={(e) => handleOpenEndedAnswerChange(e.target.value)}
                      disabled={isAnswerSubmitted}
                      className="min-h-[150px] border-2 focus:border-primary"
                    />
                  </div>
                )}

                {isAnswerSubmitted && (
                  <Alert
                    className={cn(
                      "mt-6",
                      isCorrect === true
                        ? "bg-green-50 text-green-800 dark:bg-green-950/20 dark:text-green-300"
                        : isCorrect === false
                          ? "bg-red-50 text-red-800 dark:bg-red-950/20 dark:text-red-300"
                          : "bg-blue-50 text-blue-800 dark:bg-blue-950/20 dark:text-blue-300",
                    )}
                  >
                    {isCorrect === true ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isCorrect === false ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>{feedback}</AlertTitle>
                    {!isMultipleChoice && isEvaluating && (
                      <AlertDescription>Évaluation de votre réponse en cours...</AlertDescription>
                    )}
                  </Alert>
                )}
              </>
            )}
          </CardContent>

          <CardFooter className="flex justify-between pt-2">
            {!isAnswerSubmitted ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={isMultipleChoice ? selectedAnswers.length === 0 : !openEndedAnswer.trim()}
                className="w-full"
              >
                Valider ma réponse
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="w-full" variant="default">
                {currentQuestionIndex === questions.length - 1 ? "Voir mon score" : "Question suivante"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card className="border border-primary/20 shadow-lg text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Quiz terminé !</CardTitle>
            <CardDescription>Temps total: {formatTime(timeSpent)}</CardDescription>
          </CardHeader>

          <CardContent className="pb-2">
            <div className="score-display my-6">

              {(() => {
                const scoreData = calculateTotalScore();
                const hasOpenEnded = scoreData.openEndedCount > 0;
                const finalScore = Math.round((scoreData.totalScore / scoreData.totalCount) * 20);
                setEnoughPoints(finalScore >= 10);
                return (
                  <>
                    {/* Afficher un message si certaines réponses ouvertes ne sont pas encore évaluées */}
                    {scoreData.openEndedEvaluatedCount < scoreData.openEndedCount && (
                      <div className="mt-4 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-md">
                        <p className="text-sm text-yellow-800 dark:text-yellow-300">
                          Veuillez patienter pendant l'évaluation finale de vos réponses...
                        </p>
                      </div>
                    )}

                    {/* Affichage du score final */}
                    <div className="text-5xl font-bold mb-2">{finalScore} / 20</div>
                    <Progress
                      value={(scoreData.totalScore / scoreData.totalCount) * 100}
                      className="h-3 w-64 mx-auto"
                    />

                    {/* Section des questions à choix multiples */}
                    <div className="mt-6 grid gap-4">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h3 className="font-semibold mb-1">Questions à choix multiples</h3>
                        <p className="text-lg">
                          {scoreData.mcqScore} / {scoreData.mcqCount} réponses correctes
                        </p>
                      </div>

                      {/* Section des questions ouvertes */}
                      {hasOpenEnded && (
                        <div className="p-4 bg-primary/5 rounded-lg">
                          <h3 className="font-semibold mb-1">Questions ouvertes</h3>
                          {scoreData.openEndedEvaluatedCount > 0 ? (
                            <>
                              <p className="text-lg">
                                Score moyen:{" "}
                                {Math.round((scoreData.openEndedScore / scoreData.openEndedEvaluatedCount) * 20)} / 20
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {scoreData.openEndedEvaluatedCount} sur {scoreData.openEndedCount} questions évaluées
                              </p>

                              {/* Détail des évaluations */}
                              <div className="mt-4 space-y-3 text-left">
                                {questions
                                  .filter((q) => q.type === "open-ended")
                                  .map((q) => {
                                    const evaluation = openEndedScores[q.id];
                                    return (
                                      <div key={q.id} className="border border-primary/10 rounded-md p-3">
                                        <h4 className="font-medium text-sm">{q.question}</h4>
                                        {evaluation ? (
                                          <>
                                            <div className="flex justify-between items-center mt-1">
                                              <span className="text-sm">Score: {evaluation.score}/20</span>
                                            </div>
                                            <p className="text-xs mt-1 text-muted-foreground">{evaluation.feedback}</p>

                                            {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                                              <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                                                <p className="text-xs font-medium text-blue-800 dark:text-blue-300">
                                                  Suggestions d'amélioration:
                                                </p>
                                                <ul className="list-disc list-inside text-xs text-blue-700 dark:text-blue-300 mt-1">
                                                  {evaluation.suggestions.map((suggestion, idx) => (
                                                    <li key={idx}>{suggestion}</li>
                                                  ))}
                                                </ul>
                                              </div>
                                            )}
                                          </>
                                        ) : (
                                          <p className="text-xs mt-1 italic text-muted-foreground">
                                            Évaluation en attente...
                                          </p>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">Vos réponses sont en cours d'évaluation...</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Feedback général */}
                    <p className="mt-6 text-lg">
                      {finalScore >= 16
                        ? "Excellent ! Vous maîtrisez très bien ce sujet."
                        : finalScore >= 12
                          ? "Bon travail ! Vous avez bien compris la plupart des concepts."
                          : finalScore >= 8
                            ? "Continuez à pratiquer pour améliorer votre compréhension."
                            : "Nous vous recommandons de revoir ce module avant de continuer."}
                    </p>

                    {/* Indicateur de soumission en cours */}
                    {isSubmittingAttempt && (
                      <div className="mt-4 p-2 bg-primary/10 rounded-md">
                        <p className="text-sm">Enregistrement de vos résultats...</p>
                      </div>
                    )}
                    {!enoughPoints && (
                      <div className="mt-4 p-2 bg-secondary/10 rounded-md">
                        <p className="text-lg text-red-500">Les points obtenues aux quizzs ne sont pas suffisant</p>
                      </div>
                    )}
                    {enoughPoints && (
                      <div className="mt-4 p-2 bg-secondary/10 rounded-md">
                        <p className="text-lg text-green-500">Vous allez obtenir <g>50 points</g> en finissant la module</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRestartQuiz} variant="outline" className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" />
              Recommencer le quiz
            </Button>
            {onCompleteModule && enoughPoints && (
              <Button onClick={handleCompleteModule} className="w-full sm:w-auto" disabled={isSubmittingAttempt}>
                Terminer le module
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default QuizSection

