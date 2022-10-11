import { exit } from "process";
import { Game } from "./Game";
import { terminal } from "terminal-kit";
import { setup } from "./Setup";
import { TerminalRenderer } from "./Renderer";

terminal.clear();

setup().then((setup) => {
  const game = new Game(new TerminalRenderer(), setup.answer, setup.words);
  game.start().finally(() => {
    exit();
  });
});
