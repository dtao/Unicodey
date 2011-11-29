function UnicodeyBox($wrapper) {
  var $input = $wrapper.find('.unicodey-input'),
      $outputLabel = $wrapper.find('p.output-label'),
      $loadingImage = $wrapper.find('img.loading-image'),
      $charRow = $wrapper.find('tr.char-row'),
      $codeRow = $wrapper.find('tr.code-row'),
      waitingId,
      iterator,
      lastValue,
      clearedHandler = $.noop,
      charDecodedHandler = $.noop,
      finishedHandler = $.noop;
  
  function eachCharAsync(string, func) {
    var upper = string.length - 1,
        timeoutId;
    
    (function iterate(index) {
      timeoutId = setTimeout(function() {
        var char = string.charAt(index),
            charCode = string.charCodeAt(index);
        
        func(char, charCode);
        charDecodedHandler(index, char, charCode);

        if (index < upper) {
          iterate(index + 1);
        } else {
          timeoutId = null;
          finishedHandler();
        }
      }, 25);
    }(/*index=*/ 0));

    return {
      stop: function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };
  }

  function displayUnicode(char, charCode) {
    $('<td>').text(char).appendTo($charRow);
    $('<td>').text(charCode).appendTo($codeRow);
  }

  function reset() {
    if (iterator) {
      iterator.stop();
    }

    $outputLabel.hide();
    $charRow.empty();
    $codeRow.empty();
  }
  
  $input.keyup(function() {
    var value = $input.val();

    if (value === lastValue) {
      return;
    }

    reset();

    if (value === '') {
      clearedHandler();
    } else {
      $loadingImage.show();

      if (waitingId) {
        clearTimeout(waitingId);
      }

      waitingId = setTimeout(function() {
        $loadingImage.hide();
        $outputLabel.show();
        $('<th>').text('Char').appendTo($charRow);
        $('<th>').text('Code').appendTo($codeRow);
        iterator = eachCharAsync(value, displayUnicode);
        waitingId = null;
      }, 500);
    }

    lastValue = value;
  });

  this.isVisible = function() {
    return $wrapper.is(':visible');
  };

  this.show = function() {
    $wrapper.show();
  };

  this.hide = function() {
    $wrapper.hide();
  };

  this.highlightError = function(index) {
    this.clearStyles(index);
    $($charRow.find('td')[index]).addClass('mismatch');
    $($codeRow.find('td')[index]).addClass('mismatch');
  };

  this.grayOut = function(index) {
    this.clearStyles(index);
    $($charRow.find('td')[index]).addClass('gray');
    $($codeRow.find('td')[index]).addClass('gray');
  };

  this.clearStyles = function(index) {
    if (typeof index === 'number') {
      $($charRow.find('td')[index]).removeClass('mismatch gray');
      $($codeRow.find('td')[index]).removeClass('mismatch gray');
    } else {
      $charRow.find('td').removeClass('mismatch gray');
      $codeRow.find('td').removeClass('mismatch gray');
    }
  };

  this.charCount = function() {
    return $charRow.find('td').length;
  };

  this.codeAt = function(index) {
    return $codeRow.find('td')[index].innerText;
  };

  this.onCleared = function(handler) {
    clearedHandler = handler;
  };

  this.onCharDecoded = function(handler) {
    charDecodedHandler = handler;
  };

  this.onFinished = function(handler) {
    finishedHandler = handler;
  };
}