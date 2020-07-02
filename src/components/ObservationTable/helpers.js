// medical condition
export const condition = (resource) => {
  const code = resource.code;
  const coding = code ? code.coding : 'N/A';
  const display = Array.isArray(coding) && coding.length > 0 ? coding[0].display : 'N/A';
  return display ? display : 'N/A';
};

// helpers of effective date, issued date functions
const checkValidDate = (date) => {
  const d = new Date(date);
  return d.getTime() === d.getTime();
};

const returnDate = (date) => {
  return `${date.getMonth() + 1}-${date.getDay()}-${date.getFullYear()}`;
};

// issued date
export const getIssuedDate = (resource) => {
  let iDate = resource.issued;
  if (checkValidDate(iDate)) {
    iDate = new Date(iDate);
    return returnDate(iDate);
  }
  return 'N/A';
};

// the numerical value of the result obtained
export const getValue = (resource) => {
  const valQuantity = resource.valueQuantity;
  let val = valQuantity && valQuantity.value ? valQuantity.value : '';
  const unit = valQuantity && valQuantity.unit ? valQuantity.unit : '';
  val = val.toString();
  const temp = val.split('.');
  val = val.length > 4 && temp.length > 0 ? `${temp[0]}.${temp[1].slice(0, 2)}` : val;
  return val && unit ? `${val}  ${unit}` : 'N/A';
};

// the interpretation of the result obtained
export const getInterpretation = (resource) => {
  const interPretation = resource.interpretation;
  if (interPretation) {
    if (interPretation.length > 0) {
      const coding = interPretation[0].coding;
      if (coding) {
        let inference = coding.length > 0 ? coding[0].display : '';
        inference = inference[0].toUpperCase() + inference.slice(1);
        return inference;
      }
      return '';
    }
    return '';
  }
  return '';
};

// incase if component present in resource
export const getComponentVals = (resource) => {
  const compVals = [];

  if (resource.component && resource.component.length > 0) {
    resource.component.forEach((c) => {
      const v = getValue(c);
      const cn = condition(c);
      const i = getInterpretation(c);
      const val = [cn, v, i];
      compVals.push(val);
    });
  }
  return compVals;
};

// get loinc codes
// export const getLoinc = (resource: any) => {
//   const code = resource.code;
//   let coding = code ? code.coding : 'N/A';
//   coding = coding.length > 0 ? coding : 'N/A';
//   let lionc = 'N/A';
//   if (Array.isArray(coding)) {
//     coding.filter(c => {
//       return c.system && c.system.includes('loinc');
//     });
//   }
//   return (lionc = coding[0].code ? coding[0].code : 'N/A');
// };

export const schema = [
  {
    name: 'condition',
    displayName: 'Condition',
    width: 150,
    resizable: true
  },
  {
    name: 'value',
    displayName: 'Value',
    width: 150,
    resizable: true
  },
  {
    cellType: 'STATUS_HINT',
    name: 'interpretation',
    displayName: 'Interpretation',
    width: 150,
    resizable: true
  },
  {
    name: 'issued',
    displayName: 'Issued Date',
    width: 150,
    resizable: true
  }
];
