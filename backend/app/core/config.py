"""애플리케이션 전역 설정.

.env 파일의 값을 읽어 Settings 객체로 노출한다.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # 데이터베이스 접속 URL
    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/aicom"

    # JWT 설정
    secret_key: str = "change-this-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # CORS 허용 origin 목록 (콤마로 구분된 문자열)
    cors_origins: str = "http://localhost:5173"

    # 회원가입 시 허용할 이메일 도메인 (콤마로 구분, 예: "ai.university.ac.kr").
    # 비워두면 도메인 검증을 하지 않는다 (개발 환경 기본값).
    allowed_email_domains: str = ""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def allowed_email_domain_list(self) -> list[str]:
        return [d.strip().lower() for d in self.allowed_email_domains.split(",") if d.strip()]


settings = Settings()
