import { useCallback, useEffect, useState } from "react";
import words from "./wordList";
import HangmanDrawing from "./components/HangmanDrawing";
import HangmanWord from "./components/HangmanWord";
import Keyboard from "./components/HangmanKeyboard";
import WinLoseMessage from "./components/WinLoseMessage";
import Confetti from "react-confetti";
import "./index.css";

function App() {
  //randomly selecting a new word
  const newWord: string = words[Math.floor(Math.random() * words.length)];

  //choosing a random word to be guessed
  const [word, setWord] = useState<string>(newWord);

  //array for storing letters that have already been used
  const [usedLetters, setUsedLetters] = useState<string[]>([]);

  const wrongGuesses = usedLetters.filter((letter) => !word.includes(letter));

  //determine game win or lose state
  const loser = wrongGuesses.length >= 6;
  const winner = word.split("").every((letter) => usedLetters.includes(letter));

  const addUsedLetter = useCallback(
    (letter: string) => {
      //if user has selected this letter already, ignore keypress
      if (usedLetters.includes(letter) || loser || winner) return;

      setUsedLetters((usedLetters) => [...usedLetters, letter]);
    },
    [loser, usedLetters, winner]
  );

  //event listeners for key presses
  useEffect(() => {
    //handler function for key press
    const handleKeyPress = (ev: KeyboardEvent) => {
      const selectedKey = ev.key;

      //ignoring all keys that are not a letter key
      if (!selectedKey.match(/^[a-z,A-Z]$/)) return;

      ev.preventDefault();
      addUsedLetter(selectedKey.toLowerCase());
    };

    //add event listener for key press
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [addUsedLetter]);

  function newGame() {
    setWord(newWord);
    setUsedLetters([]);
  }

  return (
    <div className="text-2xl flex flex-col items-center justify-center min-h-screen h-full w-screen">
      {/* win/lose message display */}
      {loser && <WinLoseMessage winMessage={false} newGame={newGame} />}
      {winner && <WinLoseMessage winMessage={true} newGame={newGame} />}
      {/* what is the point of winning if you don't have a little confetti to celebrate?? */}
      {winner && <Confetti />}

      {/* component with hangman drawing */}
      <HangmanDrawing numGuesses={wrongGuesses.length} />

      {/* word to be guessed */}
      <HangmanWord word={word} usedLetters={usedLetters} showWord={loser} />

      {/* keyboard with keys that can be selected through clicking or pressing respective key on keyboard */}
      <Keyboard
        usedLetters={usedLetters}
        addUsedLetter={addUsedLetter}
        disabled={winner || loser}
      />
    </div>
  );
}

export default App;
