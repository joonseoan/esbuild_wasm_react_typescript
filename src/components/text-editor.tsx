import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';

import { useActions } from '../hooks/use-actions';

import './text-editor.css';
import { Cell } from '../redux';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {

  const [editing, setEditing] = useState(false);
  // const [value, setValue] = useState('# Header'); // moved to redux
  const eventRef = useRef<HTMLDivElement | null>(null);
  const { updateCell } = useActions();


  /*
    [IMPORTANT]
    bubbling: the event function from child element can propagate to the event handler to the parent component.
    capturing: the target child event will activate the action event from the parent's event and 
              the event will get to the target event, and finally the target event will propagate the event up the the parent event again.
    event delegation: by implementing event.target, we can run specific event handler in terms of the element
  */

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // 1) only when <div ref={eventRef}> is clicked, eventRef.current.contains(event.target as Node) returns true.

      // [ IMPORTANT ]
      // [typecasting] : eventRef.current.contains requires "Node" type as an argument.
      // event.target does not have a tone of properties including Node, because it is from DivElement. so we need to do typecasting.
      // when the defined value is not able to satisfy the type, we can do typecasting!
      // console.log('event.target: ', event.target);
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
        <MDEditor onChange={(word) => updateCell(cell.id, word || '')} value={cell.content} />
      </div>
    );
  } 

  return (
    <div 
      className="text-editor card"
      onClick={() => setEditing(true)}
    >
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || 'Click to Edit'} />
      </div>
    </div>
  );
}

export default TextEditor;