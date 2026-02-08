export const required = (cellData: any) => {
  if (!cellData) {
    return { isValid: false, helperText: 'Câmp obligatoriu.' };
  }
};

export const anySpaces = (cellData: any) => {
  const regex = /\s/;

  if (regex.test(cellData)) {
    return { isValid: false, helperText: 'Nu sunt permise spații.' };
  }
};

export const onlySpaces = (cellData: any) => {
  const regex = /^\s*$/;

  if (regex.test(cellData)) {
    return { isValid: false, helperText: 'Câmpul nu poate conține doar spații.' };
  }
};

export const maxLength = (cellData: any, length: number) => {
  if (cellData.length > length) {
    return { isValid: false, helperText: `Lungimea maximă permisă este ${length} caractere.` };
  }
};

export const uppercase = (cellData: any) => {
  const uppercaseValue = String(cellData).toUpperCase();

  if (cellData !== uppercaseValue) {
    return { isValid: false, helperText: 'Textul trebuie scris cu litere mari (MAJUSCULE).' };
  }
};

export const firstLetterUppercase = (cellData: any) => {
  const regex = /^[A-Z]/;

  if (!regex.test(cellData)) {
    return { isValid: false, helperText: 'Prima literă trebuie să fie mare.' };
  }
};
