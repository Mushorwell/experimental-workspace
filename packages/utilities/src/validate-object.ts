export type ValidateOptions = {
  checkPropNames: string[];
};

export function validateType<T extends object>(
  val: T,
  options: ValidateOptions
): val is T {

  const validatePropertyInValue = <T extends object>(
    value: T,
    propertyName: string
  ): value is T => propertyName in value;

const validateValuePropertyType = <T extends object>(
  value: T,
  propertyName: string
): value is T => {
  const validateProperty = (obj: object) => {
    type TObjectWithProperty = {
      [propertyName: string]: unknown
    }
    const propertyValue = (obj as TObjectWithProperty)[propertyName];
    return Object.prototype.hasOwnProperty.call(obj, propertyName) &&
      (typeof propertyValue === 'object' ?
        (Array.isArray(propertyValue) ?
          propertyValue.length > 0 :
          !!propertyValue && Object.keys(propertyValue).length > 0) :
        !!propertyValue);
  };

  if (Array.isArray(value)) {
    return value.every(validateProperty);
  }
  return validateProperty(value);
};

  return options.checkPropNames.every((propName: string) => {
    if (Array.isArray(val)) {
      return validateValuePropertyType(val, propName);
    }
    if (typeof val === 'object') {
      return (
        validatePropertyInValue(val, propName) &&
        validateValuePropertyType(val, propName)
      );
    }
    return !!val;
  });
}
