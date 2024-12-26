//taken from the real world app, to be able to add user id to req for use in routes
declare namespace Express {
    export interface Request {
      auth?: {
        id: number;
      };
    }
  }