import { Game } from "./Game";
import { CharacterState, Guess } from "./Guess";

describe("Game", () => {

  test("win", async () => {
    // Arrange
    const mockRenderer = createMockRenderer()
    const game = new Game(mockRenderer, "cloth", ["stare", "tough", "cloth"])
    mockRenderer.promptForGuess
      .mockResolvedValueOnce("stare")
      .mockResolvedValueOnce("tough")
      .mockResolvedValueOnce("cloth")

    // Act
    await game.start()

    // Assert
    expect(mockRenderer.renderBoard).nthCalledWith(2, <Array<Guess>>[
      [
        { 
          character: "s",
          state: CharacterState.INCORRECT
        },
        { 
          character: "t",
          state: CharacterState.PRESENT
        },
        { 
          character: "a",
          state: CharacterState.INCORRECT
        },
        { 
          character: "r",
          state: CharacterState.INCORRECT
        },
        { 
          character: "e",
          state: CharacterState.INCORRECT
        },
      ],
      [
        { 
          character: "t",
          state: CharacterState.PRESENT
        },
        { 
          character: "o",
          state: CharacterState.PRESENT
        },
        { 
          character: "u",
          state: CharacterState.INCORRECT
        },
        { 
          character: "g",
          state: CharacterState.INCORRECT
        },
        { 
          character: "h",
          state: CharacterState.CORRECT
        },
      ],
    ])
    expect(mockRenderer.renderWon).toBeCalledTimes(1);
  });

  test("lose", async () => {
    // Arrange
    const mockRenderer = createMockRenderer();
    const game = new Game(mockRenderer, "input", [
      "apple",
      "bacon",
      "group",
      "pizza",
      "point",
      "treat",
    ]);
    mockRenderer.promptForGuess
      .mockResolvedValue("pizza")
      .mockResolvedValue("apple")
      .mockResolvedValue("point")
      .mockResolvedValue("treat")
      .mockResolvedValue("group")
      .mockResolvedValue("bacon")

    // Act
    await game.start();

    // Assert
    expect(mockRenderer.renderLost).toBeCalledTimes(1);
  });
});

function createMockRenderer(): {
  reset: jest.Mock<void>,
  renderBoard: jest.Mock<void>,
  promptForGuess: jest.Mock<Promise<string>>,
  renderError: jest.Mock<void>,
  renderWon: jest.Mock<void>,
  renderLost: jest.Mock<void>,
} {
  return {
    reset: jest.fn(),
    renderBoard: jest.fn(),
    promptForGuess: jest.fn(),
    renderError: jest.fn(),
    renderWon: jest.fn(),
    renderLost: jest.fn(),
  };
}
