import Smartcard from "./Smartcard/Smartcard.jsx"

function App() {

  return (
    <>
      <Smartcard name="Martin" contact="martingomezmartinezostos@gmail.com" onclick={() => {
        alert("yay")
      }}/> 
      <Smartcard/> 
    </>
  )
}

export default App
