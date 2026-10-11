/** Read CSV fields, including quoted commas, escaped quotes and CRLF. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  let afterQuote = false;
  if (text.length > 20_000_000) throw new Error("CSV exceeds the 20 MB parsing limit");
  const input = text.replace(/^\uFEFF/, "");

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (char === '"') {
      if (quoted && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (quoted) {
        quoted = false;
        afterQuote = true;
      } else if (field.length === 0 && !afterQuote) {
        quoted = true;
      } else {
        throw new Error("CSV quote in an unquoted field");
      }
    } else if (!quoted && (char === "," || char === "\n" || char === "\r")) {
      row.push(field);
      field = "";
      afterQuote = false;
      if (char !== ",") {
        if (row.some(value => value.trim() !== "")) rows.push(row);
        row = [];
        if (char === "\r" && input[i + 1] === "\n") i++;
      }
    } else {
      if (afterQuote) throw new Error("CSV content after closing quote");
      field += char;
    }
  }
  if (quoted) throw new Error("CSV contains an unterminated quoted field");
  row.push(field);
  if (row.some(value => value.trim() !== "")) rows.push(row);
  return rows;
}

export function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows.map(row => row.map(value => {
    // Neutralize text cells that spreadsheet applications may execute as formulas.
    // Numbers remain numeric (including negative values); source strings are untrusted.
    let field = String(value ?? "");
    if (typeof value === "string" && !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(field) && /^[\s\u0000-\u001f]*[=+@-]/.test(field)) field = "\'" + field;
    return /[",\r\n]/.test(field) ? `"${field.replace(/"/g, '""')}"` : field;
  }).join(",")).join("\r\n");
}
