import { RepertoireJson } from '../protocol/protocol';

export class Repertoire {
  private json_: RepertoireJson;
  private owner_: string;

  constructor(json: RepertoireJson, owner: string) {
    this.json_ = json;
    this.owner_ = owner;
  }

  getJson(): RepertoireJson {
    return this.json_;
  }

  getOwner(): string {
    return this.owner_;
  }
}
