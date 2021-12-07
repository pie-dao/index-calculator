import { Theme } from '@nivo/core';
import { ColorSchemeId } from '@nivo/colors';

export const colorScheme: ColorSchemeId = 'purpleRed_green'

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
