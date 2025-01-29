import { writeOutputJSON } from './utils.js';
import { ProjectParser } from 'typedoc-json-parser';

export class Parser {
  constructor(typedocJSON) {
    this.project = new ProjectParser({ data: typedocJSON, dependencies: {} });

    this.initData();
  }

  async initData() {
    this.data = {
      types: [...this.project.enums, ...this.project.interfaces, ...this.project.typeAliases],
      components: [],
      hooks: [],
      utils: [],
    };

    this.project.functions.forEach((func) => {
      if (func.name.startsWith('use')) {
        this.data.hooks.push(func);
      } else if (/^[A-Z]/.test(func.name)) {
        this.data.components.push(func);
      } else {
        this.data.utils.push(func);
      }
    });
  }

  start() {
    this.data.types.forEach((item) => this.parseType(item));
    this.data.components.forEach((item) => this.parseComponent(item));
    this.data.hooks.forEach((item) => this.parseHook(item));
    this.data.utils.forEach((item) => this.parseUtilFunction(item));
  }

  async parseType(item) {
    const { name, source, title, description, examples } = parseMetaInfo(item);
    const properties =
      item.type?.properties?.map((p) => ({
        ...p,
        typeString: p.type?.toString(),
      })) ?? null;

    const output = {
      name,
      source,
      title,
      description,
      examples,
      properties,
      type: item.type,
      typeString: item.type?.toString(),
    };

    await writeOutputJSON(`types/${name}.json`, output);
  }

  async parseComponent(item) {
    const { name, source, title, description, examples } = parseMetaInfo(item);
    const signature = item.signatures[0];
    const parameters = signature.parameters.map((param) => {
      let properties = param.type.properties;

      if (param.type.kind === 'reference') {
        properties = this.project.find(param.type.id)?.type?.properties;
      }

      const propertiesClean = properties?.map?.((p) => {
        const { blockTags } = p.comment;
        const description = blockTags?.find((c) => c.name === 'description')?.text;
        const example = blockTags?.find((c) => c.name === 'example')?.text;
        const defaultValue = blockTags?.find((c) => c.name === 'default')?.text;

        delete p.comment;

        return {
          ...p,
          description,
          example,
          defaultValue,
          typeString: p.type.toString(),
        };
      });

      return {
        name: param.name,
        typeString: param.type.toString(),
        kind: param.type.kind,
        properties: propertiesClean,
      };
    });

    const output = {
      name,
      source,
      title,
      description,
      examples,
      parameters,
    };

    await writeOutputJSON(`components/${name}.json`, output);
  }

  async parseHook(item) {
    await writeOutputJSON(`hooks/${item.name}.json`, item);
  }

  async parseUtilFunction(item) {
    await writeOutputJSON(`utils/${item.name}.json`, item);
  }
}

export function parseMetaInfo(item) {
  const name = item.name;
  const description = item.comment.description;
  const source = item.source.url;
  const title = item.comment.blockTags.find((c) => c.name === 'title')?.text;
  const examples = item.comment.example;

  return {
    name,
    source,
    title,
    description,
    examples,
  };
}
