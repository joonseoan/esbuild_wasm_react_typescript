import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

const fileCache = localforage.createInstance({
  name: 'filecache',
});
 
export const fetchPlugin = (userInput: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: userInput,
          };
        }

        const fetchResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        if (fetchResult) {
          return fetchResult;
        }

        const { data, request } = await axios.get(args.path);
        
        // for the css, esbuild has a different loader, not from jsx
        // $: the end of string has ./css
        const loader = args.path.match(/.css$/) ? 'css' : 'jsx';
        const result: esbuild.OnLoadResult = {
          loader,
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;
      });
    }
  }
};