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

testCases = [
  { name: 'home' },
  { name: 'color_home', preserveFill: true },
  { name: 'color_home', preserveFill: false, expected: 'home' },
  { name: 'implicit_lineto' },
  { name: 'implicit_r_lineto' },
]

function runTests() {
  var svgAnchor = $('svg-anchor');
  var testOutputTemplate = $('test-output-template');
  var testOutputAnchor = $('test-cases');
  for (var i = 0; i < testCases.length; i++) {
      var name = testCases[i].name;
      svgAnchor.innerHTML = testData[name].svg;

      var preserveFill = testCases[i].preserveFill || false;

      var output = ProcessSvg(svgAnchor.querySelector('svg'), 1, 1, 0, 0, preserveFill);

      var expected = testCases[i].expected || name;
      var expectedOutput = testData[expected]['expected'];

      outputNode = testOutputTemplate.cloneNode(true);
      outputNode.id = null;
      outputNode.hidden = false;
      var testNameSpan = outputNode.querySelector('.testName');
      testNameSpan.innerText = name + (preserveFill ? ' (preserveFill)' : '');
      if (expectedOutput !== output) {
          outputNode.classList.add('failedTest');
          outputNode.querySelector('.actualOutput').innerText = output;
          outputNode.querySelector('.expectedOutput').innerText = expectedOutput;
      }
      testOutputAnchor.appendChild(outputNode);
  }
}

window.onload = runTests;
