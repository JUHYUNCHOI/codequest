import { C, t } from "../../theme";
import { highlight } from "../../components/shared";

export function isMoo(a, b, c) { return a !== b && b === c; }

export function findAllMoos(s) {
  const moos = {};
  for (let i = 0; i <= s.length - 3; i++) {
    if (isMoo(s[i], s[i + 1], s[i + 2])) {
      const key = s[i] + s[i + 1] + s[i + 2];
      moos[key] = (moos[key] || 0) + 1;
    }
  }
  return moos;
}

export function bruteSolve(s, F) {
  const result = new Set();
  const arr = s.split("");
  const orig = findAllMoos(arr);
  for (const [k, v] of Object.entries(orig)) if (v >= F) result.add(k);
  for (let pos = 0; pos < arr.length; pos++) {
    const oc = arr[pos];
    for (let ci = 0; ci < 26; ci++) {
      const c = String.fromCharCode(97 + ci);
      if (c === oc) continue;
      arr[pos] = c;
      const moos = findAllMoos(arr);
      for (const [k, v] of Object.entries(moos)) if (v >= F) result.add(k);
      arr[pos] = oc;
    }
  }
  return [...result].sort();
}

export const BRUTE_CODE = [
  "N, F = map(int, input().split())",
  "S = input()",
  "result = set()",
  "",
  "def is_moo(a, b, c):",
  "    return a != b and b == c",
  "",
  "def count_all(s):",
  "    moos = {}",
  "    for i in range(len(s) - 2):",
  "        if is_moo(s[i], s[i+1], s[i+2]):",
  "            key = s[i] + s[i+1] + s[i+2]",
  "            moos[key] = moos.get(key, 0) + 1",
  "    return moos",
  "",
  "for k, v in count_all(S).items():",
  "    if v >= F: result.add(k)",
  "",
  "arr = list(S)",
  "for pos in range(N):",
  "    orig = arr[pos]",
  "    for c in 'abcdefghijklmnopqrstuvwxyz':",
  "        if c == orig: continue",
  "        arr[pos] = c",
  "        for k, v in count_all(arr).items():",
  "            if v >= F: result.add(k)",
  "        arr[pos] = orig",
  "",
  "result = sorted(result)",
  "print(len(result))",
  "print('\\n'.join(result))",
];

export const OPT_CODE = [
  "from collections import defaultdict",
  "n, f = map(int, input().split())",
  "string = list(input())",
  "mydict = defaultdict(int)",
  "alphabet = 'abcdefghijklmnopqrstuvwxyz'",
  "result = set()",
  "",
  "def isMoo(a, b, c):",
  "    return a != b and b == c",
  "",
  "for i in range(n - 2):",
  "    if isMoo(string[i], string[i+1], string[i+2]):",
  "        mydict[string[i]+string[i+1]+string[i+2]] += 1",
  "",
  "for pos in range(n):",
  "  minIndex = max(pos-2, 0)",
  "  maxIndex = min(n-2, pos+1)",
  "",
  "  for idx in range(minIndex, maxIndex+1):",
  "    t = string[idx:idx+3]",
  "    if isMoo(t[0], t[1], t[2]):",
  "      mydict[t[0]+t[1]+t[2]] -= 1",
  "",
  "  for c in alphabet:",
  "    for idx in range(minIndex, maxIndex+1):",
  "      t = string[idx:idx+3]",
  "      t[pos - idx] = c",
  "      if isMoo(t[0], t[1], t[2]):",
  "        key = t[0]+t[1]+t[2]",
  "        mydict[key] += 1",
  "        if mydict[key] >= f:",
  "          result.add(key)",
  "        mydict[key] -= 1",
  "",
  "  for idx in range(minIndex, maxIndex+1):",
  "    t = string[idx:idx+3]",
  "    if isMoo(t[0], t[1], t[2]):",
  "      mydict[t[0]+t[1]+t[2]] += 1",
  "",
  "result = sorted(result)",
  "print(len(result))",
  "print('\\n'.join(result))",
];

export function MiniCode({ lines }) {
  return (
    <div style={{ background: "#1e1b2e", borderRadius: 10, padding: "12px 10px", overflowX: "auto", fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: "flex", minHeight: 20 }}>
          <span style={{ color: "#4b5563", width: 24, textAlign: "right", marginRight: 8, flexShrink: 0, userSelect: "none", fontSize: 10 }}>{i + 1}</span>
          <span style={{ whiteSpace: "pre" }}>{highlight(l)}</span>
        </div>
      ))}
    </div>
  );
}
