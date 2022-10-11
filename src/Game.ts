import { CharacterState, Guess, GuessedCharacter } from "./Guess";
import { Renderer } from "./Renderer"

const MAX_GUESSES = 6;

export class Game {
  private readonly guesses: Guess[] = [];

  constructor(
    private readonly renderer: Renderer,
    private readonly answer: string,
    private readonly words: string[],
  ) {}

  async start(): Promise<void> {
    while (this.guesses.length < MAX_GUESSES) {
      const guess_input = await this.renderer.promptForGuess(this.guesses.length + 1);
      this.renderer.reset();

      if (!this.isGuessValid(guess_input)) {
        this.renderer.renderBoard(this.guesses);
        this.renderer.renderError(this.guesses.length + 1, guess_input);
        break;
      }

      const guess = this.calculateGuess(guess_input);
      this.guesses.push(guess);
      this.renderer.renderBoard(this.guesses);

      let won = true;
      for (let i = 0; i < guess.length; i++) {
        if (guess[i].state != "correct") {
          won = false;
        }
      }
      if (won) {
        this.renderer.renderWon();
        return;
      }
    }

    this.renderer.renderLost(this.answer);
  }

  private calculateGuess(guess: string): Guess {
    const guessedCharacters: GuessedCharacter[] = [];
    for (let i = 0; i < guess.length; i++) {
      let state;
      const charcter = guess[i];
      if (this.answer[i] == charcter) {
        state = CharacterState.CORRECT;
      } else if (this.answer.includes(charcter)) {
        state = CharacterState.PRESENT;
      } else {
        state = CharacterState.INCORRECT;
      }
      guessedCharacters.push({ character: guess[i], state });
    }
    return guessedCharacters as Guess;
  }

  isGuessValid(guess: string): boolean {
    if (!guess.match(/^[A-Za-z]{5}$/)) {
      return false;
    } else if (guess.length != 5) {
      return false;
    } else if (!this.words.includes(guess)) {
      return false;
    } else {
      return true;
    }
  }
}
