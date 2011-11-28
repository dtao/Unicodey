$(document).ready(function() {
  var $input = $('#input'),
      $output = $('#output');
  
  $input.keyup(function() {
    var text = $input.val(),
        output = [],
        i;
    
    for (i = 0; i < text.length; i++) {
      output.push(text.charCodeAt(i));
    }

    $output.text(output.join(' '));
  });
});