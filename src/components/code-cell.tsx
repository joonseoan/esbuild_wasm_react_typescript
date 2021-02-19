
import { useState } from 'react';

import esbuildService from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';

const CodeCell: React.FC = () => {
  const [ code, setCode ] = useState('');
  const [ input, setInput ] = useState('');

  const editorOnChange = (value: string) => {
    setInput(value)
  }

  const onClick = async () => {
    // steve
    const esbuildResult = await esbuildService(input);
    setCode(esbuildResult);


    // joon
    // const esbuildResult: BuildResult = await esbuildService(input);

    // if (!esbuildResult || !esbuildResult.outputFiles) {
    //   return;
    // }

    // setCode(esbuildResult.outputFiles[0].text);
  }

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        editorOnChange={editorOnChange}
      />
      <div onClick={onClick}>
        <button>Submit</button>
      </div>
      <Preview code={code} />
    </div>
  );
};

export default CodeCell;

