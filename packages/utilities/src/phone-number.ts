export function clean(phoneNumber: string) {
  if(phoneNumber.match(/[A-Za-z]+/g)){
    throw new Error('Letters not permitted');
  }
  if(phoneNumber.match(/[^\d\-_\(\)+\.\s]+/g)){
     throw new Error('Punctuations not permitted');
   }
    const numberLength = phoneNumber.length;
  let cleanedNumber: string = "";
  for (let i = 0; i < numberLength; i++){
    if(!!Number(phoneNumber[i])===false && phoneNumber[i]!=="0"){
        continue;
    }
    cleanedNumber = cleanedNumber + phoneNumber[i];
  }
  if(Number(cleanedNumber[0]) === 1){
      if(cleanedNumber.length === 10){
        throw new Error('Area code cannot start with one')
      }
      let updated = cleanedNumber.replace(/^1/, "");
      // console.log("This is the updated cleaned number: ", updated)
      cleanedNumber = updated;
      if(Number(cleanedNumber[0]) === 1){
        throw new Error('Area code cannot start with one')
      }
      if(updated.length < 10){
        throw new Error('Incorrect number of digits')
      }
      if(cleanedNumber.length > 11){
        throw new Error('More than 11 digits');
      }
    }
    if(Number(cleanedNumber[0]) === 0){
      throw new Error('Area code cannot start with zero')
    }
    if(cleanedNumber.length === 11 && Number(cleanedNumber[0]) !== 1){
      throw new Error('11 digits must start with 1')
    }
    if(cleanedNumber.length > 11){
      throw new Error('More than 11 digits');
    }
    if(Number(cleanedNumber[3]) === 1){
      throw new Error('Exchange code cannot start with one')
    }
    if(Number(cleanedNumber[3]) === 0){
      throw new Error('Exchange code cannot start with zero')
    }
  return cleanedNumber;
}
