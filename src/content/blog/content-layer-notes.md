---
title: 'Content Layer 구현 노트'
description: '파일 시스템 scan, frontmatter validation, Markdown 변환 흐름을 정리합니다.'
publishedAt: '2026-04-26'
tags: ['content-layer', 'typescript']
category: 'architecture'
draft: false
pin: false
---

# Content Layer 구현 노트

첫 버전의 content layer는 작은 함수 중심으로 구성합니다.

## Markdown 처리 흐름

- 파일명에서 slug를 만든다.
- frontmatter를 검증한다.
- Markdown 본문을 HTML로 변환한다.

### 공개 데이터

클라이언트에는 목록과 상세 화면에 필요한 데이터만 전달합니다.

## 렌더링 예시

```ts
type BlogPostSummary = {
	slug: string;
	title: string;
	publishedAt: Date;
};
```
