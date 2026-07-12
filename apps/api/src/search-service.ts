import { searchCatalog, type SearchDocument } from "@bazaar/search";

export class SearchService {
  constructor(private readonly documents: () => Promise<readonly SearchDocument[]>) {}
  async search(query: string) {
    return searchCatalog(await this.documents(), query);
  }
}
