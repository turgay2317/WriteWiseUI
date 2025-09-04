import { ToastType } from '../types/module.types';

export interface Toast {
  id: number;
  type: ToastType;
  text: string;
}
