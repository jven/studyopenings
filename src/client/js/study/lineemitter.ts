import { Line } from "./line";
import { TreeModel } from "../tree/treemodel";

export class LineEmitter {
  static emitForModel(treeModel: TreeModel): Line[] {
    const lines: Line[] = [];

    treeModel.traverseDepthFirst(viewInfo => {
      const isLeafNode = !viewInfo.numChildren;
      if (isLeafNode) {
        const line = Line.fromPgnForInitialPosition(
            viewInfo.pgn, treeModel.getRepertoireColor());
        lines.push(line);
      }
    });

    return lines;
  }
}