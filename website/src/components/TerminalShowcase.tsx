import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  lang: 'en' | 'id';
}

export default function TerminalShowcase({ lang }: Props) {
  const [activeTab, setActiveTab] = useState<'mpd' | 'mcp' | 'jam'>('mpd');
  const [copied, setCopied] = useState(false);

  const snippets = {
    mpd: `# Control SoraFy playback from Linux terminal via standard mpc
$ mpc -h 127.0.0.1 status
Bernadya - Satu Bulan
[playing] #1/24   1:42/3:28 (48%)
volume: 85%   repeat: off   random: on

# Or launch full TUI visualizer ncmpcpp directly
$ ncmpcpp -h 127.0.0.1 -p 6600`,

    mcp: `# Add SoraFy Model Context Protocol server to claude_desktop_config.json
{
  "mcpServers": {
    "sorafy": {
      "command": "node",
      "args": ["packages/desktop/build/mcp-server.js"],
      "env": {
        "SORAFY_PORT": "8800"
      }
    }
  }
}
# AI assistant can now play songs, adjust EQ, and query lyrics!`,

    jam: `# Launch SoraFy Jam remote on your local Wi-Fi network
$ curl -s http://192.168.1.100:4120/api/state | jq
{
  "status": "playing",
  "track": "Satu Bulan",
  "artist": "Bernadya",
  "album": "Sialnya, Hidup Harus Tetap Berjalan",
  "volume": 85,
  "listeners": 2
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[activeTab]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-[#090B0E] border border-medium rounded-2xl overflow-hidden shadow-2xl">
      {/* Terminal Titlebar & Tabs */}
      <div className="bg-[#11141A] border-b border-subtle flex items-center justify-between px-4 py-2.5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('mpd')}
            className={`text-xs font-mono-code font-semibold px-3 py-1.5 rounded transition-all ${
              activeTab === 'mpd'
                ? 'bg-surface-elevated text-[#00E599] border border-subtle'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            MPD Client (Terminal)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('mcp')}
            className={`text-xs font-mono-code font-semibold px-3 py-1.5 rounded transition-all ${
              activeTab === 'mcp'
                ? 'bg-surface-elevated text-[#00E599] border border-subtle'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            AI Claude / Cursor MCP
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('jam')}
            className={`text-xs font-mono-code font-semibold px-3 py-1.5 rounded transition-all ${
              activeTab === 'jam'
                ? 'bg-surface-elevated text-[#00E599] border border-subtle'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Jam Remote (Local Wi-Fi)
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`inline-flex items-center gap-1.5 text-xs font-mono-code font-semibold px-2.5 py-1 rounded bg-surface-elevated border border-subtle transition-all ${
            copied ? 'text-[#00E599] border-[#00E599]/40' : 'text-neutral-400 hover:text-white'
          }`}
          title="Copy snippet"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? (lang === 'id' ? 'Tersalin!' : 'Copied!') : (lang === 'id' ? 'Salin' : 'Copy')}</span>
        </button>
      </div>

      {/* Terminal Code Body */}
      <div className="p-6 font-mono-code text-xs sm:text-sm leading-relaxed overflow-x-auto text-neutral-200">
        <pre className="whitespace-pre">{snippets[activeTab]}</pre>
      </div>
    </div>
  );
}
