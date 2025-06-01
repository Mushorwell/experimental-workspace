# Template Literal Logger

The `templateLiteralLogger.ts` utility provides a mechanism to create log messages using template literals. It allows for flexible and readable logging, enabling developers to include variable data within their log messages in a clean and concise manner.

Offering flexibility in how the logs can be structured, the logger aims to make logs convenient for developers, both in how the logs are made and in the general maintenance of the code. The logger can be enabled and disabled entirely or configured to only log at certain levels and it can also be reconfigured on the fly for convenience. 

## Key Functionality

- **Template Literals**: Utilize JavaScript's template literals to embed expressions and variables directly within log messages.
- **High Order Function**: Provides a higher-order function to create customizable loggers with specific prefixes or formatting.
- **Log Levels**: Supports various log levels such as `info`, `warn`, and `error` to categorize and filter log outputs.
- **Environment Awareness**: Can be configured to disable logging in production environments to minimize performance overhead.
- **Customisability**: Can be customised using a CSSProperties-like structured object to change the color, background or even font weight.

## Quick Setup Example

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

// Create a default logger using default configurations with a prefix
const logger = TemplateLiteralLogger.logger('🔍[Hello World!!😍]::');

const userName = 'Alice';
const userId = 123;

// Log a message
logger.log`User ${userName} with ID ${userId} has logged in.`

// Log an informational message
logger.info`User ${userName} with ID ${userId} has logged in.`;

// Log a warning message
logger.warn`User ${userName} has attempted an invalid operation.`;

// Log an error message
logger.error`Failed to retrieve data for user ID: ${userId}.`;
```
By default, the logger will output the variables inline with the text and also log an output object containing all the variables used inside the template literal.

If the output is an object, it is not logged in-line by default but will be output at the end as an object. This behaviour can also be configured.

## Getting started

The logger can be configured to suit different log levels and can be enabled or disabled for specific environments. By default, it logs to the console, but there are future plans to add more server side functionalities.

There are multiple ways to instantiate the logger for use. It is object oriented therefore the normal way would be to set it up as a new object instance of the TemplateLiteralLogger. However, there are also shortcut static methods for a quick setup. These are detailed below. 

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

// different ways to setup your logger
// 1. static method - (simplest)

const tll = TemplateLiteralLogger.createLog({}, 'warn') // second parameter is optional, instantialises a logger with console.log method by default.
tll`Logger setup`

// 2. static high-order function method
const tll2 = TemplateLiteralLogger.createLoggerHOF({});
tll2('info')`Logger setup`

// 3. static logger method
const tll3 = TemplateLiteralLogger.logger({});
tll3.warn`Logger setup`

// 4. object instance approach
const tll4 = new TemplateLiteralLogger({});
tll4.log`Logger setup`;

```

By default, the logger will output the variables inline with the text and also log an output object containing all the variables used inside the template literal.

If the output is an object, it is not logged in-line by default but will be output at the end as an object. This behaviour can also be configured.

The logger can be configured to suit different log levels and can be enabled or disabled for specific environments. By default, it logs to the console, but there are future plans to add more server side options.

## Configuration Options

