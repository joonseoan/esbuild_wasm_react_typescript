import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../redux';

export const useActions = () => {
  const dispatch = useDispatch();
  
  // [IMPORTANT]
  
  // 1)
  // memo the binding function at a time.

  // in this case, useMemo is required to memo at a time.
  //  dispatch value will be changed only when action creator is used in the component.
  //  Other than that moment. the bindActionCreator version or value will not be changed

  // so the bindActionCreators does affect by useState update or useEffect update
  // when dispatch is updated, it the value will (bindActionCreator version) will be changed.

  // 2) 
  // we can use hooks everywhere!
  // So we can return useMemo, useEffect and so on.

  return useMemo(() => {
    return bindActionCreators(actionCreators, dispatch);
  }, [dispatch]);
};