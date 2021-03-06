define(function(require) {
  require('foundation.tooltip');
  //Replaces all class"tip" divs with an information icon that
  //displays the tip information on mouseover.
  var _setup = function(context, position) {
    //For each tip in this context
    $('.tip', context).each(function() {
      var obj = $(this);
      obj.removeClass('tip');
      var tip = obj.html();

      var tip_classes = ['has-tip']
      if (position) {
        tip_classes.push(position)
      }
      //replace the text with an icon and spans
      obj.html('<span data-tooltip class="' + tip_classes.join(' ') + '" data-width="210" title="' + tip + '"><i class="fa fa-question-circle"></i></span>');
    });
    $(document).foundation('reflow', 'tooltip');
  }

  return {
    'setup': _setup
  }
})
