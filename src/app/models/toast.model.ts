import { ToastType } from './module.types';

export interface Toast {
  id: number;
  type: ToastType;
  text: string;
}
