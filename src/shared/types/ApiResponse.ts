export type ApiResponseError = { error: string, errorField?: string};

export type ApiResponseSuccess<T> = {
    message?: string;
    data: T;
  };