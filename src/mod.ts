import { type AwilixContainer, Context, type MiddlewareFn } from "./deps.deno.ts";

// TODO: Implement Cradle type settings for correct type output when resolving
export type AwilixFlavor = {
  diContainerScope: AwilixContainer;
};

// TODO: add configuration
export function awilix<C extends Context = Context>(
  diContainer: AwilixContainer,
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
