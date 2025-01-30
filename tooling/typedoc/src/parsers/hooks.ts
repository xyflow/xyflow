import {
  FunctionParser,
  ParameterParser,
  ProjectParser,
  ReferenceTypeParser,
  TypeParameterParser,
  TypeParser,
} from 'typedoc-json-parser';
import { writeOutputJSON } from '../utils.js';

export async function parseHook(project: ProjectParser, item: FunctionParser) {
  const name = item.name;
  const source = item.source.url;

  if (item.signatures.length > 1) {
    console.warn(`Multiple signatures found for hook ${name}`);
    // TODO: Overload Signatures
  }

  const signature = item.signatures[0];

  const description = signature.comment.description;
  const examples = signature.comment.example;

  // Parsing the props
  const hookParameters = [];
  const typeParams = signature.typeParameters.reduce(parseTypeParameter, {});
  const params = signature.parameters.map((param) => parseParameter(param, typeParams));
  const returns = parseType(signature.returnType, typeParams);

  const output = {
    name,
    source,
    description,
    examples,
    typeParams,
    params,
    returns,
    // item,
  };
  await writeOutputJSON(`hooks/${item.name}.json`, output);
}

function parseReturnType(type: TypeParser) {}

function parseParameter(param: ParameterParser, typeParams: TypeParams) {
  const name = param.name;

  return { name };
}

type TypeParam = {
  name: string;
  def: {
    name: string;
    link?: string;
  };
};

type TypeParams = Record<string, TypeParam>;

function parseTypeParameter(types: TypeParams, typeParam: TypeParameterParser) {
  const name = typeParam.name;

  const def = typeParam.default ? parseType(typeParam.default) : undefined;

  types[name] = {
    name,
    def,
  };
  return types;
}

function parseType(type: TypeParser, typeParams?: TypeParams) {
  switch (type.kind) {
    case 'reference':
      return parseReference(type as ReferenceTypeParser, typeParams);
  }
}

function parseReference(type: ReferenceTypeParser, typeParams?: TypeParams) {
  if (typeParams && typeParams[type.name] && typeParams[type.name]) {
    return typeParams[type.name];
  } else {
    return {
      name: type.name,
      link: type.packageName,
    };
  }
}
