type CellValue = GoogleAppsScript.Spreadsheet.ValueType | string;

type RowProperties<T extends string[]> = {
  [K in T[number]]: CellValue;
};

function useRangeUtils<T extends string>(range: GoogleAppsScript.Spreadsheet.Range, columnNames: T[] = []) {
  let rangeData: RangeData = {} as RangeData;
  // type RowProperties = Record<(typeof columnNames)[number], string | GoogleAppsScript.Spreadsheet.ValueType>;
  type RowProps = RowProperties<typeof columnNames>;
  type SetValuesOptions = {
    filterRows?: (row: RowProps) => boolean;
    setValues: Partial<RowProps>;
  };
  // rows-as-objects
  interface RangeData {
    getRowsValues: () => RowProps[];
    setRowsValues: (setValueOptions: SetValuesOptions) => string | object;
    getRowsRanges?: any;
    addRows?: any;
    removeRows?: any;
  }

  rangeData.getRowsValues = () => {
    const rows = range.getValues().map((row) => {
      let rowObject = {} as RowProps;
      row.map((cell, columnIndex) => {
        rowObject[columnNames[columnIndex] as keyof RowProps] = cell;
      });
      return rowObject;
    });
    return rows;
  };

  // TODO change to single arguments instead of array
  rangeData.setRowsValues = (setValueOptions: SetValuesOptions) => {
    const { filterRows, setValues } = setValueOptions;
    const previousRows = rangeData.getRowsValues();
    const updatedRows = previousRows.map((previousRow) => {
      if (filterRows !== undefined && !filterRows(previousRow)) return previousRow;
      let newRow = previousRow;
      const updatedKeys = Object.entries(setValues);
      updatedKeys.forEach(([key, value]) => (newRow[key] = value));
      return newRow;
    });
    const gasSyntaxValues = updatedRows.map((row) => Object.values(row));
    range.setValues(gasSyntaxValues);
    return updatedRows;
  };

  return rangeData;
}

function test() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const range = sheet.getRange('A2:C4');
  const demoRangeData = useRangeUtils(range, ['name', 'type', 'paws']);
  // console.log(demoRangeData.initial());

  demoRangeData.setRowsValues({
    filterRows: (row) => row.name === 'Maciś',
    setValues: {
      name: 'Maciuś',
    },
  });

  // demoRangeData.setValues('name', 'Fido');
}

// demoRangeData.setValues([
//   {
//     modifyColumn: 'name',
//     filterRows: (row) => row.name === 'Maciek',
//     newValue: 'Maciejos',
//   },
// ]);
