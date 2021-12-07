import React from 'react'
// import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import styles from 'components/layouts/InnerPage.module.scss';

// const Container = styled.div`
//     height: 100vh
//     margin: 0;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     flex-direction: column;
// `

// const TopBar = styled.div`
//     position: absolute;
//     top: 0;
//     left: 0;
//     padding: 1.5em;
// `

// const BackButton = styled.div`
//     cursor: pointer;
// `

interface Props {
    disableBack?: boolean
}

const Layout: React.FC<Props> = ({ children, disableBack }) => {
    const navigate = useNavigate()
    
    const goBack = () => {
        if (!disableBack) navigate(-1)
    }

    return (
        <div className={styles["container"]}>
            <div className={styles["topbar"]}>
                <div className={styles["back-btn"]}
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