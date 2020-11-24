export interface Recurrence {
  id: number;
  label: Label;
  isActive: boolean;
}

export enum Label {
  NONE = 'n', DAILY = 'd', WEEKLY = 'w'
}
