import { TemplateLiteralLogger } from 'utilities';

const debug = TemplateLiteralLogger.createLog({ prefix: '🧐[Drag and drop - funtimes!!😍]:', enabled: true, options: { excludeOutputObject: false, skipPrimitivesIncludedInMessage: false, primitivesAllowedInTemplateString: ['function', 'bigint', 'number', 'string', 'boolean'] } }, 'log');

debug`project all setup!!`