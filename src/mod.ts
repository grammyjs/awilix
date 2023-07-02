import { type AwilixContainer, Context, type MiddlewareFn } from "./deps.deno.ts";

// deno-lint-ignore ban-types, no-explicit-any
export type AwilixFlavor<Cradle extends object = any> = {
  diContainerScope: AwilixContainer<Cradle>;
};

// TODO: add configuration
export function awilix<C extends Context = Context>(
  diContainer: AwilixFlavor["diContainerScope"],
): MiddlewareFn<C & AwilixFlavor> {
  return async (ctx, next) => {
    ctx.diContainerScope = diContainer.createScope();
    // ctx.api.config.use(async (prev, method, payload, signal) => {
    //   await ctx.diContainerScope.dispose();
    //   return await prev(method, payload, signal);
    // });
    await next();
  };
}
