// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

const useLocalStorageState = (key, initialValue) => {
  const [value, setValue] = React.useState(() => {
    let localStorageValue = window.localStorage.getItem(key);
    if (localStorageValue)
      return JSON.parse(localStorageValue);
    return typeof(initialValue) === 'function' ? initialValue() : initialValue;
  });

  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [value, key])

  return [value, setValue];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', () => initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
