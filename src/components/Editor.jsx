import React, { forwardRef, useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../Actions';

const Editor = ({roomId, onCodeChange}, socketRef) => {

  const editorRef = useRef(null);

  useEffect(() => {
    async function init(){
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('realtimeEditor'),
        {
        mode: {name: 'javascript', json: true},
        theme: 'dracula',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
      }
      );

      editorRef.current.on('change', (instance, changes) => {
        const {origin} = changes;
        const code = instance.getValue();
        console.log('code sss', code)
        onCodeChange(code);
        if(origin !== 'setValue'){
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
    }
    init ();
  },[])

  useEffect(() => {
    if(socketRef.current){
      console.log('socketRef.currencccccct', socketRef.current)
      socketRef.current.on(ACTIONS.CODE_CHANGE, ({code}) => {
        console.log('code', code)
        if(code !== null){
          editorRef.current.setValue(code);
        }
      });
    }
    return () => {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  },[socketRef.current]);

  return <textarea id='realtimeEditor' ref={editorRef}></textarea>
}

export default forwardRef(Editor)