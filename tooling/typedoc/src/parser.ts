import { parseComponent } from './parsers/components.js';
import { parseHook } from './parsers/hooks.js';
import { parseType } from './parsers/types.js';
import { parseUtilFunction } from './parsers/utilsFunctions.js';
import { writeOutputJSON } from './utils.js';
import { EnumParser, FunctionParser, InterfaceParser, ProjectParser, TypeAliasParser } from 'typedoc-json-parser';

export class Parser {
  project: ProjectParser;
  data: {
    types: (InterfaceParser | EnumParser | TypeAliasParser)[];
    components: FunctionParser[];
    hooks: FunctionParser[];
    utils: FunctionParser[];
  };

  constructor(typedocJSON: ProjectParser.Json) {
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
    this.data.types.forEach((item) => parseType(this.project, item));
    this.data.components.forEach((item) => parseComponent(this.project, item));
    this.data.hooks.forEach((item) => parseHook(this.project, item));
    this.data.utils.forEach((item) => parseUtilFunction(this.project, item));
  }
}
