export type ExtractJsonResult =
  | {
      success: true;
      rawJson: string;
      value: unknown;
    }
  | {
      success: false;
      message: string;
    };

function removeMarkdownCodeFence(value: string): string {
  const trimmed = value.trim();

  const fencedMatch = trimmed.match(/^```(?:json|JSON)?\s*([\s\S]*?)\s*```$/);

  if (fencedMatch) {
    return fencedMatch[1].trim();
  }

  return trimmed;
}

function extractBalancedJson(value: string): string | null {
  const objectStart = value.indexOf("{");
  const arrayStart = value.indexOf("[");

  if (objectStart === -1 && arrayStart === -1) {
    return null;
  }

  let start: number;

  if (objectStart === -1) {
    start = arrayStart;
  } else if (arrayStart === -1) {
    start = objectStart;
  } else {
    start = Math.min(objectStart, arrayStart);
  }

  const openingCharacter = value[start];
  const closingCharacter = openingCharacter === "{" ? "}" : "]";

  const stack: string[] = [openingCharacter];

  let insideString = false;
  let escaped = false;

  for (let index = start + 1; index < value.length; index += 1) {
    const character = value[index];

    if (insideString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (character === "\\") {
        escaped = true;
        continue;
      }

      if (character === '"') {
        insideString = false;
      }

      continue;
    }

    if (character === '"') {
      insideString = true;
      continue;
    }

    if (character === "{" || character === "[") {
      stack.push(character);
      continue;
    }

    if (character === "}" || character === "]") {
      const expectedOpening = character === "}" ? "{" : "[";

      if (stack[stack.length - 1] !== expectedOpening) {
        return null;
      }

      stack.pop();

      if (stack.length === 0) {
        return value.slice(start, index + 1).trim();
      }
    }
  }

  return null;
}

export function extractJsonFromText(value: string): ExtractJsonResult {
  const input = value.trim();

  if (!input) {
    return {
      success: false,
      message: "Please paste your JSON first.",
    };
  }

  /*
   * First try the input exactly as provided.
   *
   * This is the fastest and safest path when the user
   * already pasted valid JSON.
   */
  try {
    const parsed = JSON.parse(input);

    return {
      success: true,
      rawJson: input,
      value: parsed,
    };
  } catch {
    // Continue with normalization/extraction.
  }

  /*
   * Handle a response wrapped in a Markdown code fence.
   *
   * Example:
   *
   * ```json
   * { ... }
   * ```
   */
  const withoutFence = removeMarkdownCodeFence(input);

  if (withoutFence !== input) {
    try {
      const parsed = JSON.parse(withoutFence);

      return {
        success: true,
        rawJson: withoutFence,
        value: parsed,
      };
    } catch {
      // Continue with balanced JSON extraction.
    }
  }

  /*
   * Handle AI responses where JSON is surrounded by
   * additional explanatory text.
   */
  const extracted = extractBalancedJson(withoutFence);

  if (!extracted) {
    return {
      success: false,
      message:
        "No complete JSON object or array could be found in the pasted content.",
    };
  }

  try {
    const parsed = JSON.parse(extracted);

    return {
      success: true,
      rawJson: extracted,
      value: parsed,
    };
  } catch {
    return {
      success: false,
      message:
        "JSON content was found, but it could not be parsed. Make sure the generated JSON is complete and valid.",
    };
  }
}
