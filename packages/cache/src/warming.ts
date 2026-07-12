export type HotResource = Readonly<{ key: string; score: number }>;

export class HotSetWarmer {
  constructor(private readonly warm: (key: string) => Promise<void>, private readonly limit = 50) {}

  async deploy(resources: readonly HotResource[]) {
    const head = [...resources].sort((left, right) => right.score - left.score || left.key.localeCompare(right.key)).slice(0, this.limit);
    for (let index = 0; index < head.length; index += 5) {
      await Promise.all(head.slice(index, index + 5).map(({ key }) => this.warm(key)));
    }
    return head.map(({ key }) => key);
  }

  async trending(resource: HotResource) {
    await this.warm(resource.key);
    return resource.key;
  }
}
