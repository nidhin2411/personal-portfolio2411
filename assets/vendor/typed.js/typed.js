{"version";3,"file";"typed.cjs","sources";["../src/defaults.js","../src/initializer.js","../src/html-parser.js","../src/typed.js"],"sourcesContent"["/**\n * Defaults & options\n * @returns {object} Typed defaults & options\n * @public\n */\n\nconst defaults = {\n  /**\n   * @property {array} strings strings to be typed\n   * @property {string} stringsElement ID of element containing string children\n   */\n  strings: [\n    'These are the default values...',\n    'You know what you should do?',\n    'Use your own!',\n    'Have a great day!',\n  ],\n  stringsElement: null,\n\n  /**\n   * @property {number} typeSpeed type speed in milliseconds\n   */\n  typeSpeed: 0,\n\n  /**\n   * @property {number} startDelay time before typing starts in milliseconds\n   */\n  startDelay: 0,\n\n  /**\n   * @property {number} backSpeed backspacing speed in milliseconds\n   */\n  backSpeed: 0,\n\n  /**\n   * @property {boolean} smartBackspace only backspace what doesn't match the previous string\n   */\n  smartBackspace: true,\n\n  /**\n   * @property {boolean} shuffle shuffle the strings\n   */\n  shuffle: false,\n\n  /**\n   * @property {number} backDelay time before backspacing in milliseconds\n   */\n  backDelay: 700,\n\n  /**\n   * @property {boolean} fadeOut Fade out instead of backspace\n   * @property {string} fadeOutClass css class for fade animation\n   * @property {boolean} fadeOutDelay Fade out delay in milliseconds\n   */\n  fadeOut: false,\n  fadeOutClass: 'typed-fade-out',\n  fadeOutDelay: 500,\n\n  /**\n   * @property {boolean} loop loop strings\n   * @property {number} loopCount amount of loops\n   */\n  loop: false,\n  loopCount: Infinity,\n\n  /**\n   * @property {boolean} showCursor show cursor\n   * @property {string} cursorChar character for cursor\n   * @property {boolean} autoInsertCss insert CSS for cursor and fadeOut into HTML <head>\n   */\n  showCursor: true,\n  cursorChar: '|',\n  autoInsertCss: true,\n\n  /**\n   * @property {string} attr attribute for typing\n   * Ex: input placeholder, value, or just HTML text\n   */\n  attr: null,\n\n  /**\n   * @property {boolean} bindInputFocusEvents bind to focus and blur if el is text input\n   */\n  bindInputFocusEvents: false,\n\n  /**\n   * @property {string} contentType 'html' or 'null' for plaintext\n   */\n  contentType: 'html',\n\n  /**\n   * Before it begins typing\n   * @param {Typed} self\n   */\n  onBegin: (self) => {},\n\n  /**\n   * All typing is complete\n   * @param {Typed} self\n   */\n  onComplete: (self) => {},\n\n  /**\n   * Before each string is typed\n   * @param {number} arrayPos\n   * @param {Typed} self\n   */\n  preStringTyped: (arrayPos, self) => {},\n\n  /**\n   * After each string is typed\n   * @param {number} arrayPos\n   * @param {Typed} self\n   */\n  onStringTyped: (arrayPos, self) => {},\n\n  /**\n   * During looping, after last string is typed\n   * @param {Typed} self\n   */\n  onLastStringBackspaced: (self) => {},\n\n  /**\n   * Typing has been stopped\n   * @param {number} arrayPos\n   * @param {Typed} self\n   */\n  onTypingPaused: (arrayPos, self) => {},\n\n  /**\n   * Typing has been started after being stopped\n   * @param {number} arrayPos\n   * @param {Typed} self\n   */\n  onTypingResumed: (arrayPos, self) => {},\n\n  /**\n   * After reset\n   * @param {Typed} self\n   */\n  onReset: (self) => {},\n\n  /**\n   * After stop\n   * @param {number} arrayPos\n   * @param {Typed} self\n   */\n  onStop: (arrayPos, self) => {},\n\n  /**\n   * After start\n   * @param {number} arrayPos\n   * @param {Typed} self\n   */\n  onStart: (arrayPos, self) => {},\n\n  /**\n   * After destroy\n   * @param {Typed} self\n   */\n  onDestroy: (self) => {},\n};\n\nexport default defaults;\n","import defaults from './defaults.js';\n/**\n * Initialize the Typed object\n */\n\nexport default class Initializer {\n  /**\n   * Load up defaults & options on the Typed instance\n   * @param {Typed} self instance of Typed\n   * @param {object} options options object\n   * @param {string} elementId HTML element ID _OR_ instance of HTML element\n   * @private\n   */\n\n  load(self, options, elementId) {\n    // chosen element to manipulate text\n    if (typeof elementId === 'string') {\n      self.el = document.querySelector(elementId);\n    } else {\n      self.el = elementId;\n    }\n\n    self.options = { ...defaults, ...options };\n\n    // attribute to type into\n    self.isInput = self.el.tagName.toLowerCase() === 'input';\n    self.attr = self.options.attr;\n    self.bindInputFocusEvents = self.options.bindInputFocusEvents;\n\n    // show cursor\n    self.showCursor = self.isInput ? false : self.options.showCursor;\n\n    // custom cursor\n    self.cursorChar = self.options.cursorChar;\n\n    // Is the cursor blinking\n    self.cursorBlinking = true;\n\n    // text content of element\n    self.elContent = self.attr\n      ? self.el.getAttribute(self.attr)\n      : self.el.textContent;\n\n    // html or plain text\n    self.contentType = self.options.contentType;\n\n    // typing speed\n    self.typeSpeed = self.options.typeSpeed;\n\n    // add a delay before typing starts\n    self.startDelay = self.options.startDelay;\n\n    // backspacing speed\n    self.backSpeed = self.options.backSpeed;\n\n    // only backspace what doesn't match the previous string\n    self.smartBackspace = self.options.smartBackspace;\n\n    // amount of time to wait before backspacing\n    self.backDelay = self.options.backDelay;\n\n    // Fade out instead of backspace\n    self.fadeOut = self.options.fadeOut;\n    self.fadeOutClass = self.options.fadeOutClass;\n    self.fadeOutDelay = self.options.fadeOutDelay;\n\n    // variable to check whether typing is currently paused\n    self.isPaused = false;\n\n    // input strings of text\n    self.strings = self.options.strings.map((s) => s.trim());\n\n    // div containing strings\n    if (typeof self.options.stringsElement === 'string') {\n      self.stringsElement = document.querySelector(self.options.stringsElement);\n    } else {\n      self.stringsElement = self.options.stringsElement;\n    }\n\n    if (self.stringsElement) {\n      self.strings = [];\n      self.stringsElement.style.cssText =\n        'clip: rect(0 0 0 0);clip-path:inset(50%);height:1px;overflow:hidden;position:absolute;white-space:nowrap;width:1px;';\n\n      const strings = Array.prototype.slice.apply(self.stringsElement.children);\n      const stringsLength = strings.length;\n\n      if (stringsLength) {\n        for (let i = 0; i < stringsLength; i += 1) {\n          const stringEl = strings[i];\n          self.strings.push(stringEl.innerHTML.trim());\n        }\n      }\n    }\n\n    // character number position of current string\n    self.strPos = 0;\n\n    // If there is some text in the element\n    self.currentElContent = this.getCurrentElContent(self);\n\n    if (self.currentElContent && self.currentElContent.length > 0) {\n      self.strPos = self.currentElContent.length - 1;\n      self.strings.unshift(self.currentElContent);\n    }\n\n    // the order of strings\n    self.sequence = [];\n\n    // Set the order in which the strings are typed\n    for (let i in self.strings) {\n      self.sequence[i] = i;\n    }\n\n    // current array position\n    self.arrayPos = 0;\n\n    // index of string to stop backspacing on\n    self.stopNum = 0;\n\n    // Looping logic\n    self.loop = self.options.loop;\n    self.loopCount = self.options.loopCount;\n    self.curLoop = 0;\n\n    // shuffle the strings\n    self.shuffle = self.options.shuffle;\n\n    self.pause = {\n      status: false,\n      typewrite: true,\n      curString: '',\n      curStrPos: 0,\n    };\n\n    // When the typing is complete (when not looped)\n    self.typingComplete = false;\n\n    self.autoInsertCss = self.options.autoInsertCss;\n\n    if (self.autoInsertCss) {\n      this.appendCursorAnimationCss(self);\n      this.appendFadeOutAnimationCss(self);\n    }\n  }\n\n  getCurrentElContent(self) {\n    let elContent = '';\n    if (self.attr) {\n      elContent = self.el.getAttribute(self.attr);\n    } else if (self.isInput) {\n      elContent = self.el.value;\n    } else if (self.contentType === 'html') {\n      elContent = self.el.innerHTML;\n    } else {\n      elContent = self.el.textContent;\n    }\n    return elContent;\n  }\n\n  appendCursorAnimationCss(self) {\n    const cssDataName = 'data-typed-js-cursor-css';\n\n    if (!self.showCursor || document.querySelector(`[${cssDataName}]`)) {\n      return;\n    }\n\n    let css = document.createElement('style');\n    css.setAttribute(cssDataName, 'true');\n\n    css.innerHTML = `\n        .typed-cursor{\n          opacity: 1;\n        }\n        .typed-cursor.typed-cursor--blink{\n          animation: typedjsBlink 0.7s infinite;\n          -webkit-animation: typedjsBlink 0.7s infinite;\n                  animation: typedjsBlink 0.7s infinite;\n        }\n        @keyframes typedjsBlink{\n          50% { opacity: 0.0; }\n        }\n        @-webkit-keyframes typedjsBlink{\n          0% { opacity: 1; }\n          50% { opacity: 0.0; }\n          100% { opacity: 1; }\n        }\n      `;\n\n    document.body.appendChild(css);\n  }\n\n  appendFadeOutAnimationCss(self) {\n    const cssDataName = 'data-typed-fadeout-js-css';\n\n    if (!self.fadeOut || document.querySelector(`[${cssDataName}]`)) {\n      return;\n    }\n\n    let css = document.createElement('style');\n    css.setAttribute(cssDataName, 'true');\n\n    css.innerHTML = `\n        .typed-fade-out{\n          opacity: 0;\n          transition: opacity .25s;\n        }\n        .typed-cursor.typed-cursor--blink.typed-fade-out{\n          -webkit-animation: 0;\n          animation: 0;\n        }\n      `;\n\n    document.body.appendChild(css);\n  }\n}\n\nexport let initializer = new Initializer();\n","/**\n * TODO: These methods can probably be combined somehow\n * Parse HTML tags & HTML Characters\n */\n\nexport default class HTMLParser {\n  /**\n   * Type HTML tags & HTML Characters\n   * @param {string} curString Current string\n   * @param {number} curStrPos Position in current string\n   * @param {Typed} self instance of Typed\n   * @returns {number} a new string position\n   * @private\n   */\n\n  typeHtmlChars(curString, curStrPos, self) {\n    if (self.contentType !== 'html') return curStrPos;\n    const curChar = curString.substring(curStrPos).charAt(0);\n    if (curChar === '<' || curChar === '&') {\n      let endTag = '';\n      if (curChar === '<') {\n        endTag = '>';\n      } else {\n        endTag = ';';\n      }\n      while (curString.substring(curStrPos + 1).charAt(0) !== endTag) {\n        curStrPos++;\n        if (curStrPos + 1 > curString.length) {\n          break;\n        }\n      }\n      curStrPos++;\n    }\n    return curStrPos;\n  }\n\n  /**\n   * Backspace HTML tags and HTML Characters\n   * @param {string} curString Current string\n   * @param {number} curStrPos Position in current string\n   * @param {Typed} self instance of Typed\n   * @returns {number} a new string position\n   * @private\n   */\n  backSpaceHtmlChars(curString, curStrPos, self) {\n    if (self.contentType !== 'html') return curStrPos;\n    const curChar = curString.substring(curStrPos).charAt(0);\n    if (curChar === '>' || curChar === ';') {\n      let endTag = '';\n      if (curChar === '>') {\n        endTag = '<';\n      } else {\n        endTag = '&';\n      }\n      while (curString.substring(curStrPos - 1).charAt(0) !== endTag) {\n        curStrPos--;\n        if (curStrPos < 0) {\n          break;\n        }\n      }\n      curStrPos--;\n    }\n    return curStrPos;\n  }\n}\n\nexport let htmlParser = new HTMLParser();\n","import { initializer } from './initializer.js';\nimport { htmlParser } from './html-parser.js';\n\n/**\n * Welcome to Typed.js!\n * @param {string} elementId HTML element ID _OR_ HTML element\n * @param {object} options options object\n * @returns {object} a new Typed object\n */\nexport default class Typed {\n  constructor(elementId, options) {\n    // Initialize it up\n    initializer.load(this, options, elementId);\n    // All systems go!\n    this.begin();\n  }\n\n  /**\n   * Toggle start() and stop() of the Typed instance\n   * @public\n   */\n  toggle() {\n    this.pause.status ? this.start() : this.stop();\n  }\n\n  /**\n   * Stop typing / backspacing and enable cursor blinking\n   * @public\n   */\n  stop() {\n    if (this.typingComplete) return;\n    if (this.pause.status) return;\n    this.toggleBlinking(true);\n    this.pause.status = true;\n    this.options.onStop(this.arrayPos, this);\n  }\n\n  /**\n   * Start typing / backspacing after being stopped\n   * @public\n   */\n  start() {\n    if (this.typingComplete) return;\n    if (!this.pause.status) return;\n    this.pause.status = false;\n    if (this.pause.typewrite) {\n      this.typewrite(this.pause.curString, this.pause.curStrPos);\n    } else {\n      this.backspace(this.pause.curString, this.pause.curStrPos);\n    }\n    this.options.onStart(this.arrayPos, this);\n  }\n\n  /**\n   * Destroy this instance of Typed\n   * @public\n   */\n  destroy() {\n    this.reset(false);\n    this.options.onDestroy(this);\n  }\n\n  /**\n   * Reset Typed and optionally restarts\n   * @param {boolean} restart\n   * @public\n   */\n  reset(restart = true) {\n    clearInterval(this.timeout);\n    this.replaceText('');\n    if (this.cursor && this.cursor.parentNode) {\n      this.cursor.parentNode.removeChild(this.cursor);\n      this.cursor = null;\n    }\n    this.strPos = 0;\n    this.arrayPos = 0;\n    this.curLoop = 0;\n    if (restart) {\n      this.insertCursor();\n      this.options.onReset(this);\n      this.begin();\n    }\n  }\n\n  /**\n   * Begins the typing animation\n   * @private\n   */\n  begin() {\n    this.options.onBegin(this);\n    this.typingComplete = false;\n    this.shuffleStringsIfNeeded(this);\n    this.insertCursor();\n    if (this.bindInputFocusEvents) this.bindFocusEvents();\n    this.timeout = setTimeout(() => {\n      // If the strPos is 0, we're starting from the beginning of a string\n      // else, we're starting with a previous string that needs to be backspaced first\n      if (this.strPos === 0) {\n        this.typewrite(this.strings[this.sequence[this.arrayPos]], this.strPos);\n      } else {\n        this.backspace(this.strings[this.sequence[this.arrayPos]], this.strPos);\n      }\n    }, this.startDelay);\n  }\n\n  /**\n   * Called for each character typed\n   * @param {string} curString the current string in the strings array\n   * @param {number} curStrPos the current position in the curString\n   * @private\n   */\n  typewrite(curString, curStrPos) {\n    if (this.fadeOut && this.el.classList.contains(this.fadeOutClass)) {\n      this.el.classList.remove(this.fadeOutClass);\n      if (this.cursor) this.cursor.classList.remove(this.fadeOutClass);\n    }\n\n    const humanize = this.humanizer(this.typeSpeed);\n    let numChars = 1;\n\n    if (this.pause.status === true) {\n      this.setPauseStatus(curString, curStrPos, true);\n      return;\n    }\n\n    // contain typing function in a timeout humanize'd delay\n    this.timeout = setTimeout(() => {\n      // skip over any HTML chars\n      curStrPos = htmlParser.typeHtmlChars(curString, curStrPos, this);\n\n      let pauseTime = 0;\n      let substr = curString.substring(curStrPos);\n      // check for an escape character before a pause value\n      // format: \\^\\d+ .. eg: ^1000 .. should be able to print the ^ too using ^^\n      // single ^ are removed from string\n      if (substr.charAt(0) === '^') {\n        if (/^\\^\\d+/.test(substr)) {\n          let skip = 1; // skip at least 1\n          substr = /\\d+/.exec(substr)[0];\n          skip += substr.length;\n          pauseTime = parseInt(substr);\n          this.temporaryPause = true;\n          this.options.onTypingPaused(this.arrayPos, this);\n          // strip out the escape character and pause value so they're not printed\n          curString =\n            curString.substring(0, curStrPos) +\n            curString.substring(curStrPos + skip);\n          this.toggleBlinking(true);\n        }\n      }\n\n      // check for skip characters formatted as\n      // \"this is a `string to print NOW` ...\"\n      if (substr.charAt(0) === '`') {\n        while (curString.substring(curStrPos + numChars).charAt(0) !== '`') {\n          numChars++;\n          if (curStrPos + numChars > curString.length) break;\n        }\n        // strip out the escape characters and append all the string in between\n        const stringBeforeSkip = curString.substring(0, curStrPos);\n        const stringSkipped = curString.substring(\n          stringBeforeSkip.length + 1,\n          curStrPos + numChars\n        );\n        const stringAfterSkip = curString.substring(curStrPos + numChars + 1);\n        curString = stringBeforeSkip + stringSkipped + stringAfterSkip;\n        numChars--;\n      }\n\n      // timeout for any pause after a character\n      this.timeout = setTimeout(() => {\n        // Accounts for blinking while paused\n        this.toggleBlinking(false);\n\n        // We're done with this sentence!\n        if (curStrPos >= curString.length) {\n          this.doneTyping(curString, curStrPos);\n        } else {\n          this.keepTyping(curString, curStrPos, numChars);\n        }\n        // end of character pause\n        if (this.temporaryPause) {\n          this.temporaryPause = false;\n          this.options.onTypingResumed(this.arrayPos, this);\n        }\n      }, pauseTime);\n\n      // humanized value for typing\n    }, humanize);\n  }\n\n  /**\n   * Continue to the next string & begin typing\n   * @param {string} curString the current string in the strings array\n   * @param {number} curStrPos the current position in the curString\n   * @private\n   */\n  keepTyping(curString, curStrPos, numChars) {\n    // call before functions if applicable\n    if (curStrPos === 0) {\n      this.toggleBlinking(false);\n      this.options.preStringTyped(this.arrayPos, this);\n    }\n    // start typing each new char into existing string\n    // curString: arg, this.el.html: original text inside element\n    curStrPos += numChars;\n    const nextString = curString.substring(0, curStrPos);\n    this.replaceText(nextString);\n    // loop the function\n    this.typewrite(curString, curStrPos);\n  }\n\n  /**\n   * We're done typing the current string\n   * @param {string} curString the current string in the strings array\n   * @param {number} curStrPos the current position in the curString\n   * @private\n   */\n  doneTyping(curString, curStrPos) {\n    // fires callback function\n    this.options.onStringTyped(this.arrayPos, this);\n    this.toggleBlinking(true);\n    // is this the final string\n    if (this.arrayPos === this.strings.length - 1) {\n      // callback that occurs on the last typed string\n      this.complete();\n      // quit if we wont loop back\n      if (this.loop === false || this.curLoop === this.loopCount) {\n        return;\n      }\n    }\n    this.timeout = setTimeout(() => {\n      this.backspace(curString, curStrPos);\n    }, this.backDelay);\n  }\n\n  /**\n   * Backspaces 1 character at a time\n   * @param {string} curString the current string in the strings array\n   * @param {number} curStrPos the current position in the curString\n   * @private\n   */\n  backspace(curString, curStrPos) {\n    if (this.pause.status === true) {\n      this.setPauseStatus(curString, curStrPos, false);\n      return;\n    }\n    if (this.fadeOut) return this.initFadeOut();\n\n    this.toggleBlinking(false);\n    const humanize = this.humanizer(this.backSpeed);\n\n    this.timeout = setTimeout(() => {\n      curStrPos = htmlParser.backSpaceHtmlChars(curString, curStrPos, this);\n      // replace text with base text + typed characters\n      const curStringAtPosition = curString.substring(0, curStrPos);\n      this.replaceText(curStringAtPosition);\n\n      // if smartBack is enabled\n      if (this.smartBackspace) {\n        // the remaining part of the current string is equal of the same part of the new string\n        let nextString = this.strings[this.arrayPos + 1];\n        if (\n          nextString &&\n          curStringAtPosition === nextString.substring(0, curStrPos)\n        ) {\n          this.stopNum = curStrPos;\n        } else {\n          this.stopNum = 0;\n        }\n      }\n\n      // if the number (id of character in current string) is\n      // less than the stop number, keep going\n      if (curStrPos > this.stopNum) {\n        // subtract characters one by one\n        curStrPos--;\n        // loop the function\n        this.backspace(curString, curStrPos);\n      } else if (curStrPos <= this.stopNum) {\n        // if the stop number has been reached, increase\n        // array position to next string\n        this.arrayPos++;\n        // When looping, begin at the beginning after backspace complete\n        if (this.arrayPos === this.strings.length) {\n          this.arrayPos = 0;\n          this.options.onLastStringBackspaced();\n          this.shuffleStringsIfNeeded();\n          this.begin();\n        } else {\n          this.typewrite(this.strings[this.sequence[this.arrayPos]], curStrPos);\n        }\n      }\n      // humanized value for typing\n    }, humanize);\n  }\n\n  /**\n   * Full animation is complete\n   * @private\n   */\n  complete() {\n    this.options.onComplete(this);\n    if (this.loop) {\n      this.curLoop++;\n    } else {\n      this.typingComplete = true;\n    }\n  }\n\n  /**\n   * Has the typing been stopped\n   * @param {string} curString the current string in the strings array\n   * @param {number} curStrPos the current position in the curString\n   * @param {boolean} isTyping\n   * @private\n   */\n  setPauseStatus(curString, curStrPos, isTyping) {\n    this.pause.typewrite = isTyping;\n    this.pause.curString = curString;\n    this.pause.curStrPos = curStrPos;\n  }\n\n  /**\n   * Toggle the blinking cursor\n   * @param {boolean} isBlinking\n   * @private\n   */\n  toggleBlinking(isBlinking) {\n    if (!this.cursor) return;\n    // if in paused state, don't toggle blinking a 2nd time\n    if (this.pause.status) return;\n    if (this.cursorBlinking === isBlinking) return;\n    this.cursorBlinking = isBlinking;\n    if (isBlinking) {\n      this.cursor.classList.add('typed-cursor--blink');\n    } else {\n      this.cursor.classList.remove('typed-cursor--blink');\n    }\n  }\n\n  /**\n   * Speed in MS to type\n   * @param {number} speed\n   * @private\n   */\n  humanizer(speed) {\n    return Math.round((Math.random() * speed) / 2) + speed;\n  }\n\n  /**\n   * Shuffle the sequence of the strings array\n   * @private\n   */\n  shuffleStringsIfNeeded() {\n    if (!this.shuffle) return;\n    this.sequence = this.sequence.sort(() => Math.random() - 0.5);\n  }\n\n  /**\n   * Adds a CSS class to fade out current string\n   * @private\n   */\n  initFadeOut() {\n    this.el.className += ` ${this.fadeOutClass}`;\n    if (this.cursor) this.cursor.className += ` ${this.fadeOutClass}`;\n    return setTimeout(() => {\n      this.arrayPos++;\n      this.replaceText('');\n\n      // Resets current string if end of loop reached\n      if (this.strings.length > this.arrayPos) {\n        this.typewrite(this.strings[this.sequence[this.arrayPos]], 0);\n      } else {\n        this.typewrite(this.strings[0], 0);\n        this.arrayPos = 0;\n      }\n    }, this.fadeOutDelay);\n  }\n\n  /**\n   * Replaces current text in the HTML element\n   * depending on element type\n   * @param {string} str\n   * @private\n   */\n  replaceText(str) {\n    if (this.attr) {\n      this.el.setAttribute(this.attr, str);\n    } else {\n      if (this.isInput) {\n        this.el.value = str;\n      } else if (this.contentType === 'html') {\n        this.el.innerHTML = str;\n      } else {\n        this.el.textContent = str;\n      }\n    }\n  }\n\n  /**\n   * If using input elements, bind focus in order to\n   * start and stop the animation\n   * @private\n   */\n  bindFocusEvents() {\n    if (!this.isInput) return;\n    this.el.addEventListener('focus', (e) => {\n      this.stop();\n    });\n    this.el.addEventListener('blur', (e) => {\n      if (this.el.value && this.el.value.length !== 0) {\n        return;\n      }\n      this.start();\n    });\n  }\n\n  /**\n   * On init, insert the cursor element\n   * @private\n   */\n  insertCursor() {\n    if (!this.showCursor) return;\n    if (this.cursor) return;\n    this.cursor = document.createElement('span');\n    this.cursor.className = 'typed-cursor';\n    this.cursor.setAttribute('aria-hidden', true);\n    this.cursor.innerHTML = this.cursorChar;\n    this.el.parentNode &&\n      this.el.parentNode.insertBefore(this.cursor, this.el.nextSibling);\n  }\n}\n"],"names" ["defaults","strings","stringsElement","typeSpeed","startDelay","backSpeed","smartBackspace","shuffle","backDelay","fadeOut","fadeOutClass","fadeOutDelay","loop","loopCount","Infinity","showCursor","cursorChar","autoInsertCss","attr","bindInputFocusEvents","contentType","onBegin","self","onComplete","preStringTyped","arrayPos","onStringTyped","onLastStringBackspaced","onTypingPaused","onTypingResumed","onReset","onStop","onStart","onDestroy","initializer","Initializer","_proto","prototype","load","options","elementId","el","document","querySelector","_extends","isInput","tagName","toLowerCase","cursorBlinking","elContent","getAttribute","textContent","isPaused","map","s","trim","style","cssText","Array","slice","apply","children","stringsLength","length","i","push","innerHTML","strPos","currentElContent","this","getCurrentElContent","unshift","sequence","stopNum","curLoop","pause","status","typewrite","curString","curStrPos","typingComplete","appendCursorAnimationCss","appendFadeOutAnimationCss","value","cssDataName","css","createElement","setAttribute","body","appendChild","htmlParser","HTMLParser","typeHtmlChars","curChar","substring","charAt","endTag","backSpaceHtmlChars","Typed","begin","toggle","start","stop","toggleBlinking","backspace","destroy","reset","restart","clearInterval","timeout","replaceText","cursor","parentNode","removeChild","insertCursor","_this","shuffleStringsIfNeeded","bindFocusEvents","setTimeout","_this2","classList","contains","remove","humanize","humanizer","numChars","pauseTime","substr","test","skip","exec","parseInt","temporaryPause","stringBeforeSkip","stringSkipped","stringAfterSkip","doneTyping","keepTyping","setPauseStatus","nextString","_this3","complete","_this4","initFadeOut","curStringAtPosition","isTyping","isBlinking","add","speed","Math","round","random","sort","_this5","className","str","_this6","addEventListener","e","insertBefore","nextSibling"],"mappings";"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"}