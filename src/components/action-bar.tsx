import { useActions } from '../hooks/use-actions';
import './action-bar.css';

interface ActionBarProps {
  id: string;
};

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { moveCell, deleteCell } = useActions();

  const handleMove = (direction: 'up' | 'down') => {
    moveCell(id, direction);
  };

  return (
    <div className="action-bar">
      <button className="button is-primary is-small" onClick={() => handleMove('up')}>
        <span className="icon">
          <i className="fas fa-arrow-up"></i>
        </span>
      </button>
      <button className="button is-primary is-small" onClick={() => handleMove('down')}>
        <span className="icon">
          <i className="fas fa-arrow-down"></i>
        </span>
      </button>
      <button className="button is-primary is-small" onClick={() => deleteCell(id)}>
        <span className="icon">
          <i className="fas fa-times"></i>
        </span>
      </button>
    </div>
  );
};

export default ActionBar;