export type PickByType<T, Value> = {
  [K in keyof T as T[K] extends Value ? K : never]: T[K]
}

export type ExcludeByType<T, Value> = {
  [K in keyof T as T[K] extends Value ? never : K]: T[K]
}