$(document).ready(function() {
  var mainBox = new UnicodeyBox($('#main-wrapper')),
      comparisonBox = new UnicodeyBox($('#comparison-wrapper')),
      $addLink = $('a.add-link');
  
  function compareCodes(index) {
    if (mainBox.codeAt(index) !== comparisonBox.codeAt(index)) {
      mainBox.highlightError(index);
      comparisonBox.highlightError(index);
    } else {
      mainBox.clearStyles(index);
      comparisonBox.clearStyles(index);
    }
  }

  function compareCodesUpTo(index) {
    for (var i = 0; i < index; ++i) {
      compareCodes(i);
    }
  }

  function grayOutFrom(index, box) {
    for (var i = index; i < box.charCount(); ++i) {
      box.grayOut(i);
    }
  }

  function refreshStyles() {
    var mainCharCount = mainBox.charCount(),
        comparisonCharCount = comparisonBox.charCount(),
        lesserCharCount = Math.min(mainCharCount, comparisonCharCount);
    
    compareCodesUpTo(lesserCharCount);
    grayOutFrom(lesserCharCount, (lesserCharCount < mainCharCount) ? mainBox : comparisonBox);
  }

  $addLink.click(function() {
    if (comparisonBox.isVisible()) {
      comparisonBox.hide();
      mainBox.clearStyles();
      $addLink.text('compare');
    } else {
      comparisonBox.show();
      refreshStyles();
      $addLink.text('hide');
    }
  });

  mainBox.onCharDecoded(function(index) {
    if (!comparisonBox.isVisible()) {
      return;
    }

    if (index >= comparisonBox.charCount()) {
      mainBox.grayOut(index);
      return;
    }

    compareCodes(index);
  });

  mainBox.onCleared(function() {
    grayOutFrom(0, comparisonBox);
  });

  mainBox.onFinished(function() {
    if (comparisonBox.charCount() > mainBox.charCount()) {
      grayOutFrom(mainBox.charCount(), comparisonBox);
    }
  });

  comparisonBox.onCharDecoded(function(index) {
    if (index >= mainBox.charCount()) {
      comparisonBox.grayOut(index);
      return;
    }

    compareCodes(index);
  });

  comparisonBox.onCleared(function() {
    grayOutFrom(0, mainBox);
  });

  comparisonBox.onFinished(function() {
    if (mainBox.charCount() > comparisonBox.charCount()) {
      grayOutFrom(comparisonBox.charCount(), mainBox);
    }
  });
});