import { io } from "socket.io-client";


export const initSocket = async () => {
    const options = {
        'force new connection' : true,
        reconnectionAttempt: 'Infinty',
        timeout: 10000,
        transports: ['websocket'],
    };
console.log('process.env.REACT_APP_BACKEND_URL', process.env.REACT_APP_BACKEND_URL_WS)
    return io(process.env.REACT_APP_BACKEND_URL, options)
}