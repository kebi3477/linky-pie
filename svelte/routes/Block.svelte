<script>
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import Fetch from "../utils/fetch";
    import Loading from '../components/Loading.svelte';
    import Header from '../components/MainHeader.svelte';

    let url = '';
    let blocks = [];
    let groups = [];
    let loading;

    async function loginCheck() {
        const res = await Fetch.get('/api/users/me');

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
        loading.start();
        const res = await Fetch.post('/api/blocks', { link })

        if (res.statusCode === 201) {
            url = '';   
            blocks = [...blocks, res.block];
        }

        loading.stop();
    }

    async function getBlockList() {
        loading.start();
        const res = await Fetch.get('/api/blocks');
        blocks = res.block;
        loading.stop();
    }

    async function getGroupList() {
        loading.start();
        const res = await Fetch.get('/api/groups');
        groups = res.group;
        loading.stop();
    }

    // loginCheck();
    onMount(getBlockList);
    onMount(getGroupList);
</script>

<main>
    <Loading bind:this={loading}></Loading>
    <Header></Header>
    <div class="block__content">
        <div class="url__container">
            <input type="text" name="url" id="url__input" class="url__input" bind:value={url} on:keydown={handleEnter} on:paste={handlePaste}>
        </div>
        <div class="group__list">
            {#each groups as item, idx}
                <div class="group__item">
                    <div>{idx}</div>
                    <div>{item.title}</div>
                </div>
            {/each}
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
    .group__list {
        width: 100%;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }
    .group__item {
        width: 80%;
        display: flex;
        flex-flow: row;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    .group__item > * {
        color: #fff;
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