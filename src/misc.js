export function convertHTMLEntities(text) {
  var ta;
  ta = document.createElement("textarea");
  ta.innerHTML = text;
  return ta.innerText;
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

  split_comma = time.split(',')
  split_semicolon = split_comma[0].split(':')
  time = {}
  time.ms = parseInt(split_comma[1])
  time.ss = parseInt(split_semicolon[2])
  time.mm = parseInt(split_semicolon[1])
  time.hh = parseInt(split_semicolon[0])

  ms = time.ms
  ms = (time.ss * 1000) + ms
  ms = ((time.mm * 60) * 1000) + ms
  ms = (((time.hh * 60) * 60) * 1000) + ms

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


export function sanitizeEditorSpan(text) {
  return text.replace(/<\/?(\s+)?span([^>]+)?>/gim,"")
}
