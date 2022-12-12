import type { ChangeEvent} from "react";
import { useState, useMemo } from "react";
import type { Question } from "@prisma/client";
import { trpc } from "../../utils/trpc";

import styles from "../../styles/game.module.css";
import { Loader } from "../Loader";
import { UserImage } from "../User/UserImage";

export const Game: React.FC<{questions: Question[]}> = ({ questions }) => {
    const question = useMemo(() => questions[Math.floor(Math.random()*questions.length)] || questions[0], [questions]) 
    const ANSWER_PAGINATION_AMMOUNT = 5

    const [answerCount, setAnswerCount] = useState<number>(1);
    const [guess, setGuess] = useState<string>('');

    const { data: answers, hasNextPage, fetchNextPage, isLoading} = trpc.answers.getByQuestionId.useInfiniteQuery(
      { id: question?.id || '', ammount: ANSWER_PAGINATION_AMMOUNT }, 
      { getNextPageParam: (lastPage) => lastPage[lastPage.length-1]?.id, refetchOnWindowFocus: false })
      
    if(!question) return <Loader />;
    const incrementCount = () => {
        setAnswerCount(prev => prev+1)
    }
    const paginateAdvance = () => {
      fetchNextPage();
      incrementCount();
    }

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
      if(e.target.value !== undefined && e.target.value !== guess) {
        setGuess(e.target.value)
      }
    }

    const currentPage = answers?.pages[Math.floor(answerCount/ANSWER_PAGINATION_AMMOUNT)] || [];
    const currentItemIndex = answerCount % ANSWER_PAGINATION_AMMOUNT;
    return (
      <div className={styles.container}>
        {isLoading && <Loader />}
        {currentPage && currentPage?.length > 0 && (
            <>
                <div className={styles.answer}>
                  <p>
                    {currentPage[currentItemIndex]?.text}
                  </p>
                  <div className={styles.authorInfo}>
                    {currentPage[currentItemIndex]?.author?.name || 'Anon'}
                    <UserImage url={currentPage[currentItemIndex]?.author?.image} />
                  </div>
                </div>
                {currentItemIndex < currentPage.length-1 ? 
                  <button className="actionButton secondaryActionButton" onClick={incrementCount}>Next {">"}</button>
                :
                <>
                  {hasNextPage !== undefined && hasNextPage && 
                  <button className="actionButton secondaryActionButton" onClick={paginateAdvance}>fetch more</button>}
                </>
                }
                <input className="textInput" type="text" value={guess} placeholder="Guess the question" onChange={handleInput}/>
                <button disabled={!guess} className="actionButton mainActionButton" onClick={()=> null}>Guess</button>
            </>
        )}
      </div>
    )
  }