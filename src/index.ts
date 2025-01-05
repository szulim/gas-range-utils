type CellValue = GoogleAppsScript.Spreadsheet.ValueType | string;

type RowPropertiesConstructor<T extends string[]> = {
  [K in T[number]]: CellValue;
};

interface SetValuesOptionsConstructor<T extends RowPropertiesConstructor<string[]>> {
  filterRows?: (row: T) => boolean;
  setValues: Partial<T>;
}
interface GetRowsRangesOptionsConstructor<T extends string[]> {
  filterRows?: (row: RowPropertiesConstructor<T>) => boolean;
  selectProperties?: T[number][];
}

function useRangeUtils<T extends string>(range: GoogleAppsScript.Spreadsheet.Range, columnNames: T[] = []) {
  let rowsAsObjects: RowsAsObjects = {} as RowsAsObjects;

  type RowProperties = RowPropertiesConstructor<typeof columnNames>;
  interface SetValuesOptions extends SetValuesOptionsConstructor<RowProperties> {}
  type GetRowsRangesOptions = GetRowsRangesOptionsConstructor<typeof columnNames>;

  interface RowsAsObjects {
    getRowsValues: () => RowProperties[];
    setRowsValues: (setValueOptions: SetValuesOptions) => RowProperties[];
    getRowsRanges: (getRowsRangesOptions: GetRowsRangesOptions) => GoogleAppsScript.Spreadsheet.RangeList;
    addRows?: any;
    removeRows?: any;
  }

  rowsAsObjects.getRowsValues = () => getRowsValues(range, columnNames);

  rowsAsObjects.setRowsValues = (setValueOptions: SetValuesOptions) =>
    setRowsValues(setValueOptions, rowsAsObjects.getRowsValues(), range);

  rowsAsObjects.getRowsRanges = (getRowsRangesOptions: GetRowsRangesOptions) =>
    getRowsRanges(getRowsRangesOptions, rowsAsObjects.getRowsValues(), range, columnNames);

  return rowsAsObjects;
}
