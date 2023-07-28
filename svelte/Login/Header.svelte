<script>
    import { Link, link } from "svelte-routing";
</script>
<header class="login__header">
    <a href="/" class="login__button" use:link>로그인</a>
    <a href="/join" class="login__button" use:link>회원가입</a>
    <a href="/block" class="login__button" use:link>block</a>
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