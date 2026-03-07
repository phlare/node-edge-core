import { env } from "../config/env.js";

export class CoreApiClient {
  constructor(
    private readonly baseUrl: string = env.CORE_API_BASE_URL,
    private readonly token: string = env.CORE_API_TOKEN
  ) {}

  async getHealth(): Promise<unknown> {
    const response = await fetch(`${this.baseUrl}/healthz`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Core API health check failed: ${response.status}`);
    }

    return response.json();
  }
}