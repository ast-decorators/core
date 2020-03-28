import {
  compare as _compare,
  transformFile as _transformFile,
} from '../../../utils/testing';
import {setter} from '../src';
import commonOptions from './fixtures/options';

const compare = async (
  fixture: string,
  options?: string | object,
): Promise<void> => _compare(__dirname, 'setter', fixture, options);

const transformFile = async (
  fixture: string,
  options?: string | object,
): ReturnType<typeof _transformFile> =>
  _transformFile(__dirname, 'setter', fixture, options);

describe('@ast-decorators/transform-accessor', () => {
  describe('@setter', () => {
    it('compiles without interceptor', async () => {
      await compare('default', commonOptions);
    });

    it('compiles for decorator on private property', async () => {
      await compare('private-property', commonOptions);
    });

    it('compiles for decorator on property with assignment', async () => {
      await compare('property-assigning', commonOptions);
    });

    it('compiles for decorator on computed property', async () => {
      await compare('computed-property', commonOptions);
    });

    it('compiles for decorator on static property', async () => {
      await compare('static-property', commonOptions);
    });

    it('uses class name instead of this for static property', async () => {
      await compare('static-property-class-name');
    });

    it('uses this for static property if class name is absent', async () => {
      await compare('static-property-no-class-name');
    });

    it('fails if applied to something else than property', async () => {
      await expect(
        transformFile('assert-property-type', commonOptions),
      ).rejects.toThrowError(
        'Applying @setter decorator to something other than property is not allowed',
      );
    });

    it('fails if interceptor is something else than function or identifier', async () => {
      await expect(
        transformFile('assert-interceptor-type', commonOptions),
      ).rejects.toThrowError(
        'Accessor interceptor can only be function, free variable or object property',
      );
    });

    it('fails if transformer is not plugged in', () => {
      // @ts-ignore
      expect(() => setter()()).toThrowError(
        "Decorator @setter won't work because @ast-decorators/transform-accessor/lib/transformer" +
          'is not plugged in. You have to add it to your Babel config',
      );
    });

    describe('context', () => {
      it('omitted for inline arrow function interceptor', async () => {
        await compare('context-inline-arrow', commonOptions);
      });

      it('added for inline regular function interceptor', async () => {
        await compare('context-inline-regular', commonOptions);
      });

      it('omitted for in-file arrow function interceptor', async () => {
        await compare('context-within-arrow', commonOptions);
      });

      it('added for in-file regular function interceptor (expression)', async () => {
        await compare('context-within-regular', commonOptions);
      });

      it('added for in-file regular function interceptor (declaration)', async () => {
        await compare('context-within-declaration', commonOptions);
      });

      it('added for imported interceptor by default', async () => {
        await compare('context-import-default', commonOptions);
      });

      it('omitted for imported interceptor if "disableByDefault" is set', async () => {
        await compare('context-import-disabled');
      });

      it('omitted for imported interceptor if it fits "exclude" options', async () => {
        await compare('context-import-ignored');
      });

      it('added for imported interceptor if it fits "exclude" options and "disableByDefault" is set', async () => {
        await compare('context-import-disabled-ignored');
      });

      it('fails if in-file interceptor is not a function', async () => {
        await expect(
          transformFile('context-error-not-function', commonOptions),
        ).rejects.toThrowError('set is not a function');
      });

      it('fails if interceptor is not defined', async () => {
        await expect(
          transformFile('context-error-not-defined', commonOptions),
        ).rejects.toThrowError('set is not defined');
      });
    });
  });
});
