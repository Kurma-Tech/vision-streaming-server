import { IsString } from 'class-validator';

export class StreamStartDto {
  @IsString()
  public address: string;

  @IsString()
  public port: string;

  @IsString()
  public username: string;

  @IsString()
  public password: string;
  
  @IsString()
  public channel: string;
}
