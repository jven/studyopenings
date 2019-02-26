import { Color } from '../../../../protocol/color';
import { Annotator } from '../../annotation/annotator';
import { FenNormalizer } from '../../tree/fennormalizer';
import { FenToPgnMap } from '../../tree/fentopgnmap';
import { PgnToNodeMap } from '../../tree/pgntonodemap';
import { TreeNode } from '../../tree/treenode';
import { BuildAnnotation } from './buildannotation';
import { DisplayType } from './displaytype';

export class DefaultAnnotator implements Annotator<BuildAnnotation | null> {
  annotate(
      node: TreeNode,
      repertoireColor: Color,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap): Promise<BuildAnnotation | null> {
    const repetition = this.calculateRepetition_(node, pgnToNode, fenToPgn);
    const transposition = this.calculateTransposition_(
        node, pgnToNode, fenToPgn);
    const warning = this.calculateWarning_(
        node, repertoireColor, repetition, transposition);
    return Promise.resolve(warning || repetition || transposition || null);
  }

  calculateRepetition_(
      node: TreeNode,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap): BuildAnnotation | null {
    const normalizedFen = FenNormalizer.normalize(node.fen, node.numLegalMoves);
    if (!fenToPgn[normalizedFen]
        || fenToPgn[normalizedFen].length < 2
        || fenToPgn[normalizedFen][0] == node.pgn) {
      // This is a unique position or the first occurrence of it.
      return null;
    }

    for (let i = 0; i < fenToPgn[normalizedFen].length; i++) {
      const repetitionPgn = fenToPgn[normalizedFen][i];
      const repetitionNode = pgnToNode[repetitionPgn];
      if (node.pgn != repetitionPgn
          && node.pgn.startsWith(repetitionPgn)
          && repetitionNode) {
        // This is a repetition.
        const repetitionContent = '<b>' + node.lastMoveVerboseString
            + '</b> is a repetition of the position after <b>'
            + repetitionNode.lastMoveVerboseString
            + '</b>.';
        return {
          title: 'Repetition',
          content: repetitionContent,
          displayType: DisplayType.INFORMATIONAL
        };
      }
    }

    return null;
  }

  calculateTransposition_(
      node: TreeNode,
      pgnToNode: PgnToNodeMap,
      fenToPgn: FenToPgnMap): BuildAnnotation | null {
    const normalizedFen = FenNormalizer.normalize(node.fen, node.numLegalMoves);
    const pgnsForFen = fenToPgn[normalizedFen];
    if (!pgnsForFen || pgnsForFen.length < 2) {
      // This is a unique position.
      return null;
    }

    const nodesWithChildrenForFen = pgnsForFen
        .map(p => pgnToNode[p])
        .filter(n => n.children.length);

    let transpositionPgn: string;
    if (!nodesWithChildrenForFen.length) {
      // If none of the nodes for the repeated position have children, then
      // arbitrarily choose the first occurrence as not being a transposition.
      transpositionPgn = pgnsForFen[0];
    } else {
      // Otherwise, choose the first occurrence of the repeated position with
      // children to not be a transposition.
      transpositionPgn = nodesWithChildrenForFen[0].pgn;
    }

    if (node.pgn == transpositionPgn) {
      // Other occurrences of this position transpose to this one.
      return null;
    }

    const transpositionContent = '<b>' + node.lastMoveVerboseString
        + '</b> transposes to: <p><b>'
        + (transpositionPgn || '(start)')
        + '</b>.';
    return {
      title: 'Transposition',
      content: transpositionContent,
      displayType: DisplayType.INFORMATIONAL
    };
  }

  calculateWarning_(
      node: TreeNode,
      repertoireColor: Color,
      repetition: BuildAnnotation | null,
      transposition: BuildAnnotation | null): BuildAnnotation | null {
    const warnings = [];
    const numChildren = node.children.length;
    const displayColor = repertoireColor == Color.WHITE ? 'White' : 'Black';
    if (numChildren > 0) {
      if (repetition) {
        warnings.push(repetition.content
            + '<p>Lines containing repetitions must end on the first repeated '
            + 'position.<p>To fix, delete all moves after <b>'
            + node.lastMoveVerboseString
            + '</b>.');
      } else if (transposition) {
        warnings.push(transposition.content
            + '<p>Continuations from this position should be added to that '
            + 'line instead.<p>To fix, delete all moves after <b>'
            + node.lastMoveVerboseString
            + '</b>.');
      }
    }
    if (node.colorToMove == repertoireColor) {
      if (!transposition && !numChildren) {
        warnings.push(displayColor
            + ' has no reply to <b>'
            + node.lastMoveVerboseString
            + '</b>.<p>To fix, add a move for '
            + displayColor
            + ' after <b>'
            + node.lastMoveVerboseString
            + '</b> or delete this move.');
      }
      if (!transposition && numChildren > 1) {
        warnings.push('There are multiple moves for '
            + displayColor
            + ' after <b>'
            + node.lastMoveVerboseString
            + '</b> ('
            + (node.children.length > 2 ? 'e.g. ' : '')
            + '<b>'
            + node.children[0].lastMoveVerboseString
            + '</b> and <b>'
            + node.children[1].lastMoveVerboseString
            + '</b>).<p>To fix, choose at most one move for '
            + displayColor
            + ' from this position and delete all other moves.');
      }
    }

    return warnings.length
        ? {
          title: 'Warnings',
          content: warnings[0],
          displayType: DisplayType.WARNING
        }
        : null;
  }
}
