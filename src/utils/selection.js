/*光标是否是本节点的最后一行*/
export function isCursorAtLineEnd() {
  const selection = document.getSelection();
  const range = selection.getRangeAt(0);
  const node = range.endContainer;
  const offset = range.endOffset;

  // 获取光标所在行的最后一个节点
  const lastNode = getLastNodeOfLine(node);

  return node === lastNode && offset === lastNode.textContent.length;
}

export function getLastNodeOfLine(node) {
  const lineNode = getLineNode(node);
  const nodes = getAllTextNodes(lineNode);
  const lastNode = nodes[nodes.length - 1];

  return lastNode;
}

export function getLineNode(node) {
  while (node.nodeName !== 'DIV') {
    node = node.parentNode;
  }
  return node;
}

export function getAllTextNodes(node) {
  const treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while(treeWalker.nextNode()) {
    textNodes.push(treeWalker.currentNode);
  }

  return textNodes;
}
/*使用 Selection 对象中的 getRangeAt() 方法获取光标所在的范围（Range 对象）
然后通过 Range 对象中的属性获取光标所在的节点*/
export  function getCursorNode() {
  let cursorNode = null;
  const selection = window.getSelection();
  if (selection.rangeCount) {
    const range = selection.getRangeAt(0);
    cursorNode = range.endContainer;
    // 如果是文本节点，获取其父元素
    if (cursorNode.nodeType === Node.TEXT_NODE) {
      cursorNode = cursorNode.parentNode;
    }
  }
  return cursorNode;
}

export function moveCursorToEndOfNode(node) {
  const range = document.createRange();
  range.selectNodeContents(node);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}