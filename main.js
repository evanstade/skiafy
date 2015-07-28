function $(id) {
  return document.getElementById(id);
}

function ToCommand(letter) {
  switch (letter) {
    case 'M': return 'MOVE_TO';
    case 'm': return 'R_MOVE_TO';
    case 'L': return 'LINE_TO';
    case 'l': return 'R_LINE_TO';
    case 'H': return 'H_LINE_TO';
    case 'h': return 'R_H_LINE_TO';
    case 'V': return 'V_LINE_TO';
    case 'v': return 'R_V_LINE_TO';
    case 'C':
    case 'S':
      return 'CUBIC_TO';
    case 'c':
    case 's':
      return 'R_CUBIC_TO';
    case 'z': return 'CLOSE';
  }
  return '~UNKNOWN~';
}

function ConvertInput() {
  var input = $('user-input').value;
  $('svg-anchor').innerHTML = input;
  var output = '';
  var svgNode = $('svg-anchor').querySelector('svg');
  for (idx in svgNode.children) {
    var svgElement = svgNode.children[idx];
    switch (svgElement.tagName) {
      // PATH ------------------------------------------------------------------
      case 'path':
        // If fill is none, this is probably one of those worthless paths
        // of the form <path fill="none" d="M0 0h24v24H0z"/>
        if (svgElement.getAttribute('fill') == 'none')
          break;

        var commands = [];
        var path = svgElement.getAttribute('d');
        while (path) {
          var point = parseFloat(path);
          if (isNaN(point)) {
            var letter = path[0];
            path = path.substr(1);
            commands.push({ 'command': letter, 'args': [] });
          } else {
            var currentCommand = commands[commands.length - 1];
            if (currentCommand.args.length == 6) {
              commands.push({ 'command': currentCommand.command, 'args': [] });
              currentCommand = commands[commands.length - 1];
            }
            // Insert implicit points.
            if (currentCommand.command == 's' && currentCommand.args.length == 0) {
              var lastCommand = commands[commands.length - 2];
              var lgth = lastCommand.args.length;
              currentCommand.args.push(lastCommand.args[lgth - 2] - lastCommand.args[lgth - 4]);
              currentCommand.args.push(lastCommand.args[lgth - 1] - lastCommand.args[lgth - 3]);
            }

            currentCommand.args.push(point);

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

          path = path.trim();
        }

        for (command_idx in commands) {
          var command = commands[command_idx];
          output += ToCommand(command.command) + ', ';
          for (i in command.args) {
            var point = command.args[i];
            output += point;
            if (((point * 10) % 10) != 0)
              output += 'f';
            output += ', ';
          }
          output = output.trim() + '\n';
        }
        break;

      // CIRCLE ----------------------------------------------------------------
      case 'circle':
        output += 'CIRCLE, ' + svgElement.getAttribute('cx') + ', ' +
            svgElement.getAttribute('cy') + ', ' +
            svgElement.getAttribute('r') + ',\n';
    }
  }

  output += 'END';

  $('output-span').textContent = output;
}

function init() {
  $('go-button').addEventListener('click', ConvertInput);
}

window.onload = init;
