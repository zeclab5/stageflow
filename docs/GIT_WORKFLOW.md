# GIT_WORKFLOW

## Branch Strategy
- main: 항상 배포 가능 상태
- 기능 작업은 main에서 직접 진행
- PR은 선택적, 직접 push 허용

## Branch Naming Rules
- feature/{description}
- fix/{description}
- docs/{description}
- chore/{description}

## Commit Message Convention
- chore: 빌드/문서/설정 변경
- feat: 기능 추가
- fix: 버그 수정
- docs: 문서 변경
- refactor: 기능 변경 없는 구조 개선
- test: 테스트 추가/수정

## Pull Request Rules
- build/lint/test 필수 통과
- 변경 범위 최소화

## Code Review Process
- 기본: AI 자동 검증
- 주요 변경: 사용자 확인 후 push

## Merge Policy
- main 머지 후 즉시 배포 가능 상태 유지
- breaking change는 메이저 버전 명시

## Release Flow
- main 머지 → Vercel production 배포
- 태그는 필요시 생성

## Tagging Rules
- v{major}.{minor}.{patch}
- 예: v0.1.0

## Versioning Strategy
- SemVer 기본
- Alpha: 0.x.y
- Prod-ready: 1.0.0+
