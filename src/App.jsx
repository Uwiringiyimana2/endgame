import { useState } from 'react'
import { languages } from '../languages'
import { clsx } from 'clsx'
import { getFarewellText, getRandomWord } from '../utils'
import Confetti from 'react-confetti'

export default function AssemblyEndgame() {

  const [currentWord, setCurrentWord] = useState(() => getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState([])
  
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  const wrongGuessCount = 
    guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = 
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)
  
  function addGuessedLetter(letter) {
    setGuessedLetters(prevLetters => (
      prevLetters.includes(letter) ?
        prevLetters :
        [...prevLetters, letter]
    ))
  }

  const languageList = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color
    }
    const className = clsx("chip", isLanguageLost && "lost")
    return <span style={styles} className={className}>{lang.name}</span>
  })

  const wordElements = currentWord.split("").map((letter, index) => {
    const shouldRevealLetter = isGameLost || guessedLetters.includes(letter)
    const letterClassName =
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : ""}
      </span>
    )
  })

  const keyboardEls = alphabet.split("").map(letter => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })
    return (
      <button
        className={className} 
        key={letter} 
        onClick={() => addGuessedLetter(letter)}
      >
        {letter.toUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function startGameOver() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
          <p 
            className='farewell-message'
          >
            {getFarewellText(languages[wrongGuessCount - 1].name)}
          </p>)
    }
    if (!isGameOver) {
        return null
    }

    if (isGameWon) {
        return (
            <>
                <h2>You win!</h2>
                <p>Well done! 🎉</p>
            </>
        )
    } 
    if (isGameLost) {
        return (
            <>
                <h2>Game over!</h2>
                <p>You lose! Better start learning Assembly 😭</p>
            </>
        )
    }
    return null
  }

  return (
    <main>
      {
        isGameWon && 
          <Confetti 
            recycle={false}
            numberOfPieces={1000}
          />
      }
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the
           programming world safe from Assembly!</p>
      </header>
      <section className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className='language'>
        {languageList}
      </section>
      <section className='word'>
        {wordElements}
      </section>
      <section className='keyboard'>
        {keyboardEls}
      </section>
      {isGameOver && <button onClick={startGameOver} className="new-game">New Game</button>}
    </main>
  )
}

