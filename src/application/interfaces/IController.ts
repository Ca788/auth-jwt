export interface IRequest {
  body: Record<string, any>;
}

export interface IResponse {
  body: Record<string, any> | null;
  statusCode: number;
}

export interface IController {
  handle(request: IRequest): Promise<IResponse>;
}
