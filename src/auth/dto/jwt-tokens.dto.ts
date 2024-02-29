import { IsJWT, IsOptional } from 'class-validator';

export class JwtTokensDto {
  @IsJWT()
  @IsOptional()
  accessToken: string;
}
