// these represent type families
export const options = [
    'text', 
    'number',
    'decimal',
    'date', 
    'boolean',
    'relation',
    'list', // need a subtype advanced
    'object' // need an object builder
];


export const graphQLptions = [
    'Int',
    'Float',
    'String',
    'Boolean',
    'ID',
    'Date', // will need built in scalar date
    'custom'
]

export const customGraphQLOptions = [
    'scalar',
    'interface',
    'enumeration',
    'union'
]

// More options will come eventually
export const databaseTypes = [
    'PostgreSQL',
    'DynamoDB',
    // may add redis or memecached
]

export const postgresDatabaseOptions = [
    'int8',
    'serial8',
    'bit', // need a length input
    'varbit', // length option needed
    'boolean',
    'box',
    'bytea',
    'char', // length option needed
    'varchar', // length option needed
    'cidr',
    'circle',
    'date',
    'float8',
    'inet',
    'int',
    'int4',
    'interval', // more options needed
    'json',
    'jsonb',
    'line',
    'lseg',
    'macaddr',
    'money',
    'decimal', // may need other options
    'path',
    'point',
    'polygon',
    'real',
    'smallint',
    'smallserial',
    'serial',
    'text',
    'time', // may need other options
    'timetz', // may need other options
    'timestamp', // may need other options
    'timestampz', // may need other options
    'tsquery',
    'tsvector',
    'txid_snapshot',
    'uuid',
    'xml'
]

export const dynamoDbDataType = [
    'Number',
    'String',
    'Binary',
    'Null',
    'List',
    'Map',
    'Set'
]

export const optionFamilySubtypes = {
    text: {}, 
    number: {},
    decimal: {},
    date: {}, 
    boolean: {},
    relation: {},
    list: {}, // need a subtype advanced
    object: {} // need an object builder
}