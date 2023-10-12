function StartScreen({ dispatch, numQuestions }) {
  return (
    <div className="start">
      <h2>Welcome to The React Quiz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <div className="start_btn">
        <select
          className="btn btn-ui"
          onChange={(e) =>
            dispatch({ type: "filterQuestions", payload: e.target.value })
          }
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="advanced">Advanced</option>
        </select>
        <button
          className="btn btn-ui"
          onClick={() => dispatch({ type: "start", payload: numQuestions })}
        >
          Let's start
        </button>
      </div>
    </div>
  );
}

export default StartScreen;
