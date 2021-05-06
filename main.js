// Copyright 2019 The Skiafy Authors
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

function HexRgbForColorName(colorName) {
  switch (colorName.toLowerCase()) {
    case "aliceblue": return "#F0F8FF";
    case "antiquewhite": return "#FAEBD7";
    case "aqua": return "#00FFFF";
    case "aquamarine": return "#7FFFD4";
    case "azure": return "#F0FFFF";
    case "beige": return "#F5F5DC";
    case "bisque": return "#FFE4C4";
    case "black": return "#000000";
    case "blanchedalmond": return "#FFEBCD";
    case "blue": return "#0000FF";
    case "blueviolet": return "#8A2BE2";
    case "brown": return "#A52A2A";
    case "burlywood": return "#DEB887";
    case "cadetblue": return "#5F9EA0";
    case "chartreuse": return "#7FFF00";
    case "chocolate": return "#D2691E";
    case "coral": return "#FF7F50";
    case "cornflowerblue": return "#6495ED";
    case "cornsilk": return "#FFF8DC";
    case "crimson": return "#DC143C";
    case "cyan": return "#00FFFF";
    case "darkblue": return "#00008B";
    case "darkcyan": return "#008B8B";
    case "darkgoldenrod": return "#B8860B";
    case "darkgray": return "#A9A9A9";
    case "darkgreen": return "#006400";
    case "darkgrey": return "#A9A9A9";
    case "darkkhaki": return "#BDB76B";
    case "darkmagenta": return "#8B008B";
    case "darkolivegreen": return "#556B2F";
    case "darkorange": return "#FF8C00";
    case "darkorchid": return "#9932CC";
    case "darkred": return "#8B0000";
    case "darksalmon": return "#E9967A";
    case "darkseagreen": return "#8FBC8F";
    case "darkslateblue": return "#483D8B";
    case "darkslategray": return "#2F4F4F";
    case "darkslategrey": return "#2F4F4F";
    case "darkturquoise": return "#00CED1";
    case "darkviolet": return "#9400D3";
    case "deeppink": return "#FF1493";
    case "deepskyblue": return "#00BFFF";
    case "dimgray": return "#696969";
    case "dimgrey": return "#696969";
    case "dodgerblue": return "#1E90FF";
    case "firebrick": return "#B22222";
    case "floralwhite": return "#FFFAF0";
    case "forestgreen": return "#228B22";
    case "fuchsia": return "#FF00FF";
    case "gainsboro": return "#DCDCDC";
    case "ghostwhite": return "#F8F8FF";
    case "gold": return "#FFD700";
    case "goldenrod": return "#DAA520";
    case "gray": return "#808080";
    case "green": return "#008000";
    case "greenyellow": return "#ADFF2F";
    case "grey": return "#808080";
    case "honeydew": return "#F0FFF0";
    case "hotpink": return "#FF69B4";
    case "indianred": return "#CD5C5C";
    case "indigo": return "#4B0082";
    case "ivory": return "#FFFFF0";
    case "khaki": return "#F0E68C";
    case "lavender": return "#E6E6FA";
    case "lavenderblush": return "#FFF0F5";
    case "lawngreen": return "#7CFC00";
    case "lemonchiffon": return "#FFFACD";
    case "lightblue": return "#ADD8E6";
    case "lightcoral": return "#F08080";
    case "lightcyan": return "#E0FFFF";
    case "lightgoldenrodyellow": return "#FAFAD2";
    case "lightgray": return "#D3D3D3";
    case "lightgreen": return "#90EE90";
    case "lightgrey": return "#D3D3D3";
    case "lightpink": return "#FFB6C1";
    case "lightsalmon": return "#FFA07A";
    case "lightseagreen": return "#20B2AA";
    case "lightskyblue": return "#87CEFA";
    case "lightslategray": return "#778899";
    case "lightslategrey": return "#778899";
    case "lightsteelblue": return "#B0C4DE";
    case "lightyellow": return "#FFFFE0";
    case "lime": return "#00FF00";
    case "limegreen": return "#32CD32";
    case "linen": return "#FAF0E6";
    case "magenta": return "#FF00FF";
    case "maroon": return "#800000";
    case "mediumaquamarine": return "#66CDAA";
    case "mediumblue": return "#0000CD";
    case "mediumorchid": return "#BA55D3";
    case "mediumpurple": return "#9370DB";
    case "mediumseagreen": return "#3CB371";
    case "mediumslateblue": return "#7B68EE";
    case "mediumspringgreen": return "#00FA9A";
    case "mediumturquoise": return "#48D1CC";
    case "mediumvioletred": return "#C71585";
    case "midnightblue": return "#191970";
    case "mintcream": return "#F5FFFA";
    case "mistyrose": return "#FFE4E1";
    case "moccasin": return "#FFE4B5";
    case "navajowhite": return "#FFDEAD";
    case "navy": return "#000080";
    case "oldlace": return "#FDF5E6";
    case "olive": return "#808000";
    case "olivedrab": return "#6B8E23";
    case "orange": return "#FFA500";
    case "orangered": return "#FF4500";
    case "orchid": return "#DA70D6";
    case "palegoldenrod": return "#EEE8AA";
    case "palegreen": return "#98FB98";
    case "paleturquoise": return "#AFEEEE";
    case "palevioletred": return "#DB7093";
    case "papayawhip": return "#FFEFD5";
    case "peachpuff": return "#FFDAB9";
    case "peru": return "#CD853F";
    case "pink": return "#FFC0CB";
    case "plum": return "#DDA0DD";
    case "powderblue": return "#B0E0E6";
    case "purple": return "#800080";
    case "red": return "#FF0000";
    case "rosybrown": return "#BC8F8F";
    case "royalblue": return "#4169E1";
    case "saddlebrown": return "#8B4513";
    case "salmon": return "#FA8072";
    case "sandybrown": return "#F4A460";
    case "seagreen": return "#2E8B57";
    case "seashell": return "#FFF5EE";
    case "sienna": return "#A0522D";
    case "silver": return "#C0C0C0";
    case "skyblue": return "#87CEEB";
    case "slateblue": return "#6A5ACD";
    case "slategray": return "#708090";
    case "slategrey": return "#708090";
    case "snow": return "#FFFAFA";
    case "springgreen": return "#00FF7F";
    case "steelblue": return "#4682B4";
    case "tan": return "#D2B48C";
    case "teal": return "#008080";
    case "thistle": return "#D8BFD8";
    case "tomato": return "#FF6347";
    case "turquoise": return "#40E0D0";
    case "violet": return "#EE82EE";
    case "wheat": return "#F5DEB3";
    case "white": return "#FFFFFF";
    case "whitesmoke": return "#F5F5F5";
    case "yellow": return "#FFFF00";
    case "yellowgreen": return "#9ACD32";
  }
  return "";
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

    // Color keywords.
    const namedColor = HexRgbForColorName(fill);
    if (namedColor !== "")
      return ParseFillStringToPathColor(namedColor);
  }

  return '';
}

