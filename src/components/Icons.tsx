import type { SVGProps, ReactNode } from 'react';

type Props = SVGProps<SVGSVGElement>;

const makeIcon = (path: ReactNode, viewBox = '0 0 24 24') =>
  (props: Props) => (
    <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth={1.6}
         strokeLinecap="round" strokeLinejoin="round" {...props}>
      {path}
    </svg>
  );

export const Plane2 = makeIcon(
  <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1L15 22v-1.5L13 19v-5.5l8 2.5z" />
);
export const Map = makeIcon(
  <><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14"/><path d="M15 6v14"/></>
);
export const Grid = makeIcon(
  <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>
);
export const Search = makeIcon(
  <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5"/></>
);
export const Network = makeIcon(
  <><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5L6.5 17M12 7.5L17.5 17M7.5 19h9"/></>
);
export const Stats = makeIcon(
  <><path d="M3 21h18"/><rect x="5" y="13" width="3" height="6"/><rect x="11" y="9" width="3" height="10"/><rect x="17" y="5" width="3" height="14"/></>
);
export const Plus = makeIcon(<><path d="M12 5v14M5 12h14"/></>);
export const List = makeIcon(
  <><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></>
);
export const ArrowRight = makeIcon(<path d="M5 12h14M13 6l6 6-6 6"/>);
export const ZoomIn = makeIcon(
  <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5M11 8v6M8 11h6"/></>
);
export const ZoomOut = makeIcon(
  <><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.5-4.5M8 11h6"/></>
);
export const Reset = makeIcon(
  <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></>
);
export const Check = makeIcon(<path d="M5 12l5 5L20 7"/>);
export const X = makeIcon(<><path d="M6 6l12 12M18 6L6 18"/></>);
export const Trash = makeIcon(
  <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/></>
);
export const Ticket = makeIcon(
  <><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M15 7v10M12 10h.01M12 14h.01"/></>
);
export const Compass = makeIcon(
  <><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5L13 13l-4.5 2.5L11 11l4.5-2.5z" fill="currentColor" stroke="none"/></>
);
