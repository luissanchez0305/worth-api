import { Exclude, Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';
import { convertToBoolean } from 'src/utils/convertToBoolean';

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  lastname: string;
  oneSignal_id: string;
  isPremium: boolean;
}

export class SerializedUser {
  id: number;
  email: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}

const ToBoolean = () => {
  return Transform((params): boolean | undefined => {
    return convertToBoolean(params.value);
  });
};

export { ToBoolean };
