function $(id) {
  return document.getElementById(id);
}

function ToCommand(letter) {
  return letter;
}

function ConvertInput() {
  var input = $('user-input').value;

/*
  var input_lines = input.split('\n');
  for (line in input_lines) {
    var trimmed = input.trim();
    if (
  }

  output = ...
*/
  $('svg-anchor').innerHTML = input;
  var output = '';
  var svgNode = $('svg-anchor').querySelector('svg');
  for (idx in svgNode.children) {
    var svgElement = svgNode.children[idx];
    switch (svgElement.tagName) {
      case 'path':
        // If fill is none, this is probably one of those worthless paths
        // of the form <path fill="none" d="M0 0h24v24H0z"/>
        if (svgElement.getAttribute('fill') == 'none')
          break;

        var path = svgElement.getAttribute('d');
        while (path) {
          var point = parseFloat(path);
          if (isNaN(point)) {
            var letter = path[0];
            path = path.substr(1);
            output = output.trim();
            output += '\n' + ToCommand(letter);
          } else {
            output += point;
            if (((point * 10) % 10) != 0)
              output += 'f';

            var dotsSeen = 0;
            for (var i = 0; i < path.length; ++i) {
              if (i == 0 && path[i] == '-')
                continue;
              if (!isNaN(parseInt(path[i])))
                continue;
              if (path[i] == '.' && ++dotsSeen == 1)
                continue;

              path = path.substr(i);
              break;
            }
          }

          output += ', ';
          path = path.trim();
        }
        break;
    }
    output = output.trim();
  }

  $('output-span').textContent = output;
}

function init() {
  $('go-button').addEventListener('click', ConvertInput);
}

window.onload = init;
