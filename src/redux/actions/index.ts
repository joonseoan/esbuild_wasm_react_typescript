import { ActionType } from '../action-types';
import { CellDirection, CellType, Cell } from '../cell';

export interface MoveCellAction {
  type: ActionType.MOVE_CELL;
  payload: {
    id: string;
    direction: CellDirection;
  }
}

export interface DeleteCellAction {
  type: ActionType.DELETE_CELL;
  payload: string;
}

export interface InsertCellAfterAction {
  type: ActionType.INSERT_CELL_AFTER;
  payload: {
    id: string | null;
    type: CellType;
  }
}

export interface UpdateCellAction {
  type: ActionType.UPDATE_CELL;
  payload: {
    id: string;
    content: string;
  }
}

export interface BundleStartAction {
  type: ActionType.BUNDLE_START;
  payload: {
    cellId: string;
  }
}

export interface BundleCompleteAction {
  type: ActionType.BUNDLE_COMPLETE,
  payload: {
    cellId: string;
    // from /bundler/index.js
    bundle: {
      code: string; // bundled and transpile code
      err: string; // error from esbuild
    }
  }
}

export interface FetchCellsActions {
  type: ActionType.FETCH_CELLS;
}

export interface FetchCellsCompleteActions {
  type: ActionType.FETCH_CELLS_COMPLETE;
  payload: Cell[];
}

export interface FetchCellsErrorActions {
  type: ActionType.FETCH_CELLS_ERROR;
  payload: string;
}

export interface SaveCellsErrorActions {
  type: ActionType.SAVE_CELLS_ERROR;
  payload: string;
}

export type Action = 
  MoveCellAction 
  | DeleteCellAction 
  | InsertCellAfterAction 
  | UpdateCellAction
  | BundleStartAction 
  | BundleCompleteAction
  | FetchCellsActions
  | FetchCellsCompleteActions
  | FetchCellsErrorActions
  | SaveCellsErrorActions;