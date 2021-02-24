import * as esbuild from 'esbuild-wasm';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

let service: esbuild.Service;

const esbuildResult =  async (rawCode: string) => {

  if (!service) {
    // [Important]
    // to get return type
    // 1) make a variable like const service = await esbuild.startService() ==> mouse over service and then get return type
    // 2) or otherwise, the function "startService" and get the Promise<> return type. particularly for await function.
    service = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });
  }

  // try catch to get invalid code compilation error from editor
  try {
    // steve
    const result = await service.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });

    // not like this
    // joon
    // return await service.build({
    //   entryPoints: ['index.js'],
    //   bundle: true,
    //   write: false,
    //   plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
    //   define: {
    //     'process.env.NODE_ENV': '"production"',
    //     global: 'window',
    //   },
    // });

    // [Important] just send the elaborate value to minimize the type defnintion.
    return { 
      code: result.outputFiles[0].text,
      err: '',
    }
  } catch (error) {
    return {
      code: '',
      err: error.message,
    }
  }
}

export default esbuildResult;
