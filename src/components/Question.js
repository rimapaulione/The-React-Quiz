import Options from "./Options";
function Question({ question, dispatch, answer, displayQuestions }) {
  return (
    <div>
      <h4>{question.question}</h4>
      <Options
        question={question}
        dispatch={dispatch}
        answer={answer}
        displayQuestions={displayQuestions}
      />
    </div>
  );
}

export default Question;
