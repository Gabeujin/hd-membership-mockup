import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function Counter() {
    const [count, setCount] = useState<number>(0);
    const handleClick = (): void => {
        setCount(count + 1);
    };
    return (
        <div>
            <h1>Counter</h1>
            <button onClick={handleClick}>count is {count}</button>
        </div>
    );
}

function LogoLink({href,src,alt}: {href: string, src: string, alt: string}){
    return (
        <a href={href} target="_blank">
            <img src={src} className="logo" alt={alt} />
        </a>
    );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <LogoLink href="https://vite.dev" src={viteLogo} alt="Vite logo" />
        <LogoLink href="https://react.dev" src={reactLogo} alt="React logo" />
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
