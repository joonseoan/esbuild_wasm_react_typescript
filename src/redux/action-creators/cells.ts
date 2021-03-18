import axios from 'axios';
import { Dispatch } from 'react';
import { ActionType } from '../action-types';
import { 
  UpdateCellAction,
  DeleteCellAction,
  InsertCellAfterAction,
  MoveCellAction, 
  Action
} from '../actions';
import { CellDirection, CellType, Cell } from '../cell';
import { RootState } from '../reducers';

export const updateCell = (id: string, content: string): UpdateCellAction => {
  return {
    type: ActionType.UPDATE_CELL,
    payload: { id, content },
  };
};

export const deleteCell = (id: string): DeleteCellAction => {
  return {
    type: ActionType.DELETE_CELL,
    payload: id,
  };
};

export const insertCellAfter = (id: string | null, cellType: CellType ): InsertCellAfterAction => {
  return {
    type: ActionType.INSERT_CELL_AFTER,
    payload: { id, type: cellType },
  };
};

export const moveCell = (id: string, direction: CellDirection ): MoveCellAction => {
  return {
    type: ActionType.MOVE_CELL,
    payload: { id, direction },
  };
};

export const fetchCells = () => {
  return async (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionType.FETCH_CELLS });

    try {
      const { data }: { data: Cell[] } = await axios.get('/cells');
      dispatch({ type: ActionType.FETCH_CELLS_COMPLETE, payload: data });
    } catch (err) {
      dispatch({ type: ActionType.FETCH_CELLS_ERROR, payload: err.message });
    }
  }
};

export const saveCells = () => {
  // [ Important ]
  // getState is a type of RootState
  return async (dispatch: Dispatch<Action>, getState: () => RootState) => {
    try {
      const { cells: { orders, data }} = getState();
      const cells = orders.map(id => data[id]);
      await axios.post('/cells', { cells });
    } catch (err) {
      dispatch({ type: ActionType.SAVE_CELLS_ERROR, payload: err.message });
    }
  }
}
