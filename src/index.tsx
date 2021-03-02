import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from './redux';
import CellList from './components/cell-list';

const App: React.FC = () => {
  return (
    <div>
      <CellList />      
    </div>
  );
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root'),
);

