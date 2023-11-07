# Awilix

Write composable and testable bots with [Awilix](https://github.com/jeffijoe/awilix).

## Quickstart

Run `npm i grammy awilix @grammyjs/awilix` and paste the following code:

```ts
import { Bot, Context } from "grammy";
import { asClass, createContainer, Lifetime } from "awilix";
import { awilix, type AwilixFlavor } from "@grammyjs/awilix";

// Cradle is a type of object that defines what will be stored in the container.
// If you don't specify a Cradle, autocomplete won't work.
type Cradle = { someService: SomeService };
type MyContext = Context & AwilixFlavor<Cradle>;

// Create some kind of service.
class SomeService {
  getSomeData() {
    return "lorem ipsum";
  }
}

// Create DI container.
const diContainer = createContainer();
const bot = new Bot<MyContext>("");

// Register the necessary components.
diContainer.register({
  someService: asClass(SomeService, { lifetime: Lifetime.SINGLETON }),
});

// Register the plugin and provide it with our DI container.
bot.use(awilix(diContainer));

bot.command("start", (ctx) => {
  // We reserve the necessary component and work with it.
  const service = ctx.diContainerScope.resolve("someService");
  const data = service.getSomeData();
  ctx.reply(`Hello! Some data: ${data}`);
});

bot.start();
```

Find more information on how to use Awilix [here](https://github.com/jeffijoe/awilix#usage).

## Using Awilix in Conversations

For the plugin to work correctly in conversations, you must register the plugin in the conversation using the `run` method:

```ts
// Let's imagine that we have created a captcha checking service and want to use it in a conversation.
class CaptchaService {
  validate(answer: string) {
    return answer === "42";
  }
}

const diContainer = createContainer();
diContainer.register({ captchaService: asClass(CaptchaService) });

(async (conversation, ctx) => {
  // Be sure to register the awilix plugin!
  conversation.run(awilix(diContainer));
  await ctx.reply("Prove you are human! What is the answer to everything?");
  const { message: { text } } = await conversation.waitFor("message:text");
  return ctx.diContainerScope.cradle.captchaService.validate(text);
});
```

## Graceful Shutdown and Disposing

If you have registered a client to connect to a database in a container, for example, you must dispose of the container to clear the cache and close the connection.

```ts
async function stop() {
  await bot.stop();
  await diContainer.dispose();
}
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
```

In addition, when registering the plugin, you can set the `disposeOnReply` parameter, and then the plugin will automatically dispose of the created scope when the bot handles the update.

```ts
bot.register(awilix(diContainer, { disposeOnReply: true }));
```

Keep in mind that in the first example, you are disposing of a _container_, and in the second example, you are disposing of a _scope_.
Therefore, disposing of the scope will not affect the container, and vice versa.

For more information on disposal, please refer to the Awilix [documentation](https://github.com/jeffijoe/awilix#disposing).
