import { useRef, useEffect } from 'react';

import './preview.css';
interface PreviewProps {
  code: string;
};

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

const Preview: React.FC<PreviewProps> = ({ code }) => {

  const iframe = useRef<any>(null);

  useEffect(() => {
    iframe.current.srcdoc = html;
    iframe.current.contentWindow.postMessage(code, '*');
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe} 
        title="Preview"
        sandbox="allow-scripts"
        srcDoc={html}      
      />
    </div>
  );
}

export default Preview;