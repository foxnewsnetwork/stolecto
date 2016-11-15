# Stolecto

Javascript-based declarative schema, model, and network layer. Build with ember, but agnostic in usage. Couples great for folks who use facebook's redux.

Software design and architecture stolen shamelessly from Elixir's Ecto

## Usage
Declare your schemas
```javascript
import { attr, hasMany, belongsTo } from 'stoleco/schema';

const DogSchema = {
  name: attr('string'),
  fleas: hasMany('flea'),
  yuppie: belongsTo('owner')
};

const OwnerSchema = {
  name: attr('string'),
  dob: attr('moment')
}
```

Write your adapters:
```javascript
import { buildURI, buildData, buildOpts } from 'stolecto/adapter';

const DogAdapter = {
  query(appState, queryset) { ... },
  mutate(appState, changeset) { ... }
}
```

Write your IO:
```javascript
const AjaxIO = {
  makeServerRequest: fn(uri, headers, body): {streamID: string, Promise};
  onServerResponse: fn(streamID: string, json): (localState) => (localState);
}
```

Write your transducers (aka transforms)
```javascript
const momentTransformer = {
  transform(obj) { return { result: obj.toISOString(), type: 'string'}; },
  untransform(string) { return { result: moment(string), type: 'moment' } ; }
}
```
transformers are coupled together and used to make serializers.

Use your multis (aka models)
```javascript
import multi from 'stolecto/multi';

const m = multi().query(DogSchema, params).
```

## Monads
`hasMany` and `belongsTo` are actually short-hand over `attrM('array')`; that is to say, attribute declaration account for monadic context

## Installation
Project file setup largely stolen from https://github.com/tildeio/glimmer
* `git clone <repository-url>` this repository
* `cd stolecto`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
