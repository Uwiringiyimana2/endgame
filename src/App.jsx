import { useState } from 'react'
import { languages } from '../languages'
import { clsx } from 'clsx'

export default function AssemblyEndgame() {

  const [currentWord, setCurrentWord] = useState("react")
  const [guessedLetters, setGuessedLetters] = useState([])
  
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  const wrongGuessCount = 
    guessedLetters.filter(letter => !currentWord.includes(letter)).length

  const isGameWon = 
    currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1
  const isGameOver = isGameWon || isGameLost
  
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

  const wordElements = currentWord.split("").map((letter, index) => (
    <span key={index}>
      {guessedLetters.includes(letter) ? letter.toUpperCase() : ""}
    </span>
  ))

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

  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>Guess the word in under 8 attempts to keep the
           programming world safe from Assembly!</p>
      </header>
      {isGameWon ? <section className="game-status">
        <h2>You won!</h2>
        <p>Well done! 🎉</p>
      </section> : isGameLost ?
      <section className="game-status">
        <h2>Game Over!</h2>
        <p>You lose! Better start learning Assembly 😭</p>
      </section> : ""}
      <section className='language'>
        {languageList}
      </section>
      <section className='word'>
        {wordElements}
      </section>
      <section className='keyboard'>
        {keyboardEls}
      </section>
      {isGameOver && <button className="new-game">New Game</button>}
    </main>
  )
}

