import { useAtom } from 'jotai'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import logo from '../assets/icon.png'
import { socketAtom } from '../state/socket'

const Waiting = () => {
    const [socket,] = useAtom(socketAtom)
    const history = useHistory()

    useEffect(() => {
        socket.on("system:ready", () => {
            history.push("/home")
        })

        return () => {
            socket.removeAllListeners("system:ready")
        }
    }, [])

    return (
        <div className='waiting-bg'>
            <img src={logo} alt='techcast' className='wait-logo' />
            <h1>Loading...</h1>
            <p>กำลังเปิด server อยู่ ปกติจะใช้เวลา 10วิ - 5นาทีแล้วแต่ความแรงคอม</p>
            <p>แล้วถ้ามากกว่า 5 นาที น่ะหรอ.... ก็แตกไงไอ้สั*</p>
        </div>
    )
}

export default Waiting
