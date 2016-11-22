import mapValues from '../utils/map-values';
import { SelfType, SchemaAPI } from '../declare/schema';

export interface BasicSchema {
  selfType: SelfType,
  childSchemas: KeyMap<BasicSchema>
}

const DEFAULT_PARSE_RESPONSE = {
  [SelfType.Primitive](schema, command, primitive) {
    return primitive;
  },
  [SelfType.Advanced](schema, command, childrenResponses) {
    const childSchemas = this.childSchemas(schema);
    const parseChild = (child) => this.parseResponse(child, command, childrenResponses);

    return mapValues(childSchemas, parseChild);
  }
};

function createSchema(childSchemas: KeyMap<BasicSchema>): BasicSchema {
  return { selfType: SelfType.Primitive, childSchemas };
}

export class BasicSchemaAPI implements SchemaAPI<BasicSchema> {
  selfType({ selfType }) { return selfType; }
  childSchemas({ childSchemas }) { return childSchemas; }
  createSchema(schemas={}) { return createSchema(schemas); }
  parseResponse (schema, command, response) {
    const selfType = this.selfType(schema);
    return DEFAULT_PARSE_RESPONSE[selfType].call(this, schema, command, response);
  }
}
