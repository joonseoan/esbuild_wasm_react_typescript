import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localforage from 'localforage';

// using browser's local storage
const fileCache = localforage.createInstance({
  name: 'filecache',
});
 
export const fetchPlugin = (userInput: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: 'jsx',
          contents: userInput,
        };
      });
      
      // if build.onload function has a chache, it will stop here.
      build.onLoad({ filter: /.*/}, async (args: any) => {
        const fetchResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        if (fetchResult) {
          return fetchResult;
        }

        // if it does not have any RETURN RESULT?
        // It will go to the next onload.
      });

      build.onLoad({ filter: /.css$/ }, async(args: any) => {
        const { data, request } = await axios.get(args.path);
        // $: the end of string has ./css
        // for css file, delete white line,
        //  delet
        const escaped = data
          // delete space line
          .replace(/\n/g, '')
          // replace "" mark to escaped"
          .replace(/"/g, '\\"')
          // replace ' mark to escaped'
          .replace(/'/g, "\\'");

        const contents = `
            const style = document.createElement('style');
            style.innerText = '${escaped}';
            document.head.appendChild(style);
          `;

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const { data, request } = await axios.get(args.path);

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname,
        };

        await fileCache.setItem(args.path, result);
        return result;


        // [before refactoring to build a separate onload css]
        /** for bulma css testing, it must be commented out.!!! */
        // const fetchResult = await fileCache.getItem<esbuild.OnLoadResult>(args.path);

        // if (fetchResult) {
        //   return fetchResult;
        // }

        // const { data, request } = await axios.get(args.path);
        
        // $: the end of string has ./css

        // for the css, esbuild does not support css file
        //  we need to have have a trick esbuild 
        // in terms of args.path's file name, we need to put the content
        //  into "jsx" file. 
        // const fileType = args.path.match(/.css$/) ? 'css' : 'jsx';
        /*
          [ The way to insert style into result.contents]
          const style = document.createElement('style');
          style.innerText = 'body { background-color: "red" }';
          document.head.appendChild(style);
        */

        // for css file, delete white line,
        //  delet
        // const escaped = data
        //   // delete space line
        //   .replace(/\n/g, '')
        //   // replace "" mark to escaped"
        //   .replace(/"/g, '\\"')
        //   // replace ' mark to escaped'
        //   .replace(/'/g, "\\'");

        // const contents = fileType === 'css'
        //   ? `
        //       const style = document.createElement('style');
        //       style.innerText = '${escaped}';
        //       document.head.appendChild(style);
        //     `
        //   : data;

        // const result: esbuild.OnLoadResult = {
        //   loader: 'jsx',
        //   contents,
        //   resolveDir: new URL('./', request.responseURL).pathname,
        // };

        // await fileCache.setItem(args.path, result);
        // return result;
      });
    }
  }
};