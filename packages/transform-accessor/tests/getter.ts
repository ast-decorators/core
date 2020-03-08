import {compare as _compare} from '../../../utils/testing';
import options from './fixtures/options';

const compare = async (fixture: string, type: string): Promise<void> =>
  _compare(__dirname, fixture, type, options);

describe('@ast-decorators/transform-accessor', () => {
  describe('@getter', () => {
    it('compiles for decorator without interceptor', async () => {
      await compare('default', 'getter');
    });

    it('compiles for decorator with inline arrow function interceptor', async () => {
      await compare('inline-arrow', 'getter');
    });

    it('compiles for decorator with inline function interceptor', async () => {
      await compare('inline-function', 'getter');
    });

    it('compiles for decorator with interceptor declared somewhere else', async () => {
      await compare('var', 'getter');
    });
  });
});
