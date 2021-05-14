export function convertHTMLEntities(text) {
  let ta, converted;
  ta = document.createElement("textarea");
  ta.innerHTML = text;
  converted = ta.innerText;
  ta.remove()
  return converted;
}

export function uniqueID(list = null) {
  function randomString() {
    return Math.random().toString(36).substr(2, 9);
  }
  var unique = randomString();
  if (list) {
    while (!list.includes(unique)) {
      return unique;
    }
  }
  return unique;
}

export function getFileExtension(filename) {
  return filename.substr(filename.lastIndexOf('.') + 1, filename.length);
}



export function time2ms(time) {
  const byComma = time.split(',')
  const bySemicolon = byComma[0].split(':')
  const ss = parseInt(bySemicolon[2])
  const mm = parseInt(bySemicolon[1])
  const hh = parseInt(bySemicolon[0])
  const ms = (((((hh * 60) + mm) * 60) + ss) * 1000) + parseInt(byComma[1])
  return ms
}


export function sec2time(timeInSeconds) {
  var pad = function(num, size) {
      return ('000' + num).slice(size * -1);
    },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2) + ',' + pad(milliseconds, 3);
}

export function ms2time(ms) {
  return sec2time(ms / 1000);
}

export function ms2sec(ms) {
  return ms / 1000
}

export function sec2ms(sec) {
  return sec * 1000
}

export function timeLengthMs(start, end) {
  return end - start
}


export function sanitizeEditorSpan(text) {
  return text.replace(/<\/?(\s+)?span([^>]+)?>/gim, "")
}

// https://gist.github.com/Yaffle/117a0f6f92976b5cc6a6f570d911d912
function compareCaretPositons(node1, offset1, node2, offset2) {
  function isAfter(container, offset, node) {
    var c = node;
    while (c.parentNode != container) {
      c = c.parentNode;
    }
    var i = offset;
    while (c != null && i > 0) {
      c = c.previousSibling;
      i -= 1;
    }
    return i > 0;
  }


  if (node1 === node2) {
    return offset1 - offset2;
  }
  var c = node1.compareDocumentPosition(node2);
  if ((c & Node.DOCUMENT_POSITION_CONTAINED_BY) !== 0) {
    return isAfter(node1, offset1, node2) ? +1 : -1;
  } else if ((c & Node.DOCUMENT_POSITION_CONTAINS) !== 0) {
    return isAfter(node2, offset2, node1) ? -1 : +1;
  } else if ((c & Node.DOCUMENT_POSITION_FOLLOWING) !== 0) {
    return -1;
  } else if ((c & Node.DOCUMENT_POSITION_PRECEDING) !== 0) {
    return +1;
  }
}


function* positions(node, isLineStart = true) {

  function stringifyElementStart(node, isLineStart) {
    if (node.tagName.toLowerCase() === 'br') {
      // if (true) {
      return '\n';
      // }
    }
    if (node.tagName.toLowerCase() === 'div') { // Is a block-level element?
      if (!isLineStart) { //TODO: Is not at start of a line?
        return '\n';
      }
    }
    return '';
  }

  console.assert(node.nodeType === Node.ELEMENT_NODE);
  var child = node.firstChild;
  var offset = 0;
  yield {
    node: node,
    offset: offset,
    text: stringifyElementStart(node, isLineStart)
  };
  while (child != null) {
    if (child.nodeType === Node.TEXT_NODE) {
      yield {
        node: child,
        offset: 0 / 0,
        text: child.data
      };
      isLineStart = false;
    } else {
      isLineStart = yield* positions(child, isLineStart);
    }
    child = child.nextSibling;
    offset += 1;
    yield {
      node: node,
      offset: offset,
      text: ''
    };
  }
  return isLineStart;
}

export function getCaretPosition(contenteditable, textPosition) {
  var textOffset = 0;
  var lastNode = null;
  var lastOffset = 0;
  for (var p of positions(contenteditable)) {
    if (p.text.length > textPosition - textOffset) {
      return {
        node: p.node,
        offset: p.node.nodeType === Node.TEXT_NODE ? textPosition - textOffset : p.offset
      };
    }
    textOffset += p.text.length;
    lastNode = p.node;
    lastOffset = p.node.nodeType === Node.TEXT_NODE ? p.text.length : p.offset;
  }
  return {
    node: lastNode,
    offset: lastOffset
  };
}

export function getTextOffset(contenteditable, selectionNode, selectionOffset) {
  var textOffset = 0;
  for (var p of positions(contenteditable)) {
    if (selectionNode.nodeType !== Node.TEXT_NODE && selectionNode === p.node && selectionOffset === p.offset) {
      return textOffset;
    }
    if (selectionNode.nodeType === Node.TEXT_NODE && selectionNode === p.node) {
      return textOffset + selectionOffset;
    }
    textOffset += p.text.length;
  }
  return compareCaretPositons(selectionNode, selectionOffset, contenteditable, 0) < 0 ? 0 : textOffset;
}

export function getValue(contenteditable) {
  var value = '';
  for (var p of positions(contenteditable)) {
    value += p.text;
  }
  return value;
}

export function setSelectionRange(contenteditable, start, end) {
  var selection = window.getSelection();
  var s = getCaretPosition(contenteditable, start);
  var e = getCaretPosition(contenteditable, end);
  selection.setBaseAndExtent(s.node, s.offset, e.node, e.offset);
}
//TODO: Ctrl+A - rangeCount is 2
export function getSelectionDirection(contenteditable) {
  var selection = window.getSelection();
  var c = compareCaretPositons(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);
  return c < 0 ? 'forward' : 'none';
}

export function getSelectionStart(contenteditable) {
  var selection = window.getSelection();
  var c = compareCaretPositons(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);
  return c < 0 ? getTextOffset(contenteditable, selection.anchorNode, selection.anchorOffset) : getTextOffset(contenteditable, selection.focusNode, selection.focusOffset);
}

export function getSelectionEnd(contenteditable) {
  var selection = window.getSelection();
  var c = compareCaretPositons(selection.anchorNode, selection.anchorOffset, selection.focusNode, selection.focusOffset);
  return c < 0 ? getTextOffset(contenteditable, selection.focusNode, selection.focusOffset) : getTextOffset(contenteditable, selection.anchorNode, selection.anchorOffset);
}
