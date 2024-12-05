import { IsEnum, IsString } from 'class-validator';
import { ErrorType } from './ErrorType';

export class ErrorRestResponse {
  @IsString()
  message: string;

  @IsEnum(ErrorType)
  type: ErrorType;
}

