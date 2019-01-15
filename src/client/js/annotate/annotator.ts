import { TreeNode } from '../tree/treenode';
import { FenToPgnMap } from '../tree/fentopgnmap';
import { PgnToNodeMap } from '../tree/pgntonodemap';
import { Annotation } from './annotation';
import { Color } from '../../../protocol/color';

export interface Annotator {
  annotate(
      node: TreeNode,
      repertoireColor: Color,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap): Annotation | null;
}