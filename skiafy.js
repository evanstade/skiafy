// Copyright 2021 The Skiafy Authors
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
    case 'C': return 'CUBIC_TO';
    case 'S': return 'CUBIC_TO_SHORTHAND';
    case 'c':
    case 's':
      return 'R_CUBIC_TO';
    case 'Q': return 'QUADRATIC_TO';
    case 'T': return 'QUADRATIC_TO_SHORTHAND';
    case 'q':
    case 't':
      return 'R_QUADRATIC_TO';
    case 'Z':
    case 'z':
      return 'CLOSE';
  }
  return '~UNKNOWN~';
}

function LengthForSvgDirective(letter) {
  switch (letter) {
    case 'C':
    case 'c':
    case 's':
      return 6;
    case 'S':
    case 'Q':
    case 'q':
    case 't':
      return 4;
    case 'T':
    case 'L':
    case 'l':
    case 'H':
    case 'h':
    case 'V':
    case 'v':
    case 'm':
    case 'M':
      return 2;
    case 'A':
    case 'a':
      return 7;
  }
  return 999;
}

function RoundToHundredths(x) {
  return Math.floor(x * 100 + 0.5) / 100;
}

// |fillString| is expected to be "#RRGGBB" or "#RGB".
function ParseFillStringToPathColor(fillString) {
  fillString = fillString.toUpperCase();

  if (fillString.length === 4) {
    // Color in form of #RGB so let's turn that to #RRGGBB.
    fillString = `#${fillString[1]}${fillString[1]}${fillString[2]}${fillString[2]}${fillString[3]}${fillString[3]}`;
  }

  const r = fillString.substr(1,2);
  const g = fillString.substr(3,2);
  const b = fillString.substr(5,2);

  return `PATH_COLOR_ARGB, 0xFF, 0x${r}, 0x${g}, 0x${b},\n`;
}

// This method will parse the fill for |element| and if the fill
// is valid and usable, will return the corresponding path color command. If
// the fill is unusable, will return empty string.
function GetPathColorCommandFromFill(element) {
  const supportedSVGElements = ['path', 'circle', 'rect'];
  const isElementSupported = supportedSVGElements.includes(element.tagName);
  const fill = element.getAttribute('fill');
  if (isElementSupported && fill && fill !== 'none') {
    // Colors in form #FFF or #FFFFFF.
    const hexColorRegExp = /^#([0-9a-f]{3})$|^#([0-9a-f]{6})$/gi;
    const fillMatch = fill.match(hexColorRegExp);
    if (fillMatch && fillMatch.length === 1)
      return ParseFillStringToPathColor(fillMatch[0]);
  }

  return '';
}

