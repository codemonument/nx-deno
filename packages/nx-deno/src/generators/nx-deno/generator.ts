import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from "@nrwl/devkit";
import * as path from "path";
import { NxDenoGeneratorSchema } from "./schema";
import fetch from "node-fetch";

interface NormalizedSchema extends NxDenoGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

async function normalizeOptions(
  tree: Tree,
  options: NxDenoGeneratorSchema,
): Promise<NormalizedSchema> {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp("/", "g"), "-");
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(",").map((s) => s.trim())
    : [];

  const denoStdLibRedirect = await fetch(`https://deno.land/std`, {
    redirect: "manual",
  });
  const latestVersion =
    denoStdLibRedirect.headers.get("location").split("@")[1];
  const denoStdLibVersion = options.denoStdLibVersion ?? latestVersion;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    denoStdLibVersion,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: "",
  };
  generateFiles(
    tree,
    path.join(__dirname, "files"),
    options.projectRoot,
    templateOptions,
  );
}

export default async function (tree: Tree, options: NxDenoGeneratorSchema) {
  const normalizedOptions = await normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: "library",
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: "@codemonument/nx-deno:build",
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
