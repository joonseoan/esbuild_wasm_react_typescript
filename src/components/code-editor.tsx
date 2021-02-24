import { useRef } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
// it was only for line 87
// import monacoEditor from 'monaco-editor';
import prettier from 'prettier';
// prettier is supporting different language. so that's why parser is required.
import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';

// [IMPORTANT]
// "monaco-jsx-highlighter" does not have type-definition file for the module
// and also it has an error (redline)
// In this case, we need to override typescript manually in "types.d.ts" file
import Highlighter from 'monaco-jsx-highlighter';

import 'bulmaswatch/superhero/bulmaswatch.min.css';
import './code-editor.css';
import './syntax.css';

export interface CodeEditorProps {
  initialValue: string;

  // anonymous function (for reminding)
  // (value: string): void | number;

  // 2)
  editorOnChange(value: string): void;

  // 1)
  // editorOnChange: (value: string) => void;
}


/**
  <MonacoEidtor> is just a wrapper around real Monaco Editor.
  In order to modify real Monaco Editor, we need to pass props below.

  1) click "@monaco-editor/react" to get the reference of Monaco Component
  2) and get interface EditorProps
  3) the interface we need to get to modify the options

  export interface EditorProps {
    value?: string | null;
    language?: string;
    editorDidMount?: EditorDidMount;
    theme?: Theme | string;
    line?: number;
    width?: number | string;
    height?: number | string;
    loading?: React.ReactNode;

    // in order to reach out IEditorConstructionOptions, "npm install --save-exact monaco-editor" is required
    // and click IEditorConstructionOptions in typescript page in node_modules
    options?: monacoEditor.editor.IEditorConstructionOptions;
    overrideServices?: monacoEditor.editor.IEditorOverrideServices;
    className?: string;
    wrapperClassName?: string;
  }
*/

const CodeEditor: React.FC<CodeEditorProps> = ({
    initialValue,
    editorOnChange,
}) => {

  const ref = useRef<any>(null);

  /*
   ----- [IMPORTANT] ------
    export type EditorDidMount = (
      getEditorValue: () => string,
      editor: monacoEditor.editor.IStandaloneCodeEditor,
    ) => void;

    So, particulary when we need to define type directly from lib and we should use its most parent interface,
    we should not implement the detail child types
  */
  const editorDidMount: EditorDidMount = (
    // fron steve
    getEditorValue, // since it had EditorDidMount

    // from Joon (too specifying the child)
    // getEditorValue: () => string, // without EditorDidMount
   
    // from steve, 
    editor, //since it had EditorDidMount

    // from Joon (too specifying the child)
    // editor: monacoEditor.editor.IStandaloneCodeEditor // without EditorDidMount
  ) => {
    // [Important]
    // ref value can remember any value in anywhere in any fuctions which are "stay running"
    ref.current = editor;

    // it is only for the initialValue
    // console.log('getEditorValue(): ', getEditorValue());

    // editor argument is working for updating the user types
    editor.onDidChangeModelContent(() => {
      editorOnChange(getEditorValue());
    });

    // editor.ITextModelUpdateOptions.tabSize it is not object inside of object!!!
    // please find updateOptions in typescript first!!!!!!!!!!!
    editor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter =  new Highlighter(

      // [ IMPORTANT ]
      // window has monaco property but typescript does not able to recognize it.
      // In this case, we can use // @ts-ignore
      
      // @ts-ignore
      window.monaco,
      //jscodeShift
      codeShift,
      editor,
    );
    
    // when the text in editor changes...add hightlight to it.
    highlighter.highLightOnDidChangeModelContent(
      // do not console for the user's typo and mistake.
      () => {},
      () => {},
      undefined,
      () => {},
    );
  }

  const onFormatClick = () => {
    console.log(ref.current)
    // get current value from editor
    const unformatted = ref.current.getModel().getValue();

    // format that value
    const formatted = prettier.format(unformatted, {
      parser: 'babel', // for javascript
      plugins: [parser], // for javascript paser
      useTabs: false,
      semi: true,
      singleQuote: true,
    })
    // console.log('formatted: ', formatted) // const a = 1; // initial value
    // changing the new line character into '';
    .replace(/\n$/, '');

    // set the formatted value back in the editor
    ref.current.setValue(formatted);
  }

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        // [IMPORTANT]
        // type function from editorDidMount type defnition.
        editorDidMount={editorDidMount}
        // it is just initial value that will not be running after user types in editor.
        value={initialValue}
        // it also provides autocomplete for javascript
        language="javascript" 
        // light (default from Theme) | dark (from Theme) | string (not from Thme but other color)
        theme="dark" 

        // to fit Resizable height
        height="100%"
        // [IMPORTANT]
        // [options?: monacoEditor.editor.IEditorConstructionOptions;]
        // frist curily bracket ==> IEditorConstructionOptions
        // second innter curly bracket  ===> IEditorOptions which is one of properties of IEditorConstructionOptions
        options={{ 
          wordWrap: 'on',
          // fading out the unused import statement, or variable and so on. 
          showUnused: false,
          // right side small editor window bar
          minimap: { enabled: false },
          // remove right space of the editor line number
          folding: false,
          // also reduce left side space of the line number
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}

export default CodeEditor;  