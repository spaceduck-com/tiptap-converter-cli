#!/usr/bin/env node
import { generateHTML, generateJSON } from "@tiptap/html";
import { Command, Option } from "commander";
import { readFileSync } from "node:fs";
import Color from '@tiptap/extension-color';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

type Options = ({
  stdin: true,
  file: false
} | {
  stdin: false,
  file: string
}) & ({
  toHtml: true,
  toJson: false,
} | {
  toHtml: false,
  toJson: true
})

const extensions = [
  Image,
  StarterKit,
  Link,
  Color,
  TableHeader,
  TableCell,
  TableRow,
  TextAlign,
  TextStyle,
  Underline,
];

async function validateArguments() {
  const program = new Command()
    .addOption(new Option("--stdin", "read the input from stdin.").default(true).conflicts("file"))
    .addOption(new Option("-f --file <file>", "read the input from file").conflicts("stdin").implies({ "stdin": undefined }))
    .addOption(new Option("-h --to-html", "Convert from json to html").conflicts("toJson"))
    .addOption(new Option("-j --to-json", "Convert from html to json").conflicts("toHtml"))
    .version("1.0.0");
  program.parse();

  const opts = program.opts();
  if (!opts.toJson && !opts.toHtml) {
    await logError("error: must specify either JSON or HTML mode");
    process.exit(2);
  }

  return {
    stdin: !!opts.stdin,
    file: opts.file ?? false,
    toHtml: !!opts.toHtml,
    toJson: !!opts.toJson,
  } as Options;
}


async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function writeData(data: string) {
  const flushed = process.stdout.write(data);
  if (!flushed) {
    return new Promise((resolve) => {
      process.stdout.once("drain", () => {
        resolve(undefined);
      })
    })
  }
  return
}

function logError(errorMessage: string) {
  const flushed = process.stderr.write(errorMessage);

  if (!flushed) {
    return new Promise((resolve: (value: unknown) => void) => {
      process.stdout.once("drain", () => {
        resolve(undefined);
      })
    })
  }
  return
}

async function readData(options: Options) {
  if (options.stdin) {
    return await readStdin();
  }
  try {
    return readFileSync(options.file, 'utf-8');
  } catch (e) {
    await logError(`error reading file: ${options.file}`);
    process.exit(1);
  }
}

function doConversion(input: string, options: Options) {
  if (options.toHtml) {
    const inputObject = JSON.parse(input)
    const result = generateHTML(inputObject, extensions);
    return result;
  }
  return JSON.stringify(generateJSON(input, extensions));

}

async function main() {
  const options = await validateArguments();
  const input = await readData(options);
  const result = doConversion(input, options);
  await writeData(result);
  process.exit()
}

main().catch(async (e: Error) => {
  await logError("Error.")
  await logError(e.message)
  process.exit(1);
})
