---
title: 'Content Layer 구현 노트'
description: '파일 시스템 scan, frontmatter validation, Markdown 변환 흐름을 정리합니다.'
publishedAt: '2026-04-26'
tags: ['content-layer', 'typescript']
categories: ['architecture']
draft: false
pin: false
---

# Content Layer 구현 노트

첫 버전의 content layer는 작은 함수 중심으로 구성합니다.

- 파일명에서 slug를 만든다.
- frontmatter를 검증한다.
- Markdown 본문을 HTML로 변환한다.
