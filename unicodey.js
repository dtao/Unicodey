$(document).ready(function() {
  var $input = $('#input'),
      $output = $('#output'),
      iterator;
  
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
      }, 1);
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
    var $block = $('<div>').addClass('block'),
        $charBox = $('<div>').addClass('char-box').text(char).appendTo($block),
        $codeBox = $('<div>').addClass('code-box').text(charCode).appendTo($block);
    
    $block.appendTo($output);
  }
  
  $input.keyup(function() {
    if (iterator) {
      iterator.stop();
    }
    $output.empty();
    iterator = eachCharAsync($input.val(), displayUnicode);
  });
});