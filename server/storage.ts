import { GenerationResult } from "@shared/schema";

export interface IStorage {
  // Generation history
  saveGeneration(generation: GenerationResult): Promise<void>;
  getGenerations(limit?: number): Promise<GenerationResult[]>;
  clearGenerations(): Promise<void>;
}

export class MemStorage implements IStorage {
  private generations: GenerationResult[];

  constructor() {
    this.generations = [];
  }

  async saveGeneration(generation: GenerationResult): Promise<void> {
    this.generations.unshift(generation);
    // Keep only last 50 generations
    if (this.generations.length > 50) {
      this.generations = this.generations.slice(0, 50);
    }
  }

  async getGenerations(limit: number = 50): Promise<GenerationResult[]> {
    return this.generations.slice(0, limit);
  }

  async clearGenerations(): Promise<void> {
    this.generations = [];
  }
}

export const storage = new MemStorage();
