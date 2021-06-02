let testData = {
'home': {
svg:
`
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 3L4 9v12h16V9l-8-6zm6 16h-3v-6H9v6H6v-9l6-4.5 6 4.5v9z"/></svg>
`,
expected:
`CANVAS_DIMENSIONS, 24,
MOVE_TO, 12, 3,
LINE_TO, 4, 9,
R_V_LINE_TO, 12,
R_H_LINE_TO, 16,
V_LINE_TO, 9,
R_LINE_TO, -8, -6,
CLOSE,
R_MOVE_TO, 6, 16,
R_H_LINE_TO, -3,
R_V_LINE_TO, -6,
H_LINE_TO, 9,
R_V_LINE_TO, 6,
H_LINE_TO, 6,
R_V_LINE_TO, -9,
R_LINE_TO, 6, -4.5f,
R_LINE_TO, 6, 4.5f,
R_V_LINE_TO, 9,
CLOSE`},

'color_home': {
svg:
`
<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="#ABC" d="M12 3L4 9v12h16V9l-8-6zm6 16h-3v-6H9v6H6v-9l6-4.5 6 4.5v9z"/></svg>
`,
expected:
`CANVAS_DIMENSIONS, 24,
PATH_COLOR_ARGB, 0xFF, 0xAA, 0xBB, 0xCC,
MOVE_TO, 12, 3,
LINE_TO, 4, 9,
R_V_LINE_TO, 12,
R_H_LINE_TO, 16,
V_LINE_TO, 9,
R_LINE_TO, -8, -6,
CLOSE,
R_MOVE_TO, 6, 16,
R_H_LINE_TO, -3,
R_V_LINE_TO, -6,
H_LINE_TO, 9,
R_V_LINE_TO, 6,
H_LINE_TO, 6,
R_V_LINE_TO, -9,
R_LINE_TO, 6, -4.5f,
R_LINE_TO, 6, 4.5f,
R_V_LINE_TO, 9,
CLOSE`},

'circles': {
svg:
`
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><circle cx="6" cy="6" r="3"/><circle cx="14" cy="6" r="3"/><circle cx="6" cy="14" r="3"/><circle cx="14" cy="14" r="3"/></svg>
`,
expected:
`CANVAS_DIMENSIONS, 20,
CIRCLE, 6, 6, 3,
NEW_PATH,
CIRCLE, 14, 6, 3,
NEW_PATH,
CIRCLE, 6, 14, 3,
NEW_PATH,
CIRCLE, 14, 14, 3`},

'squares': {
svg:
`
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect x="3" y="3" width="6" height="6"/><rect x="11" y="3" width="6" height="6"/><rect x="3" y="11" width="6" height="6"/><rect x="11" y="11" width="6" height="6"/></svg>
`,
expected:
`CANVAS_DIMENSIONS, 20,
ROUND_RECT, 3, 3, 6, 6, 0,
NEW_PATH,
ROUND_RECT, 11, 3, 6, 6, 0,
NEW_PATH,
ROUND_RECT, 3, 11, 6, 6, 0,
NEW_PATH,
ROUND_RECT, 11, 11, 6, 6, 0`},

'ovals': {
svg:
`
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><ellipse cx="6" cy="6" rx="3" ry="2"/><ellipse cx="14" cy="6" rx="2" ry="3"/><ellipse cx="6" cy="14" ry="2" rx="3"/><ellipse cx="14" cy="14" rx="2" ry="3"/></svg>
`,
expected:
`CANVAS_DIMENSIONS, 20,
OVAL, 6, 6, 3, 2,
NEW_PATH,
OVAL, 14, 6, 2, 3,
NEW_PATH,
OVAL, 6, 14, 3, 2,
NEW_PATH,
OVAL, 14, 14, 2, 3`},
};
