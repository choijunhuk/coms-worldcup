import type { WorldCupCategory, WorldCupItem, WorldCupTemplate } from "../types/worldcup";

const now = "2026-06-19T00:00:00.000Z";

const item = (id: string, name: string, description: string, tags: string[] = []): WorldCupItem => ({
  id,
  name,
  description,
  tags,
});

const template = (
  id: string,
  title: string,
  description: string,
  category: WorldCupCategory,
  items: WorldCupItem[],
): WorldCupTemplate => ({
  id,
  title,
  description,
  category,
  items,
  targetSize: 8,
  createdAt: now,
  updatedAt: now,
  isSample: true,
});

export const sampleWorldCupItems: WorldCupItem[] = [
  item("typescript", "TypeScript", "타입과 자동완성으로 밤샘 디버깅을 줄여주는 언어", ["frontend", "type"]),
  item("python", "Python", "아이디어를 빠르게 코드로 바꾸기 좋은 만능 도구", ["ai", "script"]),
  item("java", "Java", "COMS 백엔드 토론에서 늘 빠지지 않는 안정적인 선택", ["backend"]),
  item("rust", "Rust", "무섭지만 믿음직한 시스템 프로그래밍 언어", ["systems"]),
  item("go", "Go", "단순한 문법으로 서버를 빠르게 밀어붙이는 언어", ["server"]),
  item("kotlin", "Kotlin", "Android와 JVM 세계를 조금 더 산뜻하게 만드는 언어", ["android"]),
  item("cpp", "C++", "알고리즘과 성능 이야기의 고전 강자", ["algorithm"]),
  item("javascript", "JavaScript", "결국 브라우저에서 모두가 다시 만나는 언어", ["web"]),
];

export const sampleWorldCups: WorldCupTemplate[] = [
  template("sample-language", "개발 언어 월드컵", "COMS 구성원이 가장 좋아하는 개발 언어를 고릅니다.", "language", sampleWorldCupItems),
  template("sample-framework", "프레임워크 월드컵", "프로젝트를 시작할 때 먼저 떠오르는 프레임워크 대결입니다.", "framework", [
    item("react", "React", "컴포넌트로 UI를 쌓아 올리는 COMS 단골 선택", ["frontend"]),
    item("spring", "Spring Boot", "든든한 서버와 API를 빠르게 구성하는 백엔드 표준", ["backend"]),
    item("next", "Next.js", "라우팅과 렌더링을 함께 가져가는 풀스택 React", ["fullstack"]),
    item("vite", "Vite", "빠른 개발 서버로 프로젝트 시작을 가볍게 만드는 도구", ["tooling"]),
    item("django", "Django", "관리자와 ORM까지 빠르게 갖추는 Python 웹 프레임워크", ["backend"]),
    item("flutter", "Flutter", "하나의 코드로 모바일 화면을 밀도 있게 만드는 선택", ["mobile"]),
    item("tailwind", "Tailwind CSS", "클래스 조합으로 빠르게 UI를 정리하는 CSS 도구", ["design"]),
    item("express", "Express", "Node 서버를 간단하게 시작하는 미니멀 프레임워크", ["node"]),
  ]),
  template("sample-food", "야식 메뉴 월드컵", "세미나 뒤에 가장 설득력 있는 야식을 뽑습니다.", "food", [
    item("chicken", "치킨", "말이 필요 없는 회식형 야식", ["classic"]),
    item("pizza", "피자", "조각 단위로 평화를 지키는 메뉴", ["share"]),
    item("tteokbokki", "떡볶이", "매운맛으로 프로젝트 피로를 깨우는 선택", ["spicy"]),
    item("burger", "버거", "빠르게 먹고 다시 코딩하기 좋은 메뉴", ["quick"]),
    item("ramen", "라면", "새벽 디버깅의 상징", ["late-night"]),
    item("jokbal", "족발", "긴 회의 뒤에 존재감 있는 선택", ["party"]),
    item("sushi", "초밥", "조용하지만 만족도 높은 선택", ["clean"]),
    item("sandwich", "샌드위치", "가볍게 먹고 세미나로 돌아가기 좋은 메뉴", ["light"]),
  ]),
  template("sample-error", "개발자 에러 메시지 월드컵", "가장 기억에 남는 에러 메시지를 고릅니다.", "error", [
    item("undefined", "Cannot read properties of undefined", "자바스크립트가 건네는 익숙한 인사", ["js"]),
    item("null-pointer", "NullPointerException", "객체가 없다는 사실을 늦게 알려주는 메시지", ["java"]),
    item("segfault", "Segmentation fault", "C/C++ 세계의 묵직한 경고", ["cpp"]),
    item("cors", "CORS policy blocked", "프론트와 백엔드가 처음 만날 때 자주 생기는 장벽", ["web"]),
    item("merge", "Merge conflict", "협업의 흔적이자 잠깐의 퍼즐", ["git"]),
    item("port", "Port already in use", "누군가 이미 서버를 켜둔 상태", ["dev"]),
    item("timeout", "Request timed out", "기다림 끝에 돌아온 무응답", ["network"]),
    item("module", "Module not found", "경로 하나가 프로젝트를 멈추게 하는 순간", ["build"]),
  ]),
  template("sample-seminar", "COMS 세미나 주제 월드컵", "다음 세미나에서 듣고 싶은 주제를 고릅니다.", "seminar", [
    item("react-state", "React 상태 관리", "복잡한 화면 상태를 정리하는 방법", ["frontend"]),
    item("spring-security", "Spring Security", "로그인과 권한을 안전하게 다루는 방법", ["backend"]),
    item("docker", "Docker 배포", "로컬과 서버 환경을 맞추는 실전 배포", ["infra"]),
    item("testing", "테스트 전략", "빨리 깨지는 코드를 빨리 찾는 습관", ["quality"]),
    item("database", "DB 인덱싱", "쿼리 속도를 바꾸는 기본기", ["database"]),
    item("ai", "AI API 활용", "프로덕트 안에 AI 기능을 넣는 방법", ["ai"]),
    item("design-system", "디자인 시스템", "반복되는 UI를 일관되게 만드는 방법", ["design"]),
    item("security", "웹 보안 입문", "취약점을 실제 코드 기준으로 보는 시간", ["security"]),
  ]),
  template("sample-project", "COMS 프로젝트 월드컵", "COMS에서 만들어보고 싶은 프로젝트 주제를 고릅니다.", "project", [
    item("study-matcher", "스터디 매칭", "관심 분야와 시간을 기준으로 팀을 이어주는 서비스", ["community"]),
    item("seminar-archive", "세미나 아카이브", "자료와 영상을 오래 남기는 저장소", ["archive"]),
    item("club-dashboard", "동아리 활동 대시보드", "활동, 출석, 프로젝트를 한눈에 보는 도구", ["ops"]),
    item("bug-arena", "버그 아레나", "에러 해결 기록을 게임처럼 공유하는 공간", ["fun"]),
    item("portfolio-lab", "포트폴리오 랩", "프로젝트 정리를 도와주는 전시형 도구", ["career"]),
    item("algorithm-league", "알고리즘 리그", "문제 풀이를 시즌제로 즐기는 서비스", ["algorithm"]),
    item("food-vote", "야식 투표", "모임 전 메뉴 결정을 덜 싸우게 만드는 도구", ["food"]),
    item("meme-board", "개발자 밈 게시판", "COMS 내부 농담을 가볍게 모으는 공간", ["meme"]),
  ]),
];

export const findSampleWorldCup = (id: string): WorldCupTemplate | undefined =>
  sampleWorldCups.find((worldCup) => worldCup.id === id);
