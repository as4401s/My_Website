type CareerVisualProps = { kind: 'research' | 'vision' | 'clinical' };

/** Original schematic illustrations of the work, not experimental results. */
export default function CareerVisual({ kind }: CareerVisualProps) {
  if (kind === 'research') return (
    <svg viewBox="0 0 400 290" role="img" aria-label="Schematic of microscopy images becoming segmented cells and a usable analysis result">
      <defs><pattern id="career-research-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" opacity=".09"/></pattern></defs>
      <rect width="400" height="290" fill="url(#career-research-grid)"/>
      <text x="28" y="34" className="visual-kicker">BIOIMAGE ANALYSIS</text>
      <g className="visual-cells" stroke="currentColor" fill="currentColor" fillOpacity=".08" strokeWidth="1.2">
        <ellipse cx="101" cy="110" rx="25" ry="36" transform="rotate(-28 101 110)"/><ellipse cx="179" cy="101" rx="25" ry="34" transform="rotate(32 179 101)"/>
        <ellipse cx="260" cy="132" rx="31" ry="24" transform="rotate(-24 260 132)"/><ellipse cx="155" cy="174" rx="31" ry="24" transform="rotate(18 155 174)"/><ellipse cx="324" cy="91" rx="21" ry="29" transform="rotate(20 324 91)"/>
      </g>
      <g fill="currentColor" opacity=".55"><circle cx="100" cy="112" r="6"/><circle cx="179" cy="103" r="5"/><circle cx="260" cy="132" r="6"/><circle cx="155" cy="174" r="5"/><circle cx="324" cy="91" r="4"/></g>
      <g fill="none" stroke="currentColor" strokeDasharray="3 4" opacity=".5"><rect x="57" y="65" width="88" height="91" rx="3"/><rect x="226" y="98" width="71" height="68" rx="3"/></g>
      <path d="M288 160v35h58" fill="none" stroke="currentColor" opacity=".4"/><text x="298" y="212" className="visual-caption">segment</text>
      <path d="M28 239H372" stroke="currentColor" opacity=".17"/>
      <text x="28" y="264" className="visual-caption">IMAGE</text><path d="M81 260h44m-5-4 5 4-5 4" fill="none" stroke="currentColor" opacity=".5"/>
      <text x="139" y="264" className="visual-caption">MODEL</text><path d="M202 260h44m-5-4 5 4-5 4" fill="none" stroke="currentColor" opacity=".5"/><text x="260" y="264" className="visual-caption">MEASUREMENT</text>
    </svg>
  );
  if (kind === 'vision') return (
    <svg viewBox="0 0 400 290" role="img" aria-label="Schematic comparing two model pipelines on the same medical images, then deploying to an edge device">
      <text x="28" y="34" className="visual-kicker">COMPARE. EVALUATE. DEPLOY.</text>
      <g fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="28" y="93" width="75" height="88" rx="5"/><path d="M66 107v58m-6-44c-20-10-24 21-17 35 7 5 17 0 17-6zm12 0c20-10 24 21 17 35-7 5-17 0-17-6z" opacity=".6"/>
        <path d="M103 136h28V87h26m-26 49v49h26" opacity=".45"/><rect x="157" y="62" width="107" height="51" rx="4"/><rect x="157" y="160" width="107" height="51" rx="4"/>
        <path d="M264 87h24v49h24m-24 0v49h-24" opacity=".45"/><rect x="312" y="107" width="61" height="58" rx="4"/><rect x="329" y="121" width="28" height="28" rx="2" opacity=".5"/>
        <path d="M324 101v6m12-6v6m12-6v6m12-6v6m-36 58v6m12-6v6m12-6v6m12-6v6" opacity=".5"/>
      </g>
      <text x="174" y="92" className="visual-label">VisionPro</text><text x="171" y="190" className="visual-label">TensorFlow</text>
      <text x="29" y="208" className="visual-caption">SHARED DATA</text><text x="316" y="195" className="visual-caption">EDGE</text>
      <path d="M28 239H372" stroke="currentColor" opacity=".17"/><text x="28" y="264" className="visual-caption">MEDICAL IMAGES → MODEL COMPARISON → DEPLOYMENT</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 400 290" role="img" aria-label="Schematic of an endoscopic imaging system, clinical display, and hands-on equipment support">
      <text x="28" y="34" className="visual-kicker">IMAGING IN CLINICAL PRACTICE</text>
      <g fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="122" y="66" width="211" height="131" rx="5"/><rect x="133" y="77" width="189" height="98" rx="2" opacity=".3"/>
        <circle cx="228" cy="127" r="37" opacity=".5"/><path d="M202 133q12-30 32-12t23 5m-49 27q14-18 35-7" opacity=".6"/>
        <path d="M221 197v27m14-27v27m-40 0h66"/><circle cx="228" cy="185" r="2"/>
        <rect x="42" y="156" width="31" height="54" rx="7"/><path d="M57 156v-32c0-18 24-18 24-36s-19-18-19-33m-5 155v16c0 16 42 16 42-2v-32c0-16 23-16 23-16" opacity=".7"/>
        <path d="M52 171h11m-11 9h11" opacity=".5"/>
      </g>
      <path d="M28 239H372" stroke="currentColor" opacity=".17"/><text x="28" y="264" className="visual-caption">INSTALLATION · TRAINING · TECHNICAL SUPPORT</text>
    </svg>
  );
}
