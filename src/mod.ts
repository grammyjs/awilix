import { type AwilixContainer, Context, type MiddlewareFn } from "./deps.deno.ts";

// deno-lint-ignore no-explicit-any
export type AwilixFlavor<Cradle extends object = any> = {
  diContainerScope: AwilixContainer<Cradle>;
};
export type AwilixOptions = { disposeOnReply: boolean };

export function awilix<C extends Context = Context>(
  diContainer: AwilixFlavor["diContainerScope"],
  options?: AwilixOptions,
): MiddlewareFn<C & AwilixFlavor> {
  return async (ctx, next) => {
    ctx.diContainerScope = diContainer.createScope();
    ctx.api.config.use(async (prev, method, payload, signal) => {
      if (options?.disposeOnReply) await ctx.diContainerScope.dispose();
      return await prev(method, payload, signal);
    });
    return await next();
  };
}
