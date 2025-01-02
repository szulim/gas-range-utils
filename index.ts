type CellValue = GoogleAppsScript.Spreadsheet.ValueType | string;

type RowPropertiesConstructor<T extends string[]> = {
  [K in T[number]]: CellValue;
};

function useRangeUtils<T extends string>(range: GoogleAppsScript.Spreadsheet.Range, columnNames: T[] = []) {
  let rangeData: RangeData = {} as RangeData;
  // type RowProperties = Record<(typeof columnNames)[number], string | GoogleAppsScript.Spreadsheet.ValueType>;
  type RowProperties = RowPropertiesConstructor<typeof columnNames>;
  type SetValuesOptions = {
    filterRows?: (row: RowProperties) => boolean;
    setValues: Partial<RowProperties>;
  };
  // rows-as-objects
  interface RangeData {
    getRowsValues: () => RowProperties[];
    setRowsValues: (setValueOptions: SetValuesOptions) => string | object;
    getRowsRanges?: any;
    addRows?: any;
    removeRows?: any;
  }

  rangeData.getRowsValues = () => getRowsValues(range, columnNames);

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
  console.log(demoRangeData.getRowsValues());
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
