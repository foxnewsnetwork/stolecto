import mapValues from '../utils/map-values';
import { SelfType, SchemaAPI } from '../declare/schema';
import { BasicModel } from './basic-model';
export interface BasicSchema {
  selfType: SelfType;
  childSchemas: KeyMap<BasicSchema>;
}

const DEFAULT_PARSE_RESPONSE = {
  [SelfType.Primitive](schema, command, primitive): BasicModel {
    return { schema, value: primitive };
  },
  [SelfType.Advanced](schema, command, childrenResponses) {
    const childSchemas = this.childSchemas(schema);
    const parseChild = (child, f) => this.parseResponse(child, command, childrenResponses[f]);

    return { schema, value: mapValues(childSchemas, parseChild) };
  }
};

function createSchema(childSchemas: KeyMap<BasicSchema>): BasicSchema {
  if (typeof childSchemas === 'undefined') {
    return { selfType: SelfType.Primitive, childSchemas: {} };
  } else {
    return { selfType: SelfType.Advanced, childSchemas };
  }
}

export class BasicSchemaAPI implements SchemaAPI<BasicSchema> {
  selfType(schema) { return schema.selfType; }
  childSchemas(schema) { return schema.childSchemas; }
  createSchema(schemas) { return createSchema(schemas); }
  parseResponse (schema, command, response) {
    const selfType = this.selfType(schema);
    return DEFAULT_PARSE_RESPONSE[selfType].call(this, schema, command, response);
  }
}
