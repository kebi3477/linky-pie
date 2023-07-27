export class UserMessage {
    // 2XX
    public static SUCCESS_CREATE = '성공적으로 사용자를 생성했습니다.';
    public static SUCCESS_READ   = '성공적으로 사용자를 조회했습니다.'; 
    public static SUCCESS_UPDATE = '성공적으로 사용자를 수정했습니다.'; 
    public static SUCCESS_DELETE = '성공적으로 사용자를 삭제했습니다.'; 
    public static SUCCESS_LOGIN  = '로그인 성공!';

    // 4XX
    public static BAD_REQUEST    = '잘못된 요청입니다.';
    public static NOT_FOUND      = '해당 아이디의 사용자가 존재하지 않습니다.';
    public static CONFLICT       = '해당 아이디는 이미 사용 중입니다.';

    // 5XX
    public static SERVER_ERROR   = '서버에서 처리 중 오류가 발생했습니다.';
}