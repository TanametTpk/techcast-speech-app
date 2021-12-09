import {atom} from 'jotai'
import socketIOClient from 'socket.io-client'
import { getServerAddress } from '../utils/requests';

const socket = socketIOClient(getServerAddress());

socket.on("connect", () => {
    console.log("connected");
})

export const socketAtom = atom(socket)