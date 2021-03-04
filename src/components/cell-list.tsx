import { Fragment } from 'react';
import CellListItem from './cell-list-item';
import { useTypedSelector } from '../hooks/use-typed-selector';
import AddCell from './add-cell';

const CellList: React.FC = () => {

  const cells = useTypedSelector(({ cells: { data, orders }}) => orders.map((id) => data[id]));
  const renderedCells = cells.map((cell) =>
    <Fragment key={cell.id}>
      <AddCell nextCellId={cell.id}/> 
      <CellListItem cell={cell} />
    </Fragment>
  );
  
  // [IMPORTANT]
  // we do not need to use function as long as map returns JSX!
  return <div>
    {renderedCells}
    {/* <div className={cells.length === 0 ? "force-visible" : "add-cell"}> */}
      <AddCell forceVisible={cells.length === 0} nextCellId={null} />
    {/* </div> */}
  </div>;
};

export default CellList;
