import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';

import './text-editor.css';

const TextEditor: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('# Header');
  const eventRef = useRef<HTMLDivElement | null>(null);

  /*
    bublling: the event function from child element can propagate to the event handler to the parent component.
    capturing: the target child event will activate the action event from the parent's event and 
              the event will be get to the target event, and finally the target event will propagate the event up the the parent event again.
    event delegation: by implementing event.target, we can run specific event handler in terms of the element
  */

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // 1)  only when <div ref={eventRef}> is clicked, eventRef.current.contains(event.target as Node) returns true.

      // [ IMPORTANT ]
      // [typecasting] : Node type needs a tones of properties such as childNode and so on.
      // event.target does not have those ALL properties, because it is from DiveEelement. so we need to do typecasting.
      // when the defined value is not able to satisfy the type, we can do typecasting!
      if (eventRef.current && event.target && eventRef.current.contains(event.target as Node)) {
        // nothing to do when clicking in the editor
        return;
      }
      
      // 2) when h1 node is clicked, eventRef.current.contains(event.target as Node) returns false
      //  because it is not <div> element.

      // 3)
      // because it is outside of <div ref={eventRef}> and head --> returns all html elements, not a single node ---> undefined
      // console.log(eventRef.current?.contains(event.target as Node))
      setEditing(false);
    };

    document.addEventListener('click', listener, { capture: true });

    return () => {
      document.removeEventListener('click', listener, { capture: true });
    }
  }, []);

  if (editing) {
    return (
      <div 
        ref={eventRef}
      >
        <MDEditor onChange={(word) => setValue(word || '')} value={value} />
      </div>
    );
  } 

  return (
    <div 
      className="text-editor card"
      onClick={() => setEditing(true)}
    >
      <div className="card-content">
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
}

export default TextEditor;