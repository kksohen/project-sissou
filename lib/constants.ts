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
  { href: "/", label: "공", key: "zero" },
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
  { href: "/brand", label: "록", key: "epilogue" },
  { href: "/brand", label: "Epilogue : Behind", key: "behind" },
  { href: "/community", label: "장", key: "comm" },
  { href: "/community", label: "Community", key: "community" },
  { href: "/goods", label: "형", key:"good" },
  { href: "/goods", label: "Goods", key:"goods" },
  { href: "/contact", label: "교", key:"cont" },
  { href: "/contact", label: "Contact", key:"contact" },
];

//유효성 체크 정의
export const USERNAME_MIN_LENGTH = 2;
export const USERNAME_MIN_LENGTH_ERROR = "이름은 최소 2자 이상이어야 합니다.";
export const USERNAME_REGEX = new RegExp(/^[가-힣a-zA-Z0-9._\-]+$/);

export const EMAIL_ERROR = "유효한 이메일 형식이 아닙니다.";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MIN_LENGTH_ERROR = "비밀번호는 최소 8자 이상이어야 합니다.";
export const PASSWORD_REGEX = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*?[#?!@$%^&*-]).+$/);
export const PASSWORD_REGEX_ERROR = "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.";

export const POST_MAX_LENGTH_ERROR = "제목은 15자 이내로 작성해주세요.";
export const POST_MIN_LENGTH_ERROR = "제목은 최소 2자 이상이어야 합니다.";