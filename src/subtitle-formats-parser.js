import parser from 'subtitles-parser'

export default function subsFormatsParser(data, format) {
  var parsedSubtitles = []

  switch (format.toLowerCase()) {
    case "srt":
      var parserOutput = parser.fromSrt(data, true);
      parsedSubtitles = parserOutput.map(item => {
        return {
          start: item.startTime,
          end: item.endTime,
          text: item.text
        }
      })

      break;
    default:
      return "Unsupported format."
  }

  return parsedSubtitles;
}

export function formatSupported(format) {
  return [
    "srt",
  ].includes(format)
}
