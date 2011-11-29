$(document).ready(function() {
  var $input = $('#input'),
      $outputLabel = $('p.output-label'),
      $loadingImage = $('img.loading-image'),
      $charRow = $('tr.char-row'),
      $codeRow = $('tr.code-row'),
      waitingId,
      iterator,
      lastValue;
  
  function eachCharAsync(string, func) {
    var upper = string.length - 1,
        timeoutId;
    
    (function iterate(index) {
      timeoutId = setTimeout(function() {
        func(string.charAt(index), string.charCodeAt(index));
        if (index < upper) {
          iterate(index + 1);
        } else {
          timeoutId = null;
        }
      }, 4);
    }(0));

    return {
      stop: function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      }
    };
  }

  function displayUnicode(char, charCode) {
    $('<td>').text(char).appendTo($charRow),
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

    if (value !== '') {
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
});