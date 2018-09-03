export enum ControlType {
  ADD = 'Add',
  SPLIT = 'Split',
  MOVE = 'Move',
  ROTATE = 'Rotate',
  SCALE = 'Scale',
  REMOVE = 'Remove'
}

export const normalMode = [
  ControlType.ADD,
  ControlType.SPLIT,
  ControlType.MOVE,
  ControlType.ROTATE,
  ControlType.SCALE,
  ControlType.REMOVE
];

export const animationMode = [
  ControlType.MOVE,
  ControlType.SCALE,
  ControlType.ROTATE
];
