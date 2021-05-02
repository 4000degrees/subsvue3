window.addEventListener("DOMContentLoaded", function() {
  spans = document.querySelectorAll('.main span')
  spans.forEach((item, i) => {
    item.setAttribute("contenteditable", true);
  });



  samplesrt = `1
  00:00:04,700 --> 00:00:06,736
  where are you going so early?

  2
  00:00:06,900 --> 00:00:09,494
  Don't record any more messages
  on my alarm clock.

  3
  00:00:09,660 --> 00:00:11,252
  why not?

  4
  00:00:11,420 --> 00:00:13,888
  I'll start to think we're married
  or something.

  5
  00:00:14,060 --> 00:00:15,732
  Don't ever say that word.

  6
  00:00:15,900 --> 00:00:20,132
  I'll never bring you chicken soup
  and fuck your brains out again.

  7
  00:00:20,700 --> 00:00:25,774
  - How's your cold?
  - Still there. How about yours?

  8
  00:00:25,940 --> 00:00:29,649
  - You definitely took my mind off it.
  - Really?

  9
  00:00:30,540 --> 00:00:32,690
Yes!

  10
  00:00:39,420 --> 00:00:41,376
  Juliana here.

  11
  00:00:41,540 --> 00:00:45,010
  Hi, Rayna. I missed my audition,
  I lost my head!

  12
  00:00:45,180 --> 00:00:46,977
  Listen, I have to go.

  13
  00:00:47,140 --> 00:00:49,017
  I'm with David.

  14
  00:00:52,740 --> 00:00:57,939
  Help yourself to whatever you want.
  Set the alarm before you go. And...

  15
  00:01:00,100 --> 00:01:01,738
  You are the greatest.

  16
  00:01:02,540 --> 00:01:06,579
  - Bye, honey!
  - Bye, honey. I'll call you later.

  17
  00:01:06,740 --> 00:01:07,968
  when?

  18
  00:01:09,060 --> 00:01:11,255
  - When?
  - Soon!

`


  window['srt'] = samplesrt
  window['jsonSubs'] = parseSRT(samplesrt)

  br = new RegExp("<br[^>]*>", "gi")

  function produceSubtitle(line) {
    text = line.text;
    text = text.replace(br, "\n")
    el = document.createElement('span')
    el.className = 'subtitle'
    // el.dataset.id = line.id
    el.innerHTML = text
    return el
  }

  jsonSubs.forEach((item, i) => {
    editor.appendChild(produceSubtitle(item))
  });


  var selectedElement = null;
  var lastSelectedElement = editor;

  function setFocus(e) {
    if (!window.getSelection().focusNode) {
      return;
    }
    selectedElement = window.getSelection().focusNode.parentNode;

    while (selectedElement.parentNode.contentEditable != 'true') {
      selectedElement = selectedElement.parentNode;
    }
    lastSelectedElement.classList.remove('focus')
    lastSelectedElement = selectedElement
    selectedElement.classList.add('focus');
  };
  document.onselectionchange = setFocus;
  // document.onmouseup = setFocus;

  function insertSubtitle(line, after = selectedElement) {
    after.parentNode.insertBefore(produceSubtitle(line), after.nextSibling);
  }

  hotkeys.filter = function(event) {
    return true;
  }
  hotkeys('ctrl+i, command+r', function() {
    console.log('stopped reload!');
    insertSubtitle({
      text: "sdfsdf"
    })
    return false;
  });

  editor.addEventListener("keypress", function(e) {
    if (e.keyCode == 13) {
      e.preventDefault()
      // insert 2 br tags (if only one br tag is inserted the cursor won't go to the second line)
      document.execCommand('insertHTML', false, '<br><br>');
      // prevent the default behaviour of return key pressed
      return false;
    }
  })


})
