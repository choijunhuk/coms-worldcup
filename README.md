# COMS 월드컵

COMS 동아리 내부에서 공유하고 놀 수 있는 이상형 월드컵 MVP입니다. 개발 언어, 프레임워크, 프로젝트, 세미나 주제, 야식 메뉴, 개발자 밈, 에러 메시지, 동아리 활동 같은 주제로 확장할 수 있습니다.

기본 접속 주소는 `/worldcup`입니다. 한글 URL은 사용하지 않습니다.

## 주요 기능

- 월드컵 만들기: 제목, 설명, 카테고리, 4/8/16/32강, 항목 이름/설명/이미지/GIF/YouTube URL/태그 입력
- 샘플 월드컵: 개발 언어, 프레임워크, 야식 메뉴, 에러 메시지, COMS 세미나 주제, COMS 프로젝트
- 플레이: 현재 라운드, 현재 매치, 진행률, 카드 클릭/터치, A/ArrowLeft 및 D/ArrowRight 단축키, 이전 선택 되돌리기
- 결과: 우승자, 선택 기록, 다시 하기, 결과 복사, 공유 링크 생성
- COMS 계정 저장: 로그인 상태에서는 만든 월드컵과 결과를 내 프로필 저장소에 저장
- 앱 내부 로그인/로그아웃: 헤더에서 COMS 계정으로 바로 로그인하고 로그아웃
- 공유 모음: 공유한 월드컵과 결과를 `/worldcup/shared/:slug` 링크와 메인 공유 목록에서 조회
- 미디어: 이미지 파일 업로드, GIF 파일 업로드, 이미지/GIF URL, YouTube 링크 미리보기 지원
- 랭킹: localStorage 기반 우승 횟수, 결승 진출, 선택 횟수, 승률, 우승률

## 기술 스택

- Vite + React + TypeScript
- Tailwind CSS
- React Router
- localStorage 저장
- COMS 웹사이트 API 연동: `/api/auth/me`, `/api/files`, `/api/mini-apps/worldcup/*`
- Vitest 기반 엔진 테스트
- 정적 파일 배포

## 실행 방법

```bash
npm install
npm run dev
```

## 빌드 방법

```bash
npm run build
```

## 테스트

```bash
npm test
npm run typecheck
```

## COMS 계정 저장과 공유

이 앱은 프론트 단독으로도 동작하지만, `coms-website` 백엔드가 함께 배포되어 있으면 같은 도메인의 COMS 로그인 세션을 사용합니다.

- 로그인: `POST /api/auth/login`
- 로그아웃: `POST /api/auth/logout`
- 로그인 사용자 확인: `GET /api/auth/me`
- 만료 세션 복구: `POST /api/auth/refresh`
- 내 프로필 저장: `PUT /api/mini-apps/worldcup/profile/{template|result}/{id}`
- 내 저장 목록: `GET /api/mini-apps/worldcup/profile`
- 공유 발행: `POST /api/mini-apps/worldcup/profile/{template|result}/{id}/share`
- 공유 목록: `GET /api/mini-apps/worldcup/shared`
- 공유 상세: `GET /api/mini-apps/worldcup/shared/{slug}`
- 이미지/GIF 업로드: `POST /api/files`

로그인하지 않았거나 API를 사용할 수 없는 환경에서는 기존 localStorage 저장과 텍스트 복사 기능으로 fallback합니다. 로그인과 로그아웃은 `/worldcup/` 앱 헤더에서 처리하며, 공유 링크는 `https://coms.kw.ac.kr/worldcup/shared/{slug}` 형식입니다.

## 미디어 입력

- 이미지 URL과 GIF URL은 그대로 카드 미디어로 렌더링합니다.
- YouTube URL은 embed URL로 변환해 카드에서 미리보기로 표시합니다.
- 파일 업로드는 COMS 서버 파일 API에 저장한 뒤 `/api/files/{id}/inline` URL을 사용합니다.
- 외부 API나 유료 API는 사용하지 않습니다.

## 배포 방법

