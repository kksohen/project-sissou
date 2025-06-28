//three, shader 관련
export const CONSTANTS = {
  PIXEL_DENSITY: 1.5,
  CAMERA_FOV: 45,
  CAMERA_POSITION: { x: 0, y: 0, z: -0.4},
  SPHERE_COUNT: 30,
  LOGO_RADIUS: 2,
  EASING_FACTORS: {
    LOGO_ROTATION: 0.05,
    MESH_POSITION: 0.1,
    MESH_ROTATION: 0.03,
    SPHERE_POSITION: 0.1
  },
  FADE_DURATION: 300,
} as const;

//search, menu links(현재 동일한 링크 사용 중)
export const links = [
  { href: "/", label: "제로", key: "zero" },
  { href: "/", label: "Prologue", key: "prologue" },
  { href: "/exhibition-born", label: "기", key: "gi" },
  { href: "/exhibition-born", label: "Born", key: "born"},
  { href: "/exhibition-growth", label: "승", key: "seung" },
  { href: "/exhibition-growth", label: "Growth", key: "growth"},
  { href: "/portfolio", label: "간", key: "gan" },
  { href: "/portfolio", label: "Intermission", key: "intermission" },
  { href: "/exhibition-climax", label: "전", key: "jeon" },
  { href: "/exhibition-climax", label: "Climax", key: "climax" },
  { href: "/exhibition-end", label: "결", key:"end" },
  { href: "/exhibition-end", label: "End : Da Capo", key: "daCapo" },
  { href: "/brand", label: "후일담", key: "epilogue" },
  { href: "/brand", label: "Epilogue : Behind", key: "behind" },
  { href: "/community", label: "커뮤니티", key: "comm" },
  { href: "/community", label: "Community", key: "community" },
  { href: "/goods", label: "굿즈", key:"good" },
  { href: "/goods", label: "Goods", key:"goods" },
  { href: "/contact", label: "컨택", key:"cont" },
  { href: "/contact", label: "Contact", key:"contact" },
];