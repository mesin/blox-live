export const normalizeCellsWidth = (columns) =>
  columns.map((column) => column.width);

export const stringifyCellsWidth = (columnsWidth) =>
  columnsWidth.toString().replace(/,/gi, ' ');
