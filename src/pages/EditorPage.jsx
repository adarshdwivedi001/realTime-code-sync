import React, { useState,useRef, useEffect } from 'react'
import Client from '../components/Client';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import ACTIONS from '../Actions';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Socket } from 'socket.io-client';

const EditorPage = () => {
  const reactNavigator = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const {roomId} = useParams()

  const [clients,setClients] = useState([
    
  ]);

  useEffect(() =>{
    const init = async () => {
      socketRef.current = await initSocket();
      console.log('socketRef.current ', socketRef.current )
      socketRef.current.on('connect_error', (err) => handleErrors(err));
      socketRef.current.on('connect_failed', (err) => handleErrors(err));

      function handleErrors(e){
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.userName
      });

      socketRef.current.on(ACTIONS.JOINED, 
        ({clients,username,socketId}) => {
          if(username !== location.state?.userName){
            toast.success(`${username} joined the room`);
          }
          setClients(clients);
          console.log('clients', codeRef.current)
          if (codeRef.current) {
            socketRef.current.emit(ACTIONS.SYNC_CODE, {
              code: codeRef.current,
              socketId,
            });
          }
        });

         socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId,username}) => {
          toast.success(`${username} left the room.`);
          setClients((prev) => {
            return prev.filter(
              (client) => client.socketId !== socketId
            );
          })
         }
         );
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  }, []);

  async function copyRoomId(){
    try{
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied')
    } catch(err){
      toast.error('could not copy room ID');
      console.error(error);
    }
  }

  function leaveRoom(){
    reactNavigator('/');
  }


  if(!location.state) {
    return <Navigate to='' />
  }

  return <div className='mainWrap'>
    <div className='aside'>
      <div className='asideInner'>
        <div className='logo'>
          <img className='logoImage' src='/code-sync.png' />
        </div>
        <h3>Connected</h3>
        <div className='clientList'>
           {clients.map((client)=>(
              <Client 
              key = {client.socketId}
              username = {client.username}
              />
           ))}
        </div>
      </div>
      <button className='btn copyBtn' onClick={copyRoomId}>copy Room CODE</button>
      <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
    </div>
    <div className='editorWrap'>
      <Editor ref={socketRef} roomId={roomId} onCodeChange={(code) => {
        codeRef.current = code;
        }}
        />
    </div>
  </div>
}

export default EditorPage