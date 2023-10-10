import React,{useState} from 'react';
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router';

const Home = () => {
  const navigate = useNavigate();
  const [userName,setUserName] = useState("");
  const [roomId, setRoomId] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('New Room created');
  }

  const joinRoom = () => {
    if(!roomId || !userName){
      toast.error('Room Code & User name is requied !');
      return;
    }
       // Redirect
    navigate(`/editor/${roomId}`,{
      state: {
        userName,
      }
    })
  }

  const handleInputEnter = (e) => {
    if(e.code === 'Enter'){
      joinRoom();
    }
  };

  return <div className='homePageWrapper'>
    <div className='formWrapper'>
        <img className='homePageLogo' src='/code-sync.png' alt='code-sync-logo' />
        <h4 className='mainLabel'>Enter the Room Code to Access</h4>
        <div className='inputGroup'>
          <input type='text' className='inputBox' placeholder='Room Code' onChange={(e) => setRoomId(e.target.value)} value={roomId} onKeyUp={handleInputEnter}/>
          <input type='text' className='inputBox' placeholder='User Name' onChange={(e) => setUserName(e.target.value)} value={userName} onKeyUp={handleInputEnter}/>
          <button className='btn joinBtn' onClick={joinRoom}>Access</button>
          <span className='createInfo'>
            If you don't have invite then create &nbsp;
            <a onClick={createNewRoom} href='' className='createNewBtn'>new room</a>
          </span>
        </div>
    </div>
    <footer>
      <h4>Build by <a href='https://www.linkedin.com/in/adarsh-dwivedi-7a4206193/'>0201CS191006</a></h4>
    </footer>
  </div>;
}

export default Home