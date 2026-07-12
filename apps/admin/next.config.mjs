export default {
  // Next's standalone tracer creates symlinks that require Windows Developer
  // Mode. CI packages standalone on Linux; local builds still verify the app.
  output: process.env.CI ? "standalone" : undefined,
  reactStrictMode: true,
};
