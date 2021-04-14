import parser from 'subtitles-parser'

import store from './store'
import {getFileExtension} from './misc'

export default function subsFormatsParser(data, format) {
  var subsData = Object.create(null);

  switch (format.toLowerCase()) {
    case "srt":
      // start, end, text, id
      var parsed = parser.fromSrt(data, true);
      for (const [key, value] of Object.entries(parsed)) {
        store.commit("addSubtitle", {
          start: value.startTime,
          end: value.endTime,
          text: value.text
        })
      }

      break;
    default:
      return "Unsupported format."
  }

  return subsData;
}

export function formatSupported(format) {
  return [
    "srt",
  ].includes(format)
}
