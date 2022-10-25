import { findNodeOfType, renderToText } from "$sb/lib/tree.ts";
import { getText } from "$sb/silverbullet-syscall/editor.ts";
import { parseMarkdown } from "$sb/silverbullet-syscall/markdown.ts";
import * as YAML from "yaml";
import { store } from "$sb/plugos-syscall/mod.ts";
import { collab, editor, space } from "$sb/silverbullet-syscall/mod.ts";

const defaultServer = "wss://collab.silverbullet.md";

// TODO: Change this to use SETTINGS with default server + user name

function uuidv4(): string {
  // @ts-ignore: this is fine, apparently
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c: any) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(
        16,
      ),
  );
}

async function ensureUsername(): Promise<string> {
  let username = await store.get("shareUsername");
  if (!username) {
    username = await editor.prompt(
      "Please enter a publicly visible user name (or cancel for 'anonymous'):",
    );
    if (!username) {
      return "anonymous";
    } else {
      await store.set("shareUsername", username);
    }
  }
  return username;
}

export async function joinCommand() {
  const serverUrl = await editor.prompt(
    "Please enter the URL of the server to join:",
    defaultServer,
  );
  if (!serverUrl) {
    return;
  }
  const token = await editor.prompt("Please enter the token:");
  if (!token) {
    return;
  }
  const pageName = await editor.prompt(
    "Enter a page name to use to store the page locally:",
    "shared/" + uuidv4(),
  );
  if (!pageName) {
    return;
  }
  await space.writePage(
    pageName,
    generateFrontMatter(serverUrl, token),
  );
  await editor.navigate(pageName);
}

function generateFrontMatter(serverUrl: string, token: string): string {
  return `---
$shareServerUrl: ${serverUrl}
$shareToken: ${token}
---
`;
}

export async function shareCommand() {
  const serverUrl = await editor.prompt(
    "Please enter the URL of the server share via:",
    defaultServer,
  );
  if (!serverUrl) {
    return;
  }
  const token = uuidv4();
  await editor.dispatch({
    changes: [
      {
        from: 0,
        insert: generateFrontMatter(serverUrl, token),
      },
    ],
  });
  collab.start(
    serverUrl,
    token,
    await ensureUsername(),
  );
}

export async function detectPage() {
  const tree = await parseMarkdown(await getText());
  const frontMatter = findNodeOfType(tree, "FrontMatter");
  if (frontMatter) {
    const yamlText = renderToText(frontMatter.children![1].children![0]);
    const parsedData: any = YAML.parse(yamlText);
    if (parsedData.$shareServerUrl && parsedData.$shareToken) {
      console.log("Going to enable collaboration");
      collab.start(
        parsedData.$shareServerUrl,
        parsedData.$shareToken,
        await ensureUsername(),
      );
    }
  }
}
