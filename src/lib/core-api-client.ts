export class CoreApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly token: string
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
