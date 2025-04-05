/**
 * Script to help fix unused variables in the codebase
 *
 * Usage:
 * 1. Run: node scripts/fix-unused.js
 * 2. It will print instructions on how to fix the most common issues
 */

console.log(`
=================================================
FIXING UNUSED VARIABLES IN THE CODEBASE
=================================================

Common patterns to use:

1. For unused imports:
   - Remove them if not needed
   - Or prefix with _ if they might be needed later

2. For unused variables:
   - Prefix with underscore (_) to mark as intentionally unused
   - Example: 'const value' → 'const _value'

3. For unused function parameters:
   - Prefix with underscore (_) to mark as intentionally unused
   - Example: 'function test(param)' → 'function test(_param)'

4. For console.log statements:
   - Remove if they're not needed for debugging
   - Or keep them if they provide valuable debugging info

=================================================
RUN THE LINTING COMMAND:
=================================================

npm run lint:fix

This will automatically format your code and fix many linting issues.
For remaining warnings, manually apply the patterns above.

=================================================
`);
