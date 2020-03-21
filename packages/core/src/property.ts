import {
  DecorableClass,
  DecorableClassMember,
  PluginPass,
} from '@ast-decorators/typings';
import {NodePath} from '@babel/core';
import {Decorator, isClassDeclaration, isClassExpression} from '@babel/types';
import processDecorator from './processor';
import {TransformerMap} from './utils';

const processClassMemberDecorator = (
  decorator: NodePath<Decorator>,
  transformerMap: TransformerMap,
  options: PluginPass,
): void => {
  const member = decorator.parentPath as NodePath<DecorableClassMember>;

  const klass = member.findParent(
    path => isClassDeclaration(path) || isClassExpression(path),
  ) as NodePath<DecorableClass>;

  processDecorator(decorator, [klass, member], transformerMap, options);
};

export default processClassMemberDecorator;
