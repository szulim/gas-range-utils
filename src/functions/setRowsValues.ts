function setRowsValues<T extends RowPropertiesConstructor<string[]>>(
  setValueOptions: SetValuesOptionsConstructor<T>,
  previousRowsValues: T[],
  range: GoogleAppsScript.Spreadsheet.Range
) {
  const { filterRows, setValues } = setValueOptions;
  const filteredUpdatedRowsValues = previousRowsValues.map((previousValue) => {
    if (filterRows !== undefined && !filterRows(previousValue)) return previousValue;
    let newRow = { ...previousValue };
    const updatedKeys = Object.entries(setValues);
    updatedKeys.forEach(([key, value]) => ((newRow as any)[key] = value));
    return newRow;
  });
  const gasSyntaxValues = filteredUpdatedRowsValues.map((row) => Object.values(row));
  range.setValues(gasSyntaxValues);
  return filteredUpdatedRowsValues;
}
