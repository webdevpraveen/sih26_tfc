import { useState, useEffect, useMemo, useRef } from 'react';
import { fetchTeamsFromSheet } from '../services/sheetService';
import { teamsMembersData } from '../data/teamsMembersData';
import { SIH_LOGO_BASE64, SRMU_LOGO_BASE64 } from '../data/cardLogosData';
import './ShareCardModal.css';

// In-memory cache for any live sheet updates
let cachedLiveSheetData = null;

export default function ShareCardModal({ team, isOpen, onClose }) {
  const [liveSheetData, setLiveSheetData] = useState(cachedLiveSheetData || teamsMembersData);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);

  // Background non-blocking fetch to pick up any new sheet edits silently without delaying the UI
  useEffect(() => {
    if (!cachedLiveSheetData) {
      fetchTeamsFromSheet()
        .then((data) => {
          if (data && data.length > 0) {
            cachedLiveSheetData = data;
            setLiveSheetData(data);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Generate SVG using the celebratory trophy card template (680x780)
  const generateSvgContent = ({ teamName, leaderName, teammates, sihLogo, srmuLogo }) => {
    const escapeXml = (str) =>
      (str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');

    const safeTeamName = escapeXml(teamName);
    const safeLeader = escapeXml(leaderName);
    const m2 = escapeXml(teammates[0] || 'Team Member');
    const m3 = escapeXml(teammates[1] || 'Team Member');
    const m4 = escapeXml(teammates[2] || 'Team Member');
    const m5 = escapeXml(teammates[3] || 'Team Member');
    const m6 = escapeXml(teammates[4] || 'Team Member');

    const getFontSize = (str) => {
      if (!str) return 13.5;
      if (str.length > 22) return 11;
      if (str.length > 16) return 12.5;
      return 14;
    };

    let teamFontSize = 18;
    if (teamName.length > 22) teamFontSize = 15;
    if (teamName.length > 30) teamFontSize = 13;

    return `
<svg width="100%" viewBox="0 0 680 780" role="img" xmlns="http://www.w3.org/2000/svg">
<title>SIH 2026 Selected Card</title>
<desc>We are Selected in Smart India Hackathon 2026 Internal Round - ${safeTeamName}</desc>
<defs>
  <linearGradient id="cup-body" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#fde68a"/>
    <stop offset="40%" stop-color="#f59e0b"/>
    <stop offset="100%" stop-color="#b45309"/>
  </linearGradient>
  <linearGradient id="cup-shine" x1="0%" y1="0%" x2="60%" y2="100%">
    <stop offset="0%" stop-color="#fef9c3" stop-opacity="0.9"/>
    <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="cup-base" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fbbf24"/>
    <stop offset="100%" stop-color="#92400e"/>
  </linearGradient>
  <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="100%" stop-color="#fde68a"/>
  </linearGradient>
  <radialGradient id="cup-glow" cx="50%" cy="30%" r="60%">
    <stop offset="0%" stop-color="#fef3c7" stop-opacity="0.6"/>
    <stop offset="100%" stop-color="#f59e0b" stop-opacity="0"/>
  </radialGradient>
</defs>

<!-- BASE BACKGROUND -->
<rect x="0" y="0" width="680" height="780" rx="18" fill="#ffffff"/>

<!-- AMBIENT CIRCLES -->
<circle cx="28" cy="38" r="62" fill="#dbeafe" opacity="0.65"/>
<circle cx="652" cy="18" r="54" fill="#bfdbfe" opacity="0.55"/>
<circle cx="658" cy="715" r="58" fill="#bfdbfe" opacity="0.45"/>
<circle cx="28" cy="738" r="42" fill="#d1fae5" opacity="0.45"/>
<circle cx="640" cy="760" r="30" fill="#93c5fd" opacity="0.3"/>
<circle cx="88" cy="8" r="28" fill="#fde68a" opacity="0.4"/>
<circle cx="672" cy="82" r="32" fill="#fde68a" opacity="0.3"/>

<!-- CONFETTI SHAPES - LEFT -->
<rect x="108" y="152" width="18" height="6" rx="3" fill="#22c55e" transform="rotate(-30 108 152)" opacity="0.9"/>
<rect x="78" y="182" width="14" height="5" rx="2.5" fill="#f97316" transform="rotate(20 78 182)" opacity="0.85"/>
<rect x="95" y="218" width="16" height="6" rx="3" fill="#3b82f6" transform="rotate(-45 95 218)" opacity="0.8"/>
<rect x="62" y="248" width="12" height="5" rx="2.5" fill="#eab308" transform="rotate(55 62 248)" opacity="0.85"/>
<rect x="112" y="268" width="15" height="5" rx="2.5" fill="#ec4899" transform="rotate(-20 112 268)" opacity="0.8"/>
<rect x="72" y="295" width="13" height="5" rx="2.5" fill="#a855f7" transform="rotate(40 72 295)" opacity="0.75"/>

<!-- CONFETTI SHAPES - RIGHT -->
<rect x="558" y="152" width="18" height="6" rx="3" fill="#f97316" transform="rotate(30 558 152)" opacity="0.9"/>
<rect x="592" y="182" width="14" height="5" rx="2.5" fill="#22c55e" transform="rotate(-22 592 182)" opacity="0.85"/>
<rect x="572" y="218" width="16" height="6" rx="3" fill="#eab308" transform="rotate(48 572 218)" opacity="0.8"/>
<rect x="608" y="248" width="12" height="5" rx="2.5" fill="#3b82f6" transform="rotate(-55 608 248)" opacity="0.85"/>
<rect x="560" y="268" width="15" height="5" rx="2.5" fill="#a855f7" transform="rotate(22 560 268)" opacity="0.8"/>
<rect x="598" y="295" width="13" height="5" rx="2.5" fill="#ec4899" transform="rotate(-42 598 295)" opacity="0.75"/>

<!-- CONFETTI CIRCLES -->
<circle cx="90" cy="165" r="5" fill="#eab308" opacity="0.8"/>
<circle cx="65" cy="210" r="4" fill="#22c55e" opacity="0.75"/>
<circle cx="105" cy="245" r="5" fill="#3b82f6" opacity="0.8"/>
<circle cx="80" cy="278" r="4" fill="#f97316" opacity="0.75"/>
<circle cx="590" cy="165" r="5" fill="#3b82f6" opacity="0.8"/>
<circle cx="615" cy="210" r="4" fill="#ec4899" opacity="0.75"/>
<circle cx="575" cy="245" r="5" fill="#22c55e" opacity="0.8"/>
<circle cx="610" cy="278" r="4" fill="#eab308" opacity="0.75"/>

<!-- CONFETTI STREAMERS -->
<path d="M60 168 Q66 162 72 168 Q78 174 84 168" stroke="#ec4899" stroke-width="2.5" fill="none" opacity="0.8" stroke-linecap="round"/>
<path d="M596 168 Q602 162 608 168 Q614 174 620 168" stroke="#a855f7" stroke-width="2.5" fill="none" opacity="0.8" stroke-linecap="round"/>
<path d="M56 230 Q62 224 68 230 Q74 236 80 230" stroke="#f97316" stroke-width="2.5" fill="none" opacity="0.75" stroke-linecap="round"/>
<path d="M600 230 Q606 224 612 230 Q618 236 624 230" stroke="#22c55e" stroke-width="2.5" fill="none" opacity="0.75" stroke-linecap="round"/>

<!-- ===================================================== -->
<!-- HEADER: SIH & SRMU OFFICIAL LOGOS -->
<!-- ===================================================== -->

<!-- SIH LOGO -->
<rect x="38" y="20" width="80" height="70" rx="8" fill="#ffffff" stroke="#c7d7fa" stroke-width="1.2"/>
${sihLogo
        ? `<image href="${sihLogo}" x="42" y="23" width="72" height="64" preserveAspectRatio="xMidYMid meet"/>`
        : `<text x="78" y="52" text-anchor="middle" font-family="Arial" font-size="9" fill="#3b4fa8" font-weight="bold">SIH LOGO</text>`
      }

<text x="128" y="42" font-family="Arial" font-size="13" font-weight="900" fill="#1e2a6e">SMART INDIA</text>
<text x="128" y="58" font-family="Arial" font-size="13" font-weight="900" fill="#1e2a6e">HACKATHON</text>
<text x="128" y="74" font-family="Arial" font-size="16" font-weight="900" fill="#ea580c">2026</text>
<text x="128" y="86" font-family="Arial" font-size="8.5" fill="#6b7280" font-weight="600">Innovate for a Viksit Bharat</text>

<line x1="275" y1="24" x2="275" y2="90" stroke="#c7d7fa" stroke-width="1.5"/>

<!-- SRMU LOGO (DEFAULT SHAPE) -->
<rect x="436" y="20" width="62" height="70" rx="8" fill="#ffffff" stroke="#c7d7fa" stroke-width="1.2"/>
${srmuLogo
        ? `<image href="${srmuLogo}" x="439" y="23" width="56" height="64" preserveAspectRatio="xMidYMid meet"/>`
        : `<text x="467" y="55" text-anchor="middle" font-family="Arial" font-size="8" fill="#3b4fa8" font-weight="bold">SRMU</text>`
      }

<text x="506" y="36" font-family="Arial" font-size="20" font-weight="900" fill="#1e2a6e">SRMU</text>
<text x="506" y="50" font-family="Arial" font-size="8" font-weight="bold" fill="#1e2a6e">SHRI RAMSWAROOP</text>
<text x="506" y="61" font-family="Arial" font-size="8" font-weight="bold" fill="#1e2a6e">MEMORIAL UNIVERSITY</text>
<text x="506" y="72" font-family="Arial" font-size="7.5" fill="#6b7280">LUCKNOW - DEVA ROAD</text>
<text x="506" y="83" font-family="Arial" font-size="7.5" fill="#6b7280">UTTAR PRADESH</text>

<!-- ===================================================== -->
<!-- HEADLINE: WE'RE SELECTED -->
<!-- ===================================================== -->

<text x="340" y="162" text-anchor="middle" font-family="Georgia, serif" font-size="46" font-weight="bold" fill="#1e2a6e" font-style="italic">We&apos;re</text>
<text x="340" y="222" text-anchor="middle" font-family="Georgia, serif" font-size="60" font-weight="900" fill="#ea580c" font-style="italic">Selected!</text>
<path d="M 192 236 Q 340 250 488 236" stroke="#eab308" stroke-width="4.5" fill="none" stroke-linecap="round"/>

<text x="340" y="268" text-anchor="middle" font-family="Arial" font-size="19" font-weight="bold" fill="#1e2a6e">in Smart India Hackathon 2026</text>

<rect x="198" y="277" width="284" height="40" rx="6" fill="#1e2a6e"/>
<text x="340" y="303" text-anchor="middle" font-family="Georgia, serif" font-size="22" font-style="italic" fill="#ffffff">Internal Round</text>

<!-- ===================================================== -->
<!-- TEAM & MEMBERS CONTAINER -->
<!-- ===================================================== -->

<rect x="48" y="330" width="584" height="248" rx="14" fill="#eef4ff" stroke="#c7d7fa" stroke-width="1.5"/>

<line x1="220" y1="356" x2="282" y2="356" stroke="#9ca3af" stroke-width="1"/>
<text x="340" y="360" text-anchor="middle" font-family="Arial" font-size="11" font-weight="bold" fill="#9ca3af" letter-spacing="4">TEAM</text>
<line x1="398" y1="356" x2="460" y2="356" stroke="#9ca3af" stroke-width="1"/>

<!-- TEAM NAME -->
<rect x="148" y="366" width="384" height="42" rx="8" fill="#ffffff" stroke="#f97316" stroke-width="1.5"/>
<text x="166" y="393" font-family="Arial" font-size="14" fill="#f97316">›</text>
<text x="340" y="393" text-anchor="middle" font-family="Arial" font-size="${teamFontSize}" font-weight="bold" fill="#374151">${safeTeamName}</text>
<text x="514" y="393" text-anchor="end" font-family="Arial" font-size="14" fill="#f97316">‹</text>

<!-- MEMBER 1: LEADER -->
<rect x="64" y="422" width="174" height="50" rx="8" fill="#ffffff" stroke="#f97316" stroke-width="1.4"/>
<text x="151" y="447" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="${getFontSize(leaderName)}" font-weight="bold" fill="#1e293b">${safeLeader}</text>


<!-- MEMBER 2 -->
<rect x="253" y="422" width="174" height="50" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
<text x="340" y="447" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="${getFontSize(m2)}" font-weight="bold" fill="#1e293b">${m2}</text>

<!-- MEMBER 3 -->
<rect x="442" y="422" width="174" height="50" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
<text x="529" y="447" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="${getFontSize(m3)}" font-weight="bold" fill="#1e293b">${m3}</text>

<!-- MEMBER 4 -->
<rect x="64" y="486" width="174" height="50" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
<text x="151" y="511" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="${getFontSize(m4)}" font-weight="bold" fill="#1e293b">${m4}</text>

<!-- MEMBER 5 -->
<rect x="253" y="486" width="174" height="50" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
<text x="340" y="511" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="${getFontSize(m5)}" font-weight="bold" fill="#1e293b">${m5}</text>

<!-- MEMBER 6 -->
<rect x="442" y="486" width="174" height="50" rx="8" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.2"/>
<text x="529" y="511" text-anchor="middle" dominant-baseline="central" font-family="Arial, sans-serif" font-size="${getFontSize(m6)}" font-weight="bold" fill="#1e293b">${m6}</text>

<!-- ===================================================== -->
<!-- GOLDEN TROPHY ILLUSTRATION WITH STAR & CONFETTI -->
<!-- ===================================================== -->

<ellipse cx="340" cy="632" rx="58" ry="16" fill="#fde68a" opacity="0.3"/>

<!-- CUP HANDLES -->
<path d="M302 590 Q278 590 276 608 Q274 628 302 632" stroke="url(#cup-body)" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M302 590 Q282 590 280 608 Q278 626 302 632" stroke="#fde68a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>

<path d="M378 590 Q402 590 404 608 Q406 628 378 632" stroke="url(#cup-body)" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M378 590 Q398 590 400 608 Q402 626 378 632" stroke="#fde68a" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>

<!-- CUP MAIN BODY -->
<path d="M302 572 L378 572 L368 638 Q340 648 312 638 Z" fill="url(#cup-body)"/>
<path d="M302 572 L315 638 Q305 635 302 572 Z" fill="#b45309" opacity="0.4"/>
<path d="M378 572 L365 638 Q375 635 378 572 Z" fill="#b45309" opacity="0.3"/>
<path d="M310 576 L322 572 L318 610 Q314 612 308 608 Z" fill="url(#cup-shine)" opacity="0.7"/>
<path d="M302 572 L378 572 L368 638 Q340 648 312 638 Z" fill="url(#cup-glow)" opacity="0.5"/>

<!-- CUP RIM -->
<rect x="298" y="568" width="84" height="10" rx="5" fill="url(#cup-base)"/>
<rect x="300" y="568" width="80" height="5" rx="3" fill="#fde68a" opacity="0.6"/>

<!-- CUP STEM & PEDESTAL -->
<rect x="330" y="648" width="20" height="14" rx="2" fill="url(#cup-base)"/>
<rect x="314" y="660" width="52" height="10" rx="4" fill="url(#cup-base)"/>
<rect x="316" y="660" width="24" height="5" rx="2" fill="#fde68a" opacity="0.4"/>

<!-- SHINING STAR ON CUP -->
<polygon points="340,585 344.5,598 358,598 347,606 351,619 340,611 329,619 333,606 322,598 335.5,598" fill="url(#star-grad)" opacity="0.95"/>
<polygon points="340,587 344,598 356,598 346.5,605 350,617 340,610 330,617 333.5,605 324,598 336,598" fill="#ffffff" opacity="0.4"/>

<!-- TROPHY BURST CONFETTI -->
<rect x="337" y="552" width="5" height="13" rx="2.5" fill="#eab308" opacity="0.9"/>
<rect x="353" y="556" width="4" height="11" rx="2" fill="#22c55e" opacity="0.85" transform="rotate(20 353 556)"/>
<rect x="321" y="556" width="4" height="11" rx="2" fill="#f97316" opacity="0.85" transform="rotate(-20 321 556)"/>
<rect x="366" y="562" width="4" height="10" rx="2" fill="#3b82f6" opacity="0.8" transform="rotate(38 366 562)"/>
<rect x="308" y="562" width="4" height="10" rx="2" fill="#ec4899" opacity="0.8" transform="rotate(-38 308 562)"/>
<rect x="383" y="578" width="4" height="12" rx="2" fill="#a855f7" opacity="0.8" transform="rotate(60 383 578)"/>
<rect x="293" y="578" width="4" height="12" rx="2" fill="#eab308" opacity="0.8" transform="rotate(-60 293 578)"/>
<rect x="390" y="600" width="4" height="10" rx="2" fill="#06b6d4" opacity="0.75" transform="rotate(75 390 600)"/>
<rect x="286" y="600" width="4" height="10" rx="2" fill="#22c55e" opacity="0.75" transform="rotate(-75 286 600)"/>
<circle cx="340" cy="551" r="3" fill="#fef08a" opacity="0.9"/>
<circle cx="362" cy="555" r="2.5" fill="#fbbf24" opacity="0.85"/>
<circle cx="318" cy="555" r="2.5" fill="#fbbf24" opacity="0.85"/>

<!-- ===================================================== -->
<!-- BOTTOM BANNER & FOOTER -->
<!-- ===================================================== -->

<rect x="0" y="660" width="680" height="120" fill="#1e2a6e"/>

<!-- TRICOLOR ACCENT BARS -->
<rect x="0" y="658" width="680" height="5" fill="#ff9933"/>
<rect x="0" y="663" width="680" height="5" fill="#ffffff"/>
<rect x="0" y="668" width="680" height="5" fill="#138808"/>

<text x="340" y="708" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffffff">SIH 2026</text>
<text x="340" y="731" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#ffffff" letter-spacing="2">★ INTERNAL ROUND ★</text>

<!-- FOOTER STRIP -->
<rect x="0" y="744" width="680" height="36" fill="#152059"/>
<text x="24" y="767" font-family="Arial, sans-serif" font-size="11.5" fill="#c7d7fa">Organized by <tspan font-weight="bold" fill="#ffffff">Tech Fusion Club</tspan></text>
<text x="658" y="767" text-anchor="end" font-family="Arial, sans-serif" font-size="10" fill="#cbd5e1">*This is not a Certificate. It is intended for Social Media Sharing only*</text>
</svg>
`;
  };

  // Compute SVG immediately and synchronously - 0 ms delay!
  const svgString = useMemo(() => {
    if (!team) return '';

    const clean = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const stNameClean = clean(team.teamName);
    const stLeaderClean = clean(team.leaderName);

    const sheetList = liveSheetData || teamsMembersData;
    const baseSt = stNameClean.replace(/20|2o/g, '');

    const matchedTeam = (() => {
      // Priority 1: Exact Team Name AND Exact Leader Name
      let m = (sheetList || []).find((t) => {
        const tNameClean = clean(t['Team Name']);
        const tLeaderClean = clean(t['Member 1 (Leader)']);
        return tNameClean === stNameClean && tLeaderClean === stLeaderClean;
      });
      if (m) return m;

      // Priority 2: Exact Leader Match AND matching base team name (e.g. InnoVaTeX vs InnoVaTeX 2.0)
      m = (sheetList || []).find((t) => {
        const tNameClean = clean(t['Team Name']);
        const tLeaderClean = clean(t['Member 1 (Leader)']);
        const baseT = tNameClean.replace(/20|2o/g, '');
        return tLeaderClean === stLeaderClean && (tNameClean === stNameClean || baseT === baseSt);
      });
      if (m) return m;

      // Priority 3: Exact Leader Match alone
      m = (sheetList || []).find((t) => {
        const tLeaderClean = clean(t['Member 1 (Leader)']);
        return tLeaderClean && tLeaderClean === stLeaderClean;
      });
      if (m) return m;

      // Priority 4: Exact Team Name Match where leader has some overlap
      m = (sheetList || []).find((t) => {
        const tNameClean = clean(t['Team Name']);
        const tLeaderClean = clean(t['Member 1 (Leader)']);
        if (tNameClean === stNameClean) {
          if (!tLeaderClean || !stLeaderClean) return true;
          return tLeaderClean.includes(stLeaderClean.slice(0, 4)) || stLeaderClean.includes(tLeaderClean.slice(0, 4));
        }
        return false;
      });
      if (m) return m;

      // Priority 5: Exact Team Name Match
      m = (sheetList || []).find((t) => clean(t['Team Name']) === stNameClean);
      if (m) return m;

      // Priority 6: Base Team Name match ONLY IF leader has overlap
      m = (sheetList || []).find((t) => {
        const tNameClean = clean(t['Team Name']);
        const tLeaderClean = clean(t['Member 1 (Leader)']);
        const baseT = tNameClean.replace(/20|2o/g, '');
        if (baseT === baseSt && baseT.length >= 4) {
          if (tLeaderClean && stLeaderClean) {
            return tLeaderClean.includes(stLeaderClean.slice(0, 4)) || stLeaderClean.includes(tLeaderClean.slice(0, 4));
          }
        }
        return false;
      });
      return m || null;
    })();

    const leaderName = (matchedTeam ? (matchedTeam['Member 1 (Leader)'] || team.leaderName) : team.leaderName).trim();
    const rawTeammates = matchedTeam
      ? [
        matchedTeam['Member 2'],
        matchedTeam['Member 3'],
        matchedTeam['Member 4'],
        matchedTeam['Member 5'],
        matchedTeam['Member 6'],
      ].filter(Boolean).map((s) => s.trim())
      : [];

    return generateSvgContent({
      teamName: team.teamName,
      leaderName,
      teammates: rawTeammates,
      sihLogo: SIH_LOGO_BASE64,
      srmuLogo: SRMU_LOGO_BASE64,
    });
  }, [team, liveSheetData]);

  // Convert SVG string to PNG on high-DPI canvas for downloading
  const handleDownload = () => {
    if (!svgString || isExporting) return;
    setIsExporting(true);

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      try {
        // 2x Retina resolution: 1360 x 1560 for crisp output
        const canvas = document.createElement('canvas');
        canvas.width = 1360;
        canvas.height = 1560;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1360, 1560);
        URL.revokeObjectURL(url);

        const a = document.createElement('a');
        const cleanName = team.teamName.replace(/[^a-zA-Z0-9]/g, '_');
        a.download = `SIH2026_Selected_${cleanName}.png`;
        a.href = canvas.toDataURL('image/png');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } finally {
        setIsExporting(false);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      setIsExporting(false);
    };

    img.src = url;
  };

  const handleShare = async () => {
    if (!svgString || isExporting) return;
    setIsExporting(true);

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = async () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1360;
        canvas.height = 1560;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 1360, 1560);
        URL.revokeObjectURL(url);

        canvas.toBlob(async (blob) => {
          setIsExporting(false);
          if (!blob) return handleDownload();
          const cleanName = team.teamName.replace(/[^a-zA-Z0-9]/g, '_');
          const file = new File([blob], `SIH2026_Selected_${cleanName}.png`, { type: 'image/png' });

          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
              await navigator.share({
                files: [file],
                title: `Team ${team.teamName} Selected in SIH 2026!`,
                text: `🎉 Team ${team.teamName} is officially selected in SIH 2026 Internal Round at Shri Ramswaroop Memorial University!`,
              });
              return;
            } catch (e) {
              console.log('Share dismissed', e);
            }
          }
          handleDownload();
        }, 'image/png');
      } catch (err) {
        setIsExporting(false);
        handleDownload();
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      setIsExporting(false);
    };

    img.src = url;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen || !team) return null;

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="share-modal-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="share-modal-header">
          <h3 className="share-modal-title">Selection Spotlight Card</h3>
          <p className="share-modal-subtitle">
            Official selection announcement card for <strong>{team.teamName}</strong> with all team members.
          </p>
        </div>

        {/* Live Card Preview - Renders Instantly */}
        <div className="share-preview-wrapper light-card-preview" ref={previewRef}>
          <div
            className="svg-render-container"
            dangerouslySetInnerHTML={{ __html: svgString }}
          />
        </div>

        {/* Action Buttons */}
        <div className="share-modal-actions">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="share-action-btn primary-download-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
            {isExporting ? 'Generating PNG...' : 'Download Image (PNG)'}
          </button>

          <button
            onClick={handleShare}
            disabled={isExporting}
            className="share-action-btn secondary-share-btn"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Share Card
          </button>
        </div>
      </div>
    </div>
  );
}
