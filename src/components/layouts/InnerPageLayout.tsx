import React from 'react'
import { useHistory } from 'react-router-dom'

interface Props {
    disableBack?: boolean
}

const Layout: React.FC<Props> = ({ children, disableBack }) => {
    const history = useHistory()
    
    const goBack = () => {
        if (!disableBack) history.goBack()
    }

    return (
        <div className="container">
            <div className="topbar">
                <div className="back-btn"
                    style={{ color: disableBack ? "gray" : "white" }}
                    onClick={goBack}
                >
                    back
                </div>
            </div>
            {children}
        </div>
    )
}

export default Layout