export enum ControlType {
  ADD = 'Add',
  SPLIT = 'Split',
  MOVE = 'Move',
  ROTATE = 'Rotate',
  SELECT = 'Select',
  REMOVE = 'Remove'
}

export const normalMode = [
  ControlType.ADD,
  ControlType.SPLIT,
  ControlType.MOVE,
  ControlType.ROTATE,
  ControlType.SELECT,
  ControlType.REMOVE
];

export const animationMode = [
  ControlType.MOVE,
  ControlType.SELECT,
  ControlType.ROTATE
];
