// import produce from 'immer';
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

// [Without Immer]
const reducer = (state: CellState = initialState,  action: Action): CellState => {
  switch (action.type) {
    case ActionType.MOVE_CELL:
      const moveId = action.payload.id;
      const direction = action.payload.direction;
      const changeOrders = state.orders;

      const index = changeOrders.findIndex(orderId => orderId === moveId);
      const targetId = direction === 'up' ? index - 1 : index + 1;

      if (targetId < 0 || targetId > changeOrders.length - 1) {
         return state;
      }

      // [ IMPORTANT ]: array can change value without the temp variable. // ---> array swap
      // changeOrder[Index] the id's previous index
      // changeOrder[targetId] the current targetId value
      changeOrders[index] = changeOrders[targetId];

      // changeOrder[targetId]: the moveId's new location
      changeOrders[targetId] = moveId; 
      
      return {
        ...state,
        orders: [ ...changeOrders ],
      };
    case ActionType.INSERT_CELL_BEFORE:
      const cell: Cell = {
        type: action.payload.type,
        id: getRandomId(),
        content: '',
      }

      const insertBeforeId = action.payload.id;
      const insertBeforeOrders = state.orders;
      const indexFound = insertBeforeOrders.findIndex(orderId => orderId === insertBeforeId);

      // when insertBeforeId is null, the new code item will be allocated to the last one.
      if (indexFound < 0) {
        insertBeforeOrders.push(cell.id);
      } else {
        insertBeforeOrders.splice(indexFound, 0, cell.id);
      }

      return {
        ...state,
        data: {
          ...state.data,
          [cell.id]: {
            ...cell,
          }
        }
        , orders: [ 
          ...insertBeforeOrders 
        ],
      };    
    case ActionType.DELETE_CELL:
      const deleteId = action.payload;
      delete state.data[deleteId];
      const deletedOrders = state.orders.filter(orderId => orderId !== deleteId);

      return {
        ...state,
        data: {
          ...state.data,
        },
        orders: [ 
          ...deletedOrders
        ],
      };
    case ActionType.UPDATE_CELL:
      const { id, content } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [id]: {
            ...state.data[id],
            content,
          },
        }
      };
    default:
      return state;
  }
};

const getRandomId = () => {
  // 36: A-Z
  return Math.random().toString(36).substr(2, 5);
};

// [ With Immer: we need to return state when we use typescript for immer ]
// However, in javascript we do not need to return!!
// const reducer = produce((state: CellState = initialState,  action: Action) => {
//   switch (action.type) {
//     case ActionType.MOVE_CELL:
//       return state;
//     case ActionType.INSERT_CELL_BEFORE:
//       return state;
//     case ActionType.DELETE_CELL:
//       return state;
//     case ActionType.UPDATE_CELL:
//       const { id, content } = action.payload;
//       // simply for targeting property, use assignment instead of deep clone.
//       state.data[id].content = content;
//       return state;
//     default:
//       return state;
//   }
// });

export default reducer;