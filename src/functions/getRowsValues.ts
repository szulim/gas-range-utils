function getRowsValues<T extends string>(range: GoogleAppsScript.Spreadsheet.Range, columnNames: T[] = []) {
  type RowProps = RowPropertiesConstructor<typeof columnNames>;
  const rows = range.getValues().map((row) => {
    let rowObject = {} as RowProps;
    row.map((cell, columnIndex) => {
      rowObject[columnNames[columnIndex] as keyof RowProps] = cell;
    });
    return rowObject;
  });
  return rows;
}
