export interface Plugin { readonly name: string; init(): Promise<void>; shutdown(): Promise<void>; }
