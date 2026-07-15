# SPEC-323 : Asset Aggregate Implementation

Version: 0.1
Status: Approved
Date: 2026-07-15

---

# 목표

Asset Aggregate의 구현 계약을 정의한다.

---

# 경계

- Aggregate Root: Asset
- Value Object: AssetType, AssetMetadata
- Entity: 없음

---

# 명령

- RegisterAsset(projectId, type, uri, metadata?)
- UpdateAssetMetadata(id, metadata)
- RetireAsset(id)

---

# 조회

- GetAsset(id)
- ListAssets(projectId, type?)

---

# 이벤트

- AssetRegistered
- AssetMetadataUpdated
- AssetRetired

---

# 규칙

- uri는 비어 있을 수 없다.
- type은 image | video | audio | text 중 하나.
- retire 후에는 수정할 수 없다.

---

# 패키지 구조

packages/core/src/domain/asset/
- AssetType.ts
- AssetMetadata.ts
- AssetRepository.ts

packages/core/src/application/
- command/AssetCommand.ts
- query/AssetQuery.ts

packages/core/src/infrastructure/repository/
- InMemoryAssetRepository.ts
