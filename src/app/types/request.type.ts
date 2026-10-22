export type RequestKind = 'order' | 'consultation';

export interface RequestType {
  name: string;
  phone: string;
  type: RequestKind;
  service?: string;
}
