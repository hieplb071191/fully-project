export interface JwtPayload {
  sub: number;
  username: string;
}

export interface AuthenticatedUser {
  userId: number;
  username: string;
}
