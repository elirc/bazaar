export interface DeploymentPort {
  stopAcceptingJobs(): Promise<void>;
  drainInFlight(timeoutMs: number): Promise<boolean>;
  warmHotSet(): Promise<readonly string[]>;
  markReady(): Promise<void>;
}

export class GracefulDeployment {
  constructor(private readonly port: DeploymentPort) {}
  async shutdown() {
    await this.port.stopAcceptingJobs();
    if (!(await this.port.drainInFlight(30_000))) throw new Error("Worker drain exceeded 30 seconds");
  }
  async startup() {
    const warmed = await this.port.warmHotSet();
    await this.port.markReady();
    return warmed;
  }
}
