import { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from './Main'
import Login from './Login'
import Register from './Register'

class App extends Component {
    render() {
        return (
            <Routes>
                <Route path='/' element={<Main/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/register' element={<Register/>}/>
            </Routes>
        )
    }
}

export default App;