// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonDataView, PokemonForm, PokemonInfoFallback} from '../pokemon'
import { ErrorBoundary } from 'react-error-boundary';

class HandleErrorBoundary extends React.Component{  
  constructor(props){
    super(props);
    this.state = {
      hasError: false,
      error: ''
    };
  }

  static getDerivedStateFromError(error){
    console.log(error)
    return { hasError: true, error: error }
  }

  componentDidCatch(error, errorInfo){
    console.log(error, errorInfo)
  }

  render(){
    if (this.state.hasError){
      return <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{this.state.error.message}</pre>
    </div>
    }

    return this.props.children;
  }
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null
  })
  
  React.useEffect(() => {
    if (pokemonName){
      (async () => {
        setState({
          status: 'pending',
        })
        const res = await fetchPokemon(pokemonName).catch(err => {
            setState({
            status: 'rejected',
            error: err
          });
        })
        if (res){
          setState({
            status: 'resolved',
            pokemon: res
          })
        }
      })()
    }

  }, [pokemonName])

  if (state.status === 'rejected') throw state.error;

  return <>
    {state.status === 'idle' && 'Submit a pokemon'}
    {state.status === 'pending' && <PokemonInfoFallback name={pokemonName} />}
    {state.status === 'resolved' && <PokemonDataView pokemon={state.pokemon} />}
  </>
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary resetKeys={[pokemonName]} FallbackComponent={(props) => {
          return <div role="alert">
                  There was an error: <pre style={{whiteSpace: 'normal'}}>{props.error.message}</pre>
                </div>
          }}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
