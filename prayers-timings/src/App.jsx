import { Container } from "@mui/material"
import Main from "./component/Main"
import { ClassNames } from "@emotion/react"
import "./App.css"
import styled from "@emotion/styled"
function App() {

  return (
    <>
    <div className="M">
       <Container maxWidth="xl">
        <Main/>
        </Container>
        </div>
    </>
  )
}

export default App
