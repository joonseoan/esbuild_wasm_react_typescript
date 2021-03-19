export * from './store';
// export type RootState = ReturnType<typeof reducers> ==> export all of reducers
export * from './reducers';
export * from './cell';
// when we need to have reference "* as reference name"
export * as actionCreators from './action-creators';