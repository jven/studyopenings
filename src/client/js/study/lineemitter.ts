import { RepertoireModel } from "../tree/repertoiremodel";
import { Line } from "./line";

export class LineEmitter {
  static emitForModel(model: RepertoireModel): Line[] {
    const lines: Line[] = [];

    model.traverseDepthFirstPreorder(viewInfo => {
      const isLeafNode = !viewInfo.numChildren;
      if (isLeafNode) {
        const line = Line.fromPgnForInitialPosition(
            viewInfo.pgn, model.getRepertoireColor());
        lines.push(line);
      }
    });

    return lines;
  }
}