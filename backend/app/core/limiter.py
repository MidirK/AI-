"""요청 빈도 제한(rate limit) 설정.

로그인/회원가입처럼 무차별 대입 공격에 노출되기 쉬운 엔드포인트에 사용한다.
"""

import warnings

from slowapi import Limiter
from slowapi.util import get_remote_address

# slowapi는 초기화 시 cwd의 .env 파일을 자체적으로 읽으려 시도하는데(설정을 위해서가 아니라
# 내부적으로 starlette.config.Config를 만드는 과정), 이때 시스템 기본 인코딩(cp949 등)으로
# 읽어서 우리 .env의 한글 주석에서 UnicodeDecodeError가 난다. 존재하지 않는 파일명을 넘겨
# 이 자동 로딩 자체를 비활성화한다 (rate limit 설정은 어차피 .env에 두지 않는다).
with warnings.catch_warnings():
    warnings.simplefilter("ignore", UserWarning)
    limiter = Limiter(key_func=get_remote_address, config_filename="__slowapi_no_dotenv__")
