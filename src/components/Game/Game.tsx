import { useState } from "react";
import type { Question } from "@prisma/client";
import { trpc } from "../../utils/trpc";

export const Game: React.FC<{questions: Question[]}> = ({ questions }) => {
    const question = questions[Math.floor(Math.random()*questions.length)] || questions[0]
    const ANSWER_PAGINATION_AMMOUNT = 5

    const [answerCount, setAnswerCount] = useState<number>(1);

    const { data: answers, hasNextPage, fetchNextPage} = trpc.answers.getByQuestionId.useInfiniteQuery(
      { id: question?.id || '', ammount: ANSWER_PAGINATION_AMMOUNT }, 
      { getNextPageParam: (lastPage) => lastPage[lastPage.length-1]?.id, refetchOnWindowFocus: false })
      
    if(!question) return null;
    const incrementCount = () => {
        setAnswerCount(prev => prev+1)
    }
    const paginateAdvance = () => {
      fetchNextPage();
      incrementCount();
    }
    const currentPage = answers?.pages[Math.floor(answerCount/ANSWER_PAGINATION_AMMOUNT)] || [];
    const currentItemIndex = answerCount % ANSWER_PAGINATION_AMMOUNT;
    return (
      <div>
        {currentPage && currentPage?.length > 0 && (
            <>
                {currentPage[currentItemIndex]?.text}
                {currentItemIndex < currentPage.length-1 ? 
                <button onClick={incrementCount}>Show next answer</button>
                :
                <>
                  {hasNextPage !== undefined && hasNextPage && <button onClick={paginateAdvance}>fetch more</button>}
                </>
                }
            </>
        )}
      </div>
    )
  }