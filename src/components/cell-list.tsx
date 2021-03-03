import CellListItem from './cell-list-item';
import { useTypedSelector } from '../hooks/use-typed-selector';

const CellList: React.FC = () => {

  const cells = useTypedSelector(({ cells: { data, orders }}) => orders.map((id) => data[id]));
  const renderedCells = cells.map((cell) => <CellListItem key={cell.id} cell={cell} />);
  
  // [IMPORTANT]
  // we do not need to use function as long as map returns JSX!
  return <div>{renderedCells}</div>;
};

export default CellList;
