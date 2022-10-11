export type Guess = [
  GuessedCharacter,
  GuessedCharacter,
  GuessedCharacter,
  GuessedCharacter,
  GuessedCharacter,
]

export interface GuessedCharacter {
  character: string;
  state: CharacterState;
}

export enum CharacterState {
  // Character is not present in the word.
  INCORRECT = "incorrect",
  // Character is present in the word but not at this spot.
  PRESENT = "present",
  // Character is present in the word an in the correct spot.
  CORRECT = "correct",
}
