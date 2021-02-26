import produce from 'immer';

import { ActionType } from '../action-types';
import { Action } from '../actions';
import { Cell } from '../cell';

interface CellState {
  loading: boolean;
  error: string | null;
  orders: string[];
  // [IMPORTANT]
  // it can be empty cell as well.
  data: {
    [key: string]: Cell;
  }
}

const initialState: CellState = {
  loading: false,
  error: null,
  orders: [],
  data: {},
}

// [ With Immer: we do not need to return anything when we use immer. ]
const reducer = produce((state: CellState = initialState,  action: Action) => {
  switch (action.type) {
    case ActionType.MOVE_CELL:
      return state;
    case ActionType.INSERT_CELL_BEFORE:
      return state;
    case ActionType.DELETE_CELL:
      return state;
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      // simply for targeting property, use assignment instead of deep clone.
      state.data[id].content = content;
      return;
    default:
      return state;
  }
});



// [Without Immer]
// const reducer = (state: CellState = initialState,  action: Action): CellState => {
//   switch (action.type) {
//     case ActionType.MOVE_CELL:
//       return state;
//     case ActionType.INSERT_CELL_BEFORE:
//       return state;
//     case ActionType.DELETE_CELL:
//       return state;
//     case ActionType.UPDATE_CELL:
//       const { id, content } = action.payload;
//       return {
//         ...state,
//         data: {
//           ...state.data,
//           [id]: {
//             ...state.data[id],
//             content,
//           },
//         },
//       };
//     default:
//       return state;
//   }
// }

export default reducer;