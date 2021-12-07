import { Theme } from '@nivo/core';
import { ColorSchemeId } from '@nivo/colors';

export const colorScheme: ColorSchemeId = 'purpleRed_green'

export const colorSchemeIndex = [
  '#FF08DF',
  '#05B4FF',
  '#A305FF',
  '#FF07B5',
  '#FFC9EF',
  '#8B7986',
  '#5D0041',
  '#FF8308'
];

export const customTheme: Theme = {
  "textColor": "#fff",
  "fontSize": 11,
  "axis": {
    "domain": {
      "line": {
        "stroke": "#777777",
        "strokeWidth": 1
      }
    },
    "ticks": {
      "line": {
        "stroke": "#777777",
        "strokeWidth": 1
      }
    }
  },
  "grid": {
    "line": {
      "stroke": "#dddddd",
      "strokeWidth": 1
    }
  },
}
