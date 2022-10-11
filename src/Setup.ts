import { readFile } from "fs/promises";
import { terminal } from "terminal-kit";
import { resolve } from "path";
import crypto from "crypto";


export interface GameSetup {
  answer: string;
  words: string[];
}

export async function setup() {
  const [answersBuffer, wordsButter] = await Promise.all([
    readFile(resolve(__dirname, "../assets/answer-list.txt"), { encoding: "utf-8" }),
    readFile(resolve(__dirname, "../assets/word-list.txt"), { encoding: "utf-8" }),
  ]);
  const answers = answersBuffer.split("\n");
  const words = wordsButter.split("\n");
  
  terminal.bold("Welcome to Birdle!\n");
  terminal("Enter seed to pick the word (enter anything): ");

  const seed = await getSeedInput();
  terminal("\n\n--------------\n\n")

  const digested = crypto.createHash("md5").update(seed).digest("hex");
  const numericSeed = parseInt(digested, 16);
  return {
    answer: answers[numericSeed % answers.length],
    words: words.concat(answers),
  }
}

async function getSeedInput(): Promise<string> {
  const result = await terminal.inputField({
    minLength: 1,
    cancelable: false,
  }).promise;
  if (!result) {
    throw Error("Unexpected input.");
  }
  return result;
}