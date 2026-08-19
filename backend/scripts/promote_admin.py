"""이메일로 특정 유저를 관리자(admin)로 승격시키는 CLI 스크립트.

관리자 계정은 회원가입 API로 만들 수 없다 (역할은 항상 student로 시작).
배포 후 최초 관리자를 지정할 때, 또는 운영 중 관리자를 추가할 때 이 스크립트를 사용한다.

사용법:
    python -m scripts.promote_admin admin@ai.university.ac.kr
"""

import sys

from app.db.base import SessionLocal
from app.models.user import User


def promote(email: str) -> None:
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"'{email}' 계정을 찾을 수 없습니다. 먼저 일반 회원가입을 완료해주세요.")
            sys.exit(1)

        if user.role == "admin":
            print(f"'{email}'은(는) 이미 관리자입니다.")
            return

        user.role = "admin"
        db.commit()
        print(f"'{email}'을(를) 관리자로 승격했습니다.")
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("사용법: python -m scripts.promote_admin <email>")
        sys.exit(1)

    promote(sys.argv[1])
