# 멤버십 및 포인트 관리 시스템

React와 Spring Boot 기반의 멤버십 및 포인트 관리 시스템입니다.  
RESTful API 설계를 바탕으로 TDD, CI/CD, 클라우드 배포, 서버리스 함수를 활용하여 개발 및 배포 환경을 구현한 서비스 입니다.  
단순한 멤버십 관리 및 포인트 관리 기능을 구현하였으며, 확장성을 고려하여 추가 개발 계획을 포함하고 있습니다.

---

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [프로젝트 초기 구조](#프로젝트-초기-구조)
4. [API 명세](#api-명세)
5. [구현 및 배포 단계](#구현-및-배포-단계)
6. [테스트](#테스트)
7. [CI/CD 파이프라인](#cicd-파이프라인)
8. [클라우드 배포](#클라우드-배포)
9. [추가 개발 계획](#추가-개발-계획)
10. [기여 방법](#기여-방법)

---

## 프로젝트 개요
### 목적
- 고객 멤버십 관리 및 포인트 적립/사용 기능 제공.
- RESTful API와 React 프론트엔드의 결합.
- CI/CD 및 Google Cloud 환경을 통한 자동화된 배포 실현.

### 주요 기능
1. **멤버십 관리**: 사용자 정보 CRUD.
2. **포인트 관리**: 적립/사용/조회 기능.
3. **포인트 만료 알림**: Google Cloud Functions와 Scheduler를 활용한 이벤트 기반 서비스.

---

## 기술 스택
- **백엔드**: Spring Boot 3.4.0, Java 21
- **프론트엔드**: React 18.x, TypeScript
- **데이터베이스**: H2 (테스트), Oracle 23c (프로덕션)
  - 마이그레이션 도구: Flyway
- **클라우드**: Google Cloud (GCE, Cloud Storage, Cloud Functions, Google Cloud Scheduler + Pub/Sub)
- **CI/CD**: GitHub Actions + gcloud CLI
- **테스트 도구**: JUnit 5, Mockito, JaCoCo, Cypress/Selenium
- **API 문서화**: Swagger (OpenAPI 3.0)

---

## 프로젝트 초기 구조

### 백엔드 (Spring Boot)
```
src/
├── main/
│   ├── java/com/challenge/membership/
│   │   ├── controller/        # REST API 엔드포인트
│   │   ├── service/           # 비즈니스 로직 처리
│   │   ├── repository/        # JPA 기반 데이터 액세스
│   │   ├── model/             # 엔티티 및 DTO 클래스
│   │   ├── config/            # 프로젝트 설정 (SecurityConfig 등)
|   |   └── exception/         # 전역 예외 처리 및 커스텀 예외 클래스
│   └── resources/
│       ├── application.yml    # 환경별 설정 (DB 연결 등)
│       └── static/            # 정적 리소스
├── test/
│   └── java/com/challenge/membership/
```

### 프론트엔드 (React)
```
src/
├── components/
│   ├── Membership/            # 멤버십 관련 컴포넌트
│   ├── Points/                # 포인트 관련 컴포넌트
├── pages/
│   ├── Home.tsx               # 메인 페이지
│   ├── Membership.tsx         # 멤버십 관리 페이지
│   ├── Points.tsx             # 포인트 관리 페이지
├── services/
│   ├── api.ts                 # Axios를 통한 API 호출
├── App.tsx                    # 라우팅 및 공통 레이아웃
├── index.tsx                  # 프로젝트 엔트리 포인트
```

---

## API 명세

### 1. 멤버십 관리 API
| **메서드** | **엔드포인트**         | **설명**           | **요청 본문**            | **응답**       |
|------------|------------------------|--------------------|-------------------------|----------------|
| POST       | /memberships           | 멤버십 생성        | JSON (회원 정보)         | 생성된 멤버십 정보 |
| GET        | /memberships/{id}      | 멤버십 조회        | 없음                    | 멤버십 정보    |
| PUT        | /memberships/{id}      | 멤버십 수정        | JSON (수정할 정보)       | 수정된 멤버십 정보 |
| DELETE     | /memberships/{id}      | 멤버십 삭제        | 없음                    | 성공/실패 여부 |

### 2. 포인트 관리 API
| **메서드** | **엔드포인트**         | **설명**           | **요청 본문**            | **응답**       |
|------------|------------------------|--------------------|-------------------------|----------------|
| POST       | /points                | 포인트 적립        | JSON (회원 ID, 금액 등)  | 적립 결과      |
| PUT        | /points/{id}/redeem    | 포인트 사용        | JSON (사용할 포인트 양)  | 사용 결과      |
| GET        | /points/{id}           | 포인트 조회        | 없음                    | 현재 포인트    |

#### 예외 처리 예시
**멤버십 생성 요청(/memberships)**
```json
{
   "name": "",
   "email": "invalid-email",
   "phone": "01012345678"
}
```
**응답**
```json
{
    "timestamp": "2022-01-01T00:00:00",
    "status": 400,
    "error": "Bad Request",
    "message": "Validation failed",
    "path": "/memberships",
    "errors": [
        {
            "field": "name",
            "message": "Name is required"
        },
        {
            "field": "email",
            "message": "Invalid email format"
        }
    ]
}
```

---

## 구현 및 배포 단계

1. **REST API 서버 개발**
   - Spring Boot로 멤버십 및 포인트 관리 기능 구현.
   - Swagger를 활용한 API 문서화.

2. **TDD 기반 테스트 환경 구축**
   - JUnit 5와 Mockito를 활용한 단위 테스트 및 통합 테스트 작성.

3. **React 프론트엔드 개발**
   - Axios를 활용해 REST API와 통신.
   - 페이지 구성 및 사용자 경험(UI/UX) 최적화.

4. **GitHub Actions로 CI/CD 구현**
   - 코드 Push 시 자동 테스트, 빌드, Google Cloud 배포.

5. **구글 클라우드 배포**
   - GCE: Spring Boot 애플리케이션 실행.
   - Google Cloud Storage: React 정적 리소스 배포.

6. Google Cloud Functions로 포인트 만료 알림 구현
   - Google Cloud Scheduler로 주기적 트리거 설정.
   - Pub/Sub를 통해 메시지 전달 및 Cloud Functions 실행.

---

## 테스트

### 테스트 종류
1. **단위 테스트**: 컨트롤러, 서비스, 리포지토리별 테스트 작성.
2. **통합 테스트**: 데이터베이스 연동 테스트.
3. **End-to-End 테스트**: Cypress 또는 Selenium을 사용한 통합 흐름 검증.

### 테스트 실행
```bash
./gradlew test
```

---

## CI/CD 파이프라인
1. **GitHub Actions 설정**
    - 코드 Push → 자동 테스트 → 빌드 → 클라우드 배포.
2. **자동화 작업**
    - 브랜치별 환경 분리(예: develop → 스테이징, main → 프로덕션).

---

## 추가 개발 계획

1. **확장 가능한 아키텍처**
    - Blue/Green 배포로 안정적인 배포 환경 구축.
    - Canary 배포로 새로운 기능 검증.

2. **사용자 인증 및 권한 관리**
    - JWT 기반 인증 추가.
    - 역할(Role)별 접근 권한 관리.

3. **실시간 데이터 분석**
    - 포인트 사용 데이터를 분석해 개인화된 혜택 제공.

4. **멀티 리전 배포**
    - Google Cloud 멀티 리전 배포를 통해 고가용성 확보.

5. **모니터링 시스템 도입**
    - Google Cloud Monitoring 및 Cloud Logging을 활용한 실시간 모니터링 구축.

---

## 기여 방법
1. **이슈 등록**:
    - 프로젝트 관련 문제점 또는 개선점을 GitHub Issues 에 등록해주세요.
2. **PR 요청**:
    - 새로운 기능 추가 또는 버그 수정을 PR로 요청해주세요.