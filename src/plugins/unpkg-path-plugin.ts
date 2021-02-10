import * as esbuild from 'esbuild-wasm';
 
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // [Overall this one says please bundle index.js file.]

      // try to figure out where index.js file is stored (where is path)? 
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResole', args);
        return { path: args.path, namespace: 'a' };
      });
      
      // attempt load up the index.js file
      // loading the hijacked esbuild file system with this unpkg plugin
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log('onLoad', args);
 
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'tiny-test-pkg';
              console.log(message);
            `,
          };
        } 
        // else {
        //   return {
        //     loader: 'jsx',
        //     contents: 'export default "hi there!"',
        //   };
        // }
      });

      // read and parse the index.js file after all if there are any import/require/exports
      //  index.js file.

      // then find the files from index.js file 

      // finally load those files together with index.js
    },
  };
};
