
import ReactDOM from 'react-dom';

// import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';

const App: React.FC = () => {
  return (
    <div>
      <TextEditor />      
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.querySelector('#root'),
);

