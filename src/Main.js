import { Component } from 'react'
import { Navigate } from 'react-router-dom'
class Main extends Component {
    state = {
        u_id : '',
        nickname : '',
        login : false,
    }

    render() {
        return(
            <div className='common'>
                {(() => {
                    if (!this.state.login) return <Navigate to='/login' replace={true}/>
                })()}
                <div>test</div>
            </div>
        )
    }
}

export default Main;