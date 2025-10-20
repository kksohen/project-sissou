"use server";
import { readFileSync } from "fs";
import { join } from "path";
import { getPlaiceholder } from "plaiceholder";
import sharp from "sharp";

const defaultBlur =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bmarshallxqEtTjHPw==";

//Image Blur
async function getImgBlurPlaceholder(src: string) {
  try {
    let buffer: Buffer;

    if (src.startsWith("/")) {
      const path = join(process.cwd(), "public", src);
      buffer = readFileSync(path);
    } else {
      const res = await fetch(src);
      if (!res.ok) return defaultBlur;
      buffer = Buffer.from(await res.arrayBuffer());
    }

    const { base64 } = await getPlaiceholder(buffer, { size: 8 });

    return base64;
  } catch (error) {
    console.error(error);
    return defaultBlur;
  }
}

//Image pixelate
async function getImgPlaceholder(src: string) {
  try {
    let buffer: Buffer;

    if (src.startsWith("/")) {
      //상대 경로
      const path = join(process.cwd(), "public", src);
      buffer = readFileSync(path);
    } else {
      //절대 경로
      const res = await fetch(src);
      if (!res.ok) return defaultBlur;
      buffer = Buffer.from(await res.arrayBuffer());
    }

    const pixelBuffer = await sharp(buffer)
      .resize(40, 50, {
        kernel: "nearest",
        fit: "fill",
      })
      .png()
      .toBuffer();

    const base64 = `data:image/png;base64,${pixelBuffer.toString("base64")}`;

    return base64;
  } catch (error) {
    console.error(error);
    return defaultBlur;
  }
}

export type WorkCategory = "graphic" | "web-app" | "branding" | "motion";
export interface IWork {
  id: number;
  date: string;
  title: string;
  type: string;
  project: string;
  tools: string[];
  desc: string;
  image: string;
  pixel: string;
  category: readonly WorkCategory[];
  detailImages: string[];
  photoBlur?: string[];

  video?: string[];
}

