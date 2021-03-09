import { useRef, useEffect } from 'react';

import './preview.css';
interface PreviewProps {
  code: string;
  err: string;
};

/*
  // when the document object has an error, this event is invoked.
  // event is an Error object, not direct error message, btw.

  // [ Important ]
  // it is only working for an error from async function like setTimeout()
  
  window.addEventListener('error', (event) => {
    console.log(event);
  });
*/

const html = `
  <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
        const handleError = (err) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h1>Runtime Error</h1>' + err + '<div>';
          throw err;
        }

        // only for async error
        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        });

        // for sync error : undefined or reference error, and so on.
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (err) {
            handleError(err);
          }
        }, false);
      </script>
    </body>
  </html>
`;

const Preview: React.FC<PreviewProps> = ({ code, err }) => {

  const iframe = useRef<any>(null);

  useEffect(() => {
    // [ IMPORTANT ]
    // problem here is that once postMessage to insert message to iframe does not have enough time.
    // without the setTimeout, in the middle of postMessage function,
    //   it will be refreshed and the new html will be displayed. 
    // debouncing is required.
    iframe.current.srcdoc = html; // new iframe
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*'); // current iframe
    }, 50);
  }, [code, err]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe} 
        title="Preview"
        sandbox="allow-scripts"
        srcDoc={html}    
      />
      {/* compilation error container. It will be overlapped on top of the preview window. */}
      <div className="preview-invalid-code">{err}</div>
    </div>
  );
}

export default Preview;