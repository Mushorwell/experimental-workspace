import { flattenObjectWithArrays } from './flattenObject';

const ConsoleLogFunctions = [
  'debug',
  'info',
  'warn',
  'error',
  'table',
  'group',
  'groupCollapsed',
  'groupEnd',
  'time',
  'timeEnd',
  'timeLog',
  'count',
  'countReset',
  'timeStamp',
  'trace',
  'log',
  'assert',
] as const;

const AliasToMethodMap = {
  i: 'info',
  t: 'time',
  err: 'error',
  dbg: 'debug',
  tab: 'table',
} as const;

type ConsoleMethod = (typeof ConsoleLogFunctions)[number];
type Alias = keyof typeof AliasToMethodMap;
type LogLevel = ConsoleMethod | Alias;

const consoleMethods: Record<LogLevel, (...args: any[]) => void> =
  Object.fromEntries(
    ConsoleLogFunctions.map((method) => [
      method,
      console[method as keyof Console],
    ])
  ) as Record<LogLevel, (...args: any[]) => void>;

Object.entries(AliasToMethodMap).forEach(([alias, method]) => {
  consoleMethods[alias as Alias] = console[
    method as keyof Console
  ] as unknown as (...args: any[]) => void;
});

const baseLevelOrder = {
  assert: 1,
  debug: 0,
  info: 1,
  table: 1,
  time: 1,
  timeEnd: 1,
  timeLog: 1,
  count: 1,
  countReset: 1,
  timeStamp: 1,
  group: 1,
  groupCollapsed: 1,
  groupEnd: 1,
  warn: 2,
  trace: 2,
  error: 3,
  log: 1,
};

const levelOrder: Record<LogLevel, number> = { ...baseLevelOrder } as Record<
  LogLevel,
  number
>;

Object.entries(AliasToMethodMap).forEach(([alias, method]) => {
  levelOrder[alias as Alias] =
    baseLevelOrder[method as keyof typeof baseLevelOrder];
});

type LogType = 'client' | 'server';
type PrimitiveType =
  | 'bigint'
  | 'boolean'
  | 'number'
  | 'string'
  | 'function'
  | 'object'
  | 'symbol'
  | 'undefined'
  | 'nullish';

// interface GroupedOptions {
//   collapsed?: boolean;
//   customStructure?: Record<string, any[]>;
// }

interface AdditionalOptions {
  //TODO:  multiLine?: GroupedOptions; // if object is excluded then no grouping
  type?: LogType; // TODO: unify logging utility for both client and server
  style?: Record<string, string>;
  primitivesAllowedInTemplateString?: readonly PrimitiveType[];
  skipPrimitivesIncludedInMessage?: boolean;
  excludeOutputObject?: boolean;
  flattenOutputObject?: boolean;
  tableIndexPrefix?: string;
  tableIndexDelimeter?: string;
}

interface LoggerConfig {
  enabled?: boolean;
  prefix?: string;
  minLevel?: LogLevel;
  options?: AdditionalOptions;
}

const DEFAULT_PRIMITIVES_ALLOWED: PrimitiveType[] = [
  'bigint',
  'boolean',
  'number',
  'string',
];

const defaultConfig: LoggerConfig = {
  enabled: false,
  prefix: '',
  minLevel: 'debug',
  options: {
    type: 'client',
    primitivesAllowedInTemplateString: DEFAULT_PRIMITIVES_ALLOWED,
    style: {},
    tableIndexPrefix: '',
    tableIndexDelimeter: '.',
    flattenOutputObject: false,
  },
};

type INSPECT_KEYS = keyof typeof defaultConfig;

interface TabulatedOutputObjectOptions {
  tableIndexPrefix?: string;
  tableIndexDelimeter?: string;
}

type TTemplateLiteralLogger = {
  [K in LogLevel]: (message: TemplateStringsArray, ...args: any[]) => void;
};

