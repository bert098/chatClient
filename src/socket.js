import { Socket } from "socket.io-client";
import SocketIO from 'socket.io-client'
export const client = SocketIO(`${location.protocol}//${location.host}`.replace('http', 'ws'), {
    transports: ['websocket']
})
client.addEventListener('echo', msg =>{
    console.log(msg)
})