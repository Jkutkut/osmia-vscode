export interface Result<T, E> {
  data?: T;
  error?: E;
}

export interface Option<T> {
  data?: T;
}
