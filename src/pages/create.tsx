import { type NextPage } from "next";
import Head from "next/head";
import { NavBar } from "../components/NavBar";
import type { ChangeEvent} from "react";
import { useState } from "react";

import { trpc } from "../utils/trpc";

import styles from "../styles/create.module.css";

const Create: NextPage = () => {

  return (
    <>
      <Head>
        <title>Guess the Question - Create Mode</title>
        <meta name="description" content="Guess the question by reading other users answers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <CreateQuestion />
        </div>
      </main>
    </>
  );
};

export default Create


const CreateQuestion: React.FC = () => {
    const {mutate} = trpc.questions.create.useMutation()
    const [input, setInput] = useState<string>('');
  
    const uploadQuestion = () => {
      input && mutate(input)
    }
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if(e.target.value !== undefined && e.target.value !== input) {
        setInput(e.target.value.replaceAll('?', ''))
      }
    }
  
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Create a new question</h3>
        <div className={styles.inputContainer}>
          <input className="textInput" type="text" name="question" value={input} onChange={handleChange} />
          <p>?</p>
        </div>
        <button className="actionButton mainActionButton" onClick={uploadQuestion}>Submit question</button>
      </div>
    )
  }