GitHub Actions는 `main` 브랜치 push 시 자동 실행됩니다.

1. checkout
2. Node 22 설치
3. `npm ci`
4. `npm run build`
5. SSH key 등록
6. 서버에 `/var/www/coms-worldcup` 생성
7. `rsync`로 `dist/` 업로드

GitHub Secrets에 다음 값을 등록해야 합니다.

- `SSH_HOST`
- `SSH_USER` (기본값 가정: `kw`)
- `SSH_KEY`
- `SSH_PORT` (기본값 가정: `22`)

`dist` 폴더가 서버의 `/var/www/coms-worldcup`로 업로드됩니다.

## Nginx 설정 예시

아래는 COMS 서버에서 두 독립 서비스를 함께 연결할 때의 공통 예시입니다. 이 레포가 직접 배포하는 경로는 `/worldcup/`이며, `/tier/` 블록은 함께 운영될 `coms-tier`용 참고입니다. Nginx에서 `/worldcup/`와 `/tier/`를 각각 정적 빌드 디렉토리로 `alias` 처리합니다. `alias`를 사용할 때는 `location ^~ /worldcup/`와 `alias /var/www/coms-worldcup/`처럼 양쪽 끝의 `/`를 맞춰야 합니다. `/worldcup`로 접속하면 `/worldcup/`로 redirect되게 설정합니다.

```nginx
location = /worldcup {
    return 301 /worldcup/;
}

location ^~ /worldcup/ {
    alias /var/www/coms-worldcup/;
    try_files $uri $uri/ /worldcup/index.html;
}

location = /tier {
    return 301 /tier/;
}

location ^~ /tier/ {
    alias /var/www/coms-tier/;
    try_files $uri $uri/ /tier/index.html;
}
```

## Vite base와 React Router basename

배포 경로와 반드시 일치해야 합니다.

- Vite `base`: `/worldcup/`
- React Router `basename`: `/worldcup`

이 값이 다르면 정적 자산 경로나 새로고침 라우팅이 깨질 수 있습니다.

## 폴더 구조

```txt
src/
  main.tsx
  App.tsx
  routes/
    HomePage.tsx
    CreateWorldCupPage.tsx
    PlayWorldCupPage.tsx
    ResultPage.tsx
    RankingPage.tsx
    SharedWorldCupPage.tsx
  components/
    Layout.tsx
    WorldCupCard.tsx
    WorldCupList.tsx
    WorldCupForm.tsx
    MatchView.tsx
    ProgressBar.tsx
    ResultCard.tsx
    RankingTable.tsx
    EmptyState.tsx
  lib/
    media.ts
    miniApi.ts
    worldcupEngine.ts
    storage.ts
    sampleData.ts
    share.ts
  types/
    worldcup.ts
```

## localStorage 데이터 구조

- `coms-worldcup:templates`: 사용자가 만든 `WorldCupTemplate[]`
- `coms-worldcup:results`: 플레이 완료 후 저장되는 `WorldCupResult[]`

랭킹은 `WorldCupResult[]`를 읽어 `lib/worldcupEngine.ts`의 `calculateRankings`에서 계산합니다. COMS 서버 저장소는 같은 payload를 `mini_app_documents`에 JSON으로 저장하므로, 서버 DB 랭킹으로 옮길 때도 이 계산 함수를 기준으로 API 응답을 설계하면 됩니다.

서버 저장 문서 개념:

- `app`: `worldcup`
- `contentType`: `template` 또는 `result`
- `contentId`: 템플릿/결과 ID
- `payload`: `WorldCupTemplate` 또는 `WorldCupResult`
- `shared`: 공유 목록 노출 여부
- `shareSlug`: 공유 상세 링크 식별자

## 향후 개선 아이디어

- 서버 기반 전체 랭킹
- 댓글 기능
- 좋아요 기능
- 결과 이미지 다운로드
- 카카오톡/디스코드 공유
- 관리자 신고/삭제 기능
- 인기순 랭킹
- 실제 COMS 회원만 작성 가능하게 제한
- 관리자 페이지 추가
