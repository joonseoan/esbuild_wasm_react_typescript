
import { useEffect } from 'react';

// import esbuildService from '../bundler'; // it is used in actionCreator
import { useActions } from '../hooks/use-actions';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { Cell } from '../redux';
import CodeEditor from './code-editor';
import Preview from './preview';
import Resizable from './resizable';

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  // const [ code, setCode ] = useState('');
  // compilation error message
  // const [ err, setErr ] = useState('');
  // const [ input, setInput ] = useState(''); // moved to redux
  const { updateCell, createBundle } = useActions();

  // [IMPORTANT]
  // the initial value is undefined because with cell.id the bundle object cannot be built.
  // console.log('bundle: ', bundle); == requiring typescript control
  const bundle = useTypedSelector(({ bundles }) => bundles[cell.id]);

  // [IMPORTANT]
  // props, state, context, or redux value that are used inside of the components
  // and also used in useEffect, should be inside of []
  // the value outside of the component should not be in []
  useEffect(() => {
    // debouncing by implementing timer
    // whenever user types on editor, we can's send those data to the esbuildService server.
    // it will consume a lot of resource to the application and network.
    // so debouncing (rather than immediately run some action, it has some interval. )
    const timer = setTimeout(async () => {
     
      createBundle(cell.id, cell.content);
      // setErr(esbuildResult.err);
    }, 750);

    return () => {
      clearTimeout(timer);
    }
  }, [cell.content, cell.id, createBundle]);

  const editorOnChange = (value: string) => {
    updateCell(cell.id, value);
  };

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
      <div style={{ height: 'calc(100% - 10px)', display: 'flex' }}>
        <Resizable direction="horizontal">
          <CodeEditor
            initialValue={cell.content}
            editorOnChange={editorOnChange}
          />
        </Resizable>
        {bundle && <Preview code={bundle.code} err={bundle.err} />}
      </div>
    </Resizable>
  );
};

export default CodeCell;

