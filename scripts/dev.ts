const commands = [
  [process.execPath, "run", "--cwd", "mcp-server", "dev"],
  [process.execPath, "run", "--cwd", "frontend", "dev"],
];

const children = commands.map((command) => Bun.spawn(command, {
  cwd: import.meta.dir + "/..",
  stdout: "inherit",
  stderr: "inherit",
  stdin: "inherit",
}));

const stop = () => {
  children.forEach((child) => child.kill());
};

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

await Promise.race(children.map((child) => child.exited));
stop();