function HandleNode(svgNode, scaleX, scaleY, translateX, translateY, preserveFill) {
  var output = '';
  for (var idx = 0; idx < svgNode.children.length; ++idx) {
    if (idx !== 0 && output)
        output += 'NEW_PATH,\n';

    var svgElement = svgNode.children[idx];

    if (preserveFill)
      output += GetPathColorCommandFromFill(svgElement);

    switch (svgElement.tagName) {
      // g ---------------------------------------------------------------------
      case 'g':
        if (svgElement.getAttribute('transform'))
          throw new Error('<g> with a transform not handled');
        else
          output += HandleNode(svgElement, scaleX, scaleY, translateX, translateY, preserveFill);

        break;

      // PATH ------------------------------------------------------------------
      case 'path':
        // If fill is none, this is probably one of those worthless elements
        // of the form <path fill="none" d="M0 0h24v24H0z"/>, so we skip.
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
            var svgDirective = currentCommand.command;

            // Repeated sets of arguments imply the command is repeated, unless the current
            // command is moveto, which implies that the rest are implicitly linetos.
            if (currentCommand.args.length == LengthForSvgDirective(svgDirective)) {
              if (svgDirective == 'm')
                svgDirective = 'l';
              else if (svgDirective == 'M')
                svgDirective = 'L';
              
              commands.push({ 'command': svgDirective, 'args': [] });
              currentCommand = commands[commands.length - 1];
              svgDirective = currentCommand.command;
            }

            var pathNeedsPruning = true;
            if (svgDirective.toLowerCase() == 'a' &&
                currentCommand.args.length >= 3 &&
                currentCommand.args.length <= 4) {
              point = parseInt(path[0]);
              console.assert(point == 0 || point == 1, 'Unexpected arc argument ' << point);
              path = path.substr(1);
              pathNeedsPruning = false;
            }

            // Insert implicit points for cubic and quadratic curves.
            var isQuadraticOrCubic = svgDirective.toLowerCase() == 's' || svgDirective.toLowerCase() == 't';
            if (isQuadraticOrCubic && currentCommand.args.length == 0) {
              if (svgDirective == 's' || svgDirective == 't') {
                var lastCommand = commands[commands.length - 2];
                // Make sure relative 's' directives can only match with
                // previous cubic commands, and that relative 't' directives can
                // only match with previous quadratic commands.
                if ((svgDirective == 's' && ToCommand(lastCommand.command).search('CUBIC_TO') >= 0) ||
                    (svgDirective == 't' && ToCommand(lastCommand.command).search('QUADRATIC_TO') >= 0)) {
                  // The first control point is assumed to be the reflection of
                  // the last control point on the previous command relative
                  // to the current point.
                  var lgth = lastCommand.args.length;
                  currentCommand.args.push(RoundToHundredths(lastCommand.args[lgth - 2] - lastCommand.args[lgth - 4]));
                  currentCommand.args.push(RoundToHundredths(lastCommand.args[lgth - 1] - lastCommand.args[lgth - 3]));
                } else {
                  // If there is no previous command or if the previous command
                  // was not an C, c, S or s for cubics, or Q, q, T, t for
                  // quadratics, assume the first control point is coincident with
                  // the current point.
                  currentCommand.args.push(0);
                  currentCommand.args.push(0);
                }
              }
            }

            // Whether to apply flipping and translating transforms to the
            // argument. Only the last two arguments (out of 7) in an arc
            // command are coordinates.
            var transformArg = true;
            // xAxis is true when the current coordinate refers to the xAxis.
            var xAxis = currentCommand.args.length % 2 == 0;
            if (svgDirective.toLowerCase() == 'a') {
              if (currentCommand.args.length < 5)
                transformArg = false;
              xAxis = currentCommand.args.length % 2 == 1;
            } else if (svgDirective.toLowerCase() == 'v') {
              xAxis = false;
            }
            if (transformArg) {
              point *= xAxis ? scaleX : scaleY;
              if (svgDirective != svgDirective.toLowerCase())
                point += xAxis ? translateX : translateY;
            }
            point = RoundToHundredths(point);
            currentCommand.args.push(point);

            if (pathNeedsPruning) {
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

          }

          path = path.trim();
        }

        var isStrokePath = svgElement.getAttribute('stroke') &&
                           svgElement.getAttribute('stroke') != 'none';
        if (isStrokePath) {
          var strokeWidth =  svgElement.getAttribute('stroke-width');
          if (!strokeWidth || isNaN(strokeWidth))
            strokeWidth = 1;

          output += 'STROKE, ' + strokeWidth + ',\n';
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
        output += 'NEW_PATH,\n';

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
        output += 'NEW_PATH,\n';

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

      // OVAL ----------------------------------------------------------------
      case 'ellipse':
          output += 'NEW_PATH,\n';

          var cx = parseFloat(svgElement.getAttribute('cx')) || 0;
          cx *= scaleX;
          cx += translateX;
          var cy = parseFloat(svgElement.getAttribute('cy')) || 0;
          cy *= scaleY;
          cy += translateY;
          var rx = parseFloat(svgElement.getAttribute('rx')) || 0;
          var ry = parseFloat(svgElement.getAttribute('ry')) || 0;
          output += 'OVAL, ' + cx + ', ' + cy + ', ' + rx + ', ' + ry + ',\n';
          break;
    }
  }
  return output;
}

function ProcessSvg(svgNode, scaleX, scaleY, translateX, translateY, preserveFill) {
  var output = '';
  var canvasSize = svgNode.viewBox.baseVal.width;
  if (canvasSize == 0)
    canvasSize = svgNode.width.baseVal.value;
  if (canvasSize != 48)
    output += 'CANVAS_DIMENSIONS, ' + canvasSize + ',\n';

  output += HandleNode(svgNode, scaleX, scaleY, translateX, translateY, preserveFill);
  // Truncate final comma and newline.
  return output.slice(0, -2);
}
