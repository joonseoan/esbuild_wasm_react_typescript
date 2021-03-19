import { Dispatch } from "react";
import { saveCells } from "../action-creators";
import { ActionType } from "../action-types";
import { Action } from "../actions";
import { RootState } from "../reducers";

// [Important] Persist!!!!
// In the store.ts it is registered as middleware.
// then it will receive "next" argument which is argument.
// then finally execute next callback with action argument
export const persistMiddleware = ({
  dispatch,
  getState, 
}: { 
  dispatch: Dispatch<Action>
  getState: () => RootState 
}) => {
  let timer: any;

  return (next: (action: Action) => void) => {
    return (action: Action) => {
      // if action is available
      next(action);

      // if action type is available here for update, move, insert and delete
      if (
        [
          ActionType.MOVE_CELL,
          ActionType.UPDATE_CELL, // update text and code editor
          ActionType.INSERT_CELL_AFTER,
          ActionType.DELETE_CELL
        ].includes(action.type)
      ) {
        if (timer) {
          clearTimeout(timer);
        }
        // then save it!!!
        // by calling saveCell with argument (dispatch, getState.)
        /*
          - Action Creator
          export const saveCells = () => {
            return async (dispatch: Dispatch<Action>, getState: () => RootState) => {}
        */
        timer = setTimeout(() => {
          saveCells()(dispatch, getState);
        }, 250);
      }
    };
  };
};