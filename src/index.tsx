import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  
  /*
    two ways to use a common variable to the entire component

    1. useState but it should be used when the value keeps updating
  
    2. useRef for the value does not need to be updating but need to be used in the component.
       BTW, useRef can be used to get the element abttribute from JSX/HTML
  */

  const ref = useRef<any>(null);

  const startService = async () => {
    // esbuild web-assembly initialization from esbuild.wasm file in public folder.
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });

    /*
      {
        build: bundling (webpack role)--> bundling
        transform: transpile (babel role) 
        and etc
      }    
    */
    // console.log('service: ', ref.current);
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
    // 2) get this entry point. and then
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

    // console.log('result: ', result.outputFiles[0].text); 
    //  ===> get the code from esbuild-unpkg

    // [transpiled and bundled code finally]
    setCode(result.outputFiles[0].text);

    // [only Transpiling with promise]
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

    // [Important: eval]
    // built-in function browser.
    // eval takes string and execute it browser and show the result in browser console.
    // so the code in the text area can be executed in browser and the result show up in browser console.
    // try {
    //   eval(result.outputFiles[0].text);
    // } catch (err) {
    //   alert(err);
    // }
  }

  // because html has scrip tag that can execute the code from esbuild
  // console.log(1) ===> 

  // code from esbuild
  // (() => {
  // a:index.js
  //   console.log(1);
  // })();
  
  // execute it at iframe in browser like.
  /**
   * <html>
   *  <head>
   *    <script>console.log(1)</script>
   * </head>
   * <body></body>
   * </html>  
  */
  const html = `
    <script>
      ${code}
    </script>
  `;

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
      {/* 
        [iframe]
        creating an imbedded html document by implementing iframe
        <iframe src="test.html" />

        [Condition to communicate: it is "AND" condition]     
          1) allow-same-origin
          with 2) same localhost domain, 
               3) same port, 
               4) and protocol: https vs http must be same as well 
                In other words, in the browser, netwok tab,
                same localhost, port, protocl (http://localhost:3000) should contain test.html
  

        By default, iframe can communicate with parent html document which is index.html
        however, it will generate many issues
         1) errors from parent document (index.html) / child document(iframe) should not affect in each other
            - of course, if the app needs to have that kind of communication, we should not block that comminication.
         
         2) However, in our case, when the user providesthe malicous code in (eval) in iframe,
              the parent html document should not be affected due to that error in child document.
              It should not be treated as an error in the parent and the entire app should not crash.
              That error in the child document should be treated just to be rerendered by the user
        
         3) Therefore, in our app, the parent document and the child document should not have
            any communication.
          
         In order to do so, the child has a separate document from from the different dom/document,
         which has a different protocol, port, or domain to be treated separately.
         ===> in this case, the child has all different document objects even including localstorage,
         and so on.

         However, in our application, the parent document has not specific functions that should be separate
         except for the reason about error control above.
         
         In this case, we can isolate the child document by implementing different origin <--> allow-same-origin
         but the child does not have the separate / independent document (common document but not having communication)
         For this reason, the child document will have the limitation to use entire document for instance, localStorage

         1. able to communicate between parent and child dom
         <iframe sandbox="allow-same-origin" src="test.html" /> 

         2. disable to communicate
         // empty sandbox instead of sandbox="allow-same-origin"
         <iframe sandbox="" src="test.html" /> // blocking communication but same document
      */}
      
      {/* 
        [Iframe communication between child document and parent document]

        // [In console tab ]
        In the browser, top : parent html
        In the browser, test.thml: child html

        - the parent can access to child value
          [In the child]
          window.b = 'b'

          [In the parent]
          document.querySelector('iframe').contentWindow.b

        - the child can access to parent value
          [In parent]
          window.a = 'a'

          [In the child]
          parent.a ===> a
    */}

      {/*
        1) sandbox="" blocking communication above 
           ---> sandbox="allow-scripts" // allow scipts tag
        2) srcDoc: treating string to html document 
      */}
      <iframe sandbox="allow-scripts" srcDoc={html} />
     
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.querySelector('#root'),
);