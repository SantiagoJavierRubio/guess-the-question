import { type NextPage } from "next";
import { useState, useMemo } from "react";
import Head from "next/head";
import { NavBar } from "../components/NavBar";
import { Game } from "../components/Game/Game";
import { CreateAnswer } from "../components/CreateAnswer";
import { Loader } from "../components/Loader";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [avoidIds, setAvoidIds] = useState<string[]>([])
  const { data: questions, isLoading, error, refetch, isFetching } = trpc.questions.getRandomQuestions.useQuery({ ammount: 5, avoid: avoidIds }, { refetchOnWindowFocus: false });

  if(error) alert(error.message)
  const randQuestions = questions?.sort(() => Math.random() - 0.5)

  const handleSkip = () =>  {
    if(!randQuestions) return;
    const questionId = randQuestions[0] ? randQuestions[0].id : undefined
    if(questionId) setAvoidIds((prev) => [...new Set([...prev, questionId])])
    refetch();
  }
  return (
    <>
      <Head>
        <title>Guess the Question</title>
        <meta name="description" content="Guess the question by reading other users answers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {(isFetching || isLoading) ?
         <Loader />
        :(
          <>
            {/* <CreateAnswer /> */}
            {randQuestions && randQuestions?.length > 0 ? (
              <>
              <Game questions={randQuestions} />
              <button className="actionButton secondaryActionButton mt-6" type="button" onClick={handleSkip}>Skip question</button>
              </>
            ) :
              <button className="actionButton mainActionButton" type="button" onClick={handleSkip}>{isFetching ? '...' : 'Search more questions'}</button>
            }
          </>
        )}
      </main>
    </>
  );
};

export default Home;
