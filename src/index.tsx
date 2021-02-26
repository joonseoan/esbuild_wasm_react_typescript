import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './redux';

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
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
);

