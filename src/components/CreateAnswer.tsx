import { useState } from "react";
import type { ChangeEvent } from "react";
import { trpc } from "../utils/trpc";
import { Loader } from "./Loader";

import styles from "../styles/answer.module.css";

export const CreateAnswer: React.FC = () => {
  const {mutate} = trpc.answers.create.useMutation();
  const [avoidId, setAvoidId] = useState<string>('')
  const [input, setInput] = useState<string>('');
  
    const { data, isLoading, refetch } = trpc.questions.getRandomQuestions.useQuery({ ammount: 1, avoid: [avoidId] }, { refetchOnWindowFocus: false });

    const question = data? data[0] : undefined;
      
    const submitAnswer = () => {
      input && question && mutate({ text: input, questionId: question.id })
      refetch();
    }

    const handleSkip = () => {
      refetch();
      setAvoidId(question?.id || '')
    }
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if(e.target.value !== undefined && e.target.value !== input) {
        setInput(e.target.value)
      }
    }
    
    return (
      <div className={styles.container}>
        {isLoading ? 
          <Loader /> : (
          <>
            {question ?
              <>
                <h3 className={styles.question}>{question.text}?</h3>
                <input className="textInput" type="text" name="answer" value={input} onChange={handleChange} placeholder="Your answer here" />
                <div className="flex flex-row gap-3">
                  <button className="actionButton mainActionButton" disabled={!input} onClick={submitAnswer} type="button">Submit</button>
                  <button className="actionButton secondaryActionButton" onClick={handleSkip} type="button">Skip &gt;</button>
                </div>
              </>
              :
              <p className={styles.noQuestionsWarning}>No questions 😔</p>
            }
          </>
          )}
        </div>
    )
}