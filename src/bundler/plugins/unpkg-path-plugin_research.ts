// reference
// https://unpkg.com/tiny-test-pkg
// https://unpkg.com/medium-test-pkg
// https://unpkg.com/react

import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
// importing localforage
import localforage from 'localforage';

// simple key, value store.
const fileCache = localforage.createInstance({
  name: 'filecache',
});

// [Example of usage of localforage]
// (async () => {
//   await fileCache.setItem('color', 'red');
//   const color = await fileCache.getItem('color');
//   console.log('color: ', color)
//   // visit browser application -> indexedDB --> filecache ---> "keyvaluepair"
// })()
 
export const unpkgPathPlugin = (userInput: string) => {
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

      // TYPESCRIPT
      // Argument of type '(args:any) => Promise<unknown> error without return value definition'
      // in this case return value has a trouble.
      // click onLoad and then find the type of callback return in argument.
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            
            // 2) from userInput
            contents: userInput,

            // 1) how onload returns
            // both es module and common.js module are working fine
            // with nested-test-pkg
            // contents: `
            //   import React, { useState } from 'react';
            //   const ReactDOM = require('react-dom');
            //   console.log(React);
            // `,

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

        // [Implementing locallocalforage]
        // Check to see if we have already fetched this file
        // and if it is in the cache

        // args.path: because different package is returned in terms of args.path
        
        // <esbuild result>
        // interface OnLoadResult {
        //   pluginName?: string;
        
        //   errors?: PartialMessage[];
        //   warnings?: PartialMessage[];
        
        //   contents?: string | Uint8Array;
        //   resolveDir?: string;
        //   loader?: Loader;
        // }

        // TYPESCRIPT
        // getItems --> generic
        const fetchResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        // // if it is in the chche, it immediately render
        if (fetchResult) {
          // TYPESCRIPT
          // It does not know the return value
          return fetchResult;
        }

        const { data, request } = await axios.get(args.path);
        
        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        // store response into the IndexedDB
        await fileCache.setItem(args.path, result);
        // TYPESCRIPT
        // It does not know the type of return
        return result;

        // 1)
        // return {
        //   loader: 'jsx',
        //   contents: data,
        //   resolveDir: new URL('./', request.responseURL).pathname,
        // };
      });

      // [ (3) Analyze the file and bundle import and require]
      // read and parse the index.js file after all if there are any import/require/exports
      //  index.js file.

      // then find the files from index.js file 

      // finally load those files together with index.js
    },
  };
};
