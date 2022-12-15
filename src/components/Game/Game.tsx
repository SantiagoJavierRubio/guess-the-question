import type { ChangeEvent} from "react";
import { useState, useMemo, useEffect } from "react";
import type { Question } from "@prisma/client";
import { trpc } from "../../utils/trpc";

import styles from "../../styles/game.module.css";
import { Loader } from "../Loader";
import { UserImage } from "../User/UserImage";

export const Game: React.FC<{questions: Question[]}> = ({ questions }) => {
    const question = useMemo(() => questions[Math.floor(Math.random()*questions.length)] || questions[0], [questions]) 
    const ANSWER_PAGINATION_AMMOUNT = 5

    const [answerCount, setAnswerCount] = useState<number>(0);
    const [guess, setGuess] = useState<string>('');
    const [answersLog, setAnswersLog] = useState<string[]>([]);

    const { data: answers, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage} = trpc.answers.getByQuestionId.useInfiniteQuery(
      { id: question?.id || '', ammount: ANSWER_PAGINATION_AMMOUNT }, 
      { getNextPageParam: (lastPage) => lastPage[ANSWER_PAGINATION_AMMOUNT-1] ? lastPage[ANSWER_PAGINATION_AMMOUNT-1]?.id : undefined, refetchOnWindowFocus: false })

    if(!question) return <Loader />;
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
      setAnswerCount(0);
    }


    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
      if(e.target.value !== undefined && e.target.value !== guess) {
        saveAnswerLog();
        setGuess(e.target.value)
      }
    }

    return (
      <div className={styles.container}>
        {isLoading || isFetchingNextPage && <Loader />}
        {currentPage && currentPage?.length > 0 && (
            <>
                <div className={styles.answer}>
                  <p>
                    {currentPage[currentItemIndex]?.text}
                  </p>
                  <div className={styles.authorInfo}>
                    {currentPage[currentItemIndex]?.author?.name || 'Anon'}
                    <UserImage 
                      url={currentPage[currentItemIndex]?.author?.image}
                      username={currentPage[currentItemIndex]?.author?.name || 'Anon'} 
                    />
                  </div>
                </div>
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
                <button disabled={!guess} className="actionButton mainActionButton" onClick={()=> null}>Guess</button>
            </>
        )}
      </div>
    )
  }