import {
  uniqueID
} from './misc'

export default function newSubtitle(properties) {
  return {
    id: uniqueID(),
    text: "",
    start: 0,
    end: 0,
    ...properties
  }
}
