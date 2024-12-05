/* istanbul ignore next */
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'local') {
  const dotenv = require('dotenv');
  process.env.HTTP_PROXY = '';
  process.env.HTTPS_PROXY = '';
  dotenv.load();
}
import axios from 'axios';
import { Logger } from 'trace-logger';

const logger = new Logger('ConfigSettings.ts');
enum EnvVariables {
  AXIOS_DEFAULT_TIMEOUT = 'AXIOS_DEFAULT_TIMEOUT',
  CONNECTION_TIMEOUT = 'CONNECTION_TIMEOUT',
  CONNECTION_STRING = 'CONNECTION_STRING'
}

class ConfigSettings {
  /* istanbul ignore next */
  public static getConfig(name: EnvVariables): string {
    if (!ConfigSettings.configLoaded) {
      ConfigSettings.loadConfigs();
    }
    const result = ConfigSettings.configMap.get(name);
    if (!result) {
      throw(
        `Env variable ${name} is missing from the ConfigMap`
      );
    }
    return result;
  }

  /* istanbul ignore next */
  public static loadConfigs(): void {
    ConfigSettings.configLoaded = true;
    for (const item in EnvVariables) {
      if (EnvVariables.hasOwnProperty(item)) {
        ConfigSettings.configMap.set(item, ConfigSettings.getEnvVariable(item));
      }
    }
  }



  /* istanbul ignore next */
  public static configAxios(): void {
    axios.defaults.timeout = parseInt(
      this.getConfig(EnvVariables.AXIOS_DEFAULT_TIMEOUT),
      10
    );
  }
  private static readonly configMap = new Map<string, string>();
  private static configLoaded = false;


  /* istanbul ignore next */
  private static getEnvVariable(name: string, showValueInLog = true): string {
    // check environment variable

    const envVariable: string | undefined = process.env[name];
    if (envVariable && envVariable.trim().length > 0) {
      logger.debug(
        `Using ${name} environment variable [${
          showValueInLog ? envVariable : 'VALUE_HIDDEN'
        }]`
      );
      return envVariable;
    }

    throw(
      `Env variable ${name} is missing from the ConfigMap`
    );
  }
}

export { ConfigSettings, EnvVariables };
