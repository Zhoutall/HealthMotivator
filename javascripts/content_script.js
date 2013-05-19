KeyboardUtils = {
    keyCodes: {
      ESC: 27,
      backspace: 8,
      deleteKey: 46,
      enter: 13,
      space: 32,
      shiftKey: 16,
      f1: 112,
      f12: 123,
      tab: 9
    },
    keyNames: {
      37: "left",
      38: "up",
      39: "right",
      40: "down"
    },
    keyIdentifierCorrectionMap: {
      "U+00C0": ["U+0060", "U+007E"],
      "U+00BD": ["U+002D", "U+005F"],
      "U+00BB": ["U+003D", "U+002B"],
      "U+00DB": ["U+005B", "U+007B"],
      "U+00DD": ["U+005D", "U+007D"],
      "U+00DC": ["U+005C", "U+007C"],
      "U+00BA": ["U+003B", "U+003A"],
      "U+00DE": ["U+0027", "U+0022"],
      "U+00BC": ["U+002C", "U+003C"],
      "U+00BE": ["U+002E", "U+003E"],
      "U+00BF": ["U+002F", "U+003F"]
    },
    init: function() {
      if (navigator.userAgent.indexOf("Mac") !== -1) {
        return this.platform = "Mac";
      } else if (navigator.userAgent.indexOf("Linux") !== -1) {
        return this.platform = "Linux";
      } else {
        return this.platform = "Windows";
      }
    },
    getKeyChar: function(event) {
      var character, correctedIdentifiers, keyIdentifier, unicodeKeyInHex;
      if (event.keyIdentifier.slice(0, 2) !== "U+") {
        if (this.keyNames[event.keyCode]) {
          return this.keyNames[event.keyCode];
        }
        if (event.keyCode >= this.keyCodes.f1 && event.keyCode <= this.keyCodes.f12) {
          return "f" + (1 + event.keyCode - this.keyCodes.f1);
        }
        return "";
      }
      keyIdentifier = event.keyIdentifier;
      if ((this.platform === "Windows" || this.platform === "Linux") && this.keyIdentifierCorrectionMap[keyIdentifier]) {
        correctedIdentifiers = this.keyIdentifierCorrectionMap[keyIdentifier];
        keyIdentifier = event.shiftKey ? correctedIdentifiers[1] : correctedIdentifiers[0];
      }
      unicodeKeyInHex = "0x" + keyIdentifier.substring(2);
      character = String.fromCharCode(parseInt(unicodeKeyInHex)).toLowerCase();
      if (event.shiftKey) {
        return character.toUpperCase();
      } else {
        return character;
      }
    },
    isPrimaryModifierKey: function(event) {
      if (this.platform === "Mac") {
        return event.metaKey;
      } else {
        return event.ctrlKey;
      }
    },
    isEscape: function(event) {
      return (event.keyCode === this.keyCodes.ESC) || (event.ctrlKey && this.getKeyChar(event) === '[');
    }
};

KeyboardUtils.init();
var onKeydown = function(event) {
    var c = KeyboardUtils.getKeyChar(event);
    if (c == 'A' || c == 'S' || c == 'D') {
        chrome.runtime.sendMessage({key: c});
        return true;
    }
    return false;
};
document.addEventListener("keydown", onKeydown, true);