const allWorks: IWork[] = [
  //motion category
  {
    id: 11,
    date: "2024",
    title: "총",
    type: "Interactive Art",
    project: "Personal",
    tools: ["Blender", "P5JS", "MediaPipe"],
    desc: "P5JS와 MediaPipe를 활용한 인터랙티브 아트워크로, 사용자의 손동작을 인식해 총을 쏠 수 있습니다. 모드를 바꿔가며 화면을 향해 두 손가락으로 총을 겨누어보세요!",
    image: "/assets/images/mockup/p53-thum.jpg",
    pixel: "",
    category: ["motion"] as const,
    detailImages: [],
  },
  {
    id: 10,
    date: "2024",
    title: "대칭 드로잉",
    type: "Interactive Art",
    project: "Personal",
    tools: ["P5JS"],
    desc: "P5JS로 제작한 대칭 드로잉 툴입니다. 캔버스 위에서 마우스 드래그 시 흩뿌려지는 입자 브러시가 데칼코마니 혹은 만화경의 형태로 그려집니다.",
    image: "/assets/images/mockup/p51-thum.jpg",
    pixel: "",
    category: ["motion"] as const,
    detailImages: [],
  },
  {
    id: 9,
    date: "2024",
    title: "TouchDesigner",
    type: "Interactive Art",
    project: "Personal",
    tools: ["TouchDesigner"],
    desc: "TouchDesigner로 제작한 인터랙티브 아트워크로, 사용자의 움직임을 감지해 잔상과 더불어 여러 왜곡 현상을 일으킵니다.",
    image: "/assets/images/mockup/touch-thum.jpg",
    pixel: "",
    category: ["motion"] as const,
    detailImages: ["/assets/images/mockup/touch-1.jpg"],
    video: [
      "/assets/images/mockup/touch-1.mp4",
      "/assets/images/mockup/touch-2.mp4",
      "/assets/images/mockup/touch-3.mp4",
      "/assets/images/mockup/touch-4.mp4",
    ],
  },
  //web-app category
  //web-app, branding category
  {
    id: 8,
    date: "2024",
    title: "Lucky One",
    type: "UXUI Design",
    project: "Personal",
    tools: ["Cinema 4D", "Figma", "Photoshop", "Illustration"],
    desc: "AR · RPG 요소를 결합한 셀프 멘탈케어를 위한 챌린지형 작물 재배 · 수확 앱입니다. 스마트폰과 연동해 사용자의 생체리듬과 감정을 분석하며, 진행 상황 공유 및 지인과 함께 수행할 수 있는 프로그램을 구성해 지속적인 참여를 유도합니다.",
    image: "/assets/images/mockup/luckyone-thum.jpg",
    pixel: "",
    category: ["web-app", "branding"] as const,
    detailImages: [
      "/assets/images/mockup/luckyone-1.jpg",
      "/assets/images/mockup/luckyone-2.jpg",
      "/assets/images/mockup/luckyone-3.gif",
      "/assets/images/mockup/luckyone-4.jpg",
      "/assets/images/mockup/luckyone-5.jpg",
      "/assets/images/mockup/luckyone-6.jpg",
    ],
  },
  //graphic category
  {
    id: 7,
    date: "2025",
    title: "Animal Farm",
    type: "Book Cover Design",
    project: "Personal",
    tools: ["Photoshop", "Illustration"],
    desc: "조지 오웰의 『동물농장』 책 커버 디자인으로, 주요 등장인물과 배경 요소를 그래픽으로 표현했습니다.",
    image: "/assets/images/mockup/animal-thum.jpg",
    pixel: "",
    category: ["graphic"] as const,
    detailImages: [
      "/assets/images/mockup/animal-1.jpg",
      "/assets/images/mockup/animal-2.jpg",
      "/assets/images/mockup/animal-3.jpg",
    ],
  },
  {
    id: 6,
    date: "2025",
    title: "1984",
    type: "Book Cover Design",
    project: "Personal",
    tools: ["Photoshop", "Illustration"],
    desc: "조지 오웰의 『1984』 책 커버 디자인으로, 슬로건과 상징 요소를 그래픽으로 표현했습니다.",
    image: "/assets/images/mockup/1984-thum.jpg",
    pixel: "",
    category: ["graphic"] as const,
    detailImages: [
      "/assets/images/mockup/1984-1.jpg",
      "/assets/images/mockup/1984-2.jpg",
      "/assets/images/mockup/1984-3.jpg",
    ],
  },
  {
    id: 5,
    date: "2025",
    title: "Этажи",
    type: "Vinyl Album Design",
    project: "Personal",
    tools: ["Photoshop", "Illustration"],
    desc: "몰찻도마의 『Etazhi』 앨범 패키지 디자인으로, 추상적인 그래픽 요소와 모서리가 뾰족한 타이포그래피를 통해 타이틀곡 「Sudno」 의 배경인 병실 내부의 경직된 분위기와 앨범 제목 ‘복층 건물’의 기하학적 구조를 시각화했습니다.",
    image: "/assets/images/mockup/etazhi-thum.jpg",
    pixel: "",
    category: ["graphic"] as const,
    detailImages: [
      "/assets/images/mockup/etazhi-1.jpg",
      "/assets/images/mockup/etazhi-2.jpg",
      "/assets/images/mockup/etazhi-3.jpg",
      "/assets/images/mockup/etazhi-4.jpg",
      "/assets/images/mockup/etazhi-5.jpg",
      "/assets/images/mockup/etazhi-6.jpg",
    ],
  },
  {
    id: 4,
    date: "2025",
    title: "RusKor",
    type: "Type Design",
    project: "Personal",
    tools: ["Illustration"],
    desc: "러시아어를 입문하는 한국인을 위해 키릴 문자의 발음기호에 부합하는 한글의 자모음을 배치하고, 한글의 시각적 형태를 활용하여 러시아어 발음을 연상시키며 쉽게 익숙해질 수 있는 문자를 디자인했습니다.",
    image: "/assets/images/mockup/ruskor-thum.jpg",
    pixel: "",
    category: ["graphic"] as const,
    detailImages: [
      "/assets/images/mockup/ruskor-1.jpg",
      "/assets/images/mockup/ruskor-2.jpg",
      "/assets/images/mockup/ruskor-3.jpg",
      "/assets/images/mockup/ruskor-4.jpg",
      "/assets/images/mockup/ruskor-5.jpg",
    ],
  },
  {
    id: 3,
    date: "2024",
    title: "2024年13月",
    type: "Poster Design",
    project: "Personal",
    tools: ["Illustration"],
    desc: "2024년을 보내며 한 해를 마무리하는 포스터를 제작했습니다.",
    image: "/assets/images/mockup/newyear-thum.jpg",
    pixel: "",
    category: ["graphic"] as const,
    detailImages: [
      "/assets/images/mockup/newyear-1.jpg",
      "/assets/images/mockup/newyear-2.jpg",
      "/assets/images/mockup/newyear-3.jpg",
    ],
  },
  {
    id: 2,
    date: "2022",
    title: "에코의 에-코",
    type: "Magazine Design",
    project: "Personal",
    tools: ["Cinema 4D", "InDesign", "Photoshop", "Illustration"],
    desc: "Eco와 Echo가 만나 ‘생태의 메아리’라는 의미를 지닌 《에코의 에-코의 에-코》 는 친환경 라이프에 관한 이야기를 담은 매거진입니다. 파동을 시각화한 타이포그래피와 자연의 울림이 퍼져나가는 그래픽 연출을 통해 주제를 표현했습니다.",
    image: "/assets/images/mockup/eco-thum.jpg",
    pixel: "",
    category: ["graphic"] as const,
    detailImages: [
      "/assets/images/mockup/eco-1.jpg",
      "/assets/images/mockup/eco-2.jpg",
      "/assets/images/mockup/eco-3.jpg",
      "/assets/images/mockup/eco-4.jpg",
    ],
  },
  {
    id: 1,
    date: "2020",
    title: "조화",
    type: "Poster Design",
    project: "Personal",
    tools: ["Illustration"],
    desc: "‘조화’라는 단어에 내포된 다채로움과 희망을 표현한 포스터 연작입니다.",
    image: "/assets/images/mockup/nothing-thum.jpg",
    pixel: "",
    category: ["graphic"] as const,
    detailImages: [
      "/assets/images/mockup/nothing-1.jpg",
      "/assets/images/mockup/nothing-2.jpg",
    ],
  },
];

