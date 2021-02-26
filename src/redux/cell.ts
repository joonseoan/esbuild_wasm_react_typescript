export type CellType = 'code' | 'text';
export type CellDirection = 'up' | 'down';
export interface Cell {
  id: string;
  type: CellType;
  content: string;
};

