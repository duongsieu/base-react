/* ------ Form layout sử dụng trong application ------ */
// Row layout
export const rowLayout = {
  gutter: 15
};
// Column layout
export const colLayout = {
  // Layout full
  full: {
    md: 24,
    sm: 24,
    xs: 24
  },
  // Layout 1/2
  half: {
    md: 12,
    sm: 24,
    xs: 24
  },
  // Layout 1/2 sm 1/2
  halfsp: {
    md: 12,
    sm: 12,
    xs: 12
  },
  // Layout 1/4
  quarter: {
    md: 6,
    sm: 12,
    xs: 24
  },
  // Layout 1/2 sm full
  quarterSmFull: {
    md: 6,
    sm: 24,
    xs: 24
  },
  // Layout 3/4
  threeQuarter: {
    md: 18,
    sm: 24,
    xs: 24
  },
  // Layout 1/3
  partThree: {
    md: 8,
    sm: 12,
    xs: 24
  },
  // Layout 2/3
  twoThird: {
    md: 16,
    sm: 12,
    xs: 24
  },
  // Layout 1/6
  partSix: {
    md: 4,
    sm: 12,
    xs: 24
  },
  // Layout 5/6
  fiveSixth: {
    md: 20,
    sm: 12,
    xs: 24
  },
  // Layout 1/4 lg, 1/2 md, sm full
  quarterLgFull: {
    lg: 6,
    md: 12,
    sm: 24,
    xs: 24
  },
  // Layout 1/2 lg full
  halfLgFull: {
    lg: 12,
    md: 24,
    sm: 24,
    xs: 24
  }
};
// Form item props
export const formItemDefautProps = {
  // không có dấu 2 chấm
  noColon: {
    className: 'form-item',
    colon: false
  },
  // có dấu 2 chấm
  hasColon: {
    className: 'form-item',
    colon: true
  },
  // không có dấu 2 chấm và không có phần tử sau (thêm margin-bottom: 0)
  noColonNoBottom: {
    className: 'form-item mb0',
    colon: false
  },
  // có dấu 2 chấm và không có phần tử sau (thêm margin-bottom: 0)
  hasColonNoBottom: {
    className: 'form-item mb0',
    colon: true
  }
};
// Description column
export const descriptionColumn = {
  // Layout full
  full: {
    md: 1,
    sm: 1,
    xs: 1
  },
  // Layout 1/2
  half: {
    md: 2,
    sm: 1,
    xs: 1
  }
};