export async function getWorksWithBlur(
  category: IWork["category"][0]
): Promise<IWork[]> {
  const filterWorks = allWorks.filter((work) =>
    work.category.includes(category)
  );

  const worksWithBlur = await Promise.all(
    filterWorks.map(async (work) => {
      try {
        const pixel = await getImgPlaceholder(work.image);

        return { ...work, pixel };
      } catch (error) {
        console.error(error);
        return { ...work, pixel: "" };
      }
    })
  );

  return worksWithBlur;
}

//id 불러오기
export async function getWorkById(
  id: number,
  category?: IWork["category"][0]
): Promise<IWork | null> {
  try {
    let targetWorks: IWork[];

    if (category) {
      targetWorks = allWorks.filter((work) => work.category.includes(category));
    } else {
      targetWorks = allWorks;
    }

    const work = targetWorks.find((w) => w.id === id);
    if (!work) return null;

    const detailImgWithBlur = await Promise.all(
      work.detailImages.map(async (url: string) => {
        return getImgBlurPlaceholder(url);
      })
    );

    return {
      ...work,
      photoBlur: detailImgWithBlur,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}

//게시글에서 같은 카테고리 내의 다른 게시물들 받아오기
export async function getOtherWorks(
  category: IWork["category"][0],
  excludeId?: number
) {
  try {
    //같은 카테고리 내 현재 게시글 제외 다 불러오기
    const works = allWorks
      .filter(
        (work) => work.category.includes(category) && work.id !== excludeId
      )
      .sort((a, b) => b.id - a.id);

    //년도 별 그룹
    const group: Record<string, Array<{ id: number; title: string }>> = {};

    works.forEach((work) => {
      const year = work.date;

      if (!group[year]) {
        group[year] = [];
      }

      group[year].push({
        id: work.id,
        title: work.title,
      });
    });

    //내림차순
    const sort = Object.keys(group).sort((a, b) => parseInt(b) - parseInt(a));

    return sort.map((year) => ({
      year,
      works: group[year],
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}
