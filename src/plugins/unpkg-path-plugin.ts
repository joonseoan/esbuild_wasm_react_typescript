// reference
// https://unpkg.com/tiny-test-pkg
// https://unpkg.com/medium-test-pkg
// https://unpkg.com/react

import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
 
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      // [Overall this one says please bundle index.js file.]

      // [ (1) Where can I find index.js file?]
      // try to figure out where index.js file is stored (where is path)? 
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        // args:
        /*
          importer: "index.js"
          namespace: "a"
          path: "tiny-test-pkg" (where this file is)
          resolveDir: """"
        */

        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        // mediup-test package and nested-test-package has the import ./utils and ./helpers
        // in order get them bundled together, we need to setup url with new URL
        if (args.path.includes('./') || args.path.includes('../')) {
          // 3) when we use nested-test-pkg
          return {
            namespace: 'a',
            path: new URL(args.path, 'https://unpkg.com' + args.resolveDir + '/').href
          }

          // 2) when we use medium-test-pkg with new URL() class
          // return {
          //   namespace: 'a',
          //   // args.path: ./utils
          //   // args.importer: https://unpkg.com/medium-test-pkg
          //   // we are going to take care of "href"
          //   // ===> // https//unpkg.com/medium-test-pkg/utils
          //   path: new URL(args.path, args.importer + '/').href
          // }
        }

        // 1) when we use tiny-test-pkg
        return {
          namespace: 'a',
          // we do not need to add '@1.0.0/index.js'
          path: `https://unpkg.com/${args.path}`,
        }
      });
      
      // [ (2) Lets load the modules from the web]
      // attempt load up the index.js file
      // loading the hijacked esbuild file system with this unpkg plugin
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // like the one same as above
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
  
            // es module and common.js module are working fine
            // with nested-test-pkg
            contents: `
              import React, { useState } from 'react';
              const ReactDOM = require('react-dom');
              console.log(React);
            `,

            // 2) calling medium-test-pkg
            // contents: `
            //   const message = require('medium-test-pkg');
            //   console.log(message);
            // `,


            // 1) calling tyny-test-pkg
            // contents: `
            //   const message = require('tiny-test-pkg');
            //   console.log(message);
            // `,
          };
        }
        // else {
        //   return {
        //     loader: 'jsx',
        //     contents: 'export default "hi there!"',
        //   };
        // }
        
        // or otherwise args.path !== index.js
        const { data, request } = await axios.get(args.path);

        return {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };
      });

      // [ (3) Analyze the file and bundle import and require]
      // read and parse the index.js file after all if there are any import/require/exports
      //  index.js file.

      // then find the files from index.js file 

      // finally load those files together with index.js
    },
  };
};
