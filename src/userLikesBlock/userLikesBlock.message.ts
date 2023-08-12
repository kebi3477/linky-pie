export class UserLikesBLockMessage {
    // 2XX
    public static SUCCESS_CREATE   = '좋아요 성공';
    public static SUCCESS_READ     = '성공적으로 좋아요를 조회했습니다.'; 
    public static SUCCESS_UPDATE   = '성공적으로 좋아요를 수정했습니다.'; 
    public static SUCCESS_DELETE   = '성공적으로 좋아요를 삭제했습니다.'; 

    // 4XX
    public static BAD_REQUEST    = '잘못된 요청입니다.';
    public static NOT_FOUND      = '해당 아이디는 좋아요를 하지 않았습니다.';
    public static CONFLICT       = '해당 아이디는 이미 좋아요를 했습니다.';

    // 5XX
    public static SERVER_ERROR   = '서버에서 처리 중 오류가 발생했습니다.';
}