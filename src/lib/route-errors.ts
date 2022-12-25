import React from "react";

export abstract class RouteError extends Error {
  abstract name: string;
  public method: string;
  public url: string;

  protected constructor(public status: number, public request: Request) {
    super();
    this.method = request.method;
    this.url = request.url;
  }
}

export class NotFoundError extends RouteError {
  name = "NotFound";

  public constructor(request: Request, public resource: string) {
    super(404, request);
  }
}

export type ErrorComponent<T extends RouteError = RouteError> = React.FC<{ error: T }>;
