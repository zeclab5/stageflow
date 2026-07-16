# DOCUMENTATION_STANDARD

## Objective
모든 Product 문서의 품질과 일관성을 보장한다.

## Heading 규칙
- H1: 문서 제목 1개만 사용
- H2: 섹션 단위
- H3: 하위 항목

## Table 규칙
- 표는 필수 Header 포함
- 정렬 최소화, 필요한 경우만 사용

## List 규칙
- 항목은 간결하게 1줄
- 하위 리스트는 최대 2단계

## Code Block 규칙
- 언어 명시
- 불필요한 긴 출력은 생략

## Mermaid 사용 규칙
- 다이어그램은 필요시 사용
- 이미지 자동 생성 의존하지 않음

## Emoji 사용 규칙
- 최소화
- 상태 표기용으로만 제한

## File Naming Rule
- UPPER_SNAKE_CASE.md
- Product 문서는 `docs/product/` 하위

## Folder Naming Rule
- `snake_case`
- `docs/product/`, `docs/adr/`, `docs/rfc/`

## Link Rule
- 상대 경로 우선
- 외부 링크는 가능하면 명시

## Image Rule
- 가능한 텍스트 설명 우선
- 이미지 경로는 `docs/assets/`

## Markdownlint
- `.markdownlint.json` 설정
- 새 문서는 lint 통과 필수

## Review Rule
- Draft → Review → Approved
- Markdownlint 통과 후 CTO Review

## Status
- Draft
- Review
- Approved
- Deprecated
- Archived

## Front Matter 규칙
- Title, Version, Status, Author, Reviewer, Created, Updated, Category, Tags
