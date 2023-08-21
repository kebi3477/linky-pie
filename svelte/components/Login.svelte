<script>
    import { createEventDispatcher } from 'svelte';

    import logo from '../public/images/logo.svg';
    import kakaoIcon from '../public/images/kakao-icon.svg';
    import naverIcon from '../public/images/naver-icon.svg';
    import googleIcon from '../public/images/google-icon.svg';
    import closeIcon from '../public/images/close-icon.svg';
    
    const dispatch = createEventDispatcher();

    function navigateTo(login) {
        window.location.href = `/api/auth/${login}`;
    }

    function closePopup() {
        dispatch('close');
    }

    export let isShown = false;
</script>

<div class="login" style="display: {isShown ? 'flex' : 'none'}">
    <div class="login__content">
        <button class="close__button" on:click={closePopup}>
            <img src="{closeIcon}" class="close__image" alt="close" >
        </button>
        <img src="{logo}" alt="logo" class="login__logo"/>
        <p class="login__text login__text--big">링크를<br>공유하다.</p>
        <div class="login__buttons">
            <p class="login__text login__text--regular">소셜 계정으로 로그인</p>
            <button class="login__button login__button--kakao" on:click={() => navigateTo('kakao')}>
                <img src="{kakaoIcon}" alt="카카오톡 아이콘" class="login__icon"/>
                카카오톡으로 시작하기
            </button>
            <button class="login__button login__button--naver" on:click={() => navigateTo('naver')}>
                <img src="{naverIcon}" alt="네이버 아이콘" class="login__icon"/>
                네이버로 시작하기
            </button>
            <button class="login__button login__button--google" on:click={() => navigateTo('google')}>
                <img src="{googleIcon}" alt="구글 아이콘" class="login__icon"/>
                구글로 시작하기
            </button>
        </div>
    </div>
</div>
  
<style>
    .login {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .login__content {
        background: #1F1F1F;
        padding: 40px;
        border-radius: 5px;
        width: 450px;
        position: relative;
    }
    .close__button {
        position: absolute;
        right: 22px;
        top: 26px;
        cursor: pointer;
    }
    .login__logo {
        width: 100px;
        margin: 0 auto;
    }
    .login__text {
        color: #fff;
        font-family: 'Ramche';
    }
    .login__text--big {
        margin-top: 20px;
        font-size: 39px;
        line-height: 60px;
    }
    .login__text--regular {
        padding: 10px 0;
        font-size: 16px;
        margin-left: 5px;
    }
    .login__buttons {
        margin-top: 70px;
        display: flex;
        flex-flow: column;
        gap: 17px;
    }
    .login__button {
        width: 100%;
        padding: 18px 25px;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        color: #fff;
        font-size: 15px;
        display: grid;
        grid-template-columns: 20px 1fr;
        align-items: center;
        justify-content: center;
    }
    .login__icon {
        width: 20px;
        height: 20px;
    }
    .login__button--kakao {
        background: #FFD635;
        color: #000;
    }
    .login__button--naver {
        background: #2DB400;
    }
    .login__button--google {
        background: #DE5452;
    }
</style>