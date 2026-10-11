import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const files=execFileSync("git",["ls-files","--cached","--others","--exclude-standard","-z"],{encoding:"utf8"}).split("\0").filter(Boolean);
const patterns=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{30,}\b/,/\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b/,/\bAKIA[A-Z0-9]{16}\b/];
const forbidden=files.filter(file=>/(?:^|\/)(?:\.env(?:\..*)?|\.project-config\.json|node_modules|Local Files|verification|\.vercel)(?:\/|$)/.test(file));
const findings=[];
for(const file of files){if(!/\.(?:[cm]?js|tsx?|json|ya?ml|md|html|css|py|txt)$/.test(file))continue;let text;try{text=readFileSync(file,"utf8")}catch{continue}if(patterns.some(p=>p.test(text)))findings.push(file)}
console.log(JSON.stringify({scope:"current tracked and nonignored source files; heuristic patterns, not complete history or certification",filesExamined:files.length,forbiddenPaths:forbidden,secretPatternPaths:findings},null,2));
if(forbidden.length||findings.length)process.exit(1);
