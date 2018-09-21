import * as path from "path";
import * as Convict from "convict";

export const config = Convict({
  cachePath: {
    doc: "Path to cache folder",
    format: "String",
    default: path.resolve(__dirname, "../cache")
  },
  dbPath: {
    doc: "Path to db folder",
    format: "String",
    default: `${__dirname}/db`
  }
});
