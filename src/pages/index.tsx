import { type NextPage } from "next";
import Head from "next/head";
import { NavBar } from "../components/NavBar";
import { Game } from "../components/Game/Game";
import { CreateAnswer } from "../components/CreateAnswer";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: questions, isLoading, error } = trpc.questions.getRandomQuestions.useQuery({ ammount: 5 }, { refetchOnWindowFocus: false });

  if(isLoading) return null;
  if(error) alert(error.message)
  const randQuestions = questions?.sort(() => Math.random() - 0.5)

  return (
    <>
      <Head>
        <title>Guess the Question</title>
        <meta name="description" content="Guess the question by reading other users answers" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <CreateAnswer />
        {randQuestions && <Game questions={randQuestions} />}
      </main>
    </>
  );
};

export default Home;
