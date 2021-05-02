import parser from 'subtitles-parser'

import newSubtitle from './newSubtitle'

export default function subsFormatsParser(data, format) {
  var subsData = []

  switch (format.toLowerCase()) {
    case "srt":
      var parsed = parser.fromSrt(data, true);
      for (const [key, value] of Object.entries(parsed)) {
        subsData.push(newSubtitle({
          start: value.startTime,
          end: value.endTime,
          text: value.text
        }))
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
