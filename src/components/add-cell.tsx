import { useActions } from '../hooks/use-actions';
import { CellType } from '../redux';
import './add-cell.css';

interface AddCellProps {
  nextCellId: string | null;
  forceVisible?: boolean;
}

const AddCell: React.FC<AddCellProps> = ({ nextCellId, forceVisible }) => {

  const { insertCellAfter } = useActions();

  const onClick = (item: CellType) => {
    insertCellAfter(nextCellId, item);
  };

  return <div className={`add-cell ${forceVisible && 'force-visible'}`} >
    <div className="add-buttons">
      <button className="button is-rounded is-primary is-small" onClick={() => onClick('code')}>
        <span className="icon is-small">
          <i className="fas fa-plus" />
        </span>
        <span>Code</span>
      </button>
      <button className="button is-rounded is-primary is-small" onClick={() => onClick('text')}>
        <span className="icon is-small">
          <i className="fas fa-plus" />
        </span>
        <span>Text</span>
      </button>
    </div>
    <div className="divider" />
  </div>;
}

export default AddCell;