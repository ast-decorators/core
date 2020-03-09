import {
  ASTDecoratorPluginOptions,
  DecorableClass,
  DecorableClassMember,
} from '@ast-decorators/typings';
import {NodePath} from '@babel/core';
import {Decorator, isClassDeclaration, isClassExpression} from '@babel/types';
import processDecorator from './processor';
import {PluginPass} from './utils';

const processClassMemberDecorator = (
  decorator: NodePath<Decorator>,
  options: PluginPass<ASTDecoratorPluginOptions>,
): void => {
  const member = decorator.parentPath as NodePath<DecorableClassMember>;

  const klass = member.findParent(
    path => isClassDeclaration(path) || isClassExpression(path),
  ) as NodePath<DecorableClass>;

  processDecorator(decorator, [klass, member], options);
};

export default processClassMemberDecorator;
