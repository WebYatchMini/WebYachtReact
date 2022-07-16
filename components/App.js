import { Component } from 'react'
import { Route, Routes } from 'react-router-dom'
import Main from './Main'
import Login from './Login'
import Register from './Register'
import Room from './Room'

class App extends Component {
    render() {
        return (
            <Routes>
                <Route exact path='/' element={<Login/>} />
                <Route path='/login' element={<Login/>} />
                <Route path='/register' element={<Register/>}/>
                <Route path='/main' element={<Main/>} />
                <Route path='/room' element={<Room/>} />
            </Routes>
        )
    }
}

export default App;
