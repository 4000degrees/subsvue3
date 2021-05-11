import {
  ms2time
} from './misc'
import FileSaver from "file-saver";

export default function saveFile(subtitles) {
  var srt = ''
  var i = 1;

  subtitles.forEach(subtitle => {
    srt += `${i}
${ms2time(subtitle.start)} --> ${ms2time(subtitle.end)}
${subtitle.text}

`;
    i++
  })

  var blob = new Blob([srt], {
    type: "text/plain;charset=utf-8"
  });
  FileSaver.saveAs(blob, "hello world.srt");

  // console.log(srt)
}
