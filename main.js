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
    case 'A': return 'ARC_TO';
    case 'a': return 'R_ARC_TO';
    case 'C':
    case 'S':
      return 'CUBIC_TO';
    case 'c':
    case 's':
      return 'R_CUBIC_TO';
    case 'Z':
    case 'z':
      return 'CLOSE';
  }
  return '~UNKNOWN~';
}

function LengthForCommand(letter) {
  switch (letter) {
    case 'C':
    case 'c':
    case 'S':
    case 's':
      return 6;
    case 'L':
    case 'l':
    case 'H':
    case 'h':
    case 'V':
    case 'v':
      return 2;
    case 'A':
    case 'a':
      return 7;
  };
  return 999;
}

function RoundToHundredths(x) {
  return Math.floor(x * 100 + 0.5) / 100;
}

function HandleNode(svgNode, scaleX, scaleY, translateX, translateY) {
  var output = '';
  for (var idx = 0; idx < svgNode.children.length; ++idx) {
    var svgElement = svgNode.children[idx];
    switch (svgElement.tagName) {
      // g ---------------------------------------------------------------------
      case 'g':
        if (svgElement.getAttribute('transform')) {
          output += "<g> with a transform not handled\n";
          break;
        }

        return HandleNode(svgElement, scaleX, scaleY, translateX, translateY);

      // PATH ------------------------------------------------------------------
      case 'path':
        // If fill is none, this is probably one of those worthless paths
        // of the form <path fill="none" d="M0 0h24v24H0z"/>
        if (svgElement.getAttribute('fill') == 'none')
          break;

        var commands = [];
        var path = svgElement.getAttribute('d').replace(/,/g, ' ').trim();
        if (path.slice(-1).toLowerCase() !== 'z')
          path += 'z';
        while (path) {
          var point = parseFloat(path);
          if (isNaN(point)) {
            var letter = path[0];
            path = path.substr(1);
            commands.push({ 'command': letter, 'args': [] });
          } else {
            var currentCommand = commands[commands.length - 1];
            if (currentCommand.args.length == LengthForCommand(currentCommand.command)) {
              commands.push({ 'command': currentCommand.command, 'args': [] });
              currentCommand = commands[commands.length - 1];
            }
            // Insert implicit points.
            if (currentCommand.command.toLowerCase() == 's' && currentCommand.args.length == 0) {
              if (currentCommand.command == 's') {
                var lastCommand = commands[commands.length - 2];
                if (ToCommand(lastCommand.command).search('CUBIC_TO') >= 0) {
                  // The first control point is assumed to be the reflection of
                  // the second control point on the previous command relative
                  // to the current point.
                  var lgth = lastCommand.args.length;
                  currentCommand.args.push(RoundToHundredths(lastCommand.args[lgth - 2] - lastCommand.args[lgth - 4]));
                  currentCommand.args.push(RoundToHundredths(lastCommand.args[lgth - 1] - lastCommand.args[lgth - 3]));
                } else {
                  // "If there is no previous command or if the previous command
                  // was not an C, c, S or s, assume the first control point is
                  // coincident with the current point."
                  currentCommand.args.push(0);
                  currentCommand.args.push(0);
                }
              } else {
                // TODO(estade): track current point so we can handle 'S'.
                currentCommand.args.push('???');
                currentCommand.args.push('???');
              }
            }

            var xAxis = currentCommand.command.toLowerCase() != 'v' && (currentCommand.args.length % 2 == 0);
            point *= xAxis ? scaleX : scaleY;
            if (currentCommand.command != currentCommand.command.toLowerCase()) {
              point += xAxis ? translateX : translateY;
            }
            point = RoundToHundredths(point);
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
            if (typeof point == 'number' && ((point * 10) % 10 != 0))
              output += 'f';
            output += ', ';
          }
          output = output.trim() + '\n';
        }
        break;

      // CIRCLE ----------------------------------------------------------------
      case 'circle':
        var cx = parseFloat(svgElement.getAttribute('cx'));
        cx *= scaleX;
        cx += translateX;
        var cy = parseFloat(svgElement.getAttribute('cy'));
        cy *= scaleY;
        cy += translateY;
        var rad = parseFloat(svgElement.getAttribute('r'));
        output += 'CIRCLE, ' + cx + ', ' + cy + ', ' + rad + ',\n';
        break;

      // RECT ------------------------------------------------------------------
      case 'rect':
        var x = parseFloat(svgElement.getAttribute('x')) || 0;
        x *= scaleX;
        x += translateX;
        var y = parseFloat(svgElement.getAttribute('y')) || 0;
        y *= scaleY;
        y += translateY;
        var width = parseFloat(svgElement.getAttribute('width'));
        var height = parseFloat(svgElement.getAttribute('height'));

        output += 'ROUND_RECT, ' + x + ', ' + y + ', ' + width + ', ' + height +
            ', ';

        var round = svgElement.getAttribute('rx');
        if (!round)
          round = '0';
        output += round + ',\n';
        break;
    }
  }
  return output;
}

function ConvertInput() {
  var translateX = parseFloat($('transform-x').value);
  var translateY = parseFloat($('transform-y').value);
  if (isNaN(translateX))
    translateX = 0;
  if (isNaN(translateY))
    translateY = 0;

  var scaleX = $('flip-x').checked ? -1 : 1;
  var scaleY = $('flip-y').checked ? -1 : 1;

  var input = $('user-input').value;
  $('svg-anchor').innerHTML = input;
  var output = '';
  var svgNode = $('svg-anchor').querySelector('svg');
  var canvasSize = svgNode.viewBox.baseVal.width;
  if (canvasSize == 0)
    canvasSize = svgNode.width.baseVal.value;
  if (canvasSize != 48)
    output += 'CANVAS_DIMENSIONS, ' + canvasSize + ',\n';

  output += HandleNode(svgNode, scaleX, scaleY, translateX, translateY);
  output += 'END';
  $('output-span').textContent = output;
}

function init() {
  $('go-button').addEventListener('click', ConvertInput);
}

window.onload = init;