| Option                                      | Type                                      | Default Value                              | Description                                                                                           |
|---------------------------------------------|-------------------------------------------|--------------------------------------------|-------------------------------------------------------------------------------------------------------|
| [`enabled`](#enabled "Go to definition")                                   | `boolean`                                 | `true`                                     | Whether the logger is enabled or not.                                                                 |
| [`prefix`](#prefix "Go to definition")                                    | `string`                                  | `'🔍[Template Literal Logger]:'`           | A prefix to add to the beginning of each log message.                                                 |
| [`minLevel`](#minlevel "Go to definition")                                 | `LogLevel`                                | `'debug'`                                  | The minimum log level that will be logged.                                                            |
| [`options.type`](#type "Go to definition")                              | `'client' \| 'server'`                    | `'client'`                                 | The type of logger to use. Can be either 'client' or 'server'.                                        |
| [`options.style`](#style "Go to definition")                             | `Record<string, string>`                  | `{}`                                       | A record of CSS styles to apply to the log messages.                                                  |
| [`options.primitivesAllowedInTemplateString`](#primitivesallowedintemplatestring "Go to definition") | `readonly PrimitiveType[]`                | `['bigint', 'boolean', 'number', 'string']`| The primitives that are allowed to be used in template strings.                                       |
| [`options.skipPrimitivesIncludedInMessage`](#skipprimitivesincludedinmessage "Go to definition")   | `boolean`                                 | `false`                                    | Whether to skip primitives included in the message when logging.                                      |
| [`options.excludeOutputObject`](#excludeoutputobject "Go to definition")               | `boolean`                                 | `false`                                    | Whether to exclude the output object from the log message.                                            |
| [`options.flattenOutputObject`](#flattenoutputobject "Go to definition")               | `boolean`                                 | `false`                                    | Whether to flatten the output object.                                                                 |
| [`options.flattenedOutputObjectIndexPrefix`](#flattenedoutputobjectindexprefix "Go to definition")  | `string`                                  | `''`                                       | The prefix to use for flattened output object indices.                                                |
| [`options.flattenedOutputObjectIndexDelimeter`](#flattenedoutputobjectindexdelimeter "Go to definition")| `string`                                  | `'.'`                                      | The delimiter to use for flattened output object indices.                                             |

Below are more detailed explanations of the different configuration properties. 

### Enabled

This configures the logger to be active or inactive within the codebase, if set to `false` the logger will not do anything when called. This will be useful for configuring the logger for specific environments. 

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger({enabled: false})

tll.log`Hello there` // No log will be made

```

### Prefix

This sets a prefix to every log that the logger makes to make the logs have a consistent structure.

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger({prefix: "[Hello World 👋]:"})

tll.log`Hi there...` // Will log with prefix like this - "[Hello World 👋]: Hi there..."

```

### MinLevel

This sets a allows the logger to be partially disabled for certain log levels. To configure this, you specify the lowest log level for the logger to operate.
```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger({minLevel: "error"})

tll.log`Hi there...` // Will not log anything
tll.error`Hi there...` // Will log

```

The levels are currently setup as follows - this can change in future iterations:

| Method | Value | Description
|--------|-------|-------|
| assert | 1 | normal level logs |
| debug | 0 | lowest level - disabled by default in some browsers |
| info | 1 |  normal level logs |
| table | 1 | normal level logs |
| time | 1 | normal level logs |
| timeEnd | 1 | normal level logs |
| timeLog | 1 | normal level logs |
| count | 1 | normal level logs |
| countReset | 1 | normal level logs |
| timeStamp | 1 | normal level logs |
| group | 1 | normal level logs |
| groupCollapsed | 1 | normal level logs |
| groupEnd | 1 | normal level logs |
| warn | 2 | higher importance level - used mainly for warnings |
| trace | 2 | higher importance level - used mainly for warnings |
| error | 3 | highest importance - for communicating errors |
| log | 1 | normal level logs |

### Options

Below are the available additional configuration options in more detail. Note that these are completely optional and have default presets. See the [default configurations](#default-configuration "Go to section") for more detail.

#### Type

This configures the behaviour of the logger specifically to be `client` or `server`, currently, this has no effect on the behaviour of the logger.

#### Style

This option configuration accepts an object structured in a similar way to a `style` object in react, basically passing a key/value pair with the same css properties. i.e. color, backgroundColor, fontWeight...

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger(
  {
    options: {
      style: {
         color: 'red',
         backgroundColor: 'green'
      }
    }
  }
);

tll.log`Hi there...` // log will be styled with red text and a green background color

```

#### PrimitivesAllowedInTemplateString

This configuration option controls the type of data that can be displayed inline in a log message. The different options available can be viewed in the [`Types`](#types 'Go to definitions') section for the `PrimitiveType`. Note that there is a default preset, that will be overwritten here. The different types are passed as an array. 

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger(
  {
    options: {
      primitivesAllowedInTemplateString: ['string', 'boolean']
    }
  }
);

const word = 'something';
const isAllowed = true;
const data = {foo: 'bar'}

tll.log`Allowed values inline: ${word}, ${isAllowed}; values not allowed ${data} ` 
// "word" and "isAllowed" will be logged inline in the string and data will only appear in the
// output object at the end (if it is enabled)

```

#### SkipPrimitivesIncludedInMessage

This configuration option disables values that were logged inline from being also presented in the output object at the end of the log.

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger(
  {
    options: {
      skipPrimitivesIncludedInMessage: true
    }
  }
);

const word = 'something';
const isAllowed = true;
const data = {foo: 'bar'}

tll.log`Allowed values inline: ${word}, ${isAllowed}; values not allowed ${data} `
// values "word" and "isAllowed" will not be presented in the output object but "data" will 

```

#### ExcludeOutputObject

This configuration option toggles the output object in the log.

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger(
  {
    options: {
      excludeOutputObject: true
    }
  }
);

const word = 'something';
const isAllowed = true;
const data = {foo: 'bar'}

tll.log`Allowed values inline: ${word}, ${isAllowed}; values not allowed ${data} `
// This log will only display the in-line values and the output object at the end will not be presented

```

#### FlattenOutputObject

This configuration option toggles how the output object will be structured especially for complex nested objects. It will also depend on what is set for [`flattenedOutputObjectIndexPrefix`](#flattenedoutputobjectindexprefix "Go to definition"), and [`flattenedOutputObjectIndexDelimeter`](#flattenedoutputobjectindexdelimeter "Go to definition") which have their own defaults as well. 

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger(
  {
    options: {
      flattenOutputObject: true
    }
  }
);

const data = {
  foo: {
    bar: {
      baz: "yolo"
    }
  }
}

tll.log`displaying ${data} `
// This log will display the output object in a flattened format which looks like this
/***** 
    displaying    
    {
      data.foo.bar.baz: 'yolo'
    }

******/

```

#### FlattenedOutputObjectIndexDelimeter

This sets a prefix to the output object when in flattened mode for nested objects.

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger(
  {
    options: {
      flattenedoutputobjectindexdelimeter: '/'
    }
  }
);

const data = {
  foo: {
    bar: {
      baz: "yolo"
    }
  }
}

tll.log`displaying ${data} `
// This log will display the output object in a flattened format which looks like this
/***** 
    displaying    
    {
      data/foo/bar/baz: 'yolo'
    }

******/

```

#### FlattenedOutputObjectIndexPrefix

This sets a delimeter to the output object when in flattened mode for nested objects.

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger(
  {
    options: {
      flattenedoutputobjectindexprefix: '@'
    }
  }
);

const data = {
  foo: {
    bar: {
      baz: "yolo"
    }
  }
}

tll.log`displaying ${data} `
// This log will display the output object in a flattened format which looks like this
/***** 
    displaying    
    {
      @data.foo.bar.baz: 'yolo'
    }

******/

```

### Default Configuration
These are the default configurations for the logger. Any of these properties can be configured either when instantiating the `TemplateLiteralLogger` class or through using the `configure` helper method. More on that on [this](#configure "Go to section") section. 

```typescript

const DEFAULT_PRIMITIVES_ALLOWED: PrimitiveType[] = [
  'bigint',
  'boolean',
  'number',
  'string',
];

const defaultConfig: LoggerConfig = {
  enabled: true, // logger is active by default
  prefix: '🔍[Template Literal Logger]:', // default prefix for logger
  minLevel: 'debug', // lowest level for logger to start logging
  options: {
    type: 'client', // type of logger - no effect on logger at the moment
    primitivesAllowedInTemplateString: DEFAULT_PRIMITIVES_ALLOWED, // values that can be concatenated 
    style: {}, // default styling for logged text - only works in browser console
    flattenedOutputObjectIndexPrefix: '', // no index prefix for flattened output object by default
    flattenedOutputObjectIndexDelimeter: '.', // default delimeter for flattened output object
    flattenOutputObject: false, // default output object configuration
    skipPrimitivesIncludedInMessage: false, // by default values logged in line are also presented in the output object
    excludeOutputObject: false, // by default the output object is displayed 
  },
};

```

### Types

- **LogLevel**: `'debug' \| 'info' \| 'warn' \| 'error' \| 'table' \| 'group' \| 'groupCollapsed' \| 'groupEnd' \| 'time' \| 'timeEnd' \| 'timeLog' \| 'count' \| 'countReset' \| 'timeStamp' \| 'trace' \| 'log' \| 'assert' \| 'i' \| 't' \| 'err' \| 'dbg' \| 'tab'`
- **PrimitiveType**: `'bigint' \| 'boolean' \| 'number' \| 'string' \| 'function' \| 'object' \| 'symbol' \| 'undefined' \| 'nullish'`

## Helper Functions

### Configure

The configure function gives the flexibility to update an instantialised logger's configurations to change its behaviour. The function will accept any of the configuration properties in an object.

```typescript
import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger({});
tll.log`Default configuration setup`;

... other code ...

tll.configure({prefix: `[New Prefix]:`}); // updates the prefix of the logger instance

```

### Inspect logger config

Obtains the current configuration object for the logger instance

```typescript

import { TemplateLiteralLogger } from '@4-sure/utilities';

const tll = new TemplateLiteralLogger({});
tll.log`Default configuration setup`;

const currentConfig = tll.inspectLoggerConfig();
tll.log`${currentConfig}`

```

## Conclusion

The `templateLiteralLogger.ts` utility enhances logging capabilities by leveraging the power of template literals, making it easier to produce clear and informative log messages. It is especially useful in large applications where maintaining log clarity and consistency is crucial.

## Future plans

There are some upcoming features down the roadmap including adding more server-side features so that the logger will have the functionality of also writing to files, streaming data etc.



