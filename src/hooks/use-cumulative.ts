import { useTypedSelector } from './use-typed-selector';

export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, orders } = state.cells;
    const orderedCells = orders.map(id => data[id]);

    const showFunc = `
      import _React from 'react';
      import _ReactDOM from 'react-dom';
      var show = (value) => {
        const root = document.querySelector('#root');
        if (typeof value === 'object') {
          if (value.$$typeof && value.props) {
            _ReactDOM.render(value, root);
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      }  
    `;

    // var : because var can redeclare the variable with same name.
    const showFuncNoOp = 'var show = () => {}';
    const cumulativeCodes = [];
    
    for (const c of orderedCells) {
      // [IMPORTANT]
      // It is cumulative!!!
      if (c.type === 'code') {
        if (c.id === cellId) {
          // if it is current cell, add showFunc
          cumulativeCodes.push(showFunc);
        } else {
          // also if it is not current cell,
          // after the current cell, add showFuncNoOp
          // and then it will specify same show() invoke as in the current cell.
          // in result, the same function invoke will now show up in the preview
          cumulativeCodes.push(showFuncNoOp);
        }
        cumulativeCodes.push(c.content);
      }
  
      // in order to exclude the current code cell for cumulative
      if (c.id === cellId) {
        break;
      }
    }
    return cumulativeCodes
  }).join('\n');
};