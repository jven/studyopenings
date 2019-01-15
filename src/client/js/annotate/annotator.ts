import { Color } from '../../../protocol/color';
import { FenToPgnMap } from '../tree/fentopgnmap';
import { PgnToNodeMap } from '../tree/pgntonodemap';
import { TreeNode } from '../tree/treenode';
import { Annotation } from './annotation';

export interface Annotator {
  annotate(
      node: TreeNode,
      repertoireColor: Color,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap): Annotation | null;
}