<script>
    import Thumbnail from "../../public/images/intro_block_thumbnail.svg";

    export let moveDirection = "down";
</script>

<div class="block__container" style="--moveAmount: {moveDirection === 'down' ? '50px' : '-50px'}; --position: {moveDirection === 'down' ? '0px' : '-20px'}">
    <img src='{Thumbnail}' alt="thumbnail" class="block__image">
    <div class="block__content">
        <div class="block__title block__text">8년차 개발자가 취준생님들에게 전하고 싶...</div>
        <div class="block__desc block__text">저의 8년차 개발자가 추천하는 FE 공부자료 및 공부법 글에 달린 한 댓글에 대한 저의 답변입니다. 사견일 뿐이니 무조건 따르거나 공격적으로 듣지 않았으면 좋겠습니다.</div>
        <div class="block__writer block__text">by kekekevi</div>
    </div>
</div>

<style>
    @keyframes move {
        0%, 100% {
            transform: translateY(var(--position, 0));
        }
        50% {
            transform: translateY(var(--moveAmount, 0));
        }
    }

    .block__container {
        width: 495px;
        transform: translateY(0);
        animation: move linear infinite 10s;
    }
    .block__image {
        width: 100%;
        margin-bottom: -5px;
    }
    .block__content {
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        padding: 35px 30px;
        gap: 25px;
        background-color: #33333A;
    }
    .block__text {
        color: #fff;
        width: 100%;
    }
    .block__title {
        font-weight: bold;
        font-size: 23px;
    }
    .block__desc {
        font-size: 18px;
    }
    .block__writer {
        font-size: 18px;
        font-family: 'Ramche', sans-serif;
        text-align: center;
    }

</style>