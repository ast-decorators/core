import ASTDecoratorsError from '@ast-decorators/utils/lib/ASTDecoratorsError';
import {ClassMember, ClassMemberMethod} from '@ast-decorators/utils/lib/common';
import {NodePath} from '@babel/traverse';
import {
  arrowFunctionExpression,
  callExpression,
  Class,
  ClassMethod,
  ClassPrivateMethod,
  classPrivateProperty,
  classProperty,
  FunctionDeclaration,
  functionDeclaration,
  identifier,
  isClassMethod,
  isClassPrivateMethod,
  memberExpression,
  thisExpression,
} from '@babel/types';

export type TransformBindOptions = Readonly<{
  transformerPath?: string;
}>;

export const assert = (decorator: string, member: ClassMember): void => {
  if (!isClassMethod(member) && !isClassPrivateMethod(member)) {
    throw new ASTDecoratorsError(
      `Applying @${decorator} decorator to something other than method is not allowed`,
    );
  }
};

const applyBindingToClassPrivateMethods = (
  klass: NodePath<Class>,
  methodsToBind: ReadonlyArray<NodePath<ClassPrivateMethod>>,
): void => {
  const methodFunctions: FunctionDeclaration[] = [];
  for (const method of methodsToBind) {
    const {async, body, generator, key, params} = method.node;

    if (generator) {
      const functionId = klass.parentPath.scope.generateUidIdentifier(
        key.id.name,
      );

      methodFunctions.push(
        functionDeclaration(functionId, params, body, generator, async),
      );

      method.replaceWith(
        classPrivateProperty(
          key,
          callExpression(memberExpression(functionId, identifier('bind')), [
            thisExpression(),
          ]),
        ),
      );
    } else {
      method.replaceWith(
        classPrivateProperty(key, arrowFunctionExpression(params, body, async)),
      );
    }
  }

  klass.insertBefore(methodFunctions);
};

const applyBindingToClassMethods = (
  _: NodePath<Class>,
  methodsToBind: ReadonlyArray<NodePath<ClassMethod>>,
): void => {
  for (const method of methodsToBind) {
    const {computed, key, static: _static} = method.node;

    const bindingExpression = callExpression(
      memberExpression(
        memberExpression(thisExpression(), key),
        identifier('bind'),
      ),
      [thisExpression()],
    );

    method.insertBefore(
      classProperty(key, bindingExpression, null, null, computed, _static),
    );
  }
};

export const applyBinding = (
  klass: NodePath<Class>,
  methodsToBind: ReadonlyArray<NodePath<ClassMemberMethod>>,
): void => {
  const methods: Array<NodePath<ClassMethod>> = [];
  const privateMethods: Array<NodePath<ClassPrivateMethod>> = [];

  for (const method of methodsToBind) {
    if (isClassPrivateMethod(method)) {
      privateMethods.push(method as NodePath<ClassPrivateMethod>);
    } else {
      methods.push(method as NodePath<ClassMethod>);
    }
  }

  applyBindingToClassMethods(klass, methods);
  applyBindingToClassPrivateMethods(klass, privateMethods);
};
