import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  // we do not need this one any more
  // const [code, setCode] = useState('');
  
  /*
    two ways to use a common variable to the entire component

    1. useState but it should be used when the value keeps updating
  
    2. useRef for the value does not need to be updating but need to be used in the component.
       BTW, useRef can be used to get the element abttribute from JSX/HTML
  */

  const ref = useRef<any>(null);
  const iframe = useRef<any>(null);

  const startService = async () => {
    // esbuild web-assembly initialization from esbuild.wasm lib
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

    // we can get html variable here because the function is an object
    // Just in case, the user deletes the body or default srcDoc: for instance, document.body.innerHTML = '';
    //   it will recreate the document again.
    // srdoc: is same as the one in <iframe srcDoc={html} ref={iframe} />
    iframe.current.srcdoc = html;

    // (2) [transpiled and bundled code finally]
    // [Bundling: common.js module (module.exports or require) and es module (export or import)
    //     that eventully makes the app have a single entry file including "other files" and "3rd party lib". ]

    // 1) telling esbuild that we want to use index.js as an bundling point,
    // 2) get this entry point. and then
    // 3) telling esbuild that do not get bundling from hard drive 
    //    instead use this unpkgPathPlugin!

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      // unpkgPathPlugin is from unpkg-path-plugins.ts
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    /*
      [AddEventListener and postMessage]
      The window.postMessage() method safely enables cross-origin communication between Window objects; e.g., 
      between a page and an iframe embedded within it.

      Even though the cross-orign is different between a page and ifram which means that cross-comminication is blocked 
      (with any reason, for instance, no same-origin in sandbox),
      the parrent document and the child document are still interact and set/get the value each other through addEventListener(set/on)
      and postMessage(get/emit).

      if and only if the pages they originate from share the same protocol, port number, and host (also known as the "same-origin policy").
      window.postMessage() provides a controlled mechanism to securely circumvent (overcome) this restriction (if used properly).

      OUR APP HAS DIFFERENT NO SAME ORIGIN BUT HAS SAME PORT, SAME PROTOCOL, AND DOMAIN.

      Receiver: no matter who is parent or child

      window.addEventListener('message', (event) => {
        console.log(event)
        console.log(event.data) // test message from child or parent.
      }, false);

      // child to parent 
      parent.postMessage('Hello there', '*');
      
      // parent to child
      document.querySelector('iframe').contentWindow.postMessage(result.outputFiles[0].text, '*')
*/

    // 3) using ref
    // [transpiled and bundled code]
    
    // constentVindow: basic attribute that the parent document is able to access to child
    // postMessage: sending string message to parent or child which has "addEventListener('message')"
    // '*': is for all domains. which means that the domain and port is not matter.
    // result.outputFiles[0].text: string based code bundled and traspiled by esbuild. 
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');


    // 2) using state for bundled and transpile codes

    // console.log('result: ', result.outputFiles[0].text); 
    //  ===> get the code from esbuild-unpkg
    // setCode(result.outputFiles[0].text);


    // (2) [only Transpiling with promise]
    
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
  }

  // ----------------------------------------------------START ----------------------------------------------------------
  // 2)
  /*
    // [Important: eval]
    // built-in function browser.
    // eval takes string and then execute it in browser and show the result in browser console.
    // so after 1) the code is tranpile and bundled, the code in the text area can 2) be executed in browser 
    // and 3) the result show up in browser console.
    // try {
    //   eval(result.outputFiles[0].text);
    // } catch (err) {
    //   alert(err);
    // }

    [By implementing addEventListener('message')]
    id="root" for react rendering
    event.data: 'it has postMessage data to be sent to parent or child.
    window.addEventListener('message', (event) => {}, false)
    ---> child document's setup to receive the message or string from the parent
         who is implementing "postMessage" method
  */
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

  // 1)
  /*
  // because html has script tag that can execute the code from esbuild
  // console.log(1) ===> 

  code from esbuild
  (() => {
    // a:index.js
    console.log(1);
  })();
  
  // execute it at iframe in browser like.
  * <html>
  *  <head>
  *    <script>console.log(1)</script>
  * </head>
  * <body></body>
  * </html>  
  
  it works, however, it has the issue for long codes
  because close </script> tag generates an error.
  
  const html = `
    <script>
      ${code}
    </script>
  `;

  [Solution]: use addEventListener('message', (event)=>{}, false) for parent or child above
  */
  // -------------------------------------------------END----------------------------------------------------------------
  return (
    <div>
      <textarea 
        onChange={handleOnChange}
        value={input}
      ></textarea>
      <div onClick={onClick}>
        <button>Submit</button>
      </div>
      {/* 
        pre element making the code 
        not need it any more since we have iframe and its console
      */}
      {/* <pre>{code}</pre> */}
      {/* 
        [iframe]
        creating an imbedded html document by implementing iframe
        <iframe src="test.html" />

        [The reason for us to use ifram in this app]: user's code input can generate an error for the entire app.
        that error must be isolated in the user's code itself and it should not make the app crashes.
        In other words, the parent document should not be affected by the codes user input and simultaneously
        the codes from user must show up in the iframe (no matter it has errors or does not error.)

        [Condition to communicate: it is "AND" condition]     
          1) allow-same-origin
          with 2) same localhost domain, 
               3) same port, 
               4) and protocol: https vs http must be same as well 
                In other words, in the browser, netwok tab,
                a single same localhost, port, and protocl (http://localhost:3000) should contain test.html
  

        By default, iframe can communicate with parent html document which is index.html
        however, it will generate many issues
         1) errors from parent document (index.html) / child document(iframe) should not interactively affect each other
            - of course, if the app needs to have that kind of interactive communication, we should not block that comminication. (in other app)
         
         2) However, in our case, when the user provides the malicous code in (eval or script) in iframe,
              the parent html document should not be affected by that error from child document.
              in other words, the error should not be treated as an "real" error in the parent and the entire app should not stop.
              That error in the child document should be treated just to be rerendered or modified in the child doc context only 
        
         3) Therefore, IN OUR APP, the parent document and the child document should not have
            any communication.
          
         In order to do so, the child has a separate document from from the different dom/document,
         which has a different protocol, port, or domain to be treated separately.
         ===> in this case, the child has all different document attributes even including localstorage,
         and so on.

         However, in our application, the parent document has not specific functions that should be separate in different protocol, port, and domain
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
      <iframe title="code preview" sandbox="allow-scripts" srcDoc={html} ref={iframe} />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.querySelector('#root'),
);

