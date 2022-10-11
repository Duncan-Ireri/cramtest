import { terminal } from "terminal-kit";
import { CharacterState, Guess } from "./Guess";

export interface Renderer {
  reset(): void;
  renderBoard(guesses: Guess[]): void;
  promptForGuess(guessNumber: number): Promise<string>;
  renderError(guessNumber: number, guess: string): void;
  renderWon(): void;
  renderLost(answer: string): void;
}

export class TerminalRenderer {
  private renderedLineCount = 0;

  reset(): void {
    if (this.renderedLineCount > 1) {
      terminal.up(this.renderedLineCount - 1);
    }
    terminal.column(0).eraseDisplayBelow();
    this.renderedLineCount = 0;
  }

  renderBoard(guesses: Guess[]): void {
    guesses.forEach((guess, index) => {
      terminal.white.bold(`${index + 1}: `);
      this.renderGuess(guess);
      terminal("\n");
    });
    this.renderedLineCount += guesses.length;
  }

  async promptForGuess(guessNumber: number): Promise<string> {
    terminal.white.bold(`${guessNumber}: `);
    this.renderedLineCount += 1;
    const result = await terminal.inputField({
      minLength: 5,
      maxLength: 5,
      cancelable: false,
    }).promise;
    if (!result) {
      throw Error("Unexpected input.");
    }
    return result.toLowerCase();
  }

  renderError(guessNumber: number, guess: string): void {
    terminal.white.bold(`${guessNumber}: '${guess}' is not a word.\n`);
    this.renderedLineCount += 1;
  }

  renderWon(): void {
    terminal.green("\nYou win!\n");
  }

  renderLost(answer: string): void {
    terminal.red("\nThe word was... ").white.bold(answer)("\n");
  }

  private renderGuess(guess: Guess) {
    guess.forEach((guessedCharacter) => {
      const output = `${guessedCharacter.character} `;
      switch (guessedCharacter.state) {
        case CharacterState.CORRECT:
          return terminal.green(output);
        case CharacterState.PRESENT:
          return terminal.yellow(output);
        case CharacterState.INCORRECT:
          return terminal.grey(output);
      }
    });
  }
}
