<script>
    import { onMount, onDestroy } from 'svelte';
    import Login from '../components/Login.svelte';
    import logo from '../public/images/logo.svg';
    
    let isShow = false;

    function toggleLoginPopup() {
        isShow = !isShow;
    }

    onMount(() => {
        function handleOutsideClick(event) {
            if (isShow && !event.target.closest('.login__content') && !event.target.closest('.start__button')) {
                isShow = false;
            }
        }

        window.addEventListener('click', handleOutsideClick);
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    });
</script>

<div>
    <Login isShown={isShow}/>
    <div class="intro__content">
        <div class="start__wrap">
            <div class="start__image">
                <img src="{logo}" alt="logo">
            </div>
            <button class="start__button" on:click={toggleLoginPopup}>시작하기</button>
        </div>
    </div>
</div>

<style>
    .intro__content {
        width: 100%;
        height: 100vh;
        background-color: #00000086;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .start__wrap {
        display: flex;
        flex-flow: column;
        gap: 55px;
    }
    .start__image {
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .start__button {
        width: 350px;
        height: 85px;
        border: 1px solid #fff;
        border-radius: 50px;
        font-size: 33px;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        transition: .5s;
    }
    .start__button:hover {
        background-color: #ffffff22;
    }
</style>