declare module 'express-jwt-authz' {
  import { RequestHandler } from 'express';

  export = jwt;

  function jwt(scopes: string[]): RequestHandler;
}