import { TemplateLiteralLogger } from 'utilities';

const debug = TemplateLiteralLogger.createLog({ 
  prefix: '🧐[Drag and drop - funtimes!!😍]:',
  enabled: true, 
  options: { 
    excludeOutputObject: false, 
    skipPrimitivesIncludedInMessage: false, 
    primitivesAllowedInTemplateString: ['function', 'bigint', 'number', 'string', 'boolean'] 
  } 
}, 'log');

debug`project all setup!!`
debug`testing!!!`
interface Draggable{
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget{
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus{
  Active,
  Finished
}

class Project{
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ){}
}

type Listener<T> = (projects: T[]) => void;

class State<T>{
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>){
    this.listeners.push(listener);
  }
}

class ProjectState extends State<Project>{
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor(){
    super();
  }

  static getInstance(){
    if(!this.instance){
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  addProject(title: string, description: string, people: number){
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    )
    this.projects.push(newProject);
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus){
    const project = this.projects.find((project) => project.id === projectId);
    if(project && project.status !== newStatus){
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    for(const listener of this.listeners){
      listener(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

interface Validatable{
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatable: Validatable){
  let isValid = true;
  if(validatable.required){
    isValid = isValid && validatable.value.toString().trim().length > 0;
  }
  if(validatable.minLength != null && typeof validatable.value === 'string'){
    isValid = isValid && validatable.value.length >= validatable.minLength;
  }
  if(validatable.maxLength != null && typeof validatable.value === 'string'){
    isValid = isValid && validatable.value.length < validatable.maxLength;
  }
  if(validatable.min != null && typeof validatable.value === 'number'){
    isValid = isValid && validatable.value > validatable.min;
  }
  if(validatable.max != null && typeof validatable.value === 'number'){
    isValid = isValid && validatable.value < validatable.max;
  }
  return isValid;
}

function autobind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor){
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get(){
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjDescriptor;
}

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  public templateElement: HTMLTemplateElement;
  public hostElement: T;
  public element: U;
  constructor(
    templateId: string, 
    hostId: string, 
    insertAtStart: boolean, 
    newElementId?: string
  ){
    this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId)! as T;
    const importedNode = document.importNode(this.templateElement.content, true);
    this.element = importedNode.firstElementChild as U;
    if(newElementId){
      this.element.id = newElementId;
    }
    this.attach(insertAtStart);
  }

  private attach(insertAtBeginning: boolean){
    this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
  }

  abstract configure?(): void;
  abstract renderContent(): void;
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  private project: Project;

  get persons(){
    if(this.project.people === 1){
      return '1 person';
    }else{
      return `${this.project.people} persons`;
    }
  }
  constructor(public hostId: string, project: Project){
    super('single-project', hostId, false, project.id);
    this.project = project;
    this.configure();
    this.renderContent();
  }

  @autobind
  configure(): void {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }

  @autobind
  dragStartHandler(event: DragEvent): void {
    debug`${event}`
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  dragEndHandler(event: DragEvent): void {
    debug`${event.dataTransfer?.getData('text/plain')}`
  }
}

class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
  public assignedProjects: Project[];
  constructor(private type: 'active' | 'finished'){
    super('project-list', 'app', false, `${type}-projects`);
    this.assignedProjects = [];
    
    this.configure();
    this.renderContent();
  }
  
  @autobind
  dragOverHandler(event: DragEvent): void {
    if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
      event.preventDefault();
      const listEl = this.element.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
  }

  @autobind
  dropHandler(event: DragEvent): void {
    debug`${event.dataTransfer?.getData('text/plain')}`
    const projectId = event.dataTransfer?.getData('text/plain')!;
    projectState.moveProject(projectId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
  }

  @autobind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.element.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  configure(): void {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);

    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project: Project) => {
        if(this.type === 'active'){
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent(){
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
  }

  private renderProjects(){
    const listId = `${this.type}-projects-list`;
    const list = document.getElementById(listId)! as HTMLUListElement;
    list.innerHTML = '';
    for(const project of this.assignedProjects){
      new ProjectItem(this.element.querySelector('ul')!.id, project);
    }
  }

}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLTextAreaElement;
  public peopleInputElement: HTMLInputElement;
  constructor(){
    super('project-input', 'app', false, 'user-input');

    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLTextAreaElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    
    this.configure();
  }
  
  configure(){
    this.element.addEventListener('submit', this.submitHandler);
  }

  renderContent(): void {}

  private gatherUserInput(): [string, string, number]|void {
    const title = this.titleInputElement.value;
    const description = this.descriptionInputElement.value;
    const people = this.peopleInputElement.value;
    
    const titleValidatable: Validatable = {
      value: title,
      required: true
    };
    const descriptionValidatable: Validatable = {
      value: description,
      required: true,
      minLength: 5
    };
    const peopleValidatable: Validatable = {
      value: people,
      required: true,
      min: 1,
      max: 10
    };
    
    if(!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)){
      alert('Invalid input, please try again!');
      return;
    }
    return [title, description, +people];
  }

  private clearInput(){
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event){
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if(!userInput){
      return;
    }
    if(Array.isArray(userInput)){
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      debug`submit handler called: ${{title, description, people}}`
      this.clearInput();
    }
  }

}

const projectInput = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
debug`${{projectInput, activeProjectList, finishedProjectList}}`
