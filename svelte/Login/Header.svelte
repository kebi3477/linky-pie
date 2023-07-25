<script>
</script>
<header class="login__header">
    <div class="login__button">로그인</div>
    <div class="login__button">회원가입</div>
</header>
<style>
    .login__header {
        width: 100%;
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: flex-end;
        gap: 10px;
        padding: 10px;
        position: absolute;
        top: 0;
    }
    .login__button {
        transition: .5s;
        color: #ddd;
        cursor: pointer;
    }
    .login__button:hover {
        color: #fff;
    }
</style>