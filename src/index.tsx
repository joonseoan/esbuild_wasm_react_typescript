import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';
import CodeEditor from './components/code-editor';

const App: React.FC = () => {
  const [input, setInput] = useState('');

  const ref = useRef<any>(null);
  const iframe = useRef<any>(null);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  }

  const editorOnChange = (value: string) => {
    setInput(value)
  }

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    iframe.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  }

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (err) {
              const root = document.querySelector('#root');
              root.innerHTML = '<div style="color: red;"><h1>Runtime Error</h1>' + err + '<div>';
              throw err;
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  console.log(input)

  return (
    <div>
      <CodeEditor
        initialValue="const a = 1;"
        editorOnChange={editorOnChange}
      />
      <textarea 
        onChange={handleOnChange}
        value={input}
      ></textarea>
      <div onClick={onClick}>
        <button>Submit</button>
      </div>
      <iframe title="code preview" sandbox="allow-scripts" srcDoc={html} ref={iframe} />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.querySelector('#root'),
);

