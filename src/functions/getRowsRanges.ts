function getRowsRanges<T extends string>(
  getRowsRangesOptions: GetRowsRangesOptionsConstructor<string[]>,
  rowsValues: RowPropertiesConstructor<T[]>[],
  range: GoogleAppsScript.Spreadsheet.Range,
  columnNames: string[]
) {
  const { filterRows, selectProperties } = getRowsRangesOptions;

  const startingRowIndex = range.getRow();
  const startingColumnIndex = range.getColumn();

  //add row indexes to rowValues objects array
  const rowsValuesWithIndexes = rowsValues.map((row, index) => ({ ...row, _index: startingRowIndex + index }));

  //create numbered array of column indexes from selectProperties
  const selectPropertiesIndexes = selectProperties
    .map((prop) => startingColumnIndex + columnNames.indexOf(prop))
    .sort((a, b) => a - b);

  let filteredRows: typeof rowsValuesWithIndexes;

  if (filterRows !== undefined) {
    filteredRows = rowsValuesWithIndexes.filter(filterRows);
  }

  const filteredRowsIndexes = filteredRows.map((row) => row._index);

  const rowGroups = groupNeighbourNumbers(filteredRowsIndexes);
  const columnGroups = groupNeighbourNumbers(selectPropertiesIndexes);

  const rangesGroups = [];
  rowGroups.forEach((rowGroup) => {
    columnGroups.forEach((columnGroup) => {
      const rowStart = rowGroup.start;
      const rowEnd = rowGroup.end;
      const columnStart = columnGroup.start;
      const columnEnd = columnGroup.end;
      rangesGroups.push(`R${rowStart}C${columnStart}:R${rowEnd}C${columnEnd}`);
    });
  });
  //TODO: consider between getRangeList() and getRanges(), test for speed. getRanges() has more methods ready
  return range.getSheet().getRangeList(rangesGroups);
}