function HandleNode(svgNode, scaleX, scaleY, translateX, translateY, preserveFill) {
  var output = '';
  for (var idx = 0; idx < svgNode.children.length; ++idx) {
    if (idx !== 0)
        output += "NEW_PATH,\n";

    var svgElement = svgNode.children[idx];

    if (preserveFill)
      output += GetPathColorCommandFromFill(svgElement);

    switch (svgElement.tagName) {
      // g ---------------------------------------------------------------------
      case 'g':
        if (svgElement.getAttribute('transform'))
          throw new Error("<g> with a transform not handled");
        else
          output += HandleNode(svgElement, scaleX, scaleY, translateX, translateY, preserveFill);

        break;

      // PATH ------------------------------------------------------------------
      case 'path':
        // If fill is none, this is probably one of those worthless elements
        // of the form <path fill="none" d="M0 0h24v24H0z"/>, so we skip.
        if (svgElement.getAttribute('fill') == 'none')
          break;

        output += "NEW_PATH,\n";

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
            if (currentCommand.args.length == LengthForSvgDirective(svgDirective)) {
              commands.push({ 'command': svgDirective, 'args': [] });
              currentCommand = commands[commands.length - 1];
              svgDirective = currentCommand.command;
            }

            var pathNeedsPruning = true;
            if (svgDirective.toLowerCase() == 'a' &&
                currentCommand.args.length >= 3 &&
                currentCommand.args.length <= 4) {
              point = parseInt(path[0]);
              console.assert(point == 0 || point == 1, "Unexpected arc argument " << point);
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
        output += "NEW_PATH,\n";

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
        output += "NEW_PATH,\n";

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
          output += "NEW_PATH,\n";

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

function ConvertInput() {
  var translateX = parseFloat($('transform-x').value);
  var translateY = parseFloat($('transform-y').value);
  if (isNaN(translateX))
    translateX = 0;
  if (isNaN(translateY))
    translateY = 0;

  var scaleX = $('flip-x').checked ? -1 : 1;
  var scaleY = $('flip-y').checked ? -1 : 1;
  var preserveFill = $('preserve-fill').checked;

  var input = $('user-input').value;
  $('svg-anchor').innerHTML = input;
  var output = '';
  var svgNode = $('svg-anchor').querySelector('svg');

  try {
    output = ProcessSvg(svgNode, scaleX, scaleY, translateX, translateY, preserveFill);
  } catch (e) {
    $('output-span').textContent = e.name + ": " + e.message;
    return;
  }

  $('output-span').textContent = output;
}

function init() {
  $('go-button').addEventListener('click', ConvertInput);

  if (navigator.userAgent.indexOf("WebKit") >= 0)
    $('use-webkit').hidden = true;
}

window.onload = init;
