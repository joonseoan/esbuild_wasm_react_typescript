// .d.ts files are declaration files that contain only type information. 
// These files don’t produce .js outputs like ts file.; 
// they are only used for typechecking. We’ll learn more about how to write our own declaration files later.

/*
  In the uncommon event that a library didn’t bundle its own types 
  and didn’t have a definition on DefinitelyTyped (DefinitelyTyped / @types), you can write a declaration file yourself.
  See the appendix [[Writing Declaration Files]] for a guide.

  If you want to silence warnings about a particular module without writing a declaration file, 
  you can also quick declare the module "as type any" by putting an empty declaration for it in a .d.ts file in your project.

  For example, if you wanted to use a module named some-untyped-module without having definitions for it, you would write:
  
  declare module "some-untyped-module";
*/
declare module 'monaco-jsx-highlighter';
