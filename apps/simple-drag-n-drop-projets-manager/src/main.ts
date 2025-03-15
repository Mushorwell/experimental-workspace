// Validation
interface ValidationObj{
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}
function validate(validationInput: ValidationObj){
  let isValid = true;
  if (validationInput.required){
    isValid = isValid && validationInput.value.toString().trim().length !==0;
  }
  if (validationInput.minLength != null && typeof validationInput.value === 'string'){
    isValid = isValid && validationInput.value.length > validationInput.minLength;
  }
  if (validationInput.maxLength != null && typeof validationInput.value === 'string'){
    isValid = isValid && validationInput.value.length < validationInput.maxLength;
  }
  if (validationInput.min != null && typeof validationInput.value === 'number'){
    isValid = isValid && validationInput.value > validationInput.min;
  }
  if (validationInput.max != null && typeof validationInput.value === 'number'){
    isValid = isValid && validationInput.value < validationInput.max;
  }
  return isValid;
}
// Autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor){
  const method = descriptor.value;
  const _method: PropertyDescriptor = {
    configurable: true,
    get(){
      const boundFn = method.bind(this);
      return boundFn;
    }
  } 
  return _method;
}
// Object oriented approach
export class ProjectInput{
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLTextAreaElement;
  peopleInputElement: HTMLInputElement;
  constructor(){
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as HTMLFormElement;
    this.element.id = 'user-input';
    this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description')! as HTMLTextAreaElement;
    this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;
    this.configure();
    this.attach();
  }
  private attach(){
    this.hostElement.insertAdjacentElement('afterbegin', this.element)
  }
  private configure(){
    this.element.addEventListener('submit', this.submitHandler)
  }
  @autobind
  private submitHandler(event: Event){
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if(Array.isArray(userInput)){
      const [title, desc, people] = userInput;
      console.log(title, desc, people);
      this.clearInput();
    }
  }
  private gatherUserInput(): [string, string, number]|void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidationObj: ValidationObj = {
      value: enteredTitle,
      required: true,
    }
    const descriptionValidationObj: ValidationObj = {
      value: enteredDescription,
      required: true,
      minLength: 5,
      maxLength: 200,
    }
    const peopleValidationObj: ValidationObj = {
      value: enteredPeople,
      required: true,
      min: 0,
      max: 20,
    }

    if(!validate(titleValidationObj) || !validate(descriptionValidationObj) || !validate(peopleValidationObj)){
      alert('Invalid input, please try again!');
      return;
    }
    return [enteredTitle, enteredDescription, +enteredPeople]
  }
  private clearInput(){
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }
}

// const projInput = new ProjectInput();
