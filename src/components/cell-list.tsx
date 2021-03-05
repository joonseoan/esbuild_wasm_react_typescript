import { Fragment } from 'react';
import CellListItem from './cell-list-item';
import { useTypedSelector } from '../hooks/use-typed-selector';
import AddCell from './add-cell';

const CellList: React.FC = () => {

  const cells = useTypedSelector(({ cells: { data, orders }}) => orders.map((id) => data[id]));
  const renderedCells = cells.map((cell) =>
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id}/> 
    </Fragment>
  );
  
  // [IMPORTANT]
  // we do not need to use function as long as map returns JSX!
  return <div>
    <AddCell forceVisible={cells.length === 0} previousCellId={null} />
    {renderedCells}
  </div>;
};

export default CellList;
