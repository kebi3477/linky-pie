<script>
    import { onMount, onDestroy } from 'svelte';
    import { fade } from 'svelte/transition';

    import Login from '../components/intro/Login.svelte';
    import Block from '../components/intro/Block.svelte';
    import logo from '../public/images/logo.svg';
    
    let text = '';
    let fullText = '링크를 공유하다.';
    let index = 0;
    let isShow = false;
    let slide = 0;

    function toggleLoginPopup() {
        isShow = !isShow;
    }

    function typingText() {
        let interval = setInterval(() => {
            if (index < fullText.length) {
                text += fullText[index];
                index++;
            } else {
                nextSlide();
                clearInterval(interval);
            }
        }, 300);
    }

    function waitAndNext() {
        setTimeout(() => {
            nextSlide();
        }, 3000);
    }

    function nextSlide() {
        if (slide < 3) slide++;

        if (slide === 1) {
            typingText();
        } else if (slide === 2) {
            waitAndNext();
        }
    }

    onMount(() => {
        function handleOutsideClick(event) {
            if (isShow && !event.target.closest('.login__content') && !event.target.closest('.start__button')) {
                isShow = false;
            }
        }

        window.addEventListener('click', handleOutsideClick);
        nextSlide();
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    });
</script>

<div class="intro">
    {#if slide === 1}
        <div class="intro__container" out:fade={{ delay: 500, duration: 500 }}>
            <p class="intro__text">{text}<span class="intro__cursor"></span></p>
        </div>
    {:else}
        <div class="intro__content" in:fade={{ delay: 500, duration: 500 }}>
            {#if slide === 2 || slide === 3}
                <div class="block__wrap">
                    <Block moveDirection="down" />
                    <Block moveDirection="up" />
                    <Block moveDirection="down" />

                    <Block moveDirection="down" />
                    <Block moveDirection="up" />
                    <Block moveDirection="down" />

                    <Block moveDirection="down" />
                    <Block moveDirection="up" />
                    <Block moveDirection="down" />
                </div>
            {/if}
            {#if slide === 3}
                <div class="start__wrap"  in:fade={{ delay: 250, duration: 500 }}>
                    <div class="start__image">
                        <img src="{logo}" alt="logo">
                    </div>
                    <button class="start__button" on:click={toggleLoginPopup}>시작하기</button>
                </div>
            {/if}
        </div>
    {/if}
    <Login isShown={isShow} on:close={() => isShow = false} />
</div>

<style>
    @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0; }
        100% { opacity: 1; }
    }

    .intro {
        width: 100%;
        height: 100vh;
        background-color: #0D1117;
    }
    .intro__container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100vh;
        background-color: #0D1117;
        overflow: hidden;
    }
    .intro__text {
        font-family: 'Ramche', sans-serif;
        font-size: 35px;
        color: #fff;
    }
    .intro__cursor {
        border-right: 2px solid #fff;
        animation: blink 0.5s infinite;
    }

    .intro__content {
        width: 100%;
        height: 100vh;
        background-color: #0D1117;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: absolute;
        top: 0;
    }
    .block__wrap {
        width: 1530px;
        display: flex;
        flex-wrap: wrap;
        overflow: hidden;
        gap: 10px;
    }
    .start__wrap {
        display: flex;
        flex-flow: column;
        gap: 55px;
        position: absolute;
        width: 100%;
        height: 100vh;
        background-color: #00000088;
        align-items: center;
        justify-content: center;
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