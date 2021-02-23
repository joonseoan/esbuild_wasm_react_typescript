
import { useState } from 'react';

import esbuildService from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

const CodeCell: React.FC = () => {
  const [ code, setCode ] = useState('');
  const [ input, setInput ] = useState('');

  const editorOnChange = (value: string) => {
    setInput(value)
  }

  const onClick = async () => {
    // [IMPORTANT]
    // steve: recevied the elaborated data
    const esbuildResult = await esbuildService(input);
    setCode(esbuildResult);

    // joon: get large amount of data.
    // const esbuildResult: BuildResult = await esbuildService(input);

    // if (!esbuildResult || !esbuildResult.outputFiles) {
    //   return;
    // }

    // setCode(esbuildResult.outputFiles[0].text);
  }

  return (
    // Resizable is working 1 vertical with multiple horizaontal like table
    <Resizable direction='vertical'>
      <div style={{ height: '100%', display: 'flex' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue="const a = 1;"
            editorOnChange={editorOnChange}
          />
        </Resizable>
        {/* <div onClick={onClick}>
          <button>Submit</button>
        </div> */}
        <Preview code={code} />
      </div>
    </Resizable>
  );
};

export default CodeCell;

