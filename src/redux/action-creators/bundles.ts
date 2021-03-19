// for redux thunk
import { Dispatch } from 'redux';
import { ActionType } from '../action-types';
import { Action } from '../actions';
import bundle from '../../bundler';


// Action is union type we defined with combination of all actions
export const createBundle = (cellId: string, input: string) => 
  async (dispatch: Dispatch<Action>) => {
    dispatch({
      type: ActionType.BUNDLE_START,
      payload: {
        cellId,
      },
    });

    let result: { code: string, err: any };
    try {
      result = await bundle(input);
      if (!result) {
        throw new Error ('Unable to get bundling and transpiling.');
      }
    } catch (error) {
      throw new Error(error);
    }

    dispatch({
      type: ActionType.BUNDLE_COMPLETE,
      payload: {
        cellId,
        bundle: result,
      },
    });
}
