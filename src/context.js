import axios from "axios";
import React, { useState, useContext } from "react";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: "sports",
    difficulty: "easy",
  });

  async function getQuestion(url) {
    setLoading(true);
    setWaiting(false);

    const response = await axios(url).catch((err) => console.log(err));
    console.log(response);

    if (response) {
      const data = response.data.results;

      if (data.length > 1) {
        setQuestions(data);
        setLoading(false);
        setWaiting(false);
        setError(false);
      } else {
        setWaiting(true);
        setError(true);
      }
    } else {
      setWaiting(true);
    }
  }

  function nextQuestion() {
    setIndex((oldIndex) => {
      const index = oldIndex + 1;

      if (index > questions.length - 1) {
        openModal();
        return 0;
      } else {
        return index;
      }
    });
  }

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setWaiting(true);
    setCorrect(0);
    setIsModalOpen(false);
  }

  function checkAnswer(value) {
    if (value) {
      setCorrect((oldState) => oldState + 1);
    }
    nextQuestion();
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setQuiz({ ...quiz, [name]: value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const { amount, category, difficulty } = quiz;

    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`;
    getQuestion(url);
  }

  return (
    <AppContext.Provider
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
        quiz,
        openModal,
        closeModal,
        checkAnswer,
        nextQuestion,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
