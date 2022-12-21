import type { ChangeEvent} from "react";
import { useState, useCallback, useRef } from "react";
import { Answer} from "@prisma/client";
import type { Question, User } from "@prisma/client";
import { trpc } from "../../utils/trpc";

import styles from "../../styles/game.module.css";
import { Loader } from "../Loader";
import { UserImage } from "../User/UserImage";

interface GuessTheQuestionProps {
  question: Question | undefined;
  nextFunction: () => void;
}

export const Game: React.FC = () => {
    return (
      <div className={styles.container}>
        <QuestionContainer />
      </div>
    )
  }

  const QuestionContainer: React.FC = () => {
    const avoidIds = useRef<string[]>([])
    const { 
      data: question,
      isLoading,
      isFetching,
      refetch
    } = trpc.questions.getRandomQuestion.useQuery(
        { avoid: avoidIds.current }, { refetchOnWindowFocus: false }
      )
    const handleSkip = useCallback(() => {
      if(question && !avoidIds.current.includes(question.id)) {
        avoidIds.current = [...avoidIds.current, question.id]
      }
      refetch();
      }, [question, avoidIds, refetch]
    )
    return(
      <>
        {(isLoading || isFetching) ? <Loader /> :
          <>
            <GuessTheQuestion question={question} nextFunction={handleSkip} />
            {!!question ? 
              <button className="actionButton secondaryActionButton mt-6" type="button" onClick={handleSkip}>Skip question</button> :
              <button className="actionButton mainActionButton" type="button" onClick={handleSkip}>{isFetching ? '...' : 'Search more questions'}</button>
            }
          </>
        }
      </>
    )
  }


const GuessTheQuestion: React.FC<GuessTheQuestionProps> = ({ question, nextFunction }) => {
  const ANSWER_PAGINATION_AMMOUNT = 5
  const INITIAL_SCORE = 100;
  const [answerCount, setAnswerCount] = useState<number>(0);
  const [answersLog, setAnswersLog] = useState<string[]>([]);
  const [guess, setGuess] = useState<string>('');
  const [score, setScore] = useState<number>(INITIAL_SCORE);
  const { 
    data: answers,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetchingNextPage
  } = trpc.answers.getByQuestionId.useInfiniteQuery(
      { id: question?.id || '', ammount: ANSWER_PAGINATION_AMMOUNT }, 
      { getNextPageParam: (lastPage) => lastPage[ANSWER_PAGINATION_AMMOUNT-1] ? lastPage[ANSWER_PAGINATION_AMMOUNT-1]?.id : undefined,
        onSuccess: (data) => { if(data.pages[0]?.length === 0) nextFunction() },
        refetchOnWindowFocus: false, enabled: !!question
      }
    )
  const { mutate } = trpc.game.evaluateAnswer.useMutation();
  const incrementCount = () => {
    setAnswerCount(prev => prev+1)
  }
  const decrementCount = () => {
    setAnswerCount(prev => prev-1)
  }
  const currentPage = answers?.pages[Math.floor(answerCount/ANSWER_PAGINATION_AMMOUNT)] || [];
  const currentItemIndex = answerCount % ANSWER_PAGINATION_AMMOUNT;
  
  const saveAnswerLog = () => {
    if(currentPage && currentPage.length > 0)
    setAnswersLog((prev) => [...new Set([...prev, ...currentPage.map(ans => ans.id)])])
  }
  const paginateAdvance = () => {
    saveAnswerLog();
    fetchNextPage();
    setScore((prev) => prev-10)
    setAnswerCount(0);
  }
  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if(e.target.value !== undefined && e.target.value !== guess) {
      saveAnswerLog();
      setGuess(e.target.value)
    }
  }
  const handleSubmit = () => {
    if(!question) return;
    mutate({
      answer: guess,
      originalQuestion: question.text
    })
  }
  if(isLoading || isFetchingNextPage) return <Loader />;
  return(
    <>
      {currentPage && currentPage?.length > 0 && (
        <>
            <p className="text-2xl text-white font-extrabold text-center">{score} pts</p>
            <Answer answer={currentPage[currentItemIndex]} />
            <div>
              <button 
                className="actionButton secondaryActionButton" 
                onClick={decrementCount}
                disabled={currentItemIndex === 0}
              >
                  {"<"} Prev
              </button>
              <button 
                className="actionButton secondaryActionButton"
                onClick={incrementCount}
                disabled={currentItemIndex >= currentPage.length-1}
              >
                  Next {">"} 
              </button>
            </div>
            {hasNextPage !== undefined && hasNextPage && 
            <button className="actionButton secondaryActionButton" onClick={paginateAdvance}>
              fetch more <span className="text-right ml-2 text-red-600 text-sm italic">-10pts</span>
            </button>}
            <input className="textInput text-center" type="text" value={guess} placeholder="Your guess" onChange={handleInput}/>
            <button disabled={!guess} className="actionButton mainActionButton" onClick={handleSubmit}>Guess</button>
        </>
    )}
  </>
)}

const Answer: React.FC<{answer?: (Answer & { author: User | null})}> = ({ answer }) => {
  return(
    <div className={styles.answer}>
    <p>
      {answer?.text}
    </p>
    <div className={styles.authorInfo}>
      {answer?.author?.name || 'Anon'}
      <UserImage 
        url={answer?.author?.image}
        username={answer?.author?.name || 'Anon'} 
      />
    </div>
  </div>
)}