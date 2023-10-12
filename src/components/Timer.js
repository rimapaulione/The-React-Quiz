import { useEffect } from "react";

function Timer({ dispatch, secondRemaining }) {
  const mins = Math.floor(secondRemaining / 60);
  const seconds = secondRemaining - mins * 60;

  useEffect(() => {
    const id = setInterval(() => {
      if (secondRemaining === 0) {
        dispatch({ type: "finish" });
      } else {
        dispatch({ type: "tick" });
      }
    }, 1000);

    return () => clearInterval(id);
  }, [dispatch, secondRemaining]);

  return (
    <div className="timer">
      {mins < 10 && "0"}
      {mins}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
}

export default Timer;
