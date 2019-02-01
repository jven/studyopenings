import { Color } from '../../../protocol/color';
import { FenToPgnMap } from '../tree/fentopgnmap';
import { PgnToNodeMap } from '../tree/pgntonodemap';
import { TreeNode } from '../tree/treenode';

export interface Annotator<ANNOTATION> {
  annotate(
      node: TreeNode,
      repertoireColor: Color,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap): Promise<ANNOTATION>;
}
