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

export function getTextSelectionWhithin(element) {
  // get text selection including newlines
  // https://stackoverflow.com/a/54352392
  const getTextSelection = function(editor) {
    const selection = window.getSelection();

    if (selection != null && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      if (!editor.contains(range.startContainer) || !editor.contains(range.endContainer)) {
        return null
      }

      return {
        start: getTextLength(editor, range.startContainer, range.startOffset),
        end: getTextLength(editor, range.endContainer, range.endOffset)
      };
    } else
      return null;
  }

  const getTextLength = function(parent, node, offset) {
    var textLength = 0;
    if (node.nodeName == '#text')
      textLength += offset;
    else
      for (var i = 0; i < offset; i++)
        textLength += getNodeTextLength(node.childNodes[i]);

    if (node != parent)
      textLength += getTextLength(parent, node.parentNode, getNodeOffset(node));

    return textLength;
  }

  const getNodeTextLength = function(node) {
    var textLength = 0;

    if (node.nodeName == 'BR')
      textLength = 1;
    else if (node.nodeName == '#text')
      textLength = node.nodeValue.length;
    else if (node.childNodes != null)
      for (var i = 0; i < node.childNodes.length; i++)
        textLength += getNodeTextLength(node.childNodes[i]);

    return textLength;
  }

  const getNodeOffset = function(node) {
    return node == null ? -1 : 1 + getNodeOffset(node.previousSibling);
  }

  return getTextSelection(element)
}


export function sanitizeEditorSpan(text) {
  return text.replace(/<\/?(\s+)?span([^>]+)?>/gim, "")
}