export class TemplateLiteralLogger implements TTemplateLiteralLogger {
  private config: LoggerConfig;
  private allLevels: LogLevel[] = [
    ...ConsoleLogFunctions,
    ...(Object.keys(AliasToMethodMap) as Alias[]),
  ] satisfies LogLevel[];
  public debug!: (message: TemplateStringsArray, ...args: any[]) => void;
  public info!: (message: TemplateStringsArray, ...args: any[]) => void;
  public warn!: (message: TemplateStringsArray, ...args: any[]) => void;
  public error!: (message: TemplateStringsArray, ...args: any[]) => void;
  public table!: (message: TemplateStringsArray, ...args: any[]) => void;
  public group!: (message: TemplateStringsArray, ...args: any[]) => void;
  public groupCollapsed!: (
    message: TemplateStringsArray,
    ...args: any[]
  ) => void;
  public groupEnd!: (message: TemplateStringsArray, ...args: any[]) => void;
  public time!: (message: TemplateStringsArray, ...args: any[]) => void;
  public timeEnd!: (message: TemplateStringsArray, ...args: any[]) => void;
  public timeLog!: (message: TemplateStringsArray, ...args: any[]) => void;
  public count!: (message: TemplateStringsArray, ...args: any[]) => void;
  public countReset!: (message: TemplateStringsArray, ...args: any[]) => void;
  public timeStamp!: (message: TemplateStringsArray, ...args: any[]) => void;
  public trace!: (message: TemplateStringsArray, ...args: any[]) => void;
  public log!: (message: TemplateStringsArray, ...args: any[]) => void;
  public i!: (message: TemplateStringsArray, ...args: any[]) => void;
  public t!: (message: TemplateStringsArray, ...args: any[]) => void;
  public err!: (message: TemplateStringsArray, ...args: any[]) => void;
  public dbg!: (message: TemplateStringsArray, ...args: any[]) => void;
  public tab!: (message: TemplateStringsArray, ...args: any[]) => void;
  public assert!: (message: TemplateStringsArray, ...args: any[]) => void;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      ...defaultConfig,
      ...config,
      options: { ...defaultConfig.options, ...config.options },
    };

    this.allLevels.forEach((level) => {
      if (level in AliasToMethodMap) {
        this[level] = (message: TemplateStringsArray, ...args: any[]) => {
          this.setLogMethod(AliasToMethodMap[level as Alias], message, ...args);
        };
      } else {
        this[level] = (message: TemplateStringsArray, ...args: any[]) => {
          this.setLogMethod(level, message, ...args);
        };
      }
    });

    if (this.config?.options?.primitivesAllowedInTemplateString) {
      const uniqueTypes = Array.from(
        new Set(this.config?.options?.primitivesAllowedInTemplateString)
      );
      this.config.options.primitivesAllowedInTemplateString =
        uniqueTypes as readonly PrimitiveType[];
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    const minLevel = this.config.minLevel ?? 'warn';
    return levelOrder[level] >= levelOrder[minLevel];
  }

  private prefixMessage(prefix: string, message: string) {
    return prefix ? `${prefix} ${message}` : message;
  }

  private createLogOutputObject(
    args?: any[],
    templateAllowedPrimitives?: any[]
  ) {
    if (args?.length === 1) return args[0];
    return args?.reduce((acc, currentArg, index) => {
      const isNonNullNonArrayNonFunctionObj =
        currentArg !== null &&
        typeof currentArg === 'object' &&
        typeof currentArg !== 'function' &&
        !Array.isArray(currentArg);
      if (
        this.config.options?.skipPrimitivesIncludedInMessage &&
        templateAllowedPrimitives?.includes(currentArg)
      ) {
        return acc;
      }
      if (typeof currentArg === 'string') {
        return { ...acc, [currentArg]: currentArg };
      }
      if (isNonNullNonArrayNonFunctionObj) {
        return { ...acc, ...currentArg };
      }
      return { ...acc, [`arg${index}`]: currentArg };
    }, {});
  }

  private structureMessage(
    message: string,
    templateAllowedPrimitives: any[],
    options: TabulatedOutputObjectOptions = {
      tableIndexDelimeter: this.config.options?.tableIndexDelimeter,
      tableIndexPrefix: this.config.options?.tableIndexPrefix,
    },
    ...args: any[]
  ) {
    const messagePart = this.prefixMessage(
      this.config.prefix || '',
      message || ''
    );
    const resultObj = this.createLogOutputObject(
      args,
      templateAllowedPrimitives
    );
    let outputObj;
    if (this.config.options?.excludeOutputObject) {
      outputObj = undefined;
      return { messagePart, outputObj };
    }
    outputObj = {};
    if (this.config.options?.flattenOutputObject) {
      outputObj = flattenObjectWithArrays(resultObj, {
        prefix: options.tableIndexPrefix,
        delimiter: options.tableIndexDelimeter,
      });
    } else {
      outputObj = resultObj;
    }
    return { messagePart, outputObj };
  }

  private camelToKebab(camelCaseString: string) {
    return camelCaseString.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  private setLogMethod(
    level: LogLevel = 'log',
    message?: TemplateStringsArray,
    ...args: any[]
  ): void {
    if (!this.shouldLog(level)) return;

    const primitives: any[] = [];

    args.forEach((arg) => {
      const nullish =
        arg === null ||
        (Array.isArray(arg) && arg.length === 0) ||
        (typeof arg === 'object' && Object.keys(arg).length === 0)
          ? 'nullish'
          : undefined;
      const type = typeof arg;
      if (
        (nullish &&
          this.config?.options?.primitivesAllowedInTemplateString?.includes(
            nullish
          )) ||
        this.config.options?.primitivesAllowedInTemplateString?.includes(type)
      ) {
        primitives.push(arg);
      }
    });

    const formattedMessage = this.formatMessage(message, ...primitives);
    const tabulatedOutputObjectOptions = {
      tableIndexDelimeter: '.',
      tableIndexPrefix: '',
    };
    const { messagePart, outputObj } = this.structureMessage(
      formattedMessage,
      primitives,
      tabulatedOutputObjectOptions,
      ...args
    );
    let prefixedMessage = '';
    let styles = '';
    if (this.config?.options?.style) {
      prefixedMessage = '%c' + messagePart;
      styles = this.camelToKebab(
        JSON.stringify(this.config.options.style)
          .replace(/[{"}]/g, '')
          .replace(/[,]/g, ';')
      );
    }

    switch (level) {
      case 'table':
        consoleMethods[level](outputObj);
        break;
      case 'assert': {
        let assertion = args[0];
        if (typeof assertion !== 'boolean') {
          assertion = !!assertion;
        }
        if (!(typeof outputObj === 'object') || (outputObj && Object.keys(outputObj).length === 0)) {
          consoleMethods[level](assertion, prefixedMessage, styles);
          break;
        }
        consoleMethods[level](assertion, prefixedMessage, styles, outputObj);
        break;
      }
      case 'groupEnd':
        consoleMethods[level]();
        break;
      case 'time':
      case 'timeEnd':
      case 'timeStamp':
      case 'group':
      case 'groupCollapsed':
      case 'count':
      case 'countReset':
        consoleMethods[level](prefixedMessage);
        break;
      default:
        if (!(typeof outputObj === 'object') || (outputObj && Object.keys(outputObj).length === 0)) {
          consoleMethods[level](prefixedMessage, styles);
          break;
        }
        consoleMethods[level](prefixedMessage, styles, outputObj);
        break;
    }
  }

  private formatMessage(
    strings?: TemplateStringsArray,
    ...args: any[]
  ): string {
    if (!strings || strings.length === 0) {
      return args?.join('') || '';
    }
    if (!args || args.length === 0) {
      return strings.join('');
    }
    let result = '';
    const maxLength = Math.max(strings.length, args.length);

    for (let index = 0; index < maxLength; index++) {
      result += strings[index];
      if (index < args.length) result += String(args[index]);
    }
    return result;
  }

  defaultBehaviour(message: TemplateStringsArray, ...args: any[]): void {
    this.setLogMethod('log', message, ...args);
  }

  configure(config: Partial<LoggerConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      options: { ...this.config.options, ...config.options },
    };
  }

  inspectLoggerConfig(
    key?: INSPECT_KEYS
  ): LoggerConfig | LoggerConfig[INSPECT_KEYS] {
    return key ? this.config[key] : this.config;
  }

  public static isPropertyOfDebugLogger(
    prop: string | symbol
  ): prop is keyof TemplateLiteralLogger {
    return prop in TemplateLiteralLogger.prototype;
  }

  public static setDefault(obj: TemplateLiteralLogger): TemplateLiteralLogger {
    return new Proxy(obj, {
      get: function (
        target: TemplateLiteralLogger,
        prop: string | symbol,
        receiver: any
      ) {
        if (!TemplateLiteralLogger.isPropertyOfDebugLogger(prop))
          return target.inspectLoggerConfig();
        return Reflect.get(target, prop, receiver);
      },
    }) as TemplateLiteralLogger;
  }

  public static logger(prefix: string): TemplateLiteralLogger {
    return new TemplateLiteralLogger({ prefix });
  }

  public static createLog(config: LoggerConfig, type: LogLevel = 'log') {
    const logger = new TemplateLiteralLogger(config);
    return logger[type].bind(logger);
  }

  public static createLoggerHOF(config: LoggerConfig) {
    const logger = new TemplateLiteralLogger(config);
    return (type: LogLevel) => logger[type].bind(logger);
  }
}