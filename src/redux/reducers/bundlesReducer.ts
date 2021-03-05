// import produce from 'immer';
import { ActionType } from '../action-types';
import { Action } from '../actions';

interface BundleState {
  [key: string]: { // which means empty object
    loading: boolean;
    code: string;
    err: string;
    // [ IMPORTANT ]
    // it is required because the bundle is undefined at the beginning when cell id is not available at the beginning  
  } | undefined;
};

// empty object because of [key: string]: {}
const initialState: BundleState = {};

const reducer = (state: BundleState = initialState, action: Action): BundleState => {
  switch (action.type) {
    case ActionType.BUNDLE_START:
      const { cellId: startCellId } = action.payload;
      return {
        ...state,
        [startCellId]: {
          loading: true,
          code: '',
          err: '',
        },
      };
    case ActionType.BUNDLE_COMPLETE:
      const { cellId: completeCellId, bundle: { code, err }} = action.payload;
      return {
        ...state,
        [completeCellId]: {
          loading: false,
          code,
          err,
        },
      };
    default:
      return state;
  }
};

export default reducer;