// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'

function useLocalStorage(key, initialValue = '') {
  const [value, setValues] = React.useState(() => {
    return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : typeof(initialValue) === 'function' ? initialValue() : initialValue;
  });

  const ref = React.useRef(key);

  React.useEffect(() => {
    if (key !== ref.current){
      localStorage.removeItem(ref.current);
      ref.current = key;
    }
    
    if (value)
      localStorage.setItem(key, JSON.stringify(value));
  }, [value, key])

  return [value, setValues];
}

function Board({squares, onClick}) {

  function renderSquare(i) {
    return (
      <button className="square" onClick={() => onClick(i)}>
        {squares[i]}
      </button>
    )
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

function Game() {
  const [squaresArr, setSquaresArr] = useLocalStorage('squares', () => [Array(9).fill(null)]);

  const currentSquares = squaresArr[squaresArr.length - 1];
  const winner = calculateWinner(currentSquares);
  const nextValue = calculateNextValue(currentSquares);
  const status = calculateStatus(winner, currentSquares, nextValue);

  function selectSquare(square) {
    if (currentSquares[square] || winner)
      return;
    let localSquares = [...currentSquares];
    localSquares[square] = nextValue;
    setSquaresArr([...squaresArr, localSquares]);
  }

  function goBackToMove(index) {
    setSquaresArr(squaresArr.slice(0, index + 1));
  }

  function restart() {
    setSquaresArr([Array(9).fill(null)])
  }

  const moves = squaresArr.map((squareArr, index) => {
    return <div style={{marginBottom: '5px'}}>{index + 1},<button disabled={index === (squaresArr.length - 1)} onClick={() => goBackToMove(index)}>{`Got to ${index === 0 ? 'game start' : 'move #' + index}`}{index === (squaresArr.length - 1) ? ' current' : ''}</button></div>
  })

  return (
    <div className="game">
      <div className="game-board">
        <Board onClick={selectSquare} squares={currentSquares} />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
