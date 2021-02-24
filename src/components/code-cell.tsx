
import { useState, useEffect } from 'react';

import esbuildService from '../bundler';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

const CodeCell: React.FC = () => {
  const [ code, setCode ] = useState('');
  // compilation error message
  const [ err, setErr ] = useState('');
  const [ input, setInput ] = useState('');

  useEffect(() => {
    // debouncing by implemeing timer
    // whenever user types on editor, we can's send those data to the esbuildService server.
    // it will consume alot of resource to the application and network.
    // so debouncing (rather than immediately run some action, it has some interval. )
    const timer = setTimeout(async () => {
      const esbuildResult = await esbuildService(input);
        setCode(esbuildResult.code);
        setErr(esbuildResult.err);
    }, 700);

    return () => {
      clearTimeout(timer);
    }
  }, [input]);

  const editorOnChange = (value: string) => {
    setInput(value)
  }

  // since we use debouncing...timer in useEffect
  // const onClick = async () => {
    // [IMPORTANT]
    // steve: recevied the elaborated data
    // const esbuildResult = await esbuildService(input);
    // setCode(esbuildResult);

    // joon: get large amount of data.
    // const esbuildResult: BuildResult = await esbuildService(input);

    // if (!esbuildResult || !esbuildResult.outputFiles) {
    //   return;
    // }

    // setCode(esbuildResult.outputFiles[0].text);
  // }

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
        <Preview code={code} err={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;

