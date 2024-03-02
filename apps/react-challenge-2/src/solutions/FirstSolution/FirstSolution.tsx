import {default as uuid} from 'uuid4';
import './FirstSolution.css';
import { useState } from 'react';

type TFile = {
  name: string;
  files?: TFile[];
};

type TProjectFiles = {
  files: TFile[];
};

const projectFiles = {
  files: [
    { name: 'node_modules', files: [{ name: 'joi' }] },
    { name: 'package.json' },
    { name: 'vite.config.ts' },
  ],
};

function FileEntry({ entry, depth }: { entry: TFile; depth: number }) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  return (
    <div>
      {entry.files ? (
        <button onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? '-' : '+'} {entry.name}
        </button>
      ) : (
        <div className="file-name">{entry.name}</div>
      )}
      {isExpanded && (
        <div style={{ paddingLeft: `${depth}rem` }}>
          {entry.files?.map((entry: TFile, fileIdx: number) => (
            <FileEntry key={fileIdx} entry={entry} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export function FirstSolution() {
  return (
    <section className="file-tree">
      {projectFiles.files.map((file: TFile, fileIdx: number) => (
        <FileEntry key={`${fileIdx}-${uuid()}`} entry={file} depth={1} />
      ))}
    </section>
  );
}
