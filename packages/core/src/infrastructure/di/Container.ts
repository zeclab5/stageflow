type Fulfillable<T> = T | Promise<T>;
type Factory<T> = () => Fulfillable<T>;

export interface Container {
  register<T>(token: string, factory: Factory<T>): void;
  resolve<T>(token: string): T;
}

export class DIContainer implements Container {
  private readonly factories = new Map<string, Factory<unknown>>();
  private readonly instances = new Map<string, unknown>();

  register<T>(token: string, factory: Factory<T>): void {
    this.factories.set(token, factory);
  }

  resolve<T>(token: string): T {
    const existing = this.instances.get(token);
    if (existing !== undefined) return existing as T;

    const factory = this.factories.get(token);
    if (!factory) throw new Error(`DI: unresolved token ${token}`);
    const instance = factory() as T;
    this.instances.set(token, instance);
    return instance;
  }
}
