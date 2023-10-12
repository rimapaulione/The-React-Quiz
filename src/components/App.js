import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextBtn from "./NextBtn";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import PrevBtn from "./PrevBtn";

const SECS_PER_QUESTION = 30;

const initState = {
  questions: [],
  filterQuestion: "all",
  status: "loading",
  index: 0,
  answer: null,
  answerHistory: [],
  points: 0,
  highscore: 0,
  secondRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
        highscore: localStorage.getItem("highscore"),
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "filterQuestions":
      return {
        ...state,
        filterQuestion: action.payload,
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondRemaining: action.payload * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = action.payload.displayQuestions.at(state.index);

      return {
        ...state,
        answer: action.payload.index,
        points:
          action.payload.index === question.correctOption
            ? state.points + question.points
            : state.points,
        answerHistory: [...state.answerHistory, action.payload.index],
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: state.answerHistory[state.index + 1]
          ? state.answerHistory[state.index + 1]
          : null,
      };
    case "prevQuestion":
      return {
        ...state,
        index: state.index - 1,
        answer: state.answerHistory[state.index - 1],
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initState,
        status: "ready",
        questions: state.questions,
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondRemaining: state.secondRemaining - 1,
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondRemaining,
      filterQuestion,
    },
    dispatch,
  ] = useReducer(reducer, initState);

  let displayQuestions;
  if (filterQuestion === "easy")
    displayQuestions = questions.filter((question) => question.points === 10);
  else if (filterQuestion === "medium")
    displayQuestions = questions.filter((question) => question.points === 20);
  else if (filterQuestion === "advanced")
    displayQuestions = questions.filter((question) => question.points === 30);
  else displayQuestions = questions;

  const numQuestions = displayQuestions?.length;
  const maxPossiblePoints = displayQuestions?.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  useEffect(function () {
    const fetchData = async function () {
      try {
        const res = await fetch("http://localhost:8000/questions");
        const data = await res.json();
        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        dispatch({ type: "dataFailed" });
      }
    };
    fetchData();
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen dispatch={dispatch} numQuestions={numQuestions} />
        )}

        {status === "active" && (
          <>
            <Progress
              index={index}
              points={points}
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              displayQuestions={displayQuestions}
              question={displayQuestions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <PrevBtn dispatch={dispatch} index={index} />
              <Timer dispatch={dispatch} secondRemaining={secondRemaining} />
              <NextBtn
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            dispatch={dispatch}
            highscore={highscore}
          />
        )}
      </Main>
    </div>
  );
}
