import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  
  /*
    two ways to use common variable to the entire component

    1. useState but it should be used when the value keeps updating
  
    2. useRef for the value does not need to be updating but need to be used in the component.
       BTW, useRef can be used to get the element abttribute from JSX/HTML
  */

  const ref = useRef<any>(null);

  const startService = async () => {
    // esbuild web-assembly initialization from esbuild.wasm file in public folder.
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm' // url for the file pasted.
    });

    /*
      {
        build: bundling (webpack role)--> bundling
        transform: transpile (babel role) 
        and etc
      }    
    */
    console.log('service: ', ref.current);
  };

  useEffect(() => {
    startService();
  }, []);

  const handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value);
  }

  const onClick = async () => {
    if (!ref.current) {
      return;
    }

    // [Bundling]
    // 1) telling esbuild that we want to use index.js as an bundling point,
    // 2) get this entry point. and thhen
    // 3) telling esbuild that do not get bundling from hard drive 
    //    instead use this unpkgPathPlugin!
    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      // unpkgPathPlugin is from unpkg-path-plugins.ts
      plugins: [unpkgPathPlugin(), fetchPlugin(input) ],
      define: {
        'process.env.NOD_ENV': '"production"',
        global: 'window',
      }
    });

    console.log('result: ', result)

    // console.log('result: ', result.outputFiles[0].text); 
    //  ===> get the code from esbuild-unpkg
    setCode(result.outputFiles[0].text);

    // [Transpiling with promise]
    // const result = await ref.current.transform(input, {
    //   loader: 'jsx', // from 
    //   target: 'es2015', // from es2015 (a bit latest version) to es5 (classic)
    // });

    /*
      {
        code: "the code transpiled to es5"
        map: "source map"
        warining: [ any warning ]
      }
    */

    // console.log(result);
    // update es5 code
    // setCode(result.code);

    /**
     * [esbuild setup]
      1. visit  : https://esbuild.github.io/api/#transform-api 
         by the way, esbuild is on the basis of Go language.
         js code will be translated into Go lang by Web Assembly (esbuild-wasm).

      2. expand node_modules and find "esbuild-wasm" dependency
         find "esbuild-wasm" which is purple color

         1) copy the file and paste it just under public folder.
            we need to use this file inside of browser.

      3. import esbuild-wasm at the top of this file.
     */
  }

  return (
    <div>
      <textarea 
        onChange={handleOnChange}
        value={input}
      ></textarea>
      <div onClick={onClick}>
        <button>Submit</button>
      </div>
      {/* pre element making the code */}
      <pre>{code}</pre>
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.querySelector('#root'),
);