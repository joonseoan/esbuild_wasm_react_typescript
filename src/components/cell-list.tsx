import { Fragment, useEffect } from 'react';
import CellListItem from './cell-list-item';
import { useTypedSelector } from '../hooks/use-typed-selector';
import { useActions } from '../hooks/use-actions';
import AddCell from './add-cell';
import './cell-list.css';

const CellList: React.FC = () => {
  const { fetchCells } = useActions(); 
  const cells = useTypedSelector(({ cells: { data, orders }}) => orders.map((id) => data[id]));
  const renderedCells = cells.map((cell) =>
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell previousCellId={cell.id}/> 
    </Fragment>
  );

  useEffect(() => {
    fetchCells();
  }, []);

  // [IMPORTANT]
  // useEffect(() => {
  //   saveCells();
  //   // the way to change in terms of array.
  //   // whenever cells is different on the string point of view
  // [IMPORTANT]
  // }, [JSON.stringify(cells), saveCells]);
  
  // [IMPORTANT]
  // we do not need to use function as long as map returns JSX!
  return <div className="cell-list">
    <AddCell forceVisible={cells.length === 0} previousCellId={null} />
    {renderedCells}
  </div>;
};

export default CellList;
