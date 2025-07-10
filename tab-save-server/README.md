# Tab Save Server

A simple Node.js server for receiving and archiving tab exports from the Tab-Save Chrome extension.

## Quick Start

1. Install Node.js (v12+)
2. Clone this repo and `cd tab-save-server`
3. Run:
   ```
   node src/server.js
   ```

The server listens at `http://localhost:3000/tabs`.

- **POST /tabs** — Overwrites `output.md` with the JSON `{ content: "..." }` sent in the request body.
- **GET /tabs** — Shows an HTML page with clickable links and the original markdown (copyable).

> This server is optional. Use it only if you want your extension to periodically send tab data to an HTTP server, instead of exporting manually.

## License

GNU General Public License v3.0
