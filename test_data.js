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

'implicit_lineto': {
svg:
`
<svg xmlns="http://www.w3.org/2000/svg" width="16"><path d="M1,2 3,4"/></svg>
`,
expected:
`CANVAS_DIMENSIONS, 16,
MOVE_TO, 1, 2,
LINE_TO, 3, 4,
CLOSE`},

'implicit_r_lineto': {
svg:
`
<svg xmlns="http://www.w3.org/2000/svg" width="16"><path d="m1 2 4 3 1 1Z"/></svg>
`,
expected:
`CANVAS_DIMENSIONS, 16,
R_MOVE_TO, 1, 2,
R_LINE_TO, 4, 3,
R_LINE_TO, 1, 1,
CLOSE`},
};
