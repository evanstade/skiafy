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

  if (navigator.userAgent.indexOf("WebKit") < 0)
    $('use-webkit').hidden = false;
}

window.onload = init;
