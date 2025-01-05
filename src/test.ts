function test() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getActiveSheet();
  const range = sheet.getRange('A2:C11');
  const demoRangeData = useRangeUtils(range, ['first name', 'type', 'paws']);
  console.log(demoRangeData.getRowsValues());
  // demoRangeData.setRowsValues({
  //   // filterRows: (row) => row.name === 'Maciuś',
  //   setValues: {
  //     name: 'Maciuś2',
  //   },
  // });
  demoRangeData
    .getRowsRanges({
      filterRows: (row) => row['first name'] === 'Maciuś2',
      selectProperties: ['type'],
    })
    .setBackground('red');

  // demoRangeData.setValues('name', 'Fido');
}
