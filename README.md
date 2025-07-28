# tiptap-converter-cli

A simple command-line utility for converting between [Tiptap](https://tiptap.dev)'s HTML and JSON document formats. Supports stdin and file input, and outputs to stdout.

## Features

- Convert Tiptap **JSON → HTML**
- Convert Tiptap **HTML → JSON**
- Read input from file or `stdin`
- Supports common Tiptap extensions including tables, colors, images, text styles, and links

## Installation

You can install this CLI globally via `npm`:

```bash
npm install -g @spaceduckapp/tiptap-converter-cli
```

## Usage

Using `stdin`:

```console
$ curl --silent "https://www.example.com" | tiptap-converter-cli -j | tiptap-converter-cli -h
<h1>Example Domain</h1><p>This domain is for use in illustrative examples in documents. You may use this domain in literature without prior coordination or asking for permission.</p><p><a target="_blank" rel="noopener noreferrer nofollow" href="https://www.iana.org/domains/example">More information...</a></p>
```

Help:

```console
$ tiptap-converter-cli --help
Usage: tiptap-converter-cli [options]

Options:
  --stdin           read the input from stdin. (default: true)
  -f --file <file>  read the input from file
  -h --to-html      Convert from json to html
  -j --to-json      Convert from html to json
  -V, --version     output the version number
  --help            display help for command
```
