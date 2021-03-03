import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'bulmaswatch/superhero/bulmaswatch.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

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

