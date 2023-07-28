<script>
    import { navigate } from "svelte-routing";
    import Fetch from "../Module/fetch";

    let url = '';
    let blocks = [];

    async function loginCheck() {
        const res = await Fetch.get('/api/users');

        if (res.statusCode === 401) {
            alert('로그인이 필요합니다!');
            navigate('/login', { replace: true });
        }
    }

    async function handleEnter(event) {
        if(event.key !== 'Enter') {
            return;
        }

        createBlock(url);
    }

    async function handlePaste(event) {
        const link = (event.clipboardData || window.clipboardData).getData('text');

        createBlock(link);
    }

    async function createBlock(link) {
        const res = await Fetch.post('/api/blocks', {
            title: '테스트',
            content: '본문 테스트',
            link: link
        })

        url = '';
    }

    async function getBlockList() {
        const res = await Fetch.get('/api/blocks');
        console.log(res);
        blocks = res.block;
    }
    
    async function getAI() {
        await Fetch.get('/api/blocks/test');
    }

    loginCheck();
    getBlockList();
    getAI();
</script>

<main>
    <div class="block__content">
        <div class="url__container">
            <input type="text" name="url" id="url__input" class="url__input" bind:value={url} on:keydown={handleEnter} on:paste={handlePaste}>
        </div>
        <div class="block__list">
            {#each blocks as item, idx}
                <div class="block__item">
                    <div>{idx}</div>
                    <div>{item.title}</div>
                    <a href='{item.link}' target="_blank">바로가기</a>
                </div>
            {/each}
        </div>
    </div>
</main>

<style>
    main {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        background-color: #102031;
    }
    .block__content {
        width: 500px;
        height: 90vh;
        background-color: #ffffff1f;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;
        justify-content: start;
    }
    .url__container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 20px;
    }
    .url__input {
        width: 80%;
    }
    .block__list {
        width: 100%;
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    .block__item {
        width: 80%;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .block__item > * {
        color: #fff;
    }
</style